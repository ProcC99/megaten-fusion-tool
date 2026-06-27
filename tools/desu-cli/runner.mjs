#!/usr/bin/env node
/**
 * tools/desu-cli/runner.mjs
 * ─────────────────────────────────────────────────────────────────
 * Devil Survivor / Overclocked — skill-targeted fusion path finder.
 *
 * Runs directly with Node (no build, no Angular):
 *   node tools/desu-cli/runner.mjs [options]
 *
 * USAGE
 *   node tools/desu-cli/runner.mjs --target <demon> --skills <s1,s2,...> [flags]
 *
 * OPTIONS
 *   --target  <name>       Demon to produce  (required)
 *   --skills  <s1,s2,...>  Comma-separated skills to inherit  (required)
 *   --level   <n>          Your current player level  (default: 99)
 *   --day     <n>          Current in-game day  (default: 1, AH opens day 2)
 *   --game    ds1|dso      Which game data to use  (default: ds1)
 *   --limit   <n>          Max paths to show  (default: 15)
 *   --help                 Show this help text
 *
 * EXAMPLES
 *   # All paths, no restrictions
 *   node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force
 *
 *   # Day 1, player level 14
 *   node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --level 14 --day 1
 *
 *   # Multiple skills
 *   node tools/desu-cli/runner.mjs --target Orobas --skills "Elec Amp,Null Curse" --level 35
 *
 *   # DSO game data
 *   node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --game dso --day 2
 *
 * ─────────────────────────────────────────────────────────────────
 * HOW IT WORKS
 *
 *   1. Loads raw JSON from src/app/desu1/data/ (no compilation needed)
 *   2. Runs the same fission logic as smt-nonelem-fissions.ts
 *   3. Finds which ingredients can carry each wanted skill
 *   4. Applies your player-state filter (level cap, AH availability, story locks)
 *   5. Prints paths ranked cheapest → most expensive
 *      with a VIABLE / BLOCKED verdict and exact blocker reason
 *
 * KEY FIX VS THE ANGULAR UI
 *   DESU demons have no 'affinities' field → demon.inherits = 0.
 *   The upstream recipe-generator checks:
 *     (canInheritI & (d1.inherits | d2.inherits)) === canInheritI
 *   For any skill with an element (e.g. Anti-Force → 'pas') this is
 *   always (N & 0) === N → false, so the UI returns nothing.
 *   Fix: treat inherits=0 as 0x3FFF (all 14 bits set = inherit everything),
 *   which matches actual DESU mechanics where there is no per-demon
 *   inheritance gate — only the 6-slot limit matters.
 * ─────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Paths ────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../../src/app/desu1/data');
const load = f => JSON.parse(readFileSync(join(DATA, f), 'utf8'));

// ── CLI arg parsing ──────────────────────────────────────────────
function parseArgs(argv) {
  const args = argv.slice(2);
  const out = { target: null, skills: [], level: 99, day: 1, game: 'ds1', limit: 15, help: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help': case '-h': out.help = true; break;
      case '--target':  out.target = args[++i]; break;
      case '--skills':  out.skills = args[++i].split(',').map(s => s.trim()); break;
      case '--level':   out.level  = parseInt(args[++i], 10); break;
      case '--day':     out.day    = parseInt(args[++i], 10); break;
      case '--game':    out.game   = args[++i]; break;
      case '--limit':   out.limit  = parseInt(args[++i], 10); break;
      default:
        // positional fallback: first = target, second = skills (for quick use)
        if (!out.target) out.target = args[i];
        else if (!out.skills.length) out.skills = args[i].split(',').map(s => s.trim());
    }
  }
  return out;
}

const HELP = `
Devil Survivor Fusion Path Finder
══════════════════════════════════════════════════════════════

USAGE
  node tools/desu-cli/runner.mjs --target <demon> --skills <s1,s2> [options]

OPTIONS
  --target  <name>       Demon to produce               (required)
  --skills  <s1,s2,...>  Skills to inherit, comma-sep   (required)
  --level   <n>          Your player level               (default: 99, no cap)
  --day     <n>          In-game day                     (default: 1)
                           Day 1  → no Auction House
                           Day 2+ → Basic AH available
  --game    ds1|dso      Game version                    (default: ds1)
  --limit   <n>          Max paths shown                 (default: 15)
  --help                 Show this text

EXAMPLES
  # No restrictions — show all fusion paths
  node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force

  # Day 1, player level 14 (realistic early-game check)
  node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --level 14 --day 1

  # Multiple skills
  node tools/desu-cli/runner.mjs --target Orobas --skills "Elec Amp,Null Curse" --level 35

  # Devil Survivor Overclocked data
  node tools/desu-cli/runner.mjs --target Gagyson --skills Anti-Force --game dso

  # Quick positional form (no flags)
  node tools/desu-cli/runner.mjs Gagyson Anti-Force

PLAYER STATE FLAGS EXPLAINED
  --level   Controls the fusion result cap. In DESU you cannot control a
            demon whose level exceeds yours, so no fission ingredient whose
            level is above --level will be suggested.

  --day     Controls Auction House availability:
              Day 1  → AH is not yet open; only negotiate/battle demons
                       are accessible. AH-only demons are marked BLOCKED.
              Day 2+ → Basic AH is open; AH demons become accessible.

  Demons with a story unlock condition (prereq field) are always marked
  BLOCKED until the condition is met (tracked separately, not by day).

OUTPUT LEGEND
  ✓ VIABLE   All ingredients reachable given your level/day
  ✗ BLOCKED  One or more ingredients not yet accessible (reason shown)
  [native]   Target demon already knows that skill — no carrier needed
  [AH-only]  Demon only obtainable via Auction House
  [neg]      Demon obtained via negotiation/battle (no AH needed)
`;

// ── Load data ────────────────────────────────────────────────────
const VAN_DEMONS  = load('van-demon-data.json');
const OVE_DEMONS  = load('ove-demon-data.json');
const VAN_SKILLS  = load('van-skill-data.json');
const OVE_SKILLS  = load('ove-skill-data.json');
const COMP_CONFIG = load('comp-config.json');
const FUSION_CHART = load('fusion-chart.json');
const ELEM_CHART  = load('element-chart.json');
const SPECIAL     = load('special-recipes.json');
const VAN_UNLOCKS = load('van-demon-unlocks.json');
const OVE_UNLOCKS = load('ove-demon-unlocks.json');

// ── Build collections ────────────────────────────────────────────

/** skill name → element string */
const SKILL_ELEM = {};
for (const [, v] of Object.entries({ ...VAN_SKILLS, ...OVE_SKILLS })) {
  SKILL_ELEM[v.a[0]] = v.a[1] ?? 'non';
}

/** inheritElems order — must match compendium.module.ts */
const INHERIT_ELEMS = COMP_CONFIG.resistElems.concat(COMP_CONFIG.skillElems);

/** fusion chart helpers */
const FC_RACES = FUSION_CHART.races;
const FC_TABLE = FUSION_CHART.table;

/** fission map: result race → [[raceA, raceB], ...] */
const RACE_FISSIONS = {};
for (let i = 0; i < FC_RACES.length; i++) {
  for (let j = 0; j <= i; j++) {
    const result = FC_TABLE[i][j];
    if (!result) continue;
    if (!RACE_FISSIONS[result]) RACE_FISSIONS[result] = [];
    RACE_FISSIONS[result].push([FC_RACES[j], FC_RACES[i]]);
  }
}

/** special recipe map: result → [ingred, ...] */
const SPECIAL_MAP = Object.fromEntries(Object.entries(SPECIAL));

/** prereq/story-lock map */
function buildPrereqs(unlockSets) {
  const m = {};
  for (const entry of unlockSets) {
    for (const [names, cond] of Object.entries(entry.conditions)) {
      for (const name of names.split(',')) m[name.trim()] = cond;
    }
  }
  return m;
}
const VAN_PREREQS = buildPrereqs(VAN_UNLOCKS);
const OVE_PREREQS = buildPrereqs(OVE_UNLOCKS);

const LVL_MOD = 0.5;
const ALL_INHERIT = 0x3FFF; // 14-bit: all inherit types — used when demon has no affinities

// ── Compendium helpers ───────────────────────────────────────────

function getDemonMap(game) {
  return game === 'dso' ? { ...VAN_DEMONS, ...OVE_DEMONS } : { ...VAN_DEMONS };
}
function getPrereqMap(game) {
  return game === 'dso' ? { ...VAN_PREREQS, ...OVE_PREREQS } : { ...VAN_PREREQS };
}

function demonsByRace(demonMap) {
  const by = {};
  for (const [name, d] of Object.entries(demonMap)) {
    if (!by[d.race]) by[d.race] = [];
    by[d.race].push({ name, lvl: d.lvl });
  }
  for (const r of Object.keys(by)) by[r].sort((a, b) => a.lvl - b.lvl);
  return by;
}

function lvlsForRace(byRace, race) { return (byRace[race] ?? []).map(d => d.lvl); }
function nameAtLvl(byRace, race, lvl) { return (byRace[race] ?? []).find(d => d.lvl === lvl)?.name; }

// ── Availability check ───────────────────────────────────────────

/**
 * Returns { ok: bool, reason: string, method: string }
 * method: 'starter'|'negotiate'|'ah'|'fuse'
 */
function checkAvailable(name, demonMap, prereqMap, playerLevel, day) {
  if (name === 'Pixie') return { ok: true, reason: 'starter demon', method: 'starter' };
  const d = demonMap[name];
  if (!d) return { ok: false, reason: 'not in compendium', method: '' };
  if (prereqMap[name]) return { ok: false, reason: `story-locked: ${prereqMap[name]}`, method: '' };
  if (d.lvl > playerLevel) return { ok: false, reason: `lv${d.lvl} exceeds your level (${playerLevel})`, method: '' };
  const hasAuction = Boolean(d.auctions);
  const canNeg = !d.price || d.price === 0;
  if (canNeg) return { ok: true, reason: 'negotiate/battle encounter', method: 'negotiate' };
  if (hasAuction && day >= 2) return { ok: true, reason: `Auction House (opens day 2)`, method: 'ah' };
  if (hasAuction && day < 2) return { ok: false, reason: `AH-only — Auction House not open until Day 2 (currently Day ${day})`, method: 'ah' };
  return { ok: false, reason: 'unknown — no auction and no negotiate data', method: '' };
}

// ── Skill helpers ─────────────────────────────────────────────────

function isAHExclusive(lvl) { return lvl > 99; }

function canInheritCode(elems) {
  const bits = INHERIT_ELEMS.map(e => elems.includes(e) ? '1' : '0').join('');
  return parseInt(bits, 2) || 0;
}

function demonInherits(d) {
  const raw = d.affinities
    ? parseInt(d.affinities.map(a => a > -10 ? '1' : '0').join(''), 2)
    : 0;
  return raw === 0 ? ALL_INHERIT : raw;
}

// ── Fission engine ────────────────────────────────────────────────

function getFissions(targetName, demonMap, byRace) {
  const td = demonMap[targetName];
  if (!td) return [];
  if (SPECIAL_MAP[targetName]) {
    const s = SPECIAL_MAP[targetName];
    return s.length === 2 ? [{ name1: s[0], name2: s[1] }] : [];
  }
  const pairs = [];
  const resultLvls = lvlsForRace(byRace, td.race);
  const tidx = resultLvls.indexOf(td.lvl);
  if (tidx === -1) return [];
  const minRL = tidx > 0 ? 2 * (resultLvls[tidx - 1] - LVL_MOD) : 0;
  const maxRL = tidx < resultLvls.length - 1 ? 2 * (td.lvl - LVL_MOD) : 200;
  for (const [raceA, raceB] of (RACE_FISSIONS[td.race] ?? [])) {
    for (const lvlA of lvlsForRace(byRace, raceA)) {
      for (const lvlB of lvlsForRace(byRace, raceB)) {
        if (minRL < lvlA + lvlB && lvlA + lvlB <= maxRL && (raceA !== raceB || lvlA < lvlB)) {
          const n1 = nameAtLvl(byRace, raceA, lvlA);
          const n2 = nameAtLvl(byRace, raceB, lvlB);
          if (n1 && n2) pairs.push({ name1: n1, name2: n2 });
        }
      }
    }
  }
  const EC_RACES = ELEM_CHART.races;
  const EC_ELEMS = ELEM_CHART.elems;
  const EC_TABLE = ELEM_CHART.table;
  const eRaceIdx = EC_RACES.indexOf(td.race);
  if (eRaceIdx >= 0) {
    for (let eIdx = 0; eIdx < EC_ELEMS.length; eIdx++) {
      const offset = EC_TABLE[eRaceIdx]?.[eIdx];
      if (!offset || offset <= 0) continue;
      for (const ingLvl of lvlsForRace(byRace, td.race)) {
        const rl = lvlsForRace(byRace, td.race);
        const iIdx = rl.indexOf(ingLvl);
        if (iIdx + offset < rl.length && rl[iIdx + offset] === td.lvl) {
          const n1 = nameAtLvl(byRace, td.race, ingLvl);
          if (n1) pairs.push({ name1: n1, name2: EC_ELEMS[eIdx] });
        }
      }
    }
  }
  return pairs;
}

// ── Main path finder ─────────────────────────────────────────────

function findPaths(target, wantedSkills, demonMap, byRace, prereqMap, playerLevel, day) {
  const td = demonMap[target];
  if (!td) return { error: `Demon "${target}" not found in compendium.` };

  const nativeSkills = new Set(Object.keys(td.skills ?? {}));
  const needCarry = wantedSkills.filter(s => !nativeSkills.has(s) || isAHExclusive(td.skills[s]));
  const alreadyHas = wantedSkills.filter(s => nativeSkills.has(s) && !isAHExclusive(td.skills[s]));

  const carrierMap = {};
  for (const skill of needCarry) {
    carrierMap[skill] = [];
    for (const [dname, d] of Object.entries(demonMap)) {
      const lvl = d.skills?.[skill];
      if (lvl === undefined) continue;
      carrierMap[skill].push({
        demon: dname,
        isAH: isAHExclusive(lvl),
        method: isAHExclusive(lvl) ? 'ah-exclusive' : lvl <= 0.9 ? 'innate' : `level-up(${Math.round(lvl)})`,
      });
    }
  }

  const fissions = getFissions(target, demonMap, byRace);
  const results = [];

  for (const { name1, name2 } of fissions) {
    const d1 = demonMap[name1], d2 = demonMap[name2];
    if (!d1 || !d2) continue;
    const inh1 = demonInherits(d1), inh2 = demonInherits(d2);

    const coverage = {};
    for (const skill of needCarry) {
      const bit = canInheritCode([SKILL_ELEM[skill] ?? 'non']);
      const n1Has = d1.skills?.[skill] !== undefined && !isAHExclusive(d1.skills[skill]);
      const n2Has = d2.skills?.[skill] !== undefined && !isAHExclusive(d2.skills[skill]);

      if (n1Has && (inh1 & bit) === bit) {
        coverage[skill] = { carrier: name1, side: 'left', method: 'native on ingredient' };
      } else if (n2Has && (inh2 & bit) === bit) {
        coverage[skill] = { carrier: name2, side: 'right', method: 'native on ingredient' };
      } else {
        const viable = (carrierMap[skill] ?? []).filter(c => !c.isAH);
        let assigned = false;
        for (const c of viable) {
          if (c.demon === name1 || c.demon === name2) continue;
          if ((inh1 & bit) === bit) {
            coverage[skill] = { carrier: c.demon, side: 'left', through: name1, method: c.method };
            assigned = true; break;
          } else if ((inh2 & bit) === bit) {
            coverage[skill] = { carrier: c.demon, side: 'right', through: name2, method: c.method };
            assigned = true; break;
          }
        }
        if (!assigned) {
          const ahC = (carrierMap[skill] ?? []).filter(c => c.isAH);
          if (ahC.length) {
            coverage[skill] = { carrier: ahC[0].demon, side: 'left', method: 'ah-exclusive', blocked: true };
          }
        }
      }
    }

    const uncovered = needCarry.filter(s => !coverage[s]);
    if (uncovered.length > 0) continue;

    const av1 = checkAvailable(name1, demonMap, prereqMap, playerLevel, day);
    const av2 = checkAvailable(name2, demonMap, prereqMap, playerLevel, day);

    const carrierChecks = [];
    for (const [skill, cov] of Object.entries(coverage)) {
      if (cov.carrier === name1 || cov.carrier === name2) continue;
      const av = checkAvailable(cov.carrier, demonMap, prereqMap, playerLevel, day);
      if (!av.ok) carrierChecks.push({ skill, carrier: cov.carrier, reason: av.reason });
    }

    const blockers = [];
    if (!av1.ok) blockers.push(`${name1}: ${av1.reason}`);
    if (!av2.ok) blockers.push(`${name2}: ${av2.reason}`);
    for (const cc of carrierChecks) blockers.push(`Carrier of "${cc.skill}" (${cc.carrier}): ${cc.reason}`);

    const viable = blockers.length === 0;
    const cost = (d1.price ?? 0) + (d2.price ?? 0);
    const steps = [];

    for (const [skill, cov] of Object.entries(coverage)) {
      if (cov.carrier === name1 || cov.carrier === name2) {
        const m = cov.method === 'native on ingredient'
          ? (av1.method === 'ah' || av2.method === 'ah' ? 'AH' : 'neg')
          : cov.method;
        steps.push(`  ${cov.carrier} [${m}] already knows "${skill}" \u2713`);
      } else {
        const av = checkAvailable(cov.carrier, demonMap, prereqMap, playerLevel, day);
        const tag = av.ok ? (av.method === 'ah' ? 'AH' : 'neg') : '\u2717';
        steps.push(`  [${tag}] ${cov.carrier} carries "${skill}" (${cov.method}) \u2192 fuse into ${cov.through ?? cov.side + ' chain'}`);
      }
    }
    steps.push(`  Fuse ${name1} [${av1.method === 'ah' ? 'AH' : av1.method}] \u00d7 ${name2} [${av2.method === 'ah' ? 'AH' : av2.method}] \u2192 ${target}`);

    results.push({ name1, name2, cost, viable, blockers, steps, coverage, av1, av2 });
  }

  results.sort((a, b) => (a.viable === b.viable ? 0 : a.viable ? -1 : 1) || a.cost - b.cost);
  return { fissions, alreadyHas, needCarry, carrierMap, results };
}

// ── Render ────────────────────────────────────────────────────────

function render(target, skills, out, playerLevel, day, game, limit) {
  const W = 62;
  const line = '\u2550'.repeat(W);
  const thin = '\u2500'.repeat(W);

  console.log('\n' + line);
  console.log(`  TARGET  : ${target}`);
  console.log(`  SKILLS  : ${skills.join(', ')}`);
  console.log(`  GAME    : ${game.toUpperCase()}`);
  console.log(`  PLAYER  : Level ${playerLevel === 99 ? '99 (unrestricted)' : playerLevel}  |  Day ${day}${day < 2 ? '  [AH CLOSED]' : '  [AH OPEN]'}`);
  console.log(line);

  if (out.error) { console.log('\n  ERROR: ' + out.error + '\n'); return; }

  console.log('\n  SKILL CARRIERS');
  console.log(thin);
  for (const skill of out.needCarry) {
    const carriers = out.carrierMap[skill] ?? [];
    const free = carriers.filter(c => !c.isAH);
    const ah   = carriers.filter(c => c.isAH);
    console.log(`  "${skill}"  (element: ${SKILL_ELEM[skill] ?? 'non'})`);
    if (!carriers.length) { console.log('    \u2717 No carrier found in compendium'); continue; }
    for (const c of free) console.log(`    [neg/fuse] ${c.demon}  \u2014 ${c.method}`);
    for (const c of ah)   console.log(`    [AH-only]  ${c.demon}  \u2014 AH exclusive (cannot inherit)`);
  }
  if (out.alreadyHas.length) {
    console.log(`\n  "${out.alreadyHas.join('", "')}" \u2014 ${target} already knows these natively`);
  }

  console.log(`\n  FISSION PAIRS for ${target}  (${out.fissions.length} total)`);
  console.log(thin);
  for (const p of out.fissions) console.log(`    ${p.name1}  \u00d7  ${p.name2}`);

  const viable  = out.results.filter(r => r.viable);
  const blocked = out.results.filter(r => !r.viable);

  console.log(`\n  PATHS  \u2014 ${viable.length} viable, ${blocked.length} blocked`);
  console.log(thin);

  const show = out.results.slice(0, limit);
  if (!show.length) { console.log('  No paths found.'); }

  for (let i = 0; i < show.length; i++) {
    const p = show[i];
    const tag = p.viable ? '\u2713 VIABLE' : '\u2717 BLOCKED';
    console.log(`\n  Path ${i + 1}  [${tag}]  ${p.name1} \u00d7 ${p.name2}  (est. ${p.cost}\u00a5)`);
    for (const s of p.steps) console.log(s);
    if (!p.viable) {
      console.log('  Blockers:');
      for (const b of p.blockers) console.log(`    \u2192 ${b}`);
    }
  }

  if (out.results.length > limit) {
    console.log(`\n  ... and ${out.results.length - limit} more (use --limit to show more)`);
  }

  console.log('\n' + line + '\n');
}

// ── Entry point ──────────────────────────────────────────────────

const args = parseArgs(process.argv);

if (args.help || (!args.target && !args.skills.length)) {
  console.log(HELP);
  process.exit(0);
}

if (!args.target) { console.error('Error: --target is required. Use --help for usage.'); process.exit(1); }
if (!args.skills.length) { console.error('Error: --skills is required. Use --help for usage.'); process.exit(1); }

const demonMap  = getDemonMap(args.game);
const prereqMap = getPrereqMap(args.game);
const byRace    = demonsByRace(demonMap);

const out = findPaths(args.target, args.skills, demonMap, byRace, prereqMap, args.level, args.day);
render(args.target, args.skills, out, args.level, args.day, args.game, args.limit);
