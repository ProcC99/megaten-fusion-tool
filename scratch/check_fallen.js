const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/app/desu1/data/compendium.json', 'utf8'));
const fallen = Object.keys(data.demons).filter(k => data.demons[k].race === 'Fallen').map(k => ({ name: k, lvl: data.demons[k].lvl }));
fallen.sort((a,b) => a.lvl - b.lvl);
console.log(fallen);
