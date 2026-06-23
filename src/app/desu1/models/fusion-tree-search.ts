/**
 * fusion-tree-search.ts
 * -----------------------------------------------------------------
 * Skill-targeted fusion path explorer for Devil Survivor (Overclocked).
 *
 * Entry point: searchFusionTree()
 *
 * The algorithm searches for ALL paths through the fusion graph that
 * produce a given target demon while ensuring every required skill
 * can be inherited from the constituent ingredient chains.
 *
 * It differs from the existing recipe-generator in three key ways:
 *
 *   1. It explores ALL valid fusion pairs (not just the first cheapest).
 *   2. It enumerates ALL valid skill partitions between the two parent
 *      chains instead of committing to one greedy split.
 *   3. It evaluates every node against the player’s current game state
 *      (day, AH tiers, roster levels) and tags blockers explicitly.
 *
 * Skill value encoding (ove-demon-data.json)
 * ------------------------------------------
 *   0.1 – 0.3  innate skill slot
 *   2 – 99     learned on level-up at that level
 *   > 99       AH-exclusive — CANNOT be inherited; must be purchased
 */

import { Compendium, FusionChart, SquareChart, RecipeGeneratorConfig, Demon } from '../../compendium/models';
import { toFusionPair } from '../../compendium/models/conversions';
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
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Search the full fusion graph for paths that produce `target.targetDemon`
 * while carrying all `target.requiredSkills` through the ingredient chains.
 *
 * Returns a ranked list of at most `target.maxResults` results, sorted by
 * the chosen `target.rankStrategy` and pre-bucketed into reachability tiers.
 */
export function searchFusionTree(
  target: SkillTarget,
  comp: Compendium,
  squareChart: SquareChart,
  recipeConfig: RecipeGeneratorConfig,
): RankedFusionResult[] {
  const { targetDemon, requiredSkills, playerState, maxDepth, maxResults, rankStrategy } = target;
  const { normalChart } = squareChart;

  // Separate AH-only skills upfront — they cannot be routed via fusion.
  const ahOnlySkillNames = requiredSkills.filter(s => isSkillAHOnly(s, comp));
  const inheritableSkills = requiredSkills.filter(s => !isSkillAHOnly(s, comp));

  // Build AH-only skill reachability entries for the result wrapper.
  const ahOnlyReachability = ahOnlySkillNames.map(s =>
    buildAHSkillReachability(s, comp, playerState),
  );

  const roots: FusionNode[] = collectFusionNodes(
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

/**
 * Collect FusionNode trees rooted at `demonName` that carry all
 * `requiredSkills` upward through the fusion chain.
 *
 * @param demonName     Target demon for this level of the tree.
 * @param requiredSkills Skills that MUST be present somewhere in this subtree.
 * @param playerState   Current player context for reachability checks.
 * @param comp          Compendium instance.
 * @param chart         Normal fusion chart.
 * @param recipeConfig  Fusion calculator config.
 * @param maxDepth      Remaining depth budget.
 * @param currentDepth  Current recursion depth (for cycle detection).
 * @param visited       Set of demon names already on the current path.
 */
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
  const { inheritElems } = recipeConfig;
  const results: FusionNode[] = [];

  // Guard: cycle detection and depth limit.
  if (visited.has(demonName) || currentDepth > maxDepth) { return results; }

  const demon = comp.getDemon(demonName);
  if (!demon) { return results; }

  // Build the combined inherit bitmask needed to cover all required skills.
  const requiredMask = buildRequiredMask(requiredSkills, comp, inheritElems);

  // Enumerate all fusion pairs that produce this demon.
  const pairs = recipeConfig.fissionCalculator
    .getFusions(demonName, comp, chart)
    .map(p => toFusionPair(p, comp))
    .filter(p =>
      p.name1 !== demonName &&
      p.name2 !== demonName &&
      !visited.has(p.name1) &&
      !visited.has(p.name2),
    );

  for (const pair of pairs) {
    const leftDemon = comp.getDemon(pair.name1);
    const rightDemon = comp.getDemon(pair.name2);
    if (!leftDemon || !rightDemon) { continue; }

    // Prune: combined inherit mask must cover ALL required skills.
    const combinedMask = leftDemon.inherits | rightDemon.inherits;
    if ((requiredMask & combinedMask) !== requiredMask) { continue; }

    // Enumerate all valid skill partitions between left and right.
    const partitions = enumerateSkillPartitions(
      requiredSkills, leftDemon.inherits, rightDemon.inherits, comp, inheritElems,
    );

    for (const { leftSkills, rightSkills } of partitions) {
      const nextVisited = new Set(visited).add(demonName);

      // Find source chains for left skills.
      const leftNodes = findSkillSourceNodes(
        pair.name1, leftSkills, playerState, comp, chart, recipeConfig,
        maxDepth, currentDepth + 1, nextVisited,
      );

      // Find source chains for right skills.
      const rightNodes = findSkillSourceNodes(
        pair.name2, rightSkills, playerState, comp, chart, recipeConfig,
        maxDepth, currentDepth + 1, nextVisited,
      );

      for (const leftNode of leftNodes) {
        for (const rightNode of rightNodes) {
          const node = buildInteriorNode(
            demonName, demon, requiredSkills,
            leftNode, rightNode,
            comp, playerState, inheritElems,
          );
          results.push(node);
        }
      }
    }
  }

  // Also check if the demon is a special (fixed-ingredient) fusion.
  const specIngreds = comp.getSpecialNameEntries(demonName);
  if (specIngreds.length > 1) {
    const specNodes = buildSpecialFusionNodes(
      demonName, demon, specIngreds, requiredSkills,
      playerState, comp, chart, recipeConfig,
      maxDepth, currentDepth, visited,
    );
    results.push(...specNodes);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Skill source finder
// ---------------------------------------------------------------------------

/**
 * For a given ingredient demon and a set of skills it must carry,
 * return leaf or sub-tree nodes that provide those skills.
 *
 * If the player already owns a demon that has all the required skills
 * at the current level, it is returned as an ‘owned’ leaf node.
 * Otherwise the algorithm recurses to find how to obtain that demon.
 */
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

  const demonSkillNames = Object.keys(demon.skills);
  const canProvide = requiredSkills.every(s => demonSkillNames.includes(s));
  if (!canProvide) { return []; }

  // Check if the player already owns this demon with the required skills
  // available (level-up skills only available if demon level is sufficient).
  const ownedVersion = playerState.ownedDemons.find(d => d.name === demonName);
  if (ownedVersion && hasRequiredSkillsNow(ownedVersion, requiredSkills, demon)) {
    return [buildLeafNode(demonName, demon, requiredSkills, 'owned', playerState, comp)];
  }

  const leafNodes: FusionNode[] = [
    buildLeafNode(demonName, demon, requiredSkills, 'fuse_or_buy', playerState, comp),
  ];

  // Also try to build a sub-tree if depth budget allows.
  if (currentDepth < maxDepth) {
    const subNodes = collectFusionNodes(
      demonName, requiredSkills, playerState, comp, chart, recipeConfig,
      maxDepth, currentDepth, visited,
    );
    leafNodes.push(...subNodes);
  }

  return leafNodes;
}

// ---------------------------------------------------------------------------
// Skill partition enumeration
// ---------------------------------------------------------------------------

/**
 * Enumerate all valid ways to split `skills` between a left parent
 * (with inherit bitmask `leftMask`) and a right parent (`rightMask`).
 *
 * A skill can go to the left side only if the left parent’s inherit
 * mask covers that skill’s element bit, and vice versa.  Some skills
 * can go to either side; we enumerate all valid assignments.
 *
 * Complexity: O(2^N) where N = skills.length.  Fast for N ≤ 8 (the
 * game’s max active skill count).
 */
function enumerateSkillPartitions(
  skills: string[],
  leftMask: number,
  rightMask: number,
  comp: Compendium,
  inheritElems: string[],
): { leftSkills: string[]; rightSkills: string[] }[] {
  if (skills.length === 0) {
    return [{ leftSkills: [], rightSkills: [] }];
  }

  const skillBits = skills.map(s => {
    const sk = comp.getSkill(s);
    return sk ? canInheritBit(sk.inherit, inheritElems) : 0;
  });

  const partitions: { leftSkills: string[]; rightSkills: string[] }[] = [];
  const total = 1 << skills.length;

  for (let mask = 0; mask < total; mask++) {
    let valid = true;
    const leftSkills: string[] = [];
    const rightSkills: string[] = [];

    for (let i = 0; i < skills.length; i++) {
      const goLeft = (mask >> i) & 1;
      const bit = skillBits[i];

      if (goLeft) {
        // Skill goes to left parent — left parent must be able to inherit it.
        if (bit !== 0 && (bit & leftMask) !== bit) { valid = false; break; }
        leftSkills.push(skills[i]);
      } else {
        // Skill goes to right parent — right parent must be able to inherit it.
        if (bit !== 0 && (bit & rightMask) !== bit) { valid = false; break; }
        rightSkills.push(skills[i]);
      }
    }

    if (valid) { partitions.push({ leftSkills, rightSkills }); }
  }

  // Deduplicate partitions that are set-equivalent.
  const seen = new Set<string>();
  return partitions.filter(p => {
    const key = `${[...p.leftSkills].sort().join(',')}|${[...p.rightSkills].sort().join(',')}`;
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
  inheritElems: string[],
): FusionNode {
  const reachability = evaluateDemonReachability(demonName, demon, playerState);
  const skillReach = skillsContributed.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState, comp),
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
  const skillReach = skillsContributed.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState, comp),
  );

  return {
    demon: demonName,
    skillsContributed,
    left: undefined,
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
  chart: FusionChart,
  recipeConfig: RecipeGeneratorConfig,
  maxDepth: number,
  currentDepth: number,
  visited: Set<string>,
): FusionNode[] {
  // For special fusions treat all ingredients as base cases (leaf nodes).
  const leafNodes = specIngreds.map(name => {
    const d = comp.getDemon(name);
    return d
      ? buildLeafNode(name, d, [], 'fuse_or_buy', playerState, comp)
      : null;
  }).filter(Boolean) as FusionNode[];

  if (leafNodes.length < 2) { return []; }

  const reachability = evaluateDemonReachability(demonName, demon, playerState);
  const skillReach = requiredSkills.map(s =>
    evaluateSkillReachability(s, demonName, demon, playerState, comp),
  );

  const totalCost = demon.price + leafNodes.reduce((acc, n) => acc + n.totalCost, 0);
  const depth = 1;

  return [{
    demon: demonName,
    skillsContributed: requiredSkills,
    left: leafNodes[0],
    right: leafNodes[1],
    inheritMask: leafNodes.reduce((acc, n) => acc | n.inheritMask, 0),
    totalCost,
    depth,
    reachability,
    skillReachability: skillReach,
  }];
}

// ---------------------------------------------------------------------------
// Reachability evaluators
// ---------------------------------------------------------------------------

/** Evaluate whether a demon is reachable given the current PlayerState. */
function evaluateDemonReachability(
  demonName: string,
  demon: Demon,
  playerState: PlayerState,
): DemonReachability {
  const blockers: ReachabilityBlocker[] = [];

  // Check story unlock gating.
  if (demon.fusion === 'story' || demon.prereq) {
    const condition = demon.prereq || `Unlock ${demonName}`;
    if (!playerState.unlockedFusions.includes(demonName)) {
      blockers.push({
        type: 'story_locked',
        detail: `${demonName} requires a story unlock: “${condition}”`,
        unlockCondition: condition,
      });
    }
  }

  // Check AH-only demons (fusion === 'auction' in some compendium entries).
  if (demon.fusion === 'auction') {
    const tier = detectDemonAHTier(demon);
    if (tier) {
      const tierBlocker = checkAHTierBlocker(tier, playerState);
      if (tierBlocker) { blockers.push(tierBlocker); }
    }
  }

  const method: AcquisitionMethod =
    demon.fusion === 'auction' ? { type: 'auction', tier: detectDemonAHTier(demon) ?? 'basic', buyoutCost: demon.price }
    : demon.fusion === 'story' ? { type: 'story_unlock', condition: demon.prereq ?? '' }
    : { type: 'fusion' };

  return {
    demonName,
    method,
    isReachableNow: blockers.length === 0,
    blockers,
  };
}

/** Evaluate whether a skill on a specific demon is reachable. */
function evaluateSkillReachability(
  skillName: string,
  demonName: string,
  demon: Demon,
  playerState: PlayerState,
  comp: Compendium,
): SkillReachability {
  const skillLevel = demon.skills[skillName];
  const blockers: ReachabilityBlocker[] = [];
  let method: AcquisitionMethod;
  let canBeInherited = true;

  if (skillLevel === undefined) {
    // Skill not on this demon — should not happen in a well-formed tree.
    return {
      skillName,
      onDemon: demonName,
      method: { type: 'innate' },
      canBeInherited: false,
      isReachableNow: false,
      blockers: [{ type: 'story_locked', detail: `${skillName} not found on ${demonName}`, unlockCondition: '' }],
    };
  }

  if (isAHExclusiveSkill(skillLevel)) {
    // AH-exclusive: cannot be inherited — must purchase the demon from AH.
    canBeInherited = false;
    const tier = decodeAHSkillTier(skillLevel) ?? 'occult';
    method = { type: 'auction', tier, buyoutCost: demon.price };
    const tierBlocker = checkAHTierBlocker(tier, playerState);
    if (tierBlocker) { blockers.push(tierBlocker); }

  } else if (skillLevel <= 0.9) {
    // Innate skill (slot 0.1 / 0.2 / 0.3) — always available if demon is.
    method = { type: 'innate' };

  } else {
    // Level-up skill.
    method = { type: 'levelup', requiredLevel: Math.round(skillLevel) };
    const requiredLevel = Math.round(skillLevel);
    const ownedVersion = playerState.ownedDemons.find(d => d.name === demonName);

    if (ownedVersion && ownedVersion.currentLevel < requiredLevel) {
      blockers.push({
        type: 'level_too_low',
        detail: `${demonName} needs to reach level ${requiredLevel} to learn ${skillName} (currently ${ownedVersion.currentLevel})`,
        unlockCondition: `Level ${demonName} up to ${requiredLevel}`,
      });
    }
  }

  return {
    skillName,
    onDemon: demonName,
    method,
    canBeInherited,
    isReachableNow: blockers.length === 0,
    blockers,
  };
}

// ---------------------------------------------------------------------------
// Ranking and wrapping
// ---------------------------------------------------------------------------

function rankAndWrap(
  roots: FusionNode[],
  ahOnlySkills: SkillReachability[],
  strategy: RankStrategy,
  maxResults: number,
): RankedFusionResult[] {
  const sorted = [...roots].sort((a, b) => {
    switch (strategy) {
      case 'cheapest':         return a.totalCost - b.totalCost;
      case 'fewest_steps':     return a.depth - b.depth;
      case 'most_owned_used':  return countOwnedLeaves(b) - countOwnedLeaves(a);
      default:                 return a.totalCost - b.totalCost;
    }
  });

  return sorted.slice(0, maxResults).map((root, i) => {
    const allBlockers = collectTreeBlockers(root);
    const tier = classifyReachabilityTier(allBlockers);
    return {
      rank: i + 1,
      root,
      reachabilityTier: tier,
      totalCost: root.totalCost,
      totalFusions: countFusions(root),
      ownedLeafCount: countOwnedLeaves(root),
      ahOnlySkills,
      blockers: allBlockers,
    };
  });
}

function classifyReachabilityTier(blockers: ReachabilityBlocker[]): ReachabilityTier {
  if (blockers.length === 0) { return 'available_now'; }
  // 'soon' heuristic: only one blocker and it’s not an occult AH gate.
  const hasOccultGate = blockers.some(
    b => b.type === 'ah_tier_locked' && b.detail.toLowerCase().includes('occult'),
  );
  const hasStoryGate = blockers.some(b => b.type === 'story_locked');
  if (!hasOccultGate && !hasStoryGate && blockers.length === 1) { return 'soon'; }
  return 'later_game';
}

// ---------------------------------------------------------------------------
// Tree utility helpers
// ---------------------------------------------------------------------------

function collectTreeBlockers(node: FusionNode): ReachabilityBlocker[] {
  const blockers = [
    ...node.reachability.blockers,
    ...node.skillReachability.flatMap(s => s.blockers),
  ];
  if (node.left)  { blockers.push(...collectTreeBlockers(node.left)); }
  if (node.right) { blockers.push(...collectTreeBlockers(node.right)); }
  // Deduplicate by detail string.
  return blockers.filter((b, i, a) => a.findIndex(x => x.detail === b.detail) === i);
}

function countFusions(node: FusionNode): number {
  if (!node.left && !node.right) { return 0; }
  return 1 + (node.left ? countFusions(node.left) : 0) + (node.right ? countFusions(node.right) : 0);
}

function countOwnedLeaves(node: FusionNode): number {
  if (!node.left && !node.right) {
    return node.reachability.method.type === 'innate' ? 1 : 0;
  }
  return (node.left ? countOwnedLeaves(node.left) : 0) + (node.right ? countOwnedLeaves(node.right) : 0);
}

// ---------------------------------------------------------------------------
// Bitmask helpers
// ---------------------------------------------------------------------------

function canInheritBit(element: string, inheritElems: string[]): number {
  const idx = inheritElems.indexOf(element);
  if (idx === -1) { return 0; }
  return 1 << (inheritElems.length - 1 - idx);
}

function buildRequiredMask(skills: string[], comp: Compendium, inheritElems: string[]): number {
  return skills.reduce((mask, s) => {
    const sk = comp.getSkill(s);
    return sk ? mask | canInheritBit(sk.inherit, inheritElems) : mask;
  }, 0);
}

// ---------------------------------------------------------------------------
// AH helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if a skill is AH-exclusive on ALL demons that know it,
 * meaning it can never be obtained via normal fusion inheritance.
 */
function isSkillAHOnly(skillName: string, comp: Compendium): boolean {
  const skill = comp.getSkill(skillName);
  if (!skill) { return false; }
  // A skill is considered AH-only when every demon that knows it has
  // a skill-level value > 99 (the AH-exclusive encoding).
  return skill.learnedBy.every(entry => isAHExclusiveSkill(entry.level));
}

function buildAHSkillReachability(
  skillName: string,
  comp: Compendium,
  playerState: PlayerState,
): SkillReachability {
  const skill = comp.getSkill(skillName);
  const firstEntry = skill?.learnedBy[0];
  const tier = firstEntry ? (decodeAHSkillTier(firstEntry.level) ?? 'occult') : 'occult';
  const demonName = firstEntry?.demon ?? 'unknown';
  const demon = comp.getDemon(demonName);
  const tierBlocker = checkAHTierBlocker(tier, playerState);

  return {
    skillName,
    onDemon: demonName,
    method: { type: 'auction', tier, buyoutCost: demon?.price ?? 0 },
    canBeInherited: false,
    isReachableNow: !tierBlocker,
    blockers: tierBlocker ? [tierBlocker] : [],
  };
}

function detectDemonAHTier(demon: Demon): AHTier | null {
  // Heuristic: demons with very high level values in any skill slot
  // are AH-exclusive.  Use the highest AH tier found.
  let highestTier: AHTier | null = null;
  const tierOrder: AHTier[] = ['basic', 'gold', 'platinum', 'occult'];
  for (const level of Object.values(demon.skills)) {
    const t = decodeAHSkillTier(level);
    if (t && (highestTier === null || tierOrder.indexOf(t) > tierOrder.indexOf(highestTier))) {
      highestTier = t;
    }
  }
  return highestTier;
}

function checkAHTierBlocker(
  tier: AHTier,
  playerState: PlayerState,
): ReachabilityBlocker | null {
  if (playerState.ahTiersUnlocked.includes(tier)) { return null; }

  const req = AH_TIER_REQUIREMENTS[tier];
  const parts: string[] = [];
  if (playerState.currentDay < req.minDay) {
    parts.push(`Day ${req.minDay} (currently Day ${playerState.currentDay})`);
  }
  if (playerState.currentRating < req.minRating) {
    parts.push(`Rating ${req.minRating} (currently ${playerState.currentRating})`);
  }
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const detail = `${tierLabel} AH requires ${parts.join(' and ')} + ${req.unlockCost} Macca to unlock`;

  return {
    type: 'ah_tier_locked',
    detail,
    unlockCondition: `Reach ${parts.join(' and ')} then pay ${req.unlockCost} Macca at the Auction House`,
  };
}

// ---------------------------------------------------------------------------
// Owned demon helper
// ---------------------------------------------------------------------------

/**
 * Returns true if the player’s owned version of a demon already has
 * all required skills available at their current level.
 */
function hasRequiredSkillsNow(
  owned: OwnedDemon,
  requiredSkills: string[],
  demon: Demon,
): boolean {
  for (const skillName of requiredSkills) {
    const level = demon.skills[skillName];
    if (level === undefined) { return false; }
    // Innate skills (0.x) are always available.
    if (level <= 0.9) { continue; }
    // AH-exclusive: available if the player has this demon with that skill slot.
    if (isAHExclusiveSkill(level)) {
      if (!owned.skills.includes(skillName)) { return false; }
      continue;
    }
    // Level-up skill: only available if the owned demon is high enough level.
    if (owned.currentLevel < Math.round(level)) { return false; }
  }
  return true;
}
