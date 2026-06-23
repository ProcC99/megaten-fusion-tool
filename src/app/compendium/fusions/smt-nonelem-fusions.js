"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuseWithElement = exports.fuseWithSameRace = exports.fuseWithDiffRace = void 0;
function findBin(n, bins) {
    if (!bins.length) {
        return -1;
    }
    var index = 0;
    for (var _i = 0, bins_1 = bins; _i < bins_1.length; _i++) {
        var bin = bins_1[_i];
        if (n > bin) {
            index++;
        }
    }
    return index === bins.length ? index - 1 : index;
}
function fuseWithDiffRace(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), raceA = _a.race, lvlA = _a.lvl;
    for (var _i = 0, _b = Object.entries(fusionChart.getRaceFusions(raceA)); _i < _b.length; _i++) {
        var _c = _b[_i], raceB = _c[0], raceR = _c[1];
        var lvlsR = compendium.getResultDemonLvls(raceR);
        var binsB = lvlsR.map(function (lvl) { return 2 * (lvl - fusionChart.lvlModifier) - lvlA; });
        for (var _d = 0, _e = compendium.getIngredientDemonLvls(raceB); _d < _e.length; _d++) {
            var lvlB = _e[_d];
            var binB = findBin(lvlB, binsB);
            if (binB !== -1 && lvlsR[binB] !== 100 && (raceA != raceB || lvlA != lvlB)) {
                var nameR = compendium.reverseLookupDemon(raceR, lvlsR[binB]);
                if (nameR === name && binB + 1 < lvlsR.length) {
                    recipes.push({
                        name1: compendium.reverseLookupDemon(raceB, lvlB),
                        name2: compendium.reverseLookupDemon(raceR, lvlsR[binB + 1])
                    });
                }
                else {
                    recipes.push({
                        name1: compendium.reverseLookupDemon(raceB, lvlB),
                        name2: nameR
                    });
                }
            }
        }
    }
    for (var _f = 0, _g = compendium.reverseLookupSpecial(name); _f < _g.length; _f++) {
        var name2 = _g[_f];
        var specIngreds = compendium.getSpecialNameEntries(name2);
        if (specIngreds.length === 2) {
            var name1 = specIngreds[0] === name ? specIngreds[1] : specIngreds[0];
            for (var _h = 0, recipes_1 = recipes; _h < recipes_1.length; _h++) {
                var pair = recipes_1[_h];
                if (pair.name1 === name1) {
                    pair.name2 = name2;
                }
            }
        }
    }
    return recipes;
}
exports.fuseWithDiffRace = fuseWithDiffRace;
function fuseWithSameRace(name, compendium, fusionChart) {
    var _a = compendium.getDemon(name), ingRace1 = _a.race, ingLvl1 = _a.lvl;
    var elementResult = fusionChart.getRaceFusions(ingRace1)[ingRace1];
    var ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(function (lvl) { return lvl !== ingLvl1; });
    var recipes = [];
    if (elementResult && compendium.isElementDemon(elementResult)) {
        for (var _i = 0, ingLvls2_1 = ingLvls2; _i < ingLvls2_1.length; _i++) {
            var ingLvl2 = ingLvls2_1[_i];
            recipes.push({
                name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
                name2: elementResult
            });
        }
    }
    return recipes;
}
exports.fuseWithSameRace = fuseWithSameRace;
function fuseWithElement(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), ingRace1 = _a.race, ingLvl1 = _a.lvl;
    var resultLvls = [0, 0].concat(compendium.getResultDemonLvls(ingRace1), [100, 100]);
    if (resultLvls.indexOf(ingLvl1) < 0) {
        resultLvls.push(ingLvl1);
        resultLvls.sort(function (a, b) { return a - b; });
    }
    var ingLvlIndex1 = resultLvls.indexOf(ingLvl1);
    var elementModifiers = fusionChart.getElemModifiers(ingRace1);
    var elementOffsets = Object.keys(elementModifiers).map(function (x) { return parseInt(x, 10); });
    for (var _i = 0, elementOffsets_1 = elementOffsets; _i < elementOffsets_1.length; _i++) {
        var offset = elementOffsets_1[_i];
        var resultLvl = resultLvls[ingLvlIndex1 + offset];
        if (resultLvl !== 0 && resultLvl !== 100) {
            var resultName = compendium.reverseLookupDemon(ingRace1, resultLvl);
            for (var _b = 0, _c = elementModifiers[offset]; _b < _c.length; _b++) {
                var elementName = _c[_b];
                recipes.push({
                    name1: elementName,
                    name2: resultName
                });
            }
        }
    }
    return recipes;
}
exports.fuseWithElement = fuseWithElement;
