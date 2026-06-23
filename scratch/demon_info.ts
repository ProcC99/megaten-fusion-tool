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

  // Affinities
  let rawAffinities = '';
  for (const dataObj of compConfig.demonData) {
    if (dataObj[name] && dataObj[name].resists) {
      rawAffinities = dataObj[name].resists;
      break;
    }
  }
  
  const affinities: Record<string, string> = {};
  if (rawAffinities) {
    const resistElems = compConfig.resistElems; 
    const codes: Record<string, string> = {
      'w': 'Weak', '-': 'Normal', 's': 'Resist', 'n': 'Null', 'r': 'Repel', 'd': 'Drain'
    };
    for (let i = 0; i < resistElems.length; i++) {
      const code = rawAffinities[i] || '-';
      affinities[resistElems[i].toUpperCase()] = codes[code] || code;
    }
  }

  // Skills
  const commands: SkillEntry[] = [];
  const passives: SkillEntry[] = [];
  const autos: SkillEntry[] = [];
  const racials: SkillEntry[] = [];

  for (const [sname, slvl] of Object.entries(demon.skills)) {
    const skillObj = comp.getSkill(sname);
    if (!skillObj) continue;

    const isAH = isAHExclusiveSkill(slvl);
    const ahTier = isAH ? (decodeAHSkillTier(slvl) || 'occult') : undefined;
    let levelDesc = '';
    
    if (isAH) {
      levelDesc = `Auction {${ahTier?.toUpperCase()}}`;
    } else if (slvl <= 0.9) {
      levelDesc = 'Innate';
    } else {
      levelDesc = `Lv ${Math.round(slvl)}`;
    }

    const entry: SkillEntry = { name: sname, isAH, ahTier, levelDesc };

    if (skillObj.element === 'rac') racials.push(entry);
    else if (skillObj.element === 'pas') passives.push(entry);
    else if (skillObj.element === 'aut' || skillObj.element === 'auto') autos.push(entry);
    else commands.push(entry);
  }

  // Stats
  const statNames = compConfig.baseStats;
  const statsDict: Record<string, number> = {};
  if (demon.stats) {
    for (let i = 0; i < statNames.length; i++) {
      statsDict[statNames[i]] = demon.stats[i] || 0;
    }
  }

  return {
    name: demon.name,
    race: demon.race,
    level: demon.lvl,
    price: demon.price,
    stats: statsDict,
    affinities,
    skills: {
      commands,
      passives,
      autos,
      racials
    }
  };
}

function formatDemonInfoMarkdown(info: ReturnType<typeof getDemonInfoDict>) {
  if (!info) return "Demon not found.";

  let md = `# Demon Info: ${info.name}\n\n`;
  md += `- **Race:** ${info.race}\n`;
  md += `- **Level:** ${info.level}\n`;
  md += `- **Price:** ${info.price} Macca\n\n`;

  if (info.stats && Object.keys(info.stats).length > 0) {
    md += `## Base Stats\n`;
    for (const [stat, val] of Object.entries(info.stats)) {
      md += `- **${stat}**: ${val}\n`;
    }
    md += `\n`;
  }

  md += `## Affinities\n`;
  for (const [elem, res] of Object.entries(info.affinities)) {
    md += `- **${elem}**: ${res}\n`;
  }
  md += `\n`;

  md += `## Skills\n\n`;

  const formatSlot = (entry: SkillEntry | undefined, isAHSlot = false) => {
    if (!entry) return `* ______`;
    const label = `* ${entry.name} - ${entry.levelDesc}`;
    return isAHSlot ? `* ______ // (AH Slot: ${entry.name} - ${entry.levelDesc})` : label;
  };

  // Process a category of skills ensuring maxSlots
  const renderCategory = (title: string, entries: SkillEntry[], maxSlots: number) => {
    md += `### ${title}\n`;
    let normalCount = 0;
    
    // Print normal skills first
    for (const entry of entries) {
      if (!entry.isAH) {
        md += normalCount < maxSlots ? `${formatSlot(entry)}\n` : `${formatSlot(entry)} (Exceeds slots?!)\n`;
        normalCount++;
      }
    }

    // Print free slots or AH skills occupying them
    let freeSlots = maxSlots - normalCount;
    let ahIndex = 0;
    const ahEntries = entries.filter(e => e.isAH);

    for (let i = 0; i < freeSlots; i++) {
      if (ahIndex < ahEntries.length) {
        md += `${formatSlot(ahEntries[ahIndex], true)}\n`;
        ahIndex++;
      } else {
        md += `${formatSlot(undefined)}\n`;
      }
    }

    // If there are more AH skills than free slots (rare but possible in data weirdness)
    while (ahIndex < ahEntries.length) {
      md += `${formatSlot(ahEntries[ahIndex], true)}\n`;
      ahIndex++;
    }
    
    md += `\n`;
  };

  renderCategory('Command (Max 3)', info.skills.commands, 3);
  renderCategory('Passive (Max 3)', info.skills.passives, 3);
  renderCategory('Racial', info.skills.racials, info.skills.racials.length);

  return md;
}

const target = 'Hecate';
const infoDict = getDemonInfoDict(target);
const infoMd = formatDemonInfoMarkdown(infoDict!);

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/demon_info.md';
fs.writeFileSync(outPath, infoMd);
console.log(`Demon info written to ${outPath}`);
