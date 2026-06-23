import { Compendium } from '../../smt4f/models/compendium';
import { FusionChart } from '../../smt4f/models/fusion-chart';
import { isAHExclusiveSkill, decodeAHSkillTier, PlayerState } from './fusion-tree-types';
import { SMT_NORMAL_FUSION_CALCULATOR } from '../../compendium/constants';

export interface FusionRecipe {
  state1: DPState;
  state2: DPState;
}

export interface OwnedDemon {
  name: string;
  skills: string[];
}

export interface DPState {
  demon: string;
  skills: string[];
  maxLevel: number;
  cost: number;
  ahCount: number;
  maccaCost: number;
  summonCount: number;
  ownedCount: number;
  ownedMask: number;
  isOwned?: boolean;
  recipe: FusionRecipe | null;
}

export interface FusionGraphNode {
  id: string;
  demon: string;
  level: number;
  skills: string[];
  isNatural: boolean;
  isOwned?: boolean;
  recipe?: {
    ingredient1Id: string;
    ingredient2Id: string;
  };
  stepNumber?: number;
}

export interface DPFusionResult {
  success: boolean;
  maxLevel: number;
  totalFusions: number;
  ahCount: number;
  maccaCost: number;
  summonCount: number;
  finalKey: string;
  graph: FusionGraphNode[];
  steps: {
    fuse1: string;
    fuse2: string;
    result: string;
  }[];
  label?: string;
}

export class FusionDPSolver {
  constructor(private comp: Compendium, private chart: FusionChart) {}

  private getDemonLevel(dName: string): number {
    const d = this.comp.getDemon(dName);
    return d ? d.lvl : 999;
  }

  private getDemonPrice(dName: string): number {
    const d = this.comp.getDemon(dName);
    return d && (d as any).price ? (d as any).price : 0;
  }

  private evaluateSuitability(demonName: string, skillName: string): number {
    const demon = this.comp.getDemon(demonName);
    if (!demon) return Infinity;

    const demonLevel = demon.lvl;
    const skills = demon.skills;
    
    if (skillName in skills) {
      const slvl = skills[skillName];
      const isAH = isAHExclusiveSkill(slvl);

      if (isAH) {
        const tier = decodeAHSkillTier(slvl);
        if (tier === 'occult') return demonLevel + 500;
        if (tier === 'platinum') return demonLevel + 400;
        if (tier === 'gold') return demonLevel + 300;
        if (tier === 'basic') return demonLevel + 100;
        return demonLevel + 600; 
      }

      if (slvl <= 0.9) return demonLevel;
      return Math.max(demonLevel, Math.round(slvl));
    }

    return Infinity;
  }

  private getNaturalHolders(skillName: string): {name: string, reqLevel: number}[] {
    const holders: {name: string, reqLevel: number}[] = [];
    const skillObj = this.comp.getSkill(skillName);
    if (!skillObj || skillObj.element === 'aut' || skillObj.element === 'auto') {
      return [];
    }

    for (const demon of this.comp.allDemons) {
      const dName = demon.name;
      if (skillName in demon.skills) {
        holders.push({ name: dName, reqLevel: this.evaluateSuitability(dName, skillName) });
      }
    }
    return holders.sort((a, b) => a.reqLevel - b.reqLevel);
  }

  private isSubset(sub: string[], sup: string[]): boolean {
    return sub.every(s => sup.includes(s));
  }

  private getKey(demon: string, skills: string[]): string {
    const sortedSkills = [...skills].sort();
    return `${demon}|${sortedSkills.join(',')}`;
  }

  private getMissingSkills(currentSkills: string[], requiredSkills: string[]): string[] {
    return requiredSkills.filter(s => !currentSkills.includes(s));
  }

  private getAllSubsets(arr: string[]): string[][] {
    const subsets: string[][] = [];
    const max = 1 << arr.length;
    for (let i = 0; i < max; i++) {
      const subset: string[] = [];
      for (let j = 0; j < arr.length; j++) {
        if ((i & (1 << j)) !== 0) {
          subset.push(arr[j]);
        }
      }
      subsets.push(subset);
    }
    return subsets;
  }

  public solveMultiSkillFusion(
    targetDemon: string, 
    requiredSkills: string[], 
    maxPlayerLevel: number = 99,
    criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'max_owned' = 'min_level',
    ownedDemons: OwnedDemon[] = []
  ): DPFusionResult | null {
    const bestMap = new Map<string, DPState>();
    const pq: DPState[] = [];
    
    const pushState = (state: DPState) => {
      if (state.maxLevel > maxPlayerLevel) return;
      const key = this.getKey(state.demon, state.skills);
      const existing = bestMap.get(key);
      if (existing) {
        if (criteria === 'min_level') {
          if (existing.maxLevel < state.maxLevel) return;
          if (existing.maxLevel === state.maxLevel && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'min_fusions') {
          if (existing.cost < state.cost) return;
          if (existing.cost === state.cost && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'min_ah') {
          if (existing.ahCount < state.ahCount) return;
          if (existing.ahCount === state.ahCount && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'max_owned') {
          if (existing.ownedCount > state.ownedCount) return;
          if (existing.ownedCount === state.ownedCount && existing.maccaCost <= state.maccaCost) return;
        }
      }
      bestMap.set(key, state);
      pq.push(state);
    };

    const isAH = (slvl: number) => isAHExclusiveSkill(slvl);

    // 1. Initialize Base States
    const skillList = [...requiredSkills].sort();
    
    // Empty state for all demons
    for (const demon of this.comp.allDemons) {
      const dName = demon.name;
      pushState({ demon: dName, skills: [], maxLevel: this.getDemonLevel(dName), cost: 0, ahCount: 0, maccaCost: this.getDemonPrice(dName), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });
    }

    // Natural holders for each required skill
    for (const sk of skillList) {
      const holders = this.getNaturalHolders(sk);
      for (const h of holders) {
        const ahc = isAH(this.comp.getSkill(sk).level) ? 1 : 0;
        pushState({ demon: h.name, skills: [sk], maxLevel: h.reqLevel, cost: 0, ahCount: ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });
        
        // Also add combined state if a demon naturally holds multiple required skills
        const multiSkills = skillList.filter(s => h.name === this.getNaturalHolders(s).find(x => x.name === h.name)?.name);
        if (multiSkills.length > 1) {
          const m_ahc = multiSkills.filter(s => isAH(this.comp.getSkill(s).level)).length;
          pushState({ demon: h.name, skills: multiSkills, maxLevel: h.reqLevel, cost: 0, ahCount: m_ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });
        }
      }
    }

    // Custom Owned Demons
    for (let i = 0; i < ownedDemons.length; i++) {
      const owned = ownedDemons[i];
      const relevantSkills = owned.skills.filter(s => skillList.includes(s));
      pushState({
        demon: owned.name,
        skills: relevantSkills,
        maxLevel: this.getDemonLevel(owned.name),
        cost: 0,
        ahCount: 0,
        maccaCost: 0,
        summonCount: 0,
        ownedCount: 1,
        ownedMask: 1 << i,
        isOwned: true,
        recipe: null
      });
    }

    const sortPQ = () => {
      if (criteria === 'min_level') {
        pq.sort((a, b) => (a.maxLevel - b.maxLevel) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      } else if (criteria === 'min_fusions') {
        pq.sort((a, b) => (a.cost - b.cost) || (a.maccaCost - b.maccaCost) || (a.maxLevel - b.maxLevel));
      } else if (criteria === 'min_ah') {
        pq.sort((a, b) => (a.ahCount - b.ahCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      } else if (criteria === 'max_owned') {
        pq.sort((a, b) => (b.ownedCount - a.ownedCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      }
    };

    sortPQ();

    let iterations = 0;
    while (pq.length > 0 && iterations < 100000) {
      iterations++;
      
      sortPQ();
      const current = pq.shift()!;
      
      const currentKey = this.getKey(current.demon, current.skills);
      
      // Strict prune based on criteria
      const bestCurrent = bestMap.get(currentKey)!;
      if (criteria === 'min_level' && bestCurrent.maxLevel < current.maxLevel) continue;
      if (criteria === 'min_fusions' && bestCurrent.cost < current.cost) continue;
      if (criteria === 'min_ah' && bestCurrent.ahCount < current.ahCount) continue;
      if (criteria === 'max_owned' && bestCurrent.ownedCount > current.ownedCount) continue;
      
      if (current.demon === targetDemon && this.isSubset(requiredSkills, current.skills)) {
        return this.buildResult(currentKey, bestMap);
      }

      const forwardFusions = SMT_NORMAL_FUSION_CALCULATOR.getFusions(current.demon, this.comp as any, this.chart as any);

      for (const f of forwardFusions) {
        const resultDemon = f.name2;
        const ingredientB = f.name1; 

        // Validate result demon
        const resDemonObj = this.comp.getDemon(resultDemon);
        if (!resDemonObj) continue;

        // Ensure result isn't above our global max
        if (resDemonObj.lvl > maxPlayerLevel) continue;

        const subsets = this.getAllSubsets(requiredSkills);
        for (const subB of subsets) {
          const bKey = this.getKey(ingredientB, subB);
          const bState = bestMap.get(bKey);
          
          if (bState) {
            if (current.ownedMask !== 0 && bState.ownedMask !== 0 && (current.ownedMask & bState.ownedMask) !== 0) continue;
            const mergedSkills = Array.from(new Set([...current.skills, ...bState.skills])).sort();
            if (mergedSkills.length === 0) continue; 
            
            // Validate slot limit constraint
            let cmdCount = 0;
            let pasCount = 0;
            let valid = true;
            for (const sk of mergedSkills) {
              const skObj = this.comp.getSkill(sk);
              if (!skObj || skObj.element === 'aut' || skObj.element === 'auto' || skObj.element === 'rac') {
                valid = false; break;
              }
              if (skObj.element === 'pas') pasCount++;
              else cmdCount++;
            }

            if (!valid) continue;
            if (cmdCount > 3 || pasCount > 3) continue;

            const newMaxLevel = Math.max(current.maxLevel, bState.maxLevel, resDemonObj.lvl);
            const newCost = current.cost + bState.cost + 1;
            const newAhCount = current.ahCount + bState.ahCount;
            const newMaccaCost = current.maccaCost + bState.maccaCost;
            const newSummonCount = current.summonCount + bState.summonCount;

            const newState: DPState = {
              demon: resultDemon,
              skills: mergedSkills,
              maxLevel: newMaxLevel,
              cost: newCost,
              ahCount: newAhCount,
              maccaCost: newMaccaCost,
              summonCount: newSummonCount,
              ownedCount: current.ownedCount + bState.ownedCount,
              ownedMask: current.ownedMask | bState.ownedMask,
              recipe: {
                state1: current,
                state2: bState
              }
            };
            
            pushState(newState);
          }
        }
      }
    }

    return null;
  }

  private buildResult(finalKey: string, bestMap: Map<string, DPState>): DPFusionResult {
    const finalState = bestMap.get(finalKey)!;
    const graph: FusionGraphNode[] = [];
    const steps: any[] = [];
    let nodeIdCount = 0;

    const traverse = (state: DPState): string => {
      const nodeId = `N${nodeIdCount++}`;
      
      const node: FusionGraphNode = {
        id: nodeId,
        demon: state.demon,
        level: state.maxLevel,
        skills: state.skills,
        isNatural: !state.recipe,
        isOwned: state.isOwned
      };
      
      graph.push(node);

      if (state.recipe) {
        const id1 = traverse(state.recipe.state1);
        const id2 = traverse(state.recipe.state2);
        node.recipe = { ingredient1Id: id1, ingredient2Id: id2 };
        
        const d1 = state.recipe.state1;
        const d2 = state.recipe.state2;
        
        steps.push({
          fuse1: `${d1.demon} [${d1.skills.join(', ')}]`,
          fuse2: `${d2.demon} [${d2.skills.join(', ')}]`,
          result: `${state.demon} [${state.skills.join(', ')}]`
        });
        node.stepNumber = steps.length;
      }

      return nodeId;
    };

    traverse(finalState);

    return {
      success: true,
      maxLevel: finalState.maxLevel,
      totalFusions: finalState.cost,
      ahCount: finalState.ahCount,
      maccaCost: finalState.maccaCost,
      summonCount: finalState.summonCount,
      finalKey,
      graph,
      steps
    };
  }
}
