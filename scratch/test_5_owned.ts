import "@angular/compiler";
import { FusionDPSolver, OwnedDemon } from '../src/app/desu1/models/fusion-dp-solver';
import { Compendium } from '../src/app/smt4f/models/compendium';
import { createCompConfig } from '../src/app/desu1/compendium.module';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import compendiumData from '../src/app/desu1/data/compendium.json';
import skillsData from '../src/app/desu1/data/skills.json';
import fusionsData from '../src/app/desu1/data/fusions.json';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs.dso;
compConfig.appCssClasses = [];
compConfig.affinityElems = compConfig.affinityElems || [];
compConfig.ailmentElems = compConfig.ailmentElems || [];
compConfig.alignments = compConfig.alignments || {};
compConfig.evolveData = compConfig.evolveData || {};
compConfig.resistElems = compConfig.resistElems || [];

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig);

const solver = new FusionDPSolver(comp, chart);

const ownedDemons: OwnedDemon[] = [
  { name: 'Pixie', skills: ['Zio', 'Dia'] },
  { name: 'Slime', skills: ['Lunge', 'Life Bonus'] },
  { name: 'Poltergeist', skills: ['Agi', 'Bufu'] },
  { name: 'Ogre', skills: ['Tarukaja', 'Power Punch'] },
  { name: 'Angel', skills: ['Hama', 'Patra', 'Lullaby'] }
];

// Let's find a fusion for a high level demon with some skills
const targetDemon = 'Gagyson'; // Base level ~30
const requiredSkills = ['Taunt'];

console.log("== Running DP for Max Owned == ");
const resMaxOwned = solver.solveMultiSkillFusion(targetDemon, requiredSkills, 99, 'max_owned', ownedDemons);

if (resMaxOwned) {
  console.log("Success! Used", resMaxOwned.summonCount, "summons.");
  console.log("Macca Cost:", resMaxOwned.maccaCost);
  for (const step of resMaxOwned.steps) {
    console.log(`Fuse ${step.fuse1} x ${step.fuse2} -> ${step.result}`);
  }
} else {
  console.log("No valid fusion path found.");
}
