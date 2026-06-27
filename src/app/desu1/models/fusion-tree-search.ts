/**
 * fusion-tree-search.ts (Bidirectional DP Hypergraph Shortest Path)
 * -----------------------------------------------------------------
 */

import {
  Compendium,
  FusionChart,
  SquareChart,
  RecipeGeneratorConfig,
  Demon,
} from '../../compendium/models';
import {
  AHTier,
  AH_TIER_REQUIREMENTS,
  AcquisitionMethod,
  DemonReachability,
  FusionNode,
  PlayerState,
  RankedFusionResult,
  ReachabilityBlocker,
  ReachabilityTier,
  SkillReachability,
  SkillTarget,
  decodeAHSkillTier,
  isAHExclusiveSkill,
} from './fusion-tree-types';

const PASSIVE_ELEMENTS = new Set(['aut', 'pas', 'auto']);

function isPassiveSkill(comp: Compendium, skillName: string): boolean {
  const sk = comp.getSkill(skillName);
  if (!sk) { return false; }
  return PASSIVE_ELEMENTS.has((sk.element || '').toLowerCase());
}

function demonSlotUsage(demon: Demon, comp: Compendium): { usedCmd: number; usedPas: number } {
  let usedCmd = 0;
  let usedPas = 0;
  for (const [skillName] of Object.entries(demon.skills)) {
    if (isPassiveSkill(comp, skillName)) {
      usedPas++;
    } else {
      usedCmd++;
    }
  }
  return { usedCmd, usedPas };
}

function checkSlots(demon: Demon, inheritedMask: number, comp: Compendium, inheritableSkills: string[]): boolean {
  if (inheritedMask === 0) return true;
  const { usedCmd, usedPas } = demonSlotUsage(demon, comp);
  const freeCmd = Math.max(0, 3 - usedCmd);
  const freePas = Math.max(0, 3 - usedPas);

  let neededCmd = 0;
  let neededPas = 0;
  for (let i = 0; i < inheritableSkills.length; i++) {
    if ((inheritedMask & (1 << i)) !== 0) {
      if (isPassiveSkill(comp, inheritableSkills[i])) neededPas++;
      else neededCmd++;
    }
  }
  return neededCmd <= freeCmd && neededPas <= freePas;
}

function getNativeSkillMask(demon: Demon, playerState: PlayerState, inheritableSkills: string[]): number {
  let mask = 0;
  for (let i = 0; i < inheritableSkills.length; i++) {
    const s = inheritableSkills[i];
    const lvl = demon.skills[s];
    if (lvl !== undefined && !isAHExclusiveSkill(lvl)) {
       if (lvl <= 0.9 || Math.round(lvl) <= playerState.maxLevel) {
          mask |= (1 << i);
       }
    }
  }
  return mask;
}

function isReachableBaseCase(demon: Demon, playerState: PlayerState): boolean {
  if (demon.name === 'Pixie') return true;
  if (demon.lvl > playerState.maxLevel) return false;
  if (demon.fusion === 'story' && !playerState.unlockedFusions.includes(demon.name)) return false;
  
  const hasAuction = Boolean(demon.auctions);
  const canNeg = !demon.price || demon.price === 0;

  if (canNeg) return true;
  if (hasAuction && playerState.currentDay >= 2) return true;
  
  return false;
}

interface DpState {
  demonName: string;
  mask: number;
  cost: number;
  left?: DpState;
  right?: DpState;
  depth: number;
  isOwned: boolean;
}

class PriorityQueue<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}
  push(item: T) {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }
  pop(): T {
    const top = this.data[0];
    const bottom = this.data.pop();
    if (this.data.length > 0 && bottom !== undefined) {
      this.data[0] = bottom;
      this.sinkDown(0);
    }
    return top as T;
  }
  isEmpty() { return this.data.length === 0; }
  private bubbleUp(n: number) {
    const item = this.data[n];
    while (n > 0) {
      const p = Math.floor((n - 1) / 2);
      if (this.compare(item, this.data[p]) >= 0) break;
      this.data[n] = this.data[p];
      n = p;
    }
    this.data[n] = item;
  }
  private sinkDown(n: number) {
    const len = this.data.length;
    const item = this.data[n];
    while (true) {
      const left = 2 * n + 1;
      const right = 2 * n + 2;
      let swap = -1;
      if (left < len && this.compare(this.data[left], item) < 0) swap = left;
      if (right < len && this.compare(this.data[right], swap === -1 ? item : this.data[left]) < 0) swap = right;
      if (swap === -1) break;
      this.data[n] = this.data[swap];
      n = swap;
    }
    this.data[n] = item;
  }
}

export function searchFusionTree(
  target: SkillTarget,
  comp: Compendium,
  squareChart: SquareChart,
  recipeConfig: RecipeGeneratorConfig,
): RankedFusionResult[] {
  const { targetDemon, requiredSkills, playerState, maxResults } = target;
  const { normalChart } = squareChart;

  const ahOnlySkillNames = requiredSkills.filter(s => isSkillAHOnly(s, comp));
  const inheritableSkills  = requiredSkills.filter(s => !isSkillAHOnly(s, comp));
  const N = inheritableSkills.length;
  const ALL_SKILLS = (1 << N) - 1;

  // 1. Precompute Forward Fusions
  const forwardFusions: Record<string, { partner: string, result: string }[]> = {};
  for (const resultDemon of comp.allDemons) {
    if (resultDemon.isEnemy) continue;
    const fissions = recipeConfig.fissionCalculator.getFusions(resultDemon.name, comp, normalChart);
    for (const pair of fissions) {
      const A = pair.name1;
      const B = pair.name2;
      if (A === resultDemon.name || B === resultDemon.name) continue;
      
      if (!forwardFusions[A]) forwardFusions[A] = [];
      forwardFusions[A].push({ partner: B, result: resultDemon.name });

      if (A !== B) {
        if (!forwardFusions[B]) forwardFusions[B] = [];
        forwardFusions[B].push({ partner: A, result: resultDemon.name });
      }
    }
  }

  // 2. Initialize DP Table
  const dist: Record<string, Record<number, number>> = {};
  const best: Record<string, Record<number, DpState>> = {};
  const activeMasks: Record<string, number[]> = {};

  for (const d of comp.allDemons) {
    dist[d.name] = {};
    best[d.name] = {};
    activeMasks[d.name] = [];
    for (let m = 0; m <= ALL_SKILLS; m++) dist[d.name][m] = Infinity;
  }

  type PqItem = { cost: number, name: string, mask: number };
  const pq = new PriorityQueue<PqItem>((a, b) => a.cost - b.cost);

  function relax(name: string, mask: number, cost: number, state: DpState) {
    for (let sub = mask; sub >= 0; sub = (sub - 1) & mask) {
      if (cost < dist[name][sub]) {
        if (dist[name][sub] === Infinity) activeMasks[name].push(sub);
        dist[name][sub] = cost;
        best[name][sub] = { ...state, mask: sub };
        pq.push({ cost, name, mask: sub });
      }
      if (sub === 0) break;
    }
  }

  // 3. Base Cases
  for (const demon of comp.allDemons) {
    if (demon.isEnemy) continue;
    
    // Check owned
    const owned = playerState.ownedDemons.find(d => d.name === demon.name);
    let baseMask = 0;
    
    if (owned) {
      for (let i = 0; i < N; i++) {
        if (owned.skills.includes(inheritableSkills[i]) || 
            (demon.skills[inheritableSkills[i]] !== undefined && demon.skills[inheritableSkills[i]] <= 0.9) ||
            (demon.skills[inheritableSkills[i]] !== undefined && Math.round(demon.skills[inheritableSkills[i]]) <= owned.currentLevel)) {
           baseMask |= (1 << i);
        }
      }
      relax(demon.name, baseMask, 0, { demonName: demon.name, mask: baseMask, cost: 0, depth: 0, isOwned: true });
    }

    if (isReachableBaseCase(demon, playerState)) {
      const nativeMask = getNativeSkillMask(demon, playerState, inheritableSkills);
      relax(demon.name, nativeMask, demon.price, { demonName: demon.name, mask: nativeMask, cost: demon.price, depth: 0, isOwned: false });
    }
  }

  // 4. Dijkstra Loop
  while (!pq.isEmpty()) {
    const { cost: costA, name: nameA, mask: maskA } = pq.pop();
    if (costA > dist[nameA][maskA]) continue;

    const fusions = forwardFusions[nameA] || [];
    for (const { partner: nameB, result: nameC } of fusions) {
      const demonC = comp.getDemon(nameC);
      if (!demonC || demonC.lvl > playerState.maxLevel) continue;
      
      const nativeMaskC = getNativeSkillMask(demonC, playerState, inheritableSkills);

      for (const maskB of activeMasks[nameB]) {
        const costB = dist[nameB][maskB];
        const newCost = costA + costB + demonC.price;
        const combinedMask = maskA | maskB | nativeMaskC;

        if (newCost >= dist[nameC][combinedMask]) continue;

        const inheritedMask = (maskA | maskB) & (~nativeMaskC);
        if (!checkSlots(demonC, inheritedMask, comp, inheritableSkills)) continue;

        const bestA = best[nameA][maskA];
        const bestB = best[nameB][maskB];

        relax(nameC, combinedMask, newCost, {
          demonName: nameC,
          mask: combinedMask,
          cost: newCost,
          left: bestA,
          right: bestB,
          depth: Math.max(bestA.depth, bestB.depth) + 1,
          isOwned: false
        });
      }
    }
  }

  // 5. Build Top Results
  const finalPaths: { a?: DpState, b?: DpState, cost: number, state?: DpState }[] = [];
  const targetNative = getNativeSkillMask(comp.getDemon(targetDemon), playerState, inheritableSkills);
  
  // Direct buy/own
  if (dist[targetDemon][ALL_SKILLS] !== Infinity) {
    const bestDirect = best[targetDemon][ALL_SKILLS];
    if (!bestDirect.left && !bestDirect.right) {
       finalPaths.push({ cost: bestDirect.cost, state: bestDirect });
    }
  }

  const targetFissions = recipeConfig.fissionCalculator.getFusions(targetDemon, comp, normalChart);
  for (const pair of targetFissions) {
    const nameA = pair.name1;
    const nameB = pair.name2;
    if (comp.getDemon(nameA).lvl > playerState.maxLevel || comp.getDemon(nameB).lvl > playerState.maxLevel) continue;

    for (const maskA of activeMasks[nameA]) {
      for (const maskB of activeMasks[nameB]) {
        if ((maskA | maskB | targetNative) === ALL_SKILLS) {
          const inheritedMask = (maskA | maskB) & (~targetNative);
          if (checkSlots(comp.getDemon(targetDemon), inheritedMask, comp, inheritableSkills)) {
             const cost = dist[nameA][maskA] + dist[nameB][maskB] + comp.getDemon(targetDemon).price;
             finalPaths.push({
               a: best[nameA][maskA],
               b: best[nameB][maskB],
               cost
             });
          }
        }
      }
    }
  }

  finalPaths.sort((x, y) => x.cost - y.cost);
  
  // Deduplicate
  const seenKeys = new Set<string>();
  const uniquePaths = [];
  for (const p of finalPaths) {
    let key = '';
    if (p.state) { key = p.state.demonName + '_direct'; }
    else {
      const a = p.a!.demonName; const b = p.b!.demonName;
      key = a < b ? `${a}_${b}` : `${b}_${a}`;
    }
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniquePaths.push(p);
    }
  }

  const results: RankedFusionResult[] = [];
  let rank = 1;

  for (const p of uniquePaths.slice(0, maxResults)) {
    let rootNode: FusionNode;
    const demon = comp.getDemon(targetDemon);

    if (p.state) {
      rootNode = buildNodeFromDpState(p.state, requiredSkills, comp, playerState, inheritableSkills);
    } else {
      const leftNode = buildNodeFromDpState(p.a!, inheritableSkills, comp, playerState, inheritableSkills);
      const rightNode = buildNodeFromDpState(p.b!, inheritableSkills, comp, playerState, inheritableSkills);
      const reachability = evaluateDemonReachability(targetDemon, demon, playerState);
      const skillReach = requiredSkills.map(s => evaluateSkillReachability(s, targetDemon, demon, playerState));
      rootNode = {
        demon: targetDemon,
        skillsContributed: requiredSkills,
        left: leftNode,
        right: rightNode,
        inheritMask: leftNode.inheritMask | rightNode.inheritMask,
        totalCost: p.cost,
        depth: Math.max(leftNode.depth, rightNode.depth) + 1,
        reachability,
        skillReachability: skillReach,
      };
    }

    const allBlockers = collectTreeBlockers(rootNode);
    const ahReach = ahOnlySkillNames.map(s => buildAHSkillReachability(s, comp, playerState));

    results.push({
      rank: rank++,
      root: rootNode,
      reachabilityTier: classifyTier(allBlockers),
      totalCost: rootNode.totalCost,
      totalFusions: countFusions(rootNode),
      ownedLeafCount: countOwnedLeaves(rootNode),
      ahOnlySkills: ahReach,
      blockers: allBlockers,
    });
  }

  return results;
}

function buildNodeFromDpState(
  state: DpState, 
  skillsContributed: string[], 
  comp: Compendium, 
  playerState: PlayerState,
  inheritableSkills: string[]
): FusionNode {
  const demon = comp.getDemon(state.demonName);
  const reachability = evaluateDemonReachability(state.demonName, demon, playerState);
  const skillReach = skillsContributed.map(s => evaluateSkillReachability(s, state.demonName, demon, playerState));
  
  if (!state.left || !state.right) {
    return {
      demon: state.demonName,
      skillsContributed,
      inheritMask: demon.inherits || 0x3FFF,
      totalCost: state.cost,
      depth: 0,
      isOwned: state.isOwned,
      reachability,
      skillReachability: skillReach
    };
  }

  // Figure out which skills flowed from left vs right
  const leftMask = state.left.mask;
  const rightMask = state.right.mask;
  
  const leftSkills = [];
  const rightSkills = [];
  for (let i = 0; i < inheritableSkills.length; i++) {
    if (skillsContributed.includes(inheritableSkills[i])) {
      if ((leftMask & (1 << i)) !== 0) leftSkills.push(inheritableSkills[i]);
      else if ((rightMask & (1 << i)) !== 0) rightSkills.push(inheritableSkills[i]);
    }
  }

  const leftNode = buildNodeFromDpState(state.left, leftSkills, comp, playerState, inheritableSkills);
  const rightNode = buildNodeFromDpState(state.right, rightSkills, comp, playerState, inheritableSkills);

  return {
    demon: state.demonName,
    skillsContributed,
    left: leftNode,
    right: rightNode,
    inheritMask: leftNode.inheritMask | rightNode.inheritMask,
    totalCost: state.cost,
    depth: state.depth,
    reachability,
    skillReachability: skillReach
  };
}

// ---------------------------------------------------------------------------
// Reachability evaluators (unchanged logic)
// ---------------------------------------------------------------------------

function evaluateDemonReachability(demonName: string, demon: Demon, playerState: PlayerState): DemonReachability {
  const blockers: ReachabilityBlocker[] = [];
  if (demon.lvl > playerState.maxLevel) {
    blockers.push({ type: 'level_too_low', detail: `${demonName} (Lv ${demon.lvl}) exceeds your level (${playerState.maxLevel})`, unlockCondition: `Reach Level ${demon.lvl}` });
  }
  if (demon.fusion === 'story') {
    const condition = demon.prereq || `Unlock ${demonName}`;
    if (!playerState.unlockedFusions.includes(demonName)) {
      blockers.push({ type: 'story_locked', detail: `${demonName} requires a story unlock: "${condition}"`, unlockCondition: condition });
    }
  }
  
  const hasAuction = Boolean(demon.auctions);
  const canNeg = !demon.price || demon.price === 0;

  if (!canNeg && hasAuction) {
    if (playerState.currentDay < 2) {
      blockers.push({ type: 'ah_tier_locked', detail: `Auction House not open until Day 2 (currently Day ${playerState.currentDay})`, unlockCondition: `Reach Day 2` });
    }
    // Note: We're not doing strictly ah tier detection yet like in checkAHTierBlocker because we rely on the day here, but if we need to, we could.
  }

  const method: AcquisitionMethod =
    demon.fusion === 'story' ? { type: 'story_unlock', condition: demon.prereq ?? '' }
    : canNeg ? { type: 'fusion' } // We don't have a 'negotiate' type in AcquisitionMethod right now, so we can just use 'fusion' or add it. Let's add 'negotiate' to the type if needed, but it might break angular templates if we don't update them. Let's use 'fusion' for now but it's a base case.
    : hasAuction ? { type: 'auction', tier: detectDemonAHTier(demon) ?? 'basic', buyoutCost: demon.price }
    : { type: 'fusion' };

  return { demonName, method, isReachableNow: blockers.length === 0, blockers };
}

function evaluateSkillReachability(skillName: string, demonName: string, demon: Demon, playerState: PlayerState): SkillReachability {
  const skillLevel = demon.skills[skillName];
  const blockers: ReachabilityBlocker[] = [];
  let method: AcquisitionMethod;
  let canBeInherited = true;

  if (skillLevel === undefined) {
    return { skillName, onDemon: demonName, method: { type: 'fusion' }, canBeInherited: true, isReachableNow: true, blockers: [] };
  }
  if (isAHExclusiveSkill(skillLevel)) {
    canBeInherited = false;
    const tier = decodeAHSkillTier(skillLevel) ?? 'occult';
    method = { type: 'auction', tier, buyoutCost: demon.price };
    const b = checkAHTierBlocker(tier, playerState);
    if (b) { blockers.push(b); }
  } else if (skillLevel <= 0.9) {
    method = { type: 'innate' };
  } else {
    const requiredLevel = Math.round(skillLevel);
    method = { type: 'levelup', requiredLevel };
    const owned = playerState.ownedDemons.find(d => d.name === demonName);
    if (owned && owned.currentLevel < requiredLevel) {
      blockers.push({ type: 'level_too_low', detail: `${demonName} must reach Lv ${requiredLevel} to learn ${skillName}`, unlockCondition: `Level ${demonName} to ${requiredLevel}` });
    }
  }
  return { skillName, onDemon: demonName, method, canBeInherited, isReachableNow: blockers.length === 0, blockers };
}

function classifyTier(blockers: ReachabilityBlocker[]): ReachabilityTier {
  if (blockers.length === 0) { return 'available_now'; }
  const hardGate = blockers.some(b => b.type === 'story_locked' || (b.type === 'ah_tier_locked' && b.detail.toLowerCase().includes('occult')));
  return (hardGate || blockers.length > 1) ? 'later_game' : 'soon';
}

function collectTreeBlockers(node: FusionNode): ReachabilityBlocker[] {
  const all = [...node.reachability.blockers, ...node.skillReachability.flatMap(s => s.blockers)];
  if (node.left)  { all.push(...collectTreeBlockers(node.left)); }
  if (node.right) { all.push(...collectTreeBlockers(node.right)); }
  return all.filter((b, i, a) => a.findIndex(x => x.detail === b.detail) === i);
}

function countFusions(node: FusionNode): number {
  if (!node.left && !node.right) { return 0; }
  return 1 + (node.left ? countFusions(node.left) : 0) + (node.right ? countFusions(node.right) : 0);
}

function countOwnedLeaves(node: FusionNode): number {
  if (!node.left && !node.right) { return node.isOwned ? 1 : 0; }
  return (node.left ? countOwnedLeaves(node.left) : 0) + (node.right ? countOwnedLeaves(node.right) : 0);
}

function isSkillAHOnly(skillName: string, comp: Compendium): boolean {
  const skill = comp.getSkill(skillName);
  if (!skill) { return false; }
  return skill.learnedBy.length > 0 && skill.learnedBy.every(e => isAHExclusiveSkill(e.level));
}

function buildAHSkillReachability(skillName: string, comp: Compendium, playerState: PlayerState): SkillReachability {
  const skill = comp.getSkill(skillName);
  const first = skill?.learnedBy[0];
  const tier  = first ? (decodeAHSkillTier(first.level) ?? 'occult') : 'occult';
  const demon = first ? comp.getDemon(first.demon) : null;
  const b = checkAHTierBlocker(tier, playerState);
  return { skillName, onDemon: first?.demon ?? 'unknown', method: { type: 'auction', tier, buyoutCost: demon?.price ?? 0 }, canBeInherited: false, isReachableNow: !b, blockers: b ? [b] : [] };
}

function detectDemonAHTier(demon: Demon): AHTier | null {
  const order: AHTier[] = ['basic', 'gold', 'platinum', 'occult'];
  let highest: AHTier | null = null;
  for (const level of Object.values(demon.skills)) {
    const t = decodeAHSkillTier(level);
    if (t && (highest === null || order.indexOf(t) > order.indexOf(highest))) { highest = t; }
  }
  return highest;
}

function checkAHTierBlocker(tier: AHTier, playerState: PlayerState): ReachabilityBlocker | null {
  if (playerState.ahTiersUnlocked.includes(tier)) { return null; }
  const req = AH_TIER_REQUIREMENTS[tier];
  const parts: string[] = [];
  if (playerState.currentDay < req.minDay) { parts.push(`Day ${req.minDay}`); }
  return { type: 'ah_tier_locked', detail: `AH Tier requires ${parts.join(' + ')}`, unlockCondition: `Reach ${parts.join(' and ')}` };
}
