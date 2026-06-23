"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitWithTotem = exports.splitWithElement = exports.splitWithSpecies = exports.splitWithDiffRace = void 0;
function splitWithDiffRace(name, compendium, fusionChart) {
    var recipes = [];
    var specials = compendium.getSpecialNamePairs(name);
    if (specials.length > 0) {
        if (specials[0].name1 === specials[0].name2) {
            name = specials[0].name1;
        }
        else if (name !== specials[0].name1) {
            return specials;
        }
    }
    var _a = compendium.getDemon(name), targetRace = _a.race, targetLvl = _a.lvl;
    var resultLvls = compendium.getResultDemonLvls(targetRace);
    var targetLvlIndex = resultLvls.indexOf(targetLvl);
    if (targetLvlIndex === -1) {
        return [];
    }
    var minResultLvl = resultLvls[targetLvlIndex - 1] ?
        2 * (resultLvls[targetLvlIndex - 1] - fusionChart.lvlModifier) : 0;
    var maxResultLvl = resultLvls[targetLvlIndex + 1] ?
        2 * (targetLvl - fusionChart.lvlModifier) : 200;
    for (var _i = 0, _b = Object.entries(fusionChart.getRaceFissions(targetRace)); _i < _b.length; _i++) {
        var _c = _b[_i], raceA = _c[0], raceBs = _c[1];
        for (var _d = 0, _e = compendium.getIngredientDemonLvls(raceA); _d < _e.length; _d++) {
            var lvlA = _e[_d];
            var minLvlB = minResultLvl - lvlA;
            var maxLvlB = maxResultLvl - lvlA;
            for (var _f = 0, raceBs_1 = raceBs; _f < raceBs_1.length; _f++) {
                var raceB = raceBs_1[_f];
                for (var _g = 0, _h = compendium.getIngredientDemonLvls(raceB); _g < _h.length; _g++) {
                    var lvlB = _h[_g];
                    if (minLvlB < lvlB && lvlB <= maxLvlB && (raceA != raceB || lvlA < lvlB)) {
                        recipes.push({
                            name1: compendium.reverseLookupDemon(raceA, lvlA),
                            name2: compendium.reverseLookupDemon(raceB, lvlB)
                        });
                    }
                }
            }
        }
    }
    return recipes;
}
exports.splitWithDiffRace = splitWithDiffRace;
function splitWithSpecies(name, compendium, fusionChart) {
    var recipes = [];
    var _a = compendium.getDemon(name), targetRace = _a.race, targetLvl = _a.lvl;
    var twoSpecies = Object.keys(fusionChart.getRaceFissions(targetRace)).find(function (s) { return s.charAt(0) === '2'; });
    if (!twoSpecies) {
        return recipes;
    }
    var targetSpecies = twoSpecies.substring(1);
    var resultLvls = compendium.getResultDemonLvls(targetSpecies);
    var targetLvlIndex = resultLvls.indexOf(targetLvl);
    if (targetLvlIndex === -1) {
        return recipes;
    }
    var pr1ResultLvl = resultLvls[targetLvlIndex - 2] || 0;
    var pr2ResultLvl = resultLvls[targetLvlIndex - 1] || 0;
    var maxResultLvl = resultLvls[targetLvlIndex + 1] ? 2 * targetLvl : 200;
    for (var _i = 0, _b = Object.entries(fusionChart.getRaceFissions(targetSpecies)); _i < _b.length; _i++) {
        var _c = _b[_i], raceA = _c[0], raceBs = _c[1];
        for (var _d = 0, _e = compendium.getIngredientDemonLvls(raceA).filter(function (lvl) { return lvl !== targetLvl; }); _d < _e.length; _d++) {
            var lvlA = _e[_d];
            for (var _f = 0, raceBs_2 = raceBs; _f < raceBs_2.length; _f++) {
                var raceB = raceBs_2[_f];
                for (var _g = 0, _h = compendium.getIngredientDemonLvls(raceB).filter(function (lvl) { return lvl !== targetLvl; }); _g < _h.length; _g++) {
                    var lvlB = _h[_g];
                    var minResultLvl = (lvlA === pr2ResultLvl || lvlB === pr2ResultLvl) ? pr1ResultLvl : pr2ResultLvl;
                    var resultLvl = lvlA + lvlB + fusionChart.lvlModifier;
                    if (2 * minResultLvl < resultLvl && resultLvl <= maxResultLvl) {
                        recipes.push({
                            name1: compendium.reverseLookupDemon(raceA, lvlA),
                            name2: compendium.reverseLookupDemon(raceB, lvlB)
                        });
                    }
                }
            }
        }
    }
    return recipes;
}
exports.splitWithSpecies = splitWithSpecies;
function splitWithElement(name, compendium, fusionChart) {
    var _a = compendium.getDemon(name), targetRace = _a.race, targetLvl = _a.lvl;
    var recipes = [];
    var elementModifiers = fusionChart.getElemModifiers(targetRace);
    var elementOffsets = Object.keys(elementModifiers).map(function (x) { return parseInt(x, 10); });
    if (compendium.getSpecialNamePairs(name).length || !elementOffsets.length) {
        return recipes;
    }
    var baseResultLvls = [0, 0].concat(compendium.getResultDemonLvls(targetRace), [100, 100]);
    var elementRecipes = [];
    for (var _i = 0, _b = compendium.getIngredientDemonLvls(targetRace); _i < _b.length; _i++) {
        var ingLvl = _b[_i];
        var resultLvls = baseResultLvls.slice();
        if (resultLvls.indexOf(ingLvl) < 0) {
            resultLvls.push(ingLvl);
            resultLvls.sort(function (a, b) { return a - b; });
        }
        var ingLvlIndex = resultLvls.indexOf(ingLvl);
        for (var _c = 0, elementOffsets_1 = elementOffsets; _c < elementOffsets_1.length; _c++) {
            var elementOffset = elementOffsets_1[_c];
            if (resultLvls[ingLvlIndex + elementOffset] === targetLvl) {
                elementRecipes.push({
                    ingName: compendium.reverseLookupDemon(targetRace, ingLvl),
                    elementOffset: elementOffset
                });
            }
        }
    }
    for (var _d = 0, elementRecipes_1 = elementRecipes; _d < elementRecipes_1.length; _d++) {
        var elementRecipe = elementRecipes_1[_d];
        for (var _e = 0, _f = elementModifiers[elementRecipe.elementOffset]; _e < _f.length; _e++) {
            var elementName = _f[_e];
            recipes.push({
                name1: elementRecipe.ingName,
                name2: elementName
            });
        }
    }
    return recipes;
}
exports.splitWithElement = splitWithElement;
function splitWithTotem(name, compendium, fusionChart) {
    var recipes = [];
    var specials = compendium.getSpecialNamePairs(name);
    if (specials.length === 0 || name !== specials[0].name1) {
        return recipes;
    }
    var targetRace = compendium.getDemon(specials[0].name2).race;
    for (var _i = 0, _a = Object.entries(fusionChart.getRaceFissions(targetRace)); _i < _a.length; _i++) {
        var _b = _a[_i], raceA = _b[0], raceBs = _b[1];
        for (var _c = 0, _d = compendium.getIngredientDemonLvls(raceA); _c < _d.length; _c++) {
            var lvlA = _d[_c];
            for (var _e = 0, raceBs_3 = raceBs; _e < raceBs_3.length; _e++) {
                var raceB = raceBs_3[_e];
                for (var _f = 0, _g = compendium.getIngredientDemonLvls(raceB); _f < _g.length; _f++) {
                    var lvlB = _g[_f];
                    recipes.push({
                        name1: compendium.reverseLookupDemon(raceA, lvlA),
                        name2: compendium.reverseLookupDemon(raceB, lvlB)
                    });
                }
            }
        }
    }
    return recipes;
}
exports.splitWithTotem = splitWithTotem;
