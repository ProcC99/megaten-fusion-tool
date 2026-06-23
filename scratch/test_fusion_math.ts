import { SMT_NORMAL_FUSION_CALCULATOR } from '../src/app/compendium/constants';
import { Compendium } from '../src/app/desu1/models/compendium'; // Wait, it's smt4f compendium
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';

const fusionsJSON = require('../src/app/desu1/data/fusion-chart.json');
const demonsJSON = require('../src/app/desu1/data/van-demon-data.json');
const skillsJSON = require('../src/app/desu1/data/van-skill-data.json');
const elementJSON = require('../src/app/desu1/data/element-modifiers.json');

const comp = {
  getDemon: (name: string) => demonsJSON[name],
  allDemons: Object.keys(demonsJSON).map(k => ({name: k, lvl: demonsJSON[k].lvl, race: demonsJSON[k].race}))
};

const chart = new FusionChart(fusionsJSON, elementJSON);

const fusions = SMT_NORMAL_FUSION_CALCULATOR.getFusions('Pixie', comp as any, chart);
const yj = fusions.find(f => f.name1 === 'Yuki Jyorou' || f.name2 === 'Yuki Jyorou');
console.log('Pixie + Yuki Jyorou =', yj);

