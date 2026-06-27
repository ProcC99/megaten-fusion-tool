/**
 * compendium-helper.ts
 * -----------------------------------------------------------------
 * Utilities that extend the base Compendium interface with DESU-
 * specific lookups required by the fusion tree search.
 *
 * The base Compendium has no inverted skill index — allSkills gives
 * you Skill objects, but each Skill.learnedBy list is iterated
 * linearly for every lookup.  With up to 200+ demons and 400+ skills
 * that becomes slow inside the tree search inner loop.
 *
 * DesuCompendiumHelper pre-builds a Map<skillName, DemonSkillEntry[]>
 * at construction time so every getDemonsWithSkill() call is O(1).
 */

import { Compendium, Demon, Skill } from '../../compendium/models';
import {
  AHTier,
  AH_TIER_REQUIREMENTS,
  AcquisitionMethod,
  DemonReachability,
  PlayerState,
  ReachabilityBlocker,
  SkillReachability,
  decodeAHSkillTier,
  isAHExclusiveSkill,
} from './fusion-tree-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** An entry in the inverted skill index. */
export interface DemonSkillEntry {
  demonName: string;
  demon: Demon;
  /** Raw skill-level value from the data file. */
  skillLevel: number;
  /**
   * True when this skill can be passed to a fused demon via normal
   * inheritance (i.e. skillLevel ≤ 99 and not AH-exclusive).
   */
  canInherit: boolean;
  /**
   * True when the skill is AH-exclusive on this demon (skillLevel > 99).
   * AH-exclusive skills CANNOT be inherited — the demon must be
   * purchased directly from the Auction House at the correct tier.
   */
  isAHExclusive: boolean;
  /**
   * If the skill is AH-exclusive, the minimum AH tier required to
   * see this demon in the auction listings.
   */
  ahTier: AHTier | null;
  /**
   * For level-up skills (2 ≤ skillLevel ≤ 99): the level the demon
   * must reach before this skill appears in its skill list.
   * 0 for innate skills.
   */
  requiredLevel: number;
}

// ---------------------------------------------------------------------------
// Helper class
// ---------------------------------------------------------------------------

export class DesuCompendiumHelper {
  private readonly comp: Compendium;
  /** Inverted index: skill name → every demon that knows that skill. */
  private readonly skillIndex: Map<string, DemonSkillEntry[]>;

  constructor(comp: Compendium) {
    this.comp = comp;
    this.skillIndex = this.buildSkillIndex();
  }

  // -------------------------------------------------------------------------
  // Skill index
  // -------------------------------------------------------------------------

  /**
   * Build an inverted index from skill name to the list of demons that
   * have that skill, along with acquisition metadata.
   *
   * Called once at construction time; all subsequent lookups are O(1).
   */
  private buildSkillIndex(): Map<string, DemonSkillEntry[]> {
    const index = new Map<string, DemonSkillEntry[]>();

    for (const demon of this.comp.allDemons) {
      for (const [skillName, skillLevel] of Object.entries(demon.skills)) {
        if (!index.has(skillName)) { index.set(skillName, []); }

        const ahExclusive = isAHExclusiveSkill(skillLevel);
        const ahTier = ahExclusive ? decodeAHSkillTier(skillLevel) : null;

        index.get(skillName)!.push({
          demonName: demon.name,
          demon,
          skillLevel,
          canInherit: !ahExclusive,
          isAHExclusive: ahExclusive,
          ahTier,
          // Innate skills (0.x) have requiredLevel 0.
          // Level-up skills (2–99) require the demon to reach that level.
          // AH skills get a sentinel 0 since they aren’t level-gated.
          requiredLevel: ahExclusive ? 0 : skillLevel > 0.9 ? Math.round(skillLevel) : 0,
        });
      }
    }

    return index;
  }

  // -------------------------------------------------------------------------
  // Public lookups
  // -------------------------------------------------------------------------

  /**
   * Return ALL demons that know `skillName`, regardless of whether the
   * skill is inheritable or AH-exclusive.
   *
   * O(1) — map lookup only.
   */
  getDemonsWithSkill(skillName: string): DemonSkillEntry[] {
    return this.skillIndex.get(skillName) ?? [];
  }

  /**
   * Return only demons where `skillName` is inheritable via fusion
   * (i.e. the skill is NOT AH-exclusive on that demon).
   *
   * Use this when searching for skill-carrier ingredients for a fusion chain.
   */
  getInheritableCarriers(skillName: string): DemonSkillEntry[] {
    return this.getDemonsWithSkill(skillName).filter(e => e.canInherit);
  }

  /**
   * Return only demons where `skillName` is AH-exclusive.
   * These cannot contribute the skill via fusion — they must be
   * purchased from the correct AH tier.
   */
  getAHOnlyCarriers(skillName: string): DemonSkillEntry[] {
    return this.getDemonsWithSkill(skillName).filter(e => e.isAHExclusive);
  }

  /**
   * Return true when `demonName` can pass `skillName` to a fused child
   * via normal inheritance (considering the demon’s inherit bitmask and
   * whether the skill is AH-exclusive).
   *
   * @param inheritElems  Ordered list of inheritable element names from
   *                      RecipeGeneratorConfig.
   */
  canDemonInheritSkill(
    demonName: string,
    skillName: string,
    inheritElems: string[],
  ): boolean {
    const demon = this.comp.getDemon(demonName);
    if (!demon) { return false; }

    const skillLevel = demon.skills[skillName];
    if (skillLevel === undefined) { return false; }
    if (isAHExclusiveSkill(skillLevel)) { return false; }

    const skill = this.comp.getSkill(skillName);
    if (!skill?.inherit) { return true; } // passive / no element — always inheritable

    const idx = inheritElems.indexOf(skill.inherit);
    if (idx === -1) { return false; }
    const bit = 1 << (inheritElems.length - 1 - idx);
    return (demon.inherits & bit) !== 0;
  }

  /**
   * Full reachability check for a demon given the current PlayerState.
   *
   * Returns a DemonReachability with:
   *   – isReachableNow = true when all blockers are resolved
   *   – blockers[] with human-readable descriptions
   */
  evaluatePlayerAccess(
    demonName: string,
    playerState: PlayerState,
  ): DemonReachability {
    const demon = this.comp.getDemon(demonName);
    const blockers: ReachabilityBlocker[] = [];
    let method: AcquisitionMethod = { type: 'fusion' };

    if (!demon) {
      return {
        demonName,
        method,
        isReachableNow: false,
        blockers: [{ type: 'story_locked', detail: `${demonName} not found in compendium`, unlockCondition: '' }],
      };
    }

    // --- Story-unlock gate ---
    if (demon.fusion === 'story' || demon.prereq) {
      const condition = demon.prereq || `Unlock ${demonName}`;
      method = { type: 'story_unlock', condition };
      if (!playerState.unlockedFusions.includes(demonName)) {
        blockers.push({
          type: 'story_locked',
          detail: `${demonName} requires: “${condition}”`,
          unlockCondition: condition,
        });
      }
    }

    // --- AH tier gate ---
    // Detect by scanning the demon’s AH-exclusive skill entries.
    const ahSkillEntries = Object.entries(demon.skills)
      .filter(([, lvl]) => isAHExclusiveSkill(lvl));

    if (ahSkillEntries.length > 0 || demon.fusion === 'auction') {
      // Use the highest AH tier required.
      const tierOrder: AHTier[] = ['basic', 'gold', 'platinum', 'occult'];
      let highestTier: AHTier = 'basic';

      for (const [, lvl] of ahSkillEntries) {
        const t = decodeAHSkillTier(lvl);
        if (t && tierOrder.indexOf(t) > tierOrder.indexOf(highestTier)) {
          highestTier = t;
        }
      }

      method = { type: 'auction', tier: highestTier, buyoutCost: demon.price };

      if (!playerState.ahTiersUnlocked.includes(highestTier)) {
        const req = AH_TIER_REQUIREMENTS[highestTier];
        const parts: string[] = [];
        if (playerState.currentDay < req.minDay) {
          parts.push(`Day ${req.minDay} (currently Day ${playerState.currentDay})`);
        }
        if (playerState.currentRating < req.minRating) {
          parts.push(`Rating ${req.minRating} (currently ${playerState.currentRating})`);
        }
        const label = highestTier.charAt(0).toUpperCase() + highestTier.slice(1);
        blockers.push({
          type: 'ah_tier_locked',
          detail: `${label} AH requires ${parts.join(' + ')} + ${req.unlockCost}￥ to unlock`,
          unlockCondition: `Reach ${parts.join(' and ')} and pay ${req.unlockCost}￥ at the AH screen`,
        });
      }
    }

    return { demonName, method, isReachableNow: blockers.length === 0, blockers };
  }

  /**
   * Evaluate whether a specific skill on a specific demon is reachable
   * given the player’s roster and AH tier.
   *
   * Combines:
   *   1. AH-exclusive check (skillLevel > 99 ⇒ canBeInherited = false)
   *   2. Level-up check (owned demon’s currentLevel vs requiredLevel)
   *   3. AH tier check (is the required tier unlocked?)
   */
  evaluateSkillAccess(
    skillName: string,
    demonName: string,
    playerState: PlayerState,
  ): SkillReachability {
    const demon = this.comp.getDemon(demonName);
    if (!demon) {
      return {
        skillName, onDemon: demonName,
        method: { type: 'innate' },
        canBeInherited: false,
        isReachableNow: false,
        blockers: [{ type: 'story_locked', detail: `Demon ${demonName} not found`, unlockCondition: '' }],
      };
    }

    const skillLevel = demon.skills[skillName];
    const blockers: ReachabilityBlocker[] = [];
    let method: AcquisitionMethod;
    let canBeInherited = true;

    if (skillLevel === undefined || skillLevel === null) {
      return {
        skillName, onDemon: demonName,
        method: { type: 'innate' },
        canBeInherited: false,
        isReachableNow: false,
        blockers: [{ type: 'story_locked', detail: `${skillName} not on ${demonName}`, unlockCondition: '' }],
      };
    }

    if (isAHExclusiveSkill(skillLevel)) {
      canBeInherited = false;
      const tier = decodeAHSkillTier(skillLevel) ?? 'occult';
      method = { type: 'auction', tier, buyoutCost: demon.price };

      if (!playerState.ahTiersUnlocked.includes(tier)) {
        const req = AH_TIER_REQUIREMENTS[tier];
        const label = tier.charAt(0).toUpperCase() + tier.slice(1);
        const parts: string[] = [];
        if (playerState.currentDay < req.minDay) {
          parts.push(`Day ${req.minDay}`);
        }
        if (playerState.currentRating < req.minRating) {
          parts.push(`Rating ${req.minRating}`);
        }
        blockers.push({
          type: 'ah_tier_locked',
          detail: `${skillName} on ${demonName} requires ${label} AH (${parts.join(', ')})`,
          unlockCondition: `Unlock ${label} AH and purchase ${demonName} at the correct star rank`,
        });
      }
    } else if (skillLevel <= 0.9) {
      // Innate slot (0.1 / 0.2 / 0.3)
      method = { type: 'innate' };
    } else {
      // Level-up skill
      const requiredLevel = Math.round(skillLevel);
      method = { type: 'levelup', requiredLevel };

      const owned = playerState.ownedDemons.find(d => d.name === demonName);
      if (owned && owned.currentLevel < requiredLevel) {
        blockers.push({
          type: 'level_too_low',
          detail: `${demonName} must reach level ${requiredLevel} to learn ${skillName} (at ${owned.currentLevel} now)`,
          unlockCondition: `Level ${demonName} to ${requiredLevel}`,
        });
      }
    }

    return { skillName, onDemon: demonName, method, canBeInherited, isReachableNow: blockers.length === 0, blockers };
  }

  // -------------------------------------------------------------------------
  // Convenience getters
  // -------------------------------------------------------------------------

  /** All skill names that have at least one inheritable (non-AH) carrier demon. */
  get inheritableSkillNames(): string[] {
    const names: string[] = [];
    for (const [name, entries] of this.skillIndex) {
      if (entries.some(e => e.canInherit)) { names.push(name); }
    }
    return names;
  }

  /** All skill names that are exclusively obtainable via the Auction House. */
  get ahOnlySkillNames(): string[] {
    const names: string[] = [];
    for (const [name, entries] of this.skillIndex) {
      if (entries.length > 0 && entries.every(e => e.isAHExclusive)) { names.push(name); }
    }
    return names;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Construct a DesuCompendiumHelper from an existing Compendium instance.
 * Call this once when the compendium Observable emits and cache the result.
 */
export function buildDesuCompendiumHelper(comp: Compendium): DesuCompendiumHelper {
  return new DesuCompendiumHelper(comp);
}
