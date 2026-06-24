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
  isStatsTransfer?: boolean;
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
  statsTransferCount: number;
  statsTransferDepth: number;
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

  private getKey(demon: string, skills: string[], hasStatsTransfer?: boolean): string {
    const sortedSkills = [...skills].sort();
    let key = `${demon}|${sortedSkills.join(',')}`;
    if (hasStatsTransfer !== undefined) {
      key += hasStatsTransfer ? '|ST' : '|NO_ST';
    }
    return key;
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

  public async solveMultiSkillFusion(
    targetDemon: string,
    requiredSkills: string[],
    maxPlayerLevel: number = 99,
    criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'max_owned' | 'stats_transfer' = 'min_level',
    ownedDemons: OwnedDemon[] = [],
    ignoreOwned: boolean = false,
    onProgress?: (iterations: number, pqLength: number) => void
  ): Promise<DPFusionResult | null> {
    const bestMap = new Map<string, DPState>();
    const pq: DPState[] = [];
    
    const compareBadness = (a: DPState, b: DPState) => {
      if (criteria === 'stats_transfer') {
        if (a.cost !== b.cost) return a.cost - b.cost;
        if (a.statsTransferCount !== b.statsTransferCount) {
          return b.statsTransferCount - a.statsTransferCount; // Prefer MORE stats transfer demons
        }
        if (a.statsTransferDepth !== b.statsTransferDepth) {
          return a.statsTransferDepth - b.statsTransferDepth; // Minimize depth (closer to final fusion)
        }
        return (a.maccaCost - b.maccaCost) || (a.maxLevel - b.maxLevel);
      } else if (criteria === 'min_level') {
        return (a.maxLevel - b.maxLevel) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost);
      } else if (criteria === 'min_fusions') {
        return (a.cost - b.cost) || (a.maccaCost - b.maccaCost) || (a.maxLevel - b.maxLevel);
      } else if (criteria === 'min_ah') {
        return (a.ahCount - b.ahCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost);
      } else if (criteria === 'max_owned') {
        return (b.ownedCount - a.ownedCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost);
      }
      return 0;
    };

    const pushState = (state: DPState) => {
      if (state.maxLevel > maxPlayerLevel) return;
      const key = this.getKey(state.demon, state.skills, criteria === 'stats_transfer' ? state.statsTransferCount > 0 : undefined);
      const existing = bestMap.get(key);
      if (existing) {
        if (compareBadness(state, existing) >= 0) return;
      }
      bestMap.set(key, state);
      
      let low = 0;
      let high = pq.length;
      while (low < high) {
        let mid = (low + high) >>> 1;
        if (compareBadness(state, pq[mid]) > 0) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      pq.splice(low, 0, state);
    };

    const isAH = (slvl: number) => isAHExclusiveSkill(slvl);

    // 1. Initialize Base States
    const skillList = [...requiredSkills].sort();
    
    // Find lowest level demon for each race to act as the absolute base tier
    const lowestLevelByRace = new Map<string, string>();
    for (const demon of this.comp.allDemons) {
      // Exclude special fusions from being considered the "lowest rank base" of a race 
      // since they cannot be used as generic ingredients easily or bought.
      if (demon.fusion === 'special') continue;
      const currentLowest = lowestLevelByRace.get(demon.race);
      if (!currentLowest || demon.lvl < this.comp.getDemon(currentLowest).lvl) {
        lowestLevelByRace.set(demon.race, demon.name);
      }
    }

    for (const demon of this.comp.allDemons) {
      const dName = demon.name;
      if (dName === targetDemon) continue;
      
      pushState({ demon: dName, skills: [], maxLevel: this.getDemonLevel(dName), cost: 0, ahCount: 0, maccaCost: this.getDemonPrice(dName), summonCount: 1, ownedCount: 0, ownedMask: 0, statsTransferCount: 0, statsTransferDepth: 0, recipe: null });
    }

    // Natural holders for each required skill
    for (const sk of skillList) {
      const holders = this.getNaturalHolders(sk);
      for (const h of holders) {
        if (h.name === targetDemon) continue;
        const ahc = isAH(this.comp.getSkill(sk).level) ? 1 : 0;
        pushState({ demon: h.name, skills: [sk], maxLevel: h.reqLevel, cost: 0, ahCount: ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, statsTransferCount: 0, statsTransferDepth: 0, recipe: null });
        
        // Also add combined state if a demon naturally holds multiple required skills
        const multiSkills = skillList.filter(s => h.name === this.getNaturalHolders(s).find(x => x.name === h.name)?.name);
        if (multiSkills.length > 1) {
          const m_ahc = multiSkills.filter(s => isAH(this.comp.getSkill(s).level)).length;
          pushState({ demon: h.name, skills: multiSkills, maxLevel: h.reqLevel, cost: 0, ahCount: m_ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, statsTransferCount: 0, statsTransferDepth: 0, recipe: null });
        }
      }
    }

    // Custom Owned Demons
    if (!ignoreOwned) {
      for (let i = 0; i < ownedDemons.length; i++) {
        const od = ownedDemons[i];
        if (od.name === targetDemon) continue;
        
        const mask = 1 << i;
        const requiredOwnedSkills = od.skills.filter(s => skillList.includes(s));
        
        pushState({
          demon: od.name,
          skills: requiredOwnedSkills,
          maxLevel: this.getDemonLevel(od.name),
          cost: 0,
          ahCount: requiredOwnedSkills.filter(s => isAH(this.comp.getSkill(s).level)).length,
          maccaCost: 0,
          summonCount: 0,
          ownedCount: 1,
          ownedMask: mask,
          statsTransferCount: od.isStatsTransfer ? 1 : 0,
          statsTransferDepth: od.isStatsTransfer ? 1 : 0, // Depth starts at 1 for the base demon itself
          isOwned: true,
          recipe: null
        });
      }
    }

    let iterations = 0;
    let lastYield = performance.now();
    while (pq.length > 0 && iterations < 100000) {
      iterations++;
      
      if (iterations % 500 === 0) {
        if (performance.now() - lastYield > 16) {
          if (onProgress) onProgress(iterations, pq.length);
          await new Promise(r => setTimeout(r, 0));
          lastYield = performance.now();
        }
      }

      const current = pq.pop()!;
      const currentKey = this.getKey(current.demon, current.skills, criteria === 'stats_transfer' ? current.statsTransferCount > 0 : undefined);
      
      // Strict prune based on criteria
      const bestCurrent = bestMap.get(currentKey)!;
      if (criteria === 'min_level' && bestCurrent.maxLevel < current.maxLevel) continue;
      if (criteria === 'min_fusions' && bestCurrent.cost < current.cost) continue;
      if (criteria === 'min_ah' && bestCurrent.ahCount < current.ahCount) continue;
      if (criteria === 'max_owned' && bestCurrent.ownedCount > current.ownedCount) continue;
      
      if (current.demon === targetDemon && this.isSubset(requiredSkills, current.skills)) {
        if (current.cost > 0) {
          if (criteria === 'stats_transfer' && current.statsTransferCount === 0) {
            continue; // Keep searching for an ST=1 path
          }
          return this.buildResult(current);
        }
      }

      const forwardFusions = SMT_NORMAL_FUSION_CALCULATOR.getFusions(current.demon, this.comp as any, this.chart as any);

        for (const f of forwardFusions) {
          const ingredientB = f.name1;
          const resultDemon = f.name2; 

        // Validate result demon
        const resDemonObj = this.comp.getDemon(resultDemon);
        if (!resDemonObj) continue;

        // Ensure result isn't above our global max
        if (resDemonObj.lvl > maxPlayerLevel) continue;

        const subsets = this.getAllSubsets(requiredSkills);
        for (const subB of subsets) {
          const bStates: DPState[] = [];
          if (criteria === 'stats_transfer') {
            const bKeyST = this.getKey(ingredientB, subB, true);
            const bKeyNoST = this.getKey(ingredientB, subB, false);
            if (bestMap.has(bKeyST)) bStates.push(bestMap.get(bKeyST)!);
            if (bestMap.has(bKeyNoST)) bStates.push(bestMap.get(bKeyNoST)!);
          } else {
            const bKey = this.getKey(ingredientB, subB);
            if (bestMap.has(bKey)) bStates.push(bestMap.get(bKey)!);
          }
          
          for (const bState of bStates) {
            if (current.ownedMask !== 0 && bState.ownedMask !== 0 && (current.ownedMask & bState.ownedMask) !== 0) continue;
            const mergedSkills = Array.from(new Set([...current.skills, ...bState.skills])).sort();
            // Validate slot limit constraint
            let cmdCount = 0;
            let pasCount = 0;
            let valid = true;

            for (const skName of Object.keys(resDemonObj.skills)) {
              const skLevel = resDemonObj.skills[skName];
              if (isAHExclusiveSkill(skLevel)) continue;
              const skObj = this.comp.getSkill(skName);
              if (!skObj) continue;
              if (skObj.element === 'aut' || skObj.element === 'auto' || skObj.element === 'rac') continue;
              if (skObj.element === 'pas') pasCount++;
              else cmdCount++;
            }

            for (const sk of mergedSkills) {
              const skObj = this.comp.getSkill(sk);
              if (!skObj || skObj.element === 'aut' || skObj.element === 'auto' || skObj.element === 'rac') {
                valid = false; break;
              }
              if (resDemonObj.skills.hasOwnProperty(sk) && !isAHExclusiveSkill(resDemonObj.skills[sk])) {
                continue; 
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
              statsTransferCount: current.statsTransferCount + bState.statsTransferCount,
              statsTransferDepth: (current.statsTransferCount > 0 || bState.statsTransferCount > 0) ? Math.max(current.statsTransferDepth, bState.statsTransferDepth) + 1 : 0,
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

    let bestFinalState: DPState | null = null;
    if (criteria === 'stats_transfer') {
      const finalKeyST = this.getKey(targetDemon, skillList, true);
      const finalKeyNoST = this.getKey(targetDemon, skillList, false);
      const st1 = bestMap.get(finalKeyST);
      const st0 = bestMap.get(finalKeyNoST);
      if (st1) {
        bestFinalState = st1;
      } else if (st0) {
        bestFinalState = st0;
      }
    } else {
      const finalKey = this.getKey(targetDemon, skillList);
      bestFinalState = bestMap.get(finalKey) || null;
    }
    
    if (bestFinalState) {
      return this.buildResult(bestFinalState);
    }

    return null;
  }

  private buildResult(finalState: DPState): DPFusionResult {
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
      finalKey: '',
      graph,
      steps
    };
  }
}
