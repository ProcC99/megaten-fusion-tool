import "@angular/compiler";
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { createCompConfig } from '../src/app/desu1/compendium.module';
import { SMT_NORMAL_FISSION_CALCULATOR } from '../src/app/compendium/constants';

import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import * as fs from 'fs';
import * as path from 'path';

// Initialize compendium and chart
const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;
compConfig.appCssClasses = ['ds1'];

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig as any);

function buildDemonTree(targetDemonName: string) {
  // Map to store depth (node level) for each demon. First visit = shortest path (BFS property)
  const demonDepths = new Map<string, number>();
  const tree: Record<string, { name1: string, name2: string }[]> = {};
  
  // Queue for BFS: stores [demonName, currentDepth]
  const queue: [string, number][] = [[targetDemonName, 0]];
  demonDepths.set(targetDemonName, 0);

  // We also keep track of processing order to display nicely
  const processOrder: string[] = [];

  while (queue.length > 0) {
    const [current, depth] = queue.shift()!;
    processOrder.push(current);
    
    // Get all pairs that fuse into 'current'
    const fissions = SMT_NORMAL_FISSION_CALCULATOR.getFusions(current, comp as any, chart as any);
    tree[current] = fissions.map(f => ({ name1: f.name1, name2: f.name2 }));

    for (const f of fissions) {
      if (!demonDepths.has(f.name1)) {
        demonDepths.set(f.name1, depth + 1);
        queue.push([f.name1, depth + 1]);
      }
      if (!demonDepths.has(f.name2)) {
        demonDepths.set(f.name2, depth + 1);
        queue.push([f.name2, depth + 1]);
      }
    }
  }

  return { tree, demonDepths, processOrder };
}

const target = 'Gagyson';
const { tree, demonDepths, processOrder } = buildDemonTree(target);

let md = `# Full Fusion Ancestry Tree for ${target}\n\n`;
md += `This document represents the DP table structure. Each demon is processed **exactly once** (at its shortest depth/node level from the target). Its immediate parents (fission pairs) are listed.\n\n`;
md += `**Total Unique Demon Nodes:** ${demonDepths.size}\n\n`;
md += `---\n\n`;

for (const demon of processOrder) {
  const depth = demonDepths.get(demon);
  md += `### ${demon} (Node Level: ${depth})\n`;
  const recipes = tree[demon];
  if (recipes.length === 0) {
    md += `- *No further fusions (Base/Element Demon or end of chart)*\n\n`;
  } else {
    for (const r of recipes) {
      md += `- ${r.name1} × ${r.name2}\n`;
    }
    md += `\n`;
  }
}

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/tree_output.md';
fs.writeFileSync(outPath, md);
console.log(`Markdown tree written to ${outPath}`);
