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

// ---------------------------------------------------------------------------
// Auction House
// ---------------------------------------------------------------------------

/** The four purchasable AH tiers in Devil Survivor / Overclocked. */
export type AHTier = 'basic' | 'gold' | 'platinum' | 'occult';

/** Requirements to unlock each AH tier (DS1 / DSO shared values). */
export const AH_TIER_REQUIREMENTS: Record<AHTier, { minDay: number; minRating: number; unlockCost: number }> = {
  basic:    { minDay: 1, minRating: 0,   unlockCost: 0      },
  gold:     { minDay: 3, minRating: 25,  unlockCost: 800    },
  platinum: { minDay: 5, minRating: 100, unlockCost: 3000   },
  occult:   { minDay: 7, minRating: 650, unlockCost: 15000  },
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
export function decodeAHSkillTier(skillLevel: number): AHTier | null {
  if (skillLevel <= 99) { return null; }
  const context = Math.floor(skillLevel);
  if (context <= 3317) { return 'gold'; }
  if (context <= 3319) { return 'platinum'; }
  return 'occult';
}

/** Returns true when the skill value marks an AH-exclusive skill. */
export function isAHExclusiveSkill(skillLevel: number): boolean {
  return skillLevel > 99;
}

// ---------------------------------------------------------------------------
// Acquisition methods
// ---------------------------------------------------------------------------

/**
 * Describes HOW a demon or skill can be obtained.  Used to annotate
 * every node in the fusion tree so the UI can explain blockers.
 */
export type AcquisitionMethod =
  | { type: 'innate' }                                             // skill slot 0.1–0.3
  | { type: 'levelup';    requiredLevel: number }                  // skill value 2–99
  | { type: 'auction';    tier: AHTier; buyoutCost: number }       // AH-exclusive skill / demon
  | { type: 'fusion' }                                             // produced via normal fusion
  | { type: 'story_unlock'; condition: string };                   // demonUnlocks entry

// ---------------------------------------------------------------------------
// Reachability
// ---------------------------------------------------------------------------

/** A single factor preventing access to a demon or skill right now. */
export interface ReachabilityBlocker {
  /** Machine-readable blocker category. */
  type: 'ah_tier_locked' | 'story_locked' | 'level_too_low' | 'rating_too_low' | 'day_too_low';
  /** Short human-readable description, e.g. "Occult AH requires Day 7 + 650 Rating". */
  detail: string;
  /** What the player needs to do to remove this blocker. */
  unlockCondition: string;
}

/** Reachability verdict for a single demon in the tree. */
export interface DemonReachability {
  demonName: string;
  method: AcquisitionMethod;
  /** True when all blockers are resolved for the current PlayerState. */
  isReachableNow: boolean;
  blockers: ReachabilityBlocker[];
}

/** Reachability verdict for a single skill on a specific demon. */
export interface SkillReachability {
  skillName: string;
  onDemon: string;
  method: AcquisitionMethod;
  /**
   * AH-exclusive skills (skillLevel > 99) CANNOT be fusion-inherited.
   * They must be obtained by purchasing the specific demon from the AH
   * at the correct star-rank tier.  The search must never suggest these
   * as inheritable — only flag them as a direct-purchase requirement.
   */
  canBeInherited: boolean;
  isReachableNow: boolean;
  blockers: ReachabilityBlocker[];
}

/** High-level bucket used to sort the results list in the UI. */
export type ReachabilityTier =
  | 'available_now'   // all ingredients reachable with current PlayerState
  | 'soon'            // 1 blocker, close to removal (e.g. 1 more day, small rating gap)
  | 'later_game';     // multiple blockers or a late-game gate (occult AH, story route)

// ---------------------------------------------------------------------------
// Player state
// ---------------------------------------------------------------------------

/** A single demon in the player's current party / stock. */
export interface OwnedDemon {
  name: string;
  /** The demon's ACTUAL current level — not the compendium base level. */
  currentLevel: number;
  /** The 6 skill slots as currently configured on this demon. */
  skills: string[];
}

/**
 * Everything the search algorithm needs to know about the player's
 * current game state in order to evaluate path reachability.
 *
 * All fields except `ownedDemons` have sensible defaults so callers
 * can supply just the fields they care about.
 */
export interface PlayerState {
  currentDay: number;
  currentRating: number;
  ahTiersUnlocked: AHTier[];
  unlockedFusions: string[];
  ownedDemons: OwnedDemon[];
  maxLevel: number;
  maxMacca?: number;
}

export const DEFAULT_PLAYER_STATE: PlayerState = {
  currentDay: 1,
  currentRating: 0,
  ahTiersUnlocked: ['basic'],
  unlockedFusions: [],
  ownedDemons: [],
  maxLevel: 99,
};

// ---------------------------------------------------------------------------
// Fusion tree node
// ---------------------------------------------------------------------------

/**
 * A single node in the recursive fusion tree.
 *
 * Leaf nodes (base cases) have no `left`/`right` children:
 *   – `owned`:   demon is in the player's roster right now
 *   – `auction`: demon must be purchased from the AH
 *   – `unlock`:  demon is story-gated
 *
 * Interior nodes represent a fusion step:
 *   fuse(left.demon × right.demon) → this.demon
 *
 * The `skillsContributed` field records which target skills THIS
 * specific node carries upward in the chain (after inheritance
 * filtering).  A skill only appears once across the entire tree.
 */
export interface FusionNode {
  /** Name of the demon at this node. */
  demon: string;
  /**
   * Skills that this subtree contributes toward the final target.
   * Empty for interior nodes that exist only to satisfy level arithmetic.
   */
  skillsContributed: string[];
  /** Left parent in the fusion (undefined for leaf nodes). */
  left?: FusionNode;
  /** Right parent in the fusion (undefined for leaf nodes). */
  right?: FusionNode;
  /**
   * Combined inherit bitmask of this node's two parents.
   * Mirrors the `inherits` field on the Demon interface.
   * 0 for leaf nodes.
   */
  inheritMask: number;
  /** Total Macca cost of this entire subtree (recursive sum). */
  totalCost: number;
  /** Depth from this node down to the deepest leaf. */
  depth: number;
  /** True if this node is a leaf that is currently owned by the player. */
  isOwned?: boolean;
  /** Reachability verdict for the DEMON at this node. */
  reachability: DemonReachability;
  /**
   * Reachability of each skill contributed by this node.
   * Includes AH-exclusive flag so the UI can call out non-inheritable
   * skills explicitly.
   */
  skillReachability: SkillReachability[];
}

// ---------------------------------------------------------------------------
// Search config
// ---------------------------------------------------------------------------

/** Determines how the results list is sorted after search. */
export type RankStrategy =
  | 'cheapest'          // minimise totalCost of the full tree
  | 'fewest_steps'      // minimise total fusion count across both chains
  | 'most_owned_used';  // maximise number of leaf nodes that are already owned

/**
 * Input to the fusion tree search.  Supplied by the UI component
 * when the player clicks "Find Paths".
 */
export interface SkillTarget {
  /** The demon the player wants to end up with. */
  targetDemon: string;
  /**
   * The skills that MUST be present on the target demon.
   * Each skill must be inheritable (skillLevel ≤ 99 somewhere in the
   * compendium) or flagged as AH-only (the tool will explain the
   * purchase requirement instead of trying to route it via fusion).
   */
  requiredSkills: string[];
  /** Current player context — drives reachability evaluation. */
  playerState: PlayerState;
  /**
   * Maximum recursion depth for ingredient sub-chains.
   * Depth 1 = target demon fused from two directly-available demons.
   * Depth 3 is a good default; higher values can be slow.
   */
  maxDepth: number;
  /** Maximum number of ranked results to return. Default 20. */
  maxResults: number;
  /** How to order the results. Default 'cheapest'. */
  rankStrategy: RankStrategy;
}

/** Default search config — conservative depth, 20 results, cheapest first. */
export const DEFAULT_SKILL_TARGET: Omit<SkillTarget, 'targetDemon' | 'requiredSkills'> = {
  playerState: DEFAULT_PLAYER_STATE,
  maxDepth: 3,
  maxResults: 20,
  rankStrategy: 'cheapest',
};

// ---------------------------------------------------------------------------
// Search result
// ---------------------------------------------------------------------------

/**
 * A single ranked path returned by the fusion tree search.
 *
 * The `root` is the FusionNode for the target demon itself.
 * Walking the tree recursively gives the full step-by-step plan.
 */
export interface RankedFusionResult {
  /** Unique rank in the current result set (1-based). */
  rank: number;
  /** The root node — i.e. the target demon at the top of the tree. */
  root: FusionNode;
  /** Pre-computed reachability bucket for quick UI filtering. */
  reachabilityTier: ReachabilityTier;
  /** Total Macca needed across the entire tree (mirrors root.totalCost). */
  totalCost: number;
  /** Total number of fusion steps across both chains. */
  totalFusions: number;
  /** Number of leaf nodes already in the player's roster. */
  ownedLeafCount: number;
  /**
   * Any AH-exclusive skills in the required set — listed here for
   * quick access without walking the full tree.
   * These CANNOT be routed via fusion; they require AH purchase.
   */
  ahOnlySkills: SkillReachability[];
  /**
   * Blockers that prevent this path from being executed right now.
   * Empty array means the path is AVAILABLE_NOW.
   */
  blockers: ReachabilityBlocker[];
}
