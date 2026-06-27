import * as fs from 'fs';
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';

const compData = JSON.parse(fs.readFileSync('./src/app/desu1/data/compendium.json', 'utf8'));
const skillsData = JSON.parse(fs.readFileSync('./src/app/desu1/data/skills.json', 'utf8'));
const fusionsData = JSON.parse(fs.readFileSync('./src/app/desu1/data/fusions.json', 'utf8'));

const comp = new Compendium({
  appCssClasses: [],
  lang: 'en',
  skillData: skillsData as any,
  fusionSpells: {},
  fissionCalculator: null,
  fusionCalculator: null,
  demons: compData.demons as any,
  skills: skillsData as any,
  specialRecipes: compData.special as any,
  alignments: {},
  bossDemons: {},
  dlcDemons: [],
  elementDemons: compData.elements as any,
  evolutions: {},
  mitamaTable: compData.mitamaTable,
  normalTable: fusionsData as any,
  races: compData.races,
  resistCodes: compData.resistCodes,
  statOverrides: {},
  tribeAttributes: {}
}, {});
const chart = new FusionChart(fusionsData as any);
const solver = new FusionDPSolver(comp, chart);

const ownedDemons = [{ name: 'Pixie', skills: [] }];
const res = solver.solveMultiSkillFusion('Gagyson', ['Mabufu'], 99, 'max_owned', ownedDemons);

console.log("Max Owned Result:");
if (res) {
  console.log("Total Fusions:", res.totalFusions);
  console.log("Macca:", res.maccaCost);
  for (const n of res.graph) {
    console.log(`- ${n.demon} (Owned: ${n.isOwned})`);
  }
} else {
  console.log("null");
}
