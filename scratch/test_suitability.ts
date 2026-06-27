import "@angular/compiler";
import { Compendium } from '../src/app/smt4f/models/compendium';
import { createCompConfig } from '../src/app/desu1/compendium.module';
import { decodeAHSkillTier, isAHExclusiveSkill } from '../src/app/desu1/models/fusion-tree-types';

import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import * as fs from 'fs';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;
compConfig.appCssClasses = ['ds1'];

const comp = new Compendium(compConfig as any, {});

interface SkillEntry {
  name: string;
  isAH: boolean;
  ahTier?: string;
  levelDesc: string;
}

function getDemonInfoDict(name: string) {
  const demon = comp.getDemon(name);
  if (!demon) return null;

  const commands: SkillEntry[] = [];
  const passives: SkillEntry[] = [];
  const autos: SkillEntry[] = [];
  const racials: SkillEntry[] = [];

  for (const [sname, slvl] of Object.entries(demon.skills)) {
    const skillObj = comp.getSkill(sname);
    if (!skillObj) continue;

    const isAH = isAHExclusiveSkill(slvl);
    const ahTier = isAH ? (decodeAHSkillTier(slvl) || 'occult') : undefined;
    let levelDesc = isAH ? `Auction {${ahTier?.toUpperCase()}}` : (slvl <= 0.9 ? 'Innate' : `Lv ${Math.round(slvl)}`);
    const entry: SkillEntry = { name: sname, isAH, ahTier, levelDesc };

    if (skillObj.element === 'rac') racials.push(entry);
    else if (skillObj.element === 'pas') passives.push(entry);
    else if (skillObj.element === 'aut' || skillObj.element === 'auto') autos.push(entry);
    else commands.push(entry);
  }

  return {
    name: demon.name,
    skills: { commands, passives, autos, racials }
  };
}

function evaluateSuitability(demonName: string, targetSkillName: string) {
  const demonInfo = getDemonInfoDict(demonName);
  const targetSkill = comp.getSkill(targetSkillName);

  if (!demonInfo) return `Error: Demon '${demonName}' not found.`;
  if (!targetSkill) return `Error: Skill '${targetSkillName}' not found.`;

  let md = `# Fusion Suitability Test\n\n`;

  // 1. Target Skill Info
  md += `## Target Skill: **${targetSkill.name}**\n`;
  let skillType = 'Command';
  if (targetSkill.element === 'pas') skillType = 'Passive';
  else if (targetSkill.element === 'aut' || targetSkill.element === 'auto') skillType = 'Auto';
  else if (targetSkill.element === 'rac') skillType = 'Racial';

  md += `- **Element:** ${targetSkill.element}\n`;
  md += `- **Required Slot Type:** ${skillType}\n`;
  md += `- **Cost:** ${targetSkill.cost ? targetSkill.cost : 'None'}\n`;
  md += `- **Effect:** ${targetSkill.effect}\n\n`;

  // 2. Demon Info
  md += `## Demon: **${demonInfo.name}**\n`;

  // Check if inherently possessed
  const allSkills = [
    ...demonInfo.skills.commands, 
    ...demonInfo.skills.passives, 
    ...demonInfo.skills.autos, 
    ...demonInfo.skills.racials
  ];
  
  const possessedEntry = allSkills.find(s => s.name === targetSkill.name && !s.isAH);
  
  // Calculate free slots for the required type
  let freeSlots = 0;
  let occupiedCount = 0;
  let maxSlots = 0;

  if (skillType === 'Command') {
    occupiedCount = demonInfo.skills.commands.filter(s => !s.isAH).length;
    maxSlots = 3;
  } else if (skillType === 'Passive') {
    occupiedCount = demonInfo.skills.passives.filter(s => !s.isAH).length;
    maxSlots = 3;
  } else if (skillType === 'Auto') {
    occupiedCount = demonInfo.skills.autos.filter(s => !s.isAH).length;
    maxSlots = 1; // Though Demons can't inherit Autos, just for completeness
  }
  freeSlots = Math.max(0, maxSlots - occupiedCount);

  md += `- **Current ${skillType} Skills:** ${occupiedCount} / ${maxSlots} occupied\n`;
  md += `- **Available ${skillType} Slots:** ${freeSlots}\n\n`;

  // 3. Evaluation
  md += `## Evaluation Result\n`;
  
  if (possessedEntry) {
    md += `✅ **SUITABLE (Natural Holder)**\n`;
    md += `This demon naturally learns \`${targetSkill.name}\` (${possessedEntry.levelDesc}). It can pass this skill on to its descendants.\n`;
  } else if (freeSlots > 0) {
    md += `✅ **SUITABLE (Can Inherit)**\n`;
    md += `This demon has ${freeSlots} free ${skillType} slot(s). It can successfully inherit \`${targetSkill.name}\` from its parents during fusion.\n`;
  } else {
    md += `❌ **NOT SUITABLE**\n`;
    md += `This demon does not naturally possess the skill, and has NO free ${skillType} slots available to inherit it. It cannot hold this skill in a fusion chain.\n`;
  }

  return md;
}

const mdSarasvati = evaluateSuitability('Sarasvati', 'Anti-Force');
const mdGagyson = evaluateSuitability('Gagyson', 'Anti-Force');

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/suitability.md';
fs.writeFileSync(outPath, mdSarasvati + '\n\n---\n\n' + mdGagyson);
console.log(`Suitability test written to ${outPath}`);
