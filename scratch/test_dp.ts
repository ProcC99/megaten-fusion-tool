import { Compendium } from './src/app/smt4f/models/compendium';
import { FusionChart } from './src/app/smt4f/models/fusion-chart';
import { FusionDPSolver } from './src/app/desu1/models/fusion-dp-solver';
import * as fs from 'fs';

const compData = JSON.parse(fs.readFileSync('./src/app/desu1/data/compendium.json', 'utf8'));
const chartData = JSON.parse(fs.readFileSync('./src/app/desu1/data/fusion-chart.json', 'utf8'));
const skillsData = JSON.parse(fs.readFileSync('./src/app/desu1/data/skills.json', 'utf8'));

const comp = new Compendium(compData, skillsData);
const chart = new FusionChart(chartData);

const solver = new FusionDPSolver(comp, chart);

console.time('solve');
const res = solver.solveMultiSkillFusion('Gagyson', ['Taunt', '+Stone'], 99);
console.timeEnd('solve');

console.log(res ? "Found!" : "Not found");
