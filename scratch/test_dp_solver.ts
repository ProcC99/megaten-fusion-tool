import "@angular/compiler";
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { createCompConfig } from '../src/app/desu1/compendium.module';

import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig as any);

const solver = new FusionDPSolver(comp, chart);

console.log("Starting DP calculation for Gagyson with Mabufu and +Stone...");
console.time('solveMultiSkillFusion');
const res = solver.solveMultiSkillFusion('Gagyson', ['Mabufu', '+Stone'], 99);
console.timeEnd('solveMultiSkillFusion');

if (res) {
  console.log("Success! Max Level:", res.maxLevel);
  console.log("Steps:");
  for (const step of res.steps) {
    console.log(`  Fuse: ${step.fuse1} + ${step.fuse2} -> ${step.result}`);
  }
} else {
  console.log("Failed to find a fusion path.");
}
