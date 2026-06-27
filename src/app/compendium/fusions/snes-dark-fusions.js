"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuseWithDarkRace = exports.splitWithDarkRace = void 0;
function splitWithDarkRace(name, compendium, fusionChart) {
    var _a = compendium.getDemon(name), raceR = _a.race, lvlR = _a.lvl;
    var lvlAs = [0, 0].concat(compendium.getResultDemonLvls(raceR), [100, 100]);
    var indR = lvlAs.indexOf(lvlR);
    var recipes = [];
    if (fusionChart.getLightDark(raceR) < 0 || indR === -1) {
        return recipes;
    }
    var lvlA7 = lvlAs[indR - 2];
    var lvlA5 = lvlAs[indR - 1];
    var lvlA3 = lvlAs[indR + 1];
    var nameA7 = lvlA7 !== 0 ? compendium.reverseLookupDemon(raceR, lvlA7) : '';
    var nameA5 = lvlA5 !== 0 ? compendium.reverseLookupDemon(raceR, lvlA5) : '';
    var nameA3 = lvlA3 !== 100 ? compendium.reverseLookupDemon(raceR, lvlA3) : '';
    for (var _i = 0, _b = fusionChart.races; _i < _b.length; _i++) {
        var raceB = _b[_i];
        if (fusionChart.getLightDark(raceB) < 0) {
            for (var _c = 0, _d = compendium.getIngredientDemonLvls(raceB); _c < _d.length; _c++) {
                var lvlB = _d[_c];
                var nameB = compendium.reverseLookupDemon(raceB, lvlB);
                if (lvlA7 >= lvlB && (lvlA7 + lvlB) % 7 === 0) {
                    recipes.push({ name1: nameA7, name2: nameB });
                }
                if (lvlA5 >= lvlB && (lvlA5 + lvlB) % 7 !== 0 && (lvlA5 + lvlB) % 5 === 0) {
                    recipes.push({ name1: nameA5, name2: nameB });
                }
                if (lvlA3 >= lvlB && (lvlA3 + lvlB) % 7 !== 0 && (lvlA3 + lvlB) % 5 !== 0 && (lvlA3 + lvlB) % 3 === 0) {
                    recipes.push({ name1: nameA3, name2: nameB });
                }
            }
        }
    }
    return recipes.filter(function (r) { return r.name1 !== ''; });
}
exports.splitWithDarkRace = splitWithDarkRace;
function fuseWithDarkRace(name, compendium, fusionChart) {
    var _a = compendium.getDemon(name), raceA = _a.race, lvlA = _a.lvl;
    var lvlRs = [0, 0].concat(compendium.getResultDemonLvls(raceA), [100, 100]);
    var indA = lvlRs.indexOf(lvlA);
    var recipes = [];
    if (fusionChart.getLightDark(raceA) < 0 || indA === -1) {
        return recipes;
    }
    var lvlR7 = lvlRs[indA + 2];
    var lvlR5 = lvlRs[indA + 1];
    var lvlR3 = lvlRs[indA - 1];
    var nameR7 = lvlR7 !== 100 ? compendium.reverseLookupDemon(raceA, lvlR7) : '';
    var nameR5 = lvlR5 !== 100 ? compendium.reverseLookupDemon(raceA, lvlR5) : '';
    var nameR3 = lvlR3 !== 0 ? compendium.reverseLookupDemon(raceA, lvlR3) : '';
    for (var _i = 0, _b = fusionChart.races; _i < _b.length; _i++) {
        var raceB = _b[_i];
        if (fusionChart.getLightDark(raceB) < 0) {
            var lvlBs = compendium.getIngredientDemonLvls(raceB);
            for (var indB = 0; indB < lvlBs.length; indB++) {
                var lvlB = lvlBs[indB];
                var nameB = compendium.reverseLookupDemon(raceB, lvlB);
                if (lvlA >= lvlB) {
                    if ((lvlA + lvlB) % 7 === 0) {
                        recipes.push({ name1: nameB, name2: nameR7 });
                    }
                    else if ((lvlA + lvlB) % 5 === 0) {
                        recipes.push({ name1: nameB, name2: nameR5 });
                    }
                    else if ((lvlA + lvlB) % 3 === 0) {
                        recipes.push({ name1: nameB, name2: nameR3 });
                    }
                    else if ((lvlA + lvlB) % 2 === 0 && indB > 0) {
                        recipes.push({ name1: nameB, name2: compendium.reverseLookupDemon(raceB, lvlBs[indB - 1]) });
                    }
                }
                else {
                    if ((lvlA + lvlB) % 2 === 0 && indB < lvlBs.length - 1) {
                        recipes.push({ name1: nameB, name2: compendium.reverseLookupDemon(raceB, lvlBs[indB + 1]) });
                    }
                    else if ((lvlA + lvlB) % 2 === 1) {
                        recipes.push({ name1: nameB, name2: 'Slime' });
                    }
                }
            }
        }
    }
    return recipes.filter(function (r) { return r.name2 !== ''; });
}
exports.fuseWithDarkRace = fuseWithDarkRace;
