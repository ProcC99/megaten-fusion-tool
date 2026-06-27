import { Compendium } from '../src/app/desu1/models/compendium';
import { FusionChart } from '../src/app/desu1/models/fusion-chart';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';

const compJSON = require('../src/app/desu1/data/comp-config.json');
const fusionsJSON = require('../src/app/desu1/data/fusions.json');
const demonsJSON = require('../src/app/desu1/data/van-demon-data.json');
const skillsJSON = require('../src/app/desu1/data/van-skill-data.json');
const elementJSON = require('../src/app/desu1/data/element-modifiers.json');

// We have to mock compendium to pass it
const comp = new Compendium(demonsJSON, skillsJSON, {}, {}, {});
const chart = new FusionChart(fusionsJSON, elementJSON);

const solver = new FusionDPSolver(comp, chart);

const reqSkills = [];
const ownedDemons = [{ name: 'Pixie', skills: [] }];

console.log("Lowest Level:");
const minLevel = solver.solveMultiSkillFusion('Gagyson', reqSkills, 99, 'min_level', ownedDemons);
console.log(minLevel ? minLevel.maccaCost : 'null');

console.log("Max Owned:");
const maxOwned = solver.solveMultiSkillFusion('Gagyson', reqSkills, 99, 'max_owned', ownedDemons);
console.log(maxOwned ? maxOwned.maccaCost : 'null');
