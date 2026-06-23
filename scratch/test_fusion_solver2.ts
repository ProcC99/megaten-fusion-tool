import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';

const fusionsJSON = require('../src/app/desu1/data/fusions.json');
const demonsJSON = require('../src/app/desu1/data/van-demon-data.json');
const skillsJSON = require('../src/app/desu1/data/van-skill-data.json');

const comp = new Compendium(demonsJSON, skillsJSON);
const chart = new FusionChart(fusionsJSON);

const solver = new FusionDPSolver(comp, chart);

const reqSkills: string[] = [];
const ownedDemons = [{ name: 'Pixie', skills: [] }];

console.log("Lowest Level (Empty Skills):");
const minLevel = solver.solveMultiSkillFusion('Gagyson', reqSkills, 99, 'min_level', ownedDemons);
console.log(minLevel ? `macca: ${minLevel.maccaCost}, owned: ${minLevel.graph.filter(n => n.isOwned).length}` : 'null');

console.log("Max Owned (Empty Skills):");
const maxOwned = solver.solveMultiSkillFusion('Gagyson', reqSkills, 99, 'max_owned', ownedDemons);
console.log(maxOwned ? `macca: ${maxOwned.maccaCost}, owned: ${maxOwned.graph.filter(n => n.isOwned).length}` : 'null');

console.log("Testing with a required skill (Mabufu):");
const reqSkills2 = ['Mabufu'];
const maxOwned2 = solver.solveMultiSkillFusion('Gagyson', reqSkills2, 99, 'max_owned', ownedDemons);
console.log(maxOwned2 ? `macca: ${maxOwned2.maccaCost}, owned: ${maxOwned2.graph.filter(n => n.isOwned).length}` : 'null');

