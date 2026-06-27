import "@angular/compiler";
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { createCompConfig } from '../src/app/desu1/compendium.module';
import { decodeAHSkillTier, isAHExclusiveSkill } from '../src/app/desu1/models/fusion-tree-types';
import { SMT_NORMAL_FISSION_CALCULATOR } from '../src/app/compendium/constants';

import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import * as fs from 'fs';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;
compConfig.appCssClasses = ['ds1'];

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig as any);

interface SuitabilityResult {
  isSuitable: boolean;
  status: 'Natural Holder' | 'Can Inherit' | 'Not Suitable';
  freeSlots: number;
}

function evaluateDemonSuitability(demonName: string, targetSkillName: string): SuitabilityResult {
  const demon = comp.getDemon(demonName);
  const targetSkill = comp.getSkill(targetSkillName);

  if (!demon || !targetSkill) return { isSuitable: false, status: 'Not Suitable', freeSlots: 0 };

  let skillType = 'Command';
  if (targetSkill.element === 'pas') skillType = 'Passive';
  else if (targetSkill.element === 'aut' || targetSkill.element === 'auto') skillType = 'Auto';
  else if (targetSkill.element === 'rac') skillType = 'Racial';

  let hasSkill = false;
  let occupiedNormal = 0;

  for (const [sname, slvl] of Object.entries(demon.skills)) {
    const sObj = comp.getSkill(sname);
    if (!sObj) continue;
    const isAH = isAHExclusiveSkill(slvl);

    if (sname === targetSkill.name && !isAH) hasSkill = true;

    // Check slots
    let thisType = 'Command';
    if (sObj.element === 'pas') thisType = 'Passive';
    else if (sObj.element === 'aut' || sObj.element === 'auto') thisType = 'Auto';
    else if (sObj.element === 'rac') thisType = 'Racial';

    if (thisType === skillType && !isAH) {
      occupiedNormal++;
    }
  }

  let maxSlots = 0;
  if (skillType === 'Command') maxSlots = 3;
  if (skillType === 'Passive') maxSlots = 3;
  if (skillType === 'Auto') maxSlots = 1;

  const freeSlots = Math.max(0, maxSlots - occupiedNormal);

  if (hasSkill) return { isSuitable: true, status: 'Natural Holder', freeSlots };
  if (freeSlots > 0) return { isSuitable: true, status: 'Can Inherit', freeSlots };
  return { isSuitable: false, status: 'Not Suitable', freeSlots: 0 };
}

function evaluateFusionLines(targetDemonName: string, targetSkillName: string) {
  const targetSuitability = evaluateDemonSuitability(targetDemonName, targetSkillName);
  
  let md = `# Tier 0 Fusion Lines Evaluation\n\n`;
  md += `**Target:** ${targetDemonName}\n`;
  md += `**Required Skill:** ${targetSkillName}\n\n`;

  if (!targetSuitability.isSuitable) {
    md += `❌ ${targetDemonName} cannot hold ${targetSkillName}. No fusions are viable.\n`;
    return md;
  }

  md += `✅ ${targetDemonName} can hold ${targetSkillName} (${targetSuitability.status}). Evaluating its fusion lines:\n\n`;

  const fissions = SMT_NORMAL_FISSION_CALCULATOR.getFusions(targetDemonName, comp as any, chart as any);
  
  // We'll store the evaluated lines to rank them
  interface EvaluatedLine {
    name1: string;
    name2: string;
    suitA: SuitabilityResult;
    suitB: SuitabilityResult;
    demonA: any;
    demonB: any;
    hasNaturalHolder: boolean;
    maxLevel: number;
    maxAHTierNum: number;
  }

  const ahTierToNum: Record<string, number> = { 'basic': 1, 'gold': 2, 'platinum': 3, 'occult': 4 };
  function getAHTierNum(d: any): number {
    // Some demons might not have an AH tier, we'll assign them a base value based on level, or 5 if unavailable.
    // For simplicity, if they don't have an AH tier, we treat them as tier 5 (harder to get directly).
    let highest: number = 5;
    for (const level of Object.values(d.skills as Record<string, number>)) {
      const t = decodeAHSkillTier(level);
      if (t) {
        highest = Math.min(highest, ahTierToNum[t] || 5);
      }
    }
    // If no AH tier found, we default to 5
    return highest;
  }

  const evaluatedLines: EvaluatedLine[] = [];

  for (const f of fissions) {
    const suitA = evaluateDemonSuitability(f.name1, targetSkillName);
    const suitB = evaluateDemonSuitability(f.name2, targetSkillName);

    // If neither parent can even hold the skill, the fusion line is dead.
    const isViableLine = suitA.isSuitable || suitB.isSuitable;
    if (!isViableLine) continue;

    const demonA = comp.getDemon(f.name1);
    const demonB = comp.getDemon(f.name2);

    const hasNaturalHolder = suitA.status === 'Natural Holder' || suitB.status === 'Natural Holder';
    const maxLevel = Math.max(demonA.lvl, demonB.lvl);
    const maxAHTierNum = Math.max(getAHTierNum(demonA), getAHTierNum(demonB));

    evaluatedLines.push({
      name1: f.name1,
      name2: f.name2,
      suitA,
      suitB,
      demonA,
      demonB,
      hasNaturalHolder,
      maxLevel,
      maxAHTierNum
    });
  }

  // Sort the lines!
  // 1. Natural Holder (true before false)
  // 2. Max Level (lower is better)
  // 3. Max AH Tier (lower is better)
  evaluatedLines.sort((a, b) => {
    if (a.hasNaturalHolder !== b.hasNaturalHolder) {
      return a.hasNaturalHolder ? -1 : 1;
    }
    if (a.maxLevel !== b.maxLevel) {
      return a.maxLevel - b.maxLevel;
    }
    return a.maxAHTierNum - b.maxAHTierNum;
  });

  md += `*Summary: ${evaluatedLines.length} viable lines found. Ranked by Natural Holder > Level > AH Tier*\n\n`;

  for (let i = 0; i < evaluatedLines.length; i++) {
    const line = evaluatedLines[i];
    const ahTierA = line.maxAHTierNum === 5 ? 'None/Fusion' : Object.keys(ahTierToNum).find(k => ahTierToNum[k] === getAHTierNum(line.demonA));
    const ahTierB = line.maxAHTierNum === 5 ? 'None/Fusion' : Object.keys(ahTierToNum).find(k => ahTierToNum[k] === getAHTierNum(line.demonB));

    md += `### ${i + 1}. ✅ ${line.name1} × ${line.name2}\n`;
    md += `- **${line.name1}** (Lv ${line.demonA.lvl}, AH: ${ahTierA}): ${line.suitA.status} (Free slots: ${line.suitA.freeSlots})\n`;
    md += `- **${line.name2}** (Lv ${line.demonB.lvl}, AH: ${ahTierB}): ${line.suitB.status} (Free slots: ${line.suitB.freeSlots})\n\n`;
  }

  return md;
}

const target = 'Jack Frost';
const skill = 'Anti-Fire';
const mdLines = evaluateFusionLines(target, skill);

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/fusion_lines.md';
fs.writeFileSync(outPath, mdLines);
console.log(`Fusion lines evaluation written to ${outPath}`);
