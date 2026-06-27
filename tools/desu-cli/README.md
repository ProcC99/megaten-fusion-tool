# Devil Survivor Fusion Path Finder — CLI

A Node.js command-line tool for finding **skill-targeted fusion paths** in
*Shin Megami Tensei: Devil Survivor* and *Devil Survivor Overclocked*.

Unlike the Angular UI's recipe generator (which accepts pre-chosen ingredients
and returns one fixed path), this tool explores **all possible fission pairs**
for your target demon and filters them against your actual in-game state:
your current player level and which day you're on.

---

## Requirements

- Node.js ≥ 18 (no `npm install` needed — pure Node, no dependencies)
- Run from the **repo root**

---

## Usage

```sh
node tools/desu-cli/runner.mjs [options]
```

| Option | Description | Default |
|---|---|---|
| `--target <name>` | Demon to fuse (**required**) | — |
| `--skills <s1,s2,...>` | Skills to inherit, comma-separated (**required**) | — |
| `--level <n>` | Your current player level | 99 (unrestricted) |
| `--day <n>` | Current in-game day (controls AH access) | 1 |
| `--game ds1\|dso` | Which game's data to use | ds1 |
| `--limit <n>` | Max paths to display | 15 |
| `--help` | Show full help text | — |

---

## Examples

### No restrictions — all paths

```sh
node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force
```

### Early game: Day 1, Level 14

```sh
node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --level 14 --day 1
```

**Day 1 means the Auction House is not yet open**, so all AH-only demons
(Kikimora, Toubyou, Lilim, etc.) are marked BLOCKED with an exact reason.

### Day 2 opens the AH

```sh
node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --level 14 --day 2
```

Path 1 (`Sarasvati × Kikimora`, est. 95¥) becomes ✓ VIABLE — Sarasvati
carries Anti-Force natively and Kikimora is now buyable from the AH.

### Multiple skills

```sh
node tools/desu-cli/runner.mjs --target Orobas --skills "Elec Amp,Null Curse" --level 35
```

### Devil Survivor Overclocked data

```sh
node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --game dso --day 2
```

### Quick positional form (no flags)

```sh
node tools/desu-cli/runner.mjs Gagyson Anti-Force
```

---

## Output explained

```
══════════════════════════════════════════════════════════════
  TARGET  : Gagyson
  SKILLS  : Anti-Force
  GAME    : DS1
  PLAYER  : Level 14  |  Day 2  [AH OPEN]
══════════════════════════════════════════════════════════════

  SKILL CARRIERS
  "Anti-Force"  (element: pas)
    [neg/fuse] Basilisk  — innate
    [neg/fuse] Sarasvati  — innate

  FISSION PAIRS for Gagyson  (8 total)
    Sarasvati  ×  Kikimora
    Kijimunaa  ×  Kikimora
    ...

  PATHS  — 1 viable, 7 blocked

  Path 1  [✓ VIABLE]  Sarasvati × Kikimora  (est. 95¥)
    Sarasvati [neg] already knows "Anti-Force" ✓
    Fuse Sarasvati [negotiate] × Kikimora [AH] → Gagyson

  Path 2  [✗ BLOCKED]  Kijimunaa × Kikimora  (est. 95¥)
    Blockers:
      → Carrier of "Anti-Force" (Basilisk): lv25 exceeds your level (14)
```

### Tags

| Tag | Meaning |
|---|---|
| `✓ VIABLE` | All ingredients reachable given your level and day |
| `✗ BLOCKED` | One or more ingredients not yet accessible |
| `[neg]` | Demon obtainable via negotiation / battle encounter |
| `[AH]` | Demon purchasable from the Auction House |
| `[starter]` | Pixie — always available as your initial partner |
| `[AH-only]` | Demon that has no negotiate route |

---

## Why paths are blocked: common cases

| Blocker message | What it means |
|---|---|
| `AH-only — Auction House not open until Day 2` | Demon has no negotiate encounter; use `--day 2` or later |
| `lv15 exceeds your level (14)` | You can't control demons above your level; level up first |
| `story-locked: <condition>` | Demon unlocks after a specific story event |

---

## How it differs from the Angular UI

The Angular recipe generator:
1. Accepts **two manually chosen ingredient chains**
2. Confirms or fails that single combination
3. Has no concept of the player's current level, day, or AH access

This CLI:
1. **Enumerates all valid fission pairs** for the target demon automatically
2. Finds which demons **carry each wanted skill** (O(1) index lookup)
3. Applies your **player state** (level cap + AH day gate) to every ingredient
4. Returns every path ranked by cost, labelled VIABLE or BLOCKED with exact reasons
5. Works directly on the raw JSON data — no build step required

---

## Implementation notes

### The inherits=0 fix

DESU demons have no `affinities` field in the JSON. The Angular compendium
maps this to `inherits = 0`, which causes the skill inheritance bitmask check
`(canInheritI & (d1.inherits | d2.inherits)) === canInheritI` to always fail
(for any non-zero skill element), returning zero paths.

DESU mechanics don't have per-demon inheritance gates — only the 6-slot limit
applies. This CLI treats `inherits = 0` as `0x3FFF` (all 14 bits set), matching
actual game behaviour.

### AH availability model

`price > 0 && auctions != null` → AH-only demon (no negotiate route).  
`price == 0` → negotiate/battle only.  
AH is modelled as closed on Day 1 and open from Day 2 onward.  
`Pixie` is hard-coded as always available (starter partner).
