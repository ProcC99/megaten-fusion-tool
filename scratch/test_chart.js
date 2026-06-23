const comp = require('../src/app/desu1/data/compendium.json');
const chart = require('../src/app/desu1/data/fusions.json');

const pixie = comp.demons["Pixie"];
const yuki = comp.demons["Yuki Jyorou"];
console.log("Pixie race:", pixie.race);
console.log("Yuki Jyorou race:", yuki.race);

const idx1 = chart.races.indexOf(pixie.race);
const idx2 = chart.races.indexOf(yuki.race);
console.log("Fusion result:", chart.table[idx1][idx2]);
