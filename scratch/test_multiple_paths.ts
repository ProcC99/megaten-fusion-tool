import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { FusionDPSolver } from '../src/app/desu1/models/fusion-dp-solver';
import compendiumData from '../src/app/desu1/data/compendium.json';
import chartData from '../src/app/desu1/data/fusion-chart.json';
import skillsData from '../src/app/desu1/data/skills.json';

const comp = new Compendium(compendiumData, skillsData);
const chart = new FusionChart(chartData);
const solver = new FusionDPSolver(comp, chart);

console.time('solver');
// We will modify the solver locally to test
