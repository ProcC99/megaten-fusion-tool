"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitWithTreasure = exports.splitWithGem = exports.splitWithSameRace = void 0;
function splitWithSameRace(name, compendium, fusionChart) {
    var _a = compendium.getDemon(name), targetRace = _a.race, targetLvl = _a.lvl;
    var recipes = [];
    if (compendium.getSpecialNameEntries(name).length) {
        return recipes;
    }
    var resultLvls = compendium.getResultDemonLvls(targetRace);
    var targetLvlIndex = resultLvls.indexOf(targetLvl);
    if (targetLvlIndex < 0) {
        return recipes;
    }
    var lvlModifier = 1;
    var minResultLvl = 2 * (targetLvl - lvlModifier);
    var maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * (resultLvls[targetLvlIndex + 1] - lvlModifier) : 200;
    var nextResultLvl = resultLvls[targetLvlIndex + 2] ? 2 * (resultLvls[targetLvlIndex + 2] - lvlModifier) : 200;
    var ingLvls = compendium.getIngredientDemonLvls(targetRace).filter(function (lvl) { return lvl !== targetLvl; });
    var ingLvlM = maxResultLvl / 2 + lvlModifier;
    for (var _i = 0, ingLvls_1 = ingLvls; _i < ingLvls_1.length; _i++) {
        var ingLvl2 = ingLvls_1[_i];
        if (ingLvlM < ingLvl2 && ingLvlM + ingLvl2 < nextResultLvl) {
            recipes.push({
                name1: compendium.reverseLookupDemon(targetRace, ingLvlM),
                name2: compendium.reverseLookupDemon(targetRace, ingLvl2)
            });
        }
    }
    for (var ingLvlIndex1 = 0; ingLvlIndex1 < ingLvls.length; ingLvlIndex1++) {
        var ingLvl1 = ingLvls[ingLvlIndex1];
        for (var ingLvlIndex2 = ingLvlIndex1 + 1; ingLvlIndex2 < ingLvls.length; ingLvlIndex2++) {
            var ingLvl2 = ingLvls[ingLvlIndex2];
            if (minResultLvl <= ingLvl1 + ingLvl2 && ingLvl1 + ingLvl2 < maxResultLvl) {
                recipes.push({
                    name1: compendium.reverseLookupDemon(targetRace, ingLvl1),
                    name2: compendium.reverseLookupDemon(targetRace, ingLvl2)
                });
            }
        }
    }
    return recipes;
}
exports.splitWithSameRace = splitWithSameRace;
function splitWithGem(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), raceR = _a.race, lvlR = _a.lvl;
    var elookup = fusionChart.getElemModifiers(raceR);
    var rlvls = compendium.getResultDemonLvls(raceR);
    var li = rlvls.indexOf(lvlR);
    var elementOffsets = Object.keys(elookup).map(function (x) { return parseInt(x, 10); });
    elementOffsets.sort();
    if (li === -1) {
        return recipes;
    }
    for (var _i = 0, elementOffsets_1 = elementOffsets; _i < elementOffsets_1.length; _i++) {
        var offset = elementOffsets_1[_i];
        if (0 <= li + offset && li + offset < rlvls.length) {
            var lvl1 = rlvls[li + offset];
            recipes.push({
                price: lvl1,
                names1: [compendium.reverseLookupDemon(raceR, lvl1)],
                lvl1: lvl1,
                names2: elookup[offset],
                lvl2: lvl1
            });
        }
    }
    return recipes;
}
exports.splitWithGem = splitWithGem;
function splitWithTreasure(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), raceR = _a.race, lvlR = _a.lvl;
    var elookup = fusionChart.getElemModifiers(raceR);
    var rlvls = compendium.getResultDemonLvls(raceR).concat([99]);
    var li = rlvls.indexOf(lvlR);
    var nextRanks = [lvlR];
    if (li === -1) {
        return recipes;
    }
    if (li > 1 && elookup[2]) {
        recipes.push({ price: 0, names1: [], lvl1: rlvls[li - 2], names2: elookup[2], lvl2: rlvls[li - 1] - 1 });
    }
    if (li > 0 && elookup[1]) {
        recipes.push({ price: 0, names1: [], lvl1: rlvls[li - 1], names2: elookup[1], lvl2: lvlR - 1 });
    }
    if (elookup[-1]) {
        recipes.push({ price: 0, names1: [], lvl1: lvlR + 1, names2: elookup[-1], lvl2: rlvls[li + 1] });
    }
    if (li < rlvls.length - 2 && elookup[-1]) {
        nextRanks.push(rlvls[li + 1]);
        recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 1])], lvl1: rlvls[li + 1], names2: elookup[-1], lvl2: rlvls[li + 2] });
    }
    if (li < rlvls.length - 2 && elookup[-2]) {
        recipes.push({ price: 0, names2: elookup[-2], lvl1: rlvls[li + 1] + 1, lvl2: rlvls[li + 2], names1: [] });
    }
    if (li < rlvls.length - 3 && elookup[-2]) {
        nextRanks.push(rlvls[li + 2]);
        recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 2])], lvl1: rlvls[li + 2], names2: elookup[-2], lvl2: rlvls[li + 3] });
        recipes.push({ price: 0, names1: [compendium.reverseLookupDemon(raceR, rlvls[li + 1])], lvl1: rlvls[li + 2] + 1, names2: elookup[-2], lvl2: rlvls[li + 3] });
    }
    for (var _i = 0, _b = recipes.filter(function (r) { return r.names1.length === 0; }); _i < _b.length; _i++) {
        var row = _b[_i];
        for (var _c = 0, _d = compendium.getIngredientDemonLvls(raceR).filter(function (i) { return !nextRanks.includes(i); }); _c < _d.length; _c++) {
            var lvl1 = _d[_c];
            if (lvl1 <= row.lvl2) {
                row.names1.push(compendium.reverseLookupDemon(raceR, lvl1));
            }
        }
    }
    for (var _e = 0, recipes_1 = recipes; _e < recipes_1.length; _e++) {
        var row = recipes_1[_e];
        row.price = Math.pow(row.lvl1 * 3 + 7, 2) + 2000;
    }
    return recipes.filter(function (r) { return r.names1.length > 0; });
}
exports.splitWithTreasure = splitWithTreasure;
