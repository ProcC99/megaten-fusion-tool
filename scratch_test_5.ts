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
  { name: 'Pixie', skills: ['Agi'] },
  { name: 'Kobold', skills: ['Cleave'] },
  { name: 'Kabuso', skills: [] },
  { name: 'Ogre', skills: ['Taunt'] },
  { name: 'Heqet', skills: ['Dia'] }
];

const targetDemon = 'Wendigo';
const targetSkills = ['Dia', 'Agi'];

console.log(`Running DP Solver for target ${targetDemon} with skills [${targetSkills.join(', ')}]`);
console.log(`Using 5 Owned Demons: ${ownedDemons.map(d => d.name).join(', ')}`);

const res = solver.solveMultiSkillFusion(targetDemon, targetSkills, 99, 'min_summons', ownedDemons);

if (res) {
  console.log("\\n=== FUSION PATH FOUND ===");
  console.log(`Max Level: ${res.maxLevel}`);
  console.log(`Total Fusions: ${res.totalFusions}`);
  console.log(`Summon Count: ${res.summonCount}`);
  console.log(`Macca Cost: ${res.maccaCost}`);
  console.log(`\\nSteps:`);
  res.steps.forEach((s, i) => {
    console.log(`  Step ${i + 1}: ${s.fuse1} x ${s.fuse2} = ${s.result}`);
  });
} else {
  console.log("Failed to find a fusion path.");
}
