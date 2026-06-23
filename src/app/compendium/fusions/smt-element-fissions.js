"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitElement = void 0;
function splitElement(element, compendium, fusionChart) {
    var recipes = compendium.getSpecialNamePairs(element).slice();
    for (var _i = 0, _a = Object.entries(fusionChart.getRaceFissions(element)); _i < _a.length; _i++) {
        var _b = _a[_i], raceA = _b[0], raceAs = _b[1];
        var ingLvls1 = compendium.getIngredientDemonLvls(raceA);
        for (var i = 0; i < ingLvls1.length; i++) {
            for (var j = i + 1; j < ingLvls1.length; j++) {
                recipes.push({
                    name1: compendium.reverseLookupDemon(raceA, ingLvls1[i]),
                    name2: compendium.reverseLookupDemon(raceA, ingLvls1[j]),
                });
            }
        }
    }
    return recipes;
}
exports.splitElement = splitElement;
