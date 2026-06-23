"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuseWithSameRace = void 0;
function fuseWithSameRace(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), ingRace1 = _a.race, ingLvl1 = _a.lvl;
    var lvlModifier = 1;
    var ingLvls2 = compendium.getIngredientDemonLvls(ingRace1).filter(function (lvl) { return lvl !== ingLvl1; });
    var resultLvls = compendium.getResultDemonLvls(ingRace1).filter(function (lvl) { return lvl !== ingLvl1; }).map(function (lvl) { return 2 * lvl; });
    var _loop_1 = function (ingLvl2) {
        var findResultLvlFun = function (index, resultLvl) { return ingLvl1 + ingLvl2 + 2 * lvlModifier >= resultLvl ? index + 1 : index; };
        var resultLvlIndex = resultLvls.reduce(findResultLvlFun, -1);
        if (resultLvls[resultLvlIndex] / 2 === ingLvl2) {
            resultLvlIndex = resultLvlIndex - 1;
        }
        var resultLvl = resultLvls[resultLvlIndex] / 2;
        if (resultLvl) {
            recipes.push({
                name1: compendium.reverseLookupDemon(ingRace1, ingLvl2),
                name2: compendium.reverseLookupDemon(ingRace1, resultLvl)
            });
        }
    };
    for (var _i = 0, ingLvls2_1 = ingLvls2; _i < ingLvls2_1.length; _i++) {
        var ingLvl2 = ingLvls2_1[_i];
        _loop_1(ingLvl2);
    }
    return recipes;
}
exports.fuseWithSameRace = fuseWithSameRace;
