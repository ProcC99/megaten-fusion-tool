import "@angular/compiler";
import { FusionDPSolver, OwnedDemon } from './src/app/desu1/models/fusion-dp-solver';
import { Compendium } from './src/app/smt4f/models/compendium';
import { createCompConfig } from './src/app/desu1/compendium.module';
import FUSION_CHART_JSON from './src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from './src/app/desu1/data/element-chart.json';
import { FusionChart } from './src/app/smt4f/models/fusion-chart';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.affinityElems = compConfig.affinityElems || [];
compConfig.ailmentElems = compConfig.ailmentElems || [];
compConfig.alignments = compConfig.alignments || {};
compConfig.evolveData = compConfig.evolveData || {};
compConfig.resistElems = compConfig.resistElems || [];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig as any);
const solver = new FusionDPSolver(comp as any, chart as any);

const ownedDemons: OwnedDemon[] = [
  { name: 'Pixie', skills: ['Taunt'] }
];

console.log("Running DP Solver for Gagyson + [Taunt] with Owned Pixie...");
const resSummons = solver.solveMultiSkillFusion('Gagyson', ['Taunt'], 99, 'min_summons', ownedDemons);

if (resSummons) {
  console.log("Success! Final State:");
  console.log(`Max Level: ${resSummons.maxLevel}`);
  console.log(`Total Fusions: ${resSummons.totalFusions}`);
  console.log(`Summon Count: ${resSummons.summonCount}`);
  console.log(`Macca Cost: ${resSummons.maccaCost}`);
  console.log(`Steps:`);
  resSummons.steps.forEach((s, i) => {
    console.log(`  Step ${i + 1}: ${s.fuse1} x ${s.fuse2} = ${s.result}`);
  });
} else {
  console.log("Failed to find a fusion path.");
}
