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

    let thisType = 'Command';
    if (sObj.element === 'pas') thisType = 'Passive';
    else if (sObj.element === 'aut' || sObj.element === 'auto') thisType = 'Auto';
    else if (sObj.element === 'rac') thisType = 'Racial';

    if (thisType === skillType && !isAH) occupiedNormal++;
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

interface SuccessfulChain {
  path: string[]; // e.g. ["Jack Frost", "Kijimunaa x Erthys", "Pixie x Flaemis"]
  naturalHolder: string;
  naturalHolderLevel: number;
  maxChainLevel: number;
}

function searchFusionPaths(targetDemonName: string, targetSkillName: string) {
  const targetSuitability = evaluateDemonSuitability(targetDemonName, targetSkillName);
  if (!targetSuitability.isSuitable) return `❌ ${targetDemonName} cannot hold ${targetSkillName}.\n`;

  const successfulChains: SuccessfulChain[] = [];
  const visited = new Set<string>();

  // Queue stores: [demonName, currentPath, currentMaxLevel]
  const queue: { demon: string, path: string[], maxLevel: number, depth: number }[] = [];
  
  const initialDemon = comp.getDemon(targetDemonName);
  queue.push({ 
    demon: targetDemonName, 
    path: [targetDemonName], 
    maxLevel: initialDemon.lvl,
    depth: 0 
  });
  
  // We'll search up to Depth 2 (Gen 0 = depth 0->1, Gen 1 = depth 1->2)
  const MAX_DEPTH = 2;

  while (queue.length > 0) {
    const { demon, path, maxLevel, depth } = queue.shift()!;
    if (depth >= MAX_DEPTH) continue;
    if (visited.has(demon)) continue;
    visited.add(demon);

    const fissions = SMT_NORMAL_FISSION_CALCULATOR.getFusions(demon, comp as any, chart as any);

    for (const f of fissions) {
      const suitA = evaluateDemonSuitability(f.name1, targetSkillName);
      const suitB = evaluateDemonSuitability(f.name2, targetSkillName);
      const demonA = comp.getDemon(f.name1);
      const demonB = comp.getDemon(f.name2);
      
      const pairMaxLevel = Math.max(maxLevel, demonA.lvl, demonB.lvl);
      const stepStr = `${f.name1} × ${f.name2} -> ${demon}`;

      // Check A
      if (suitA.status === 'Natural Holder') {
        successfulChains.push({
          path: [...path, stepStr],
          naturalHolder: f.name1,
          naturalHolderLevel: demonA.lvl,
          maxChainLevel: pairMaxLevel
        });
      } else if (suitA.status === 'Can Inherit' && !visited.has(f.name1)) {
        queue.push({
          demon: f.name1,
          path: [...path, stepStr],
          maxLevel: pairMaxLevel,
          depth: depth + 1
        });
      }

      // Check B
      if (suitB.status === 'Natural Holder') {
        successfulChains.push({
          path: [...path, stepStr],
          naturalHolder: f.name2,
          naturalHolderLevel: demonB.lvl,
          maxChainLevel: pairMaxLevel
        });
      } else if (suitB.status === 'Can Inherit' && !visited.has(f.name2)) {
        queue.push({
          demon: f.name2,
          path: [...path, stepStr],
          maxLevel: pairMaxLevel,
          depth: depth + 1
        });
      }
    }
  }

  // Rank chains:
  // 1. Natural Holder Level (lowest first)
  // 2. Max Chain Level (lowest first)
  successfulChains.sort((a, b) => {
    if (a.naturalHolderLevel !== b.naturalHolderLevel) return a.naturalHolderLevel - b.naturalHolderLevel;
    return a.maxChainLevel - b.maxChainLevel;
  });

  let md = `# Deep Fusion Search (Gen 1)\n\n`;
  md += `**Target:** ${targetDemonName}\n`;
  md += `**Required Skill:** ${targetSkillName}\n\n`;
  md += `*Summary: Found ${successfulChains.length} valid paths to a Natural Holder within Gen 1 (Depth 2). Ranked by Lowest Natural Holder Level > Lowest Chain Level*\n\n`;

  // Deduplicate paths with same Natural Holder and Step for cleaner output
  const printed = new Set<string>();
  let rank = 1;

  for (const chain of successfulChains) {
    const key = `${chain.naturalHolder}-${chain.path.join('|')}`;
    if (printed.has(key)) continue;
    printed.add(key);

    md += `### ${rank}. Natural Holder: **${chain.naturalHolder}** (Lv ${chain.naturalHolderLevel})\n`;
    md += `- **Max Level in Chain:** ${chain.maxChainLevel}\n`;
    md += `- **Fusion Path:**\n`;
    for (let i = chain.path.length - 1; i >= 1; i--) {
      md += `  ${chain.path.length - i}. ${chain.path[i]}\n`;
    }
    md += `\n`;
    rank++;
  }

  return md;
}

const target = 'Jack Frost';
const skill = 'Anti-Fire';
const mdLines = searchFusionPaths(target, skill);

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/fusion_bfs.md';
fs.writeFileSync(outPath, mdLines);
console.log(`Fusion BFS written to ${outPath}`);
