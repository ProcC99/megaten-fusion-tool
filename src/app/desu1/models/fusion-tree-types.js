"use strict";
/**
 * fusion-tree-types.ts
 * -----------------------------------------------------------------
 * Data models for the Devil Survivor skill-targeted fusion path
 * explorer.  These types are DESU-specific and do not replace any
 * existing interfaces — they extend the compendium layer upward.
 *
 * Key design decisions
 * --------------------
 * • FusionNode is a recursive tree so the full fusion chain (of any
 *   depth) is represented as a single inspectable value rather than
 *   the current flat chain1 / chain2 / stepR triple.
 *
 * • PlayerState captures everything that determines whether a path
 *   is actually reachable for the player RIGHT NOW, including:
 *     – Current day (gates story unlocks)
 *     – AH tiers purchased (gates auction-only demons / AH skills)
 *     – Actual demon roster levels (gates level-up skills)
 *
 * • ReachabilityTier allows the UI to bucket results into
 *   AVAILABLE_NOW / SOON / LATER_GAME without hiding anything —
 *   the player can always see future options for planning.
 *
 * Skill value encoding (from ove-demon-data.json)
 * ------------------------------------------------
 *   0.1 – 0.3   innate skill (slot index)
 *   2 – 99      learned on level-up at that level
 *   > 100       AH-exclusive: encoded as <auctionContext>.<statDelta>
 *               These skills CANNOT be passed via fusion inheritance.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SKILL_TARGET = exports.DEFAULT_PLAYER_STATE = exports.isAHExclusiveSkill = exports.decodeAHSkillTier = exports.AH_TIER_REQUIREMENTS = void 0;
/** Requirements to unlock each AH tier (DS1 / DSO shared values). */
exports.AH_TIER_REQUIREMENTS = {
    basic: { minDay: 1, minRating: 0, unlockCost: 0 },
    gold: { minDay: 3, minRating: 25, unlockCost: 800 },
    platinum: { minDay: 5, minRating: 100, unlockCost: 3000 },
    occult: { minDay: 7, minRating: 650, unlockCost: 15000 },
};
/**
 * Decode the AH tier from the float skill-level encoding used in
 * ove-demon-data.json.  Values > 100 are AH-exclusive; the integer
 * part encodes the auction context.
 *
 * Heuristic mapping (derived from compendium + guide cross-reference):
 *   3300–3317  → 'gold'
 *   3318–3319  → 'platinum'
 *   3320+      → 'occult'
 *
 * Returns null for non-AH skill values (≤ 99).
 */
function decodeAHSkillTier(skillLevel) {
    if (skillLevel <= 99) {
        return null;
    }
    var context = Math.floor(skillLevel);
    if (context <= 3317) {
        return 'gold';
    }
    if (context <= 3319) {
        return 'platinum';
    }
    return 'occult';
}
exports.decodeAHSkillTier = decodeAHSkillTier;
/** Returns true when the skill value marks an AH-exclusive skill. */
function isAHExclusiveSkill(skillLevel) {
    return skillLevel > 99;
}
exports.isAHExclusiveSkill = isAHExclusiveSkill;
exports.DEFAULT_PLAYER_STATE = {
    currentDay: 1,
    currentRating: 0,
    ahTiersUnlocked: ['basic'],
    unlockedFusions: [],
    ownedDemons: [],
    maxLevel: 99,
};
/** Default search config — conservative depth, 20 results, cheapest first. */
exports.DEFAULT_SKILL_TARGET = {
    playerState: exports.DEFAULT_PLAYER_STATE,
    maxDepth: 3,
    maxResults: 20,
    rankStrategy: 'cheapest',
};
