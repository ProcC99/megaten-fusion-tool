import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';

const fusionsJSON = require('../src/app/desu1/data/fusion-chart.json');
const demonsJSON = require('../src/app/desu1/data/van-demon-data.json');
const skillsJSON = require('../src/app/desu1/data/van-skill-data.json');

const comp = new Compendium(
  {
    demons: demonsJSON,
    skills: skillsJSON,
    specialRecipes: {},
    fusionSpells: {},
    resistCodes: {},
    ailmentElems: [],
    alignments: [],
    appCssClasses: [],
    demonData: []
  } as any,
  {}
);

const chart = new FusionChart(fusionsJSON);
const solver = new FusionDPSolver(comp, chart);

console.log("Empty skills, Max Owned");
const res = solver.solveMultiSkillFusion('Gagyson', [], 99, 'max_owned', [{name: 'Pixie', skills: []}]);
console.log(res);

