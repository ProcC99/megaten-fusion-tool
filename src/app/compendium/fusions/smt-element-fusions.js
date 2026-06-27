"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuseTwoElements = exports.fuseWithSpecResult = exports.fuseWithNormResult = void 0;
function fuseWithNormResult(name, compendium, fusionChart) {
    var recipes = [];
    for (var _i = 0, _a = Object.entries(fusionChart.getElemFusions(name)); _i < _a.length; _i++) {
        var _b = _a[_i], ingRace = _b[0], resultModifier = _b[1];
        var ingLvls = compendium.getResultDemonLvls(ingRace).filter(function (lvl) { return lvl < 100; });
        var ingLvls2 = resultModifier < 0 ? ingLvls.slice(-1 * resultModifier) : ingLvls.slice(0, -1 * resultModifier);
        var resultLvls = resultModifier < 0 ? ingLvls.slice(0, resultModifier) : ingLvls.slice(resultModifier);
        for (var index = 0; index < ingLvls2.length; index++) {
            recipes.push({
                name1: compendium.reverseLookupDemon(ingRace, ingLvls2[index]),
                name2: compendium.reverseLookupDemon(ingRace, resultLvls[index])
            });
        }
    }
    return recipes;
}
exports.fuseWithNormResult = fuseWithNormResult;
function fuseWithSpecResult(name, compendium, fusionChart) {
    var recipes = [];
    var elementResults = fusionChart.getElemFusions(name);
    var _loop_1 = function (ingRace2, ingLvl2, ingName2) {
        var resultModifier = elementResults[ingRace2];
        if (resultModifier) {
            var findResultLevelFun = function (index, resultLvl) { return ingLvl2 > resultLvl ? index + 1 : index; };
            var resultLvls = compendium.getResultDemonLvls(ingRace2).filter(function (lvl) { return lvl < 100; });
            var resultLvlIndex = resultModifier + resultLvls.reduce(findResultLevelFun, 0);
            if (0 < resultLvlIndex && resultLvlIndex < resultLvls.length) {
                recipes.push({
                    name1: ingName2,
                    name2: compendium.reverseLookupDemon(ingRace2, resultLvls[resultLvlIndex])
                });
            }
        }
    };
    for (var _i = 0, _a = compendium.specialDemons; _i < _a.length; _i++) {
        var _b = _a[_i], ingRace2 = _b.race, ingLvl2 = _b.lvl, ingName2 = _b.name;
        _loop_1(ingRace2, ingLvl2, ingName2);
    }
    return recipes;
}
exports.fuseWithSpecResult = fuseWithSpecResult;
function fuseTwoElements(name, compendium, fusionChart) {
    return [];
}
exports.fuseTwoElements = fuseTwoElements;
