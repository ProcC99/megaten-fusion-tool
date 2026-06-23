/**
 * fusion-tree-search.ts  (rewritten)
 * -----------------------------------------------------------------
 * Skill-targeted fusion path explorer for Devil Survivor Overclocked.
 *
 * Key change vs the scaffolded version
 * -------------------------------------
 * enumerateSkillPartitions() now enforces the 3 CMD / 3 PAS slot cap
 * per parent demon:
 *
 *   A parent can carry a desired skill into the fusion if EITHER:
 *     (a) it already has the skill in its own skill list, OR
 *     (b) it has a free slot of the correct type (CMD or PAS) that
 *         one of ITS OWN parents can fill via inheritance.
 *
 *   Free slots  = 3 − (number of non-racial skills already on the demon)
 *   PAS skills  = element 'aut' in the compendium, OR Skill.inherit
 *                 being one of the known passive element tags.
 *   Racial skill occupies slot 7 and is excluded entirely.
 *
 * Skill value encoding (ove-demon-data.json)
 * ------------------------------------------
 *   0.1 – 0.3  innate skill slot  (always occupies a slot)
 *   2 – 99     level-up skill     (occupies a slot once learned)
 *   > 99       AH-exclusive       CANNOT be inherited
 */

import {
  Compendium,
  FusionChart,
  SquareChart,
  RecipeGeneratorConfig,
  Demon,
  Skill,
} from '../../compendium/models';
import {
  AHTier,
  AH_TIER_REQUIREMENTS,
  AcquisitionMethod,
  DemonReachability,
  FusionNode,
  OwnedDemon,
  PlayerState,
  RankedFusionResult,
  RankStrategy,
  ReachabilityBlocker,
  ReachabilityTier,
  SkillReachability,
  SkillTarget,
  decodeAHSkillTier,
  isAHExclusiveSkill,
} from './fusion-tree-types';

// ---------------------------------------------------------------------------
// Slot helpers
// ---------------------------------------------------------------------------

/** Passive-type element tags used in the DSO skill data. */
const PASSIVE_ELEMENTS = new Set(['aut', 'pas', 'auto']);

/**
 * Returns true when a skill should go into the PAS (passive) bucket.
 * Relies on Skill.element — for DSO this is 'aut' for Auto-type skills.
 * Fallback: if element is undefined we conservatively treat it as CMD.
 */
function isPassiveSkill(comp: Compendium, skillName: string): boolean {
  const sk = comp.getSkill(skillName);
  if (!sk) { return false; }
  return PASSIVE_ELEMENTS.has((sk.element || '').toLowerCase());
}

/**
 * Counts how many CMD and PAS slots a demon's current skill list
 * already occupies (excluding the fixed Racial slot which is index 7
 * and encoded separately by the compendium).
 *
 * Rules:
 *   • AH-exclusive skills (level > 99) occupy a slot (they're real skills).
 *   • Innate skills (0.x) occupy a slot.
 *   • Level-up skills (2–99) occupy a slot once learned — we count them
 *     all conservatively (player will level the demon before fusing).
 */
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

/** Free CMD and PAS inheritance slots available on a demon. */
function freeSlots(demon: Demon, comp: Compendium): { freeCmd: number; freePas: number } {
  const { usedCmd, usedPas } = demonSlotUsage(demon, comp);
  return {
    freeCmd: Math.max(0, 3 - usedCmd),
    freePas: Math.max(0, 3 - usedPas),
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Search the fusion graph for paths that produce `target.targetDemon`
 * while carrying all `target.requiredSkills` into the final demon.
 *
 * Returns at most `target.maxResults` results ranked by `target.rankStrategy`.
 */
export function searchFusionTree(
  target: SkillTarget,
  comp: Compendium,
  squareChart: SquareChart,
  recipeConfig: RecipeGeneratorConfig,
): RankedFusionResult[] {
  const { targetDemon, requiredSkills, playerState, maxDepth, maxResults, rankStrategy } = target;
  const { normalChart } = squareChart;

  // Separate AH-only skills — cannot be routed via fusion.
  const ahOnlySkillNames = requiredSkills.filter(s => isSkillAHOnly(s, comp));
  const inheritableSkills  = requiredSkills.filter(s => !isSkillAHOnly(s, comp));

  const ahOnlyReachability = ahOnlySkillNames.map(s =>
    buildAHSkillReachability(s, comp, playerState),
  );

  const roots = collectFusionNodes(
    targetDemon,
    inheritableSkills,
    playerState,
    comp,
    normalChart,
    recipeConfig,
    maxDepth,
    0,
    new Set<string>(),
  );

  return rankAndWrap(roots, ahOnlyReachability, rankStrategy, maxResults);
}

// ---------------------------------------------------------------------------
// Core recursive collector
// ---------------------------------------------------------------------------

function collectFusionNodes(
  demonName: string,
  requiredSkills: string[],
  playerState: PlayerState,
  comp: Compendium,
  chart: FusionChart,
  recipeConfig: RecipeGeneratorConfig,
  maxDepth: number,
  currentDepth: number,
  visited: Set<string>,
): FusionNode[] {
  const results: FusionNode[] = [];

  if (visited.has(demonName) || currentDepth > maxDepth) { return results; }

  const demon = comp.getDemon(demonName);
  if (!demon) { return results; }

  // Enumerate all fusion pairs that produce this demon.
  const pairs = recipeConfig.fissionCalculator
    .getFusions(demonName, comp, chart)
    .filter(p =>
      p.name1 !== demonName &&
      p.name2 !== demonName &&
      !visited.has(p.name1) &&
      !visited.has(p.name2),
    );

  for (const pair of pairs) {
    const leftDemon  = comp.getDemon(pair.name1);
    const rightDemon = comp.getDemon(pair.name2);
    if (!leftDemon || !rightDemon) { continue; }

    // Enumerate all SLOT-CAP-VALID skill partitions between the two parents.
    const partitions = enumerateSkillPartitions(
      requiredSkills, leftDemon, rightDemon, comp,
    );
    if (partitions.length === 0) { continue; }

    for (const { leftSkills, rightSkills } of partitions) {
      const nextVisited = new Set(visited).add(demonName);

      const leftNodes = findSkillSourceNodes(
        pair.name1, leftSkills, playerState, comp, chart, recipeConfig,
        maxDepth, currentDepth + 1, nextVisited,
      );
      const rightNodes = findSkillSourceNodes(
        pair.name2, rightSkills, playerState, comp, chart, recipeConfig,
        maxDepth, currentDepth + 1, nextVisited,
      );

      for (const leftNode of leftNodes) {
        for (const rightNode of rightNodes) {
          results.push(buildInteriorNode(
            demonName, demon, requiredSkills,
            leftNode, rightNode,
            comp, playerState,
          ));
        }
      }
    }
  }

  // Special (fixed-ingredient) fusions.
  const specIngreds = comp.getSpecialNameEntries(demonName);
  if (specIngreds.length > 1) {
    results.push(...buildSpecialFusionNodes(
      demonName, demon, specIngreds, requiredSkills,
      playerState, comp,
    ));
  }

  return results;
}

// ---------------------------------------------------------------------------
// Skill source finder
// ---------------------------------------------------------------------------

function findSkillSourceNodes(
  demonName: string,
  requiredSkills: string[],
  playerState: PlayerState,
  comp: Compendium,
  chart: FusionChart,
  recipeConfig: RecipeGeneratorConfig,
  maxDepth: number,
  currentDepth: number,
  visited: Set<string>,
): FusionNode[] {
  const demon = comp.getDemon(demonName);
  if (!demon) { return []; }

  // Demon must either already have each required skill OR have a free slot for it.
  const { freeCmd, freePas } = freeSlots(demon, comp);
  let neededCmd = 0;
  let neededPas = 0;

  for (const skillName of requiredSkills) {
    const alreadyHas = demon.skills[skillName] !== undefined &&
                       !isAHExclusiveSkill(demon.skills[skillName]);
    if (alreadyHas) { continue; } // skill is already present — no slot needed
    if (isPassiveSkill(comp, skillName)) {
      neededPas++;
    } else {
      neededCmd++;
    }
  }

  if (neededCmd > freeCmd || neededPas > freePas) { return []; }

  const ownedVersion = playerState.ownedDemons.find(d => d.name === demonName);
  if (ownedVersion && hasRequiredSkillsNow(ownedVersion, requiredSkills, demon)) {
    return [buildLeafNode(demonName, demon, requiredSkills, 'owned', playerState, comp)];
  }

  const nodes: FusionNode[] = [
    buildLeafNode(demonName, demon, requiredSkills, 'fuse_or_buy', playerState, comp),
  ];

  if (currentDepth < maxDepth) {
    nodes.push(...collectFusionNodes(
      demonName, requiredSkills, playerState, comp, chart, recipeConfig,
      maxDepth, currentDepth, visited,
    ));
  }

  return nodes;
}

// ---------------------------------------------------------------------------
// Slot-cap-aware skill partition enumeration
// ---------------------------------------------------------------------------

/**
 * Enumerate all valid ways to split `skills` between leftDemon and rightDemon
 * subject to:
 *   1. Each skill must go to a parent that has a free slot of the right type
 *      (CMD or PAS), OR the parent already has the skill.
 *   2. The total CMD skills routed to a parent must not exceed its freeCmd,
 *      and likewise for PAS.
 *
 * Complexity: O(2^N), N ≤ 6. Fast enough for all practical inputs.
 */
function enumerateSkillPartitions(
  skills: string[],
  leftDemon: Demon,
  rightDemon: Demon,
  comp: Compendium,
): { leftSkills: string[]; rightSkills: string[] }[] {
  if (skills.length === 0) {
    return [{ leftSkills: [], rightSkills: [] }];
  }

  const leftSlots  = freeSlots(leftDemon,  comp);
  const rightSlots = freeSlots(rightDemon, comp);

  // Pre-classify each skill: is it passive? does each parent already have it?
  const meta = skills.map(s => ({
    name: s,
    isPas: isPassiveSkill(comp, s),
    leftHas:  leftDemon.skills[s]  !== undefined && !isAHExclusiveSkill(leftDemon.skills[s]  ?? 101),
    rightHas: rightDemon.skills[s] !== undefined && !isAHExclusiveSkill(rightDemon.skills[s] ?? 101),
  }));

  const partitions: { leftSkills: string[]; rightSkills: string[] }[] = [];
  const total = 1 << skills.length;

  for (let mask = 0; mask < total; mask++) {
    let leftNeedCmd = 0, leftNeedPas = 0;
    let rightNeedCmd = 0, rightNeedPas = 0;
    let valid = true;

    const leftSkills:  string[] = [];
    const rightSkills: string[] = [];

    for (let i = 0; i < skills.length; i++) {
      const m = meta[i];
      const goLeft = ((mask >> i) & 1) === 1;

      if (goLeft) {
        leftSkills.push(m.name);
        if (!m.leftHas) {
          m.isPas ? leftNeedPas++ : leftNeedCmd++;
        }
      } else {
        rightSkills.push(m.name);
        if (!m.rightHas) {
          m.isPas ? rightNeedPas++ : rightNeedCmd++;
        }
      }
    }

    if (
      leftNeedCmd  > leftSlots.freeCmd  ||
      leftNeedPas  > leftSlots.freePas  ||
      rightNeedCmd > rightSlots.freeCmd ||
      rightNeedPas > rightSlots.freePas
    ) { valid = false; }

    if (!valid) { continue; }
    partitions.push({ leftSkills, rightSkills });
  }

  // Deduplicate set-equivalent partitions.
  const seen = new Set<string>();
  return partitions.filter(p => {
    const key = [...p.leftSkills].sort().join(',') + '|' + [...p.rightSkills].sort().join(',');
    if (seen.has(key)) { return false; }
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Node builders
// ---------------------------------------------------------------------------

function buildInteriorNode(
  demonName: string,
  demon: Demon,
  skillsContributed: string[],
  left: FusionNode,
  right: FusionNode,
  comp: Compendium,
  playerState: PlayerState,
): FusionNode {
  const reachability = evaluateDemonReachability(demonName, demon, playerState);
  const skillReach   = skillsContributed.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState),
  );
  return {
    demon: demonName,
    skillsContributed,
    left,
    right,
    inheritMask: left.inheritMask | right.inheritMask,
    totalCost: demon.price + left.totalCost + right.totalCost,
    depth: 1 + Math.max(left.depth, right.depth),
    reachability,
    skillReachability: skillReach,
  };
}

function buildLeafNode(
  demonName: string,
  demon: Demon,
  skillsContributed: string[],
  context: 'owned' | 'fuse_or_buy',
  playerState: PlayerState,
  comp: Compendium,
): FusionNode {
  const reachability = evaluateDemonReachability(demonName, demon, playerState);
  const skillReach   = skillsContributed.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState),
  );
  return {
    demon: demonName,
    skillsContributed,
    left:  undefined,
    right: undefined,
    inheritMask: demon.inherits,
    totalCost: context === 'owned' ? 0 : demon.price,
    depth: 0,
    reachability,
    skillReachability: skillReach,
  };
}

function buildSpecialFusionNodes(
  demonName: string,
  demon: Demon,
  specIngreds: string[],
  requiredSkills: string[],
  playerState: PlayerState,
  comp: Compendium,
): FusionNode[] {
  const leaves = specIngreds
    .map(name => {
      const d = comp.getDemon(name);
      return d ? buildLeafNode(name, d, [], 'fuse_or_buy', playerState, comp) : null;
    })
    .filter(Boolean) as FusionNode[];

  if (leaves.length < 2) { return []; }

  const reachability = evaluateDemonReachability(demonName, demon, playerState);
  const skillReach   = requiredSkills.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState),
  );

  return [{
    demon: demonName,
    skillsContributed: requiredSkills,
    left:  leaves[0],
    right: leaves[1],
    inheritMask: leaves.reduce((acc, n) => acc | n.inheritMask, 0),
    totalCost: demon.price + leaves.reduce((acc, n) => acc + n.totalCost, 0),
    depth: 1,
    reachability,
    skillReachability: skillReach,
  }];
}

// ---------------------------------------------------------------------------
// Reachability evaluators
// ---------------------------------------------------------------------------

function evaluateDemonReachability(
  demonName: string,
  demon: Demon,
  playerState: PlayerState,
): DemonReachability {
  const blockers: ReachabilityBlocker[] = [];

  if (demon.fusion === 'story' || demon.prereq) {
    const condition = demon.prereq || `Unlock ${demonName}`;
    if (!playerState.unlockedFusions.includes(demonName)) {
      blockers.push({
        type: 'story_locked',
        detail: `${demonName} requires a story unlock: "${condition}"`,
        unlockCondition: condition,
      });
    }
  }

  if (demon.fusion === 'auction') {
    const tier = detectDemonAHTier(demon);
    if (tier) {
      const b = checkAHTierBlocker(tier, playerState);
      if (b) { blockers.push(b); }
    }
  }

  const method: AcquisitionMethod =
    demon.fusion === 'auction'  ? { type: 'auction',      tier: detectDemonAHTier(demon) ?? 'basic', buyoutCost: demon.price }
    : demon.fusion === 'story' ? { type: 'story_unlock', condition: demon.prereq ?? '' }
    : { type: 'fusion' };

  return { demonName, method, isReachableNow: blockers.length === 0, blockers };
}

function evaluateSkillReachability(
  skillName: string,
  demonName: string,
  demon: Demon,
  playerState: PlayerState,
): SkillReachability {
  const skillLevel = demon.skills[skillName];
  const blockers: ReachabilityBlocker[] = [];
  let method: AcquisitionMethod;
  let canBeInherited = true;

  if (skillLevel === undefined) {
    return {
      skillName, onDemon: demonName,
      method: { type: 'innate' },
      canBeInherited: false, isReachableNow: false,
      blockers: [{ type: 'story_locked', detail: `${skillName} not found on ${demonName}`, unlockCondition: '' }],
    };
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
      blockers.push({
        type: 'level_too_low',
        detail: `${demonName} must reach Lv ${requiredLevel} to learn ${skillName} (currently Lv ${owned.currentLevel})`,
        unlockCondition: `Level ${demonName} to ${requiredLevel}`,
      });
    }
  }

  return { skillName, onDemon: demonName, method, canBeInherited, isReachableNow: blockers.length === 0, blockers };
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

function rankAndWrap(
  roots: FusionNode[],
  ahOnlySkills: SkillReachability[],
  strategy: RankStrategy,
  maxResults: number,
): RankedFusionResult[] {
  const sorted = [...roots].sort((a, b) => {
    switch (strategy) {
      case 'cheapest':        return a.totalCost - b.totalCost;
      case 'fewest_steps':    return a.depth - b.depth;
      case 'most_owned_used': return countOwnedLeaves(b) - countOwnedLeaves(a);
      default:                return a.totalCost - b.totalCost;
    }
  });

  return sorted.slice(0, maxResults).map((root, i) => {
    const allBlockers = collectTreeBlockers(root);
    return {
      rank: i + 1,
      root,
      reachabilityTier: classifyTier(allBlockers),
      totalCost: root.totalCost,
      totalFusions: countFusions(root),
      ownedLeafCount: countOwnedLeaves(root),
      ahOnlySkills,
      blockers: allBlockers,
    };
  });
}

function classifyTier(blockers: ReachabilityBlocker[]): ReachabilityTier {
  if (blockers.length === 0) { return 'available_now'; }
  const hardGate = blockers.some(
    b => b.type === 'story_locked' ||
         (b.type === 'ah_tier_locked' && b.detail.toLowerCase().includes('occult')),
  );
  return (hardGate || blockers.length > 1) ? 'later_game' : 'soon';
}

// ---------------------------------------------------------------------------
// Tree utilities
// ---------------------------------------------------------------------------

function collectTreeBlockers(node: FusionNode): ReachabilityBlocker[] {
  const all = [
    ...node.reachability.blockers,
    ...node.skillReachability.flatMap(s => s.blockers),
  ];
  if (node.left)  { all.push(...collectTreeBlockers(node.left)); }
  if (node.right) { all.push(...collectTreeBlockers(node.right)); }
  return all.filter((b, i, a) => a.findIndex(x => x.detail === b.detail) === i);
}

function countFusions(node: FusionNode): number {
  if (!node.left && !node.right) { return 0; }
  return 1 +
    (node.left  ? countFusions(node.left)  : 0) +
    (node.right ? countFusions(node.right) : 0);
}

function countOwnedLeaves(node: FusionNode): number {
  if (!node.left && !node.right) {
    return node.reachability.method.type === 'innate' ? 1 : 0;
  }
  return (node.left  ? countOwnedLeaves(node.left)  : 0) +
         (node.right ? countOwnedLeaves(node.right) : 0);
}

// ---------------------------------------------------------------------------
// AH helpers
// ---------------------------------------------------------------------------

function isSkillAHOnly(skillName: string, comp: Compendium): boolean {
  const skill = comp.getSkill(skillName);
  if (!skill) { return false; }
  return skill.learnedBy.length > 0 &&
         skill.learnedBy.every(e => isAHExclusiveSkill(e.level));
}

function buildAHSkillReachability(
  skillName: string,
  comp: Compendium,
  playerState: PlayerState,
): SkillReachability {
  const skill = comp.getSkill(skillName);
  const first = skill?.learnedBy[0];
  const tier  = first ? (decodeAHSkillTier(first.level) ?? 'occult') : 'occult';
  const demon = first ? comp.getDemon(first.demon) : null;
  const b = checkAHTierBlocker(tier, playerState);
  return {
    skillName,
    onDemon: first?.demon ?? 'unknown',
    method: { type: 'auction', tier, buyoutCost: demon?.price ?? 0 },
    canBeInherited: false,
    isReachableNow: !b,
    blockers: b ? [b] : [],
  };
}

function detectDemonAHTier(demon: Demon): AHTier | null {
  const order: AHTier[] = ['basic', 'gold', 'platinum', 'occult'];
  let highest: AHTier | null = null;
  for (const level of Object.values(demon.skills)) {
    const t = decodeAHSkillTier(level);
    if (t && (highest === null || order.indexOf(t) > order.indexOf(highest))) {
      highest = t;
    }
  }
  return highest;
}

function checkAHTierBlocker(
  tier: AHTier,
  playerState: PlayerState,
): ReachabilityBlocker | null {
  if (playerState.ahTiersUnlocked.includes(tier)) { return null; }
  const req = AH_TIER_REQUIREMENTS[tier];
  const parts: string[] = [];
  if (playerState.currentDay    < req.minDay)    { parts.push(`Day ${req.minDay} (currently Day ${playerState.currentDay})`); }
  if (playerState.currentRating < req.minRating) { parts.push(`Rating ${req.minRating} (currently ${playerState.currentRating})`); }
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);
  return {
    type: 'ah_tier_locked',
    detail: `${label} AH requires ${parts.join(' + ')} + ${req.unlockCost} Macca to unlock`,
    unlockCondition: `Reach ${parts.join(' and ')} then pay ${req.unlockCost} Macca at the Auction House`,
  };
}

// ---------------------------------------------------------------------------
// Owned demon helper
// ---------------------------------------------------------------------------

function hasRequiredSkillsNow(
  owned: OwnedDemon,
  requiredSkills: string[],
  demon: Demon,
): boolean {
  for (const skillName of requiredSkills) {
    const level = demon.skills[skillName];
    if (level === undefined) { return false; }
    if (level <= 0.9) { continue; }                          // innate — always available
    if (isAHExclusiveSkill(level)) {
      if (!owned.skills.includes(skillName)) { return false; }
      continue;
    }
    if (owned.currentLevel < Math.round(level)) { return false; } // level-up skill
  }
  return true;
}
