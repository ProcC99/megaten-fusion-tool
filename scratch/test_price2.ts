import { Compendium } from '../src/app/smt4f/models/compendium';
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
    appCssClasses: []
  } as any,
  {}
);
console.log('Pixie:', comp.getDemon('Pixie').price);
console.log('Yuki Jyorou:', comp.getDemon('Yuki Jyorou').price);
