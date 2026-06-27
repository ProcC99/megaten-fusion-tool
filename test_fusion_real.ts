import "@angular/compiler";
// import '@angular/compiler';
import { searchFusionTree } from '/home/jpurple/workish/skill-recipe/src/app/desu1/models/fusion-tree-search';
import { Compendium } from '/home/jpurple/workish/skill-recipe/src/app/smt4f/models/compendium';
import { DEFAULT_PLAYER_STATE } from '/home/jpurple/workish/skill-recipe/src/app/desu1/models/fusion-tree-types';
import { NormalFusionCalculator } from '/home/jpurple/workish/skill-recipe/src/app/compendium/models/normal-fusion-calculator';

import { createCompConfig } from '/home/jpurple/workish/skill-recipe/src/app/desu1/compendium.module';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '/home/jpurple/workish/skill-recipe/src/app/compendium/constants';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
// Stub missing arrays because translateComp usually does this in FusionDataService
compConfig.affinityElems = compConfig.affinityElems || [];
compConfig.ailmentElems = compConfig.ailmentElems || [];
compConfig.alignments = compConfig.alignments || {};
compConfig.evolveData = compConfig.evolveData || {};
compConfig.resistElems = compConfig.resistElems || [];

const comp = new Compendium(compConfig as any, {});
import FUSION_CHART_JSON from '/home/jpurple/workish/skill-recipe/src/app/desu1/data/fusion-chart.json';

const recipeConfig = {
  fissionCalculator: SMT_NORMAL_FISSION_CALCULATOR,
  fusionCalculator: SMT_NORMAL_FUSION_CALCULATOR,
  triFissionCalculator: SMT_NORMAL_FISSION_CALCULATOR,
  triFusionCalculator: SMT_NORMAL_FUSION_CALCULATOR,
  races: compConfig.races,
  skillElems: compConfig.skillElems || [],
  inheritElems: compConfig.skillElems || [],
  displayElems: {},
  restrictInherits: false,
  defaultDemon: 'Gagyson'
};

const playerState = { ...DEFAULT_PLAYER_STATE, maxLevel: 14, currentDay: 1 };
playerState.unlockedFusions = [];
const target = {
  targetDemon: 'Gagyson',
  requiredSkills: ['Anti-Force'],
  playerState: playerState,
  maxDepth: 3,
  maxResults: 10,
  rankStrategy: 'cheapest' as const
};
import { FusionChart } from './src/app/smt4f/models/fusion-chart';
import ELEMENT_CHART_JSON from './src/app/desu1/data/element-chart.json';

compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;
compConfig.appCssClasses = ['ds1'];

const rawChart = new FusionChart(compConfig as any);
const squareChart = { normalChart: rawChart, tripleChart: rawChart };

console.log("Running REAL DP search for Day 1...");
const results = searchFusionTree(target, comp as any, squareChart as any, recipeConfig as any);
const strict = results.filter(r => r.blockers.length === 0 && r.ahOnlySkills.every(s => s.isReachableNow));
console.log(`Day 1, Level 14: ${strict.length} viable, ${results.length - strict.length} blocked.`);

playerState.currentDay = 2;
console.log("\nRunning REAL DP search for Day 2...");
const resultsDay2 = searchFusionTree(target, comp as any, squareChart as any, recipeConfig as any);
const strictDay2 = resultsDay2.filter(r => r.blockers.length === 0 && r.ahOnlySkills.every(s => s.isReachableNow));
console.log(`Day 2, Level 14: ${strictDay2.length} viable, ${resultsDay2.length - strictDay2.length} blocked.`);
if (strictDay2.length > 0) {
  console.log("Best Day 2 Result:", JSON.stringify(strictDay2[0], null, 2));
}
