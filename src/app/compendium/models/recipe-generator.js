"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSkillsRecipe = exports.createLeftRightRecipe = exports.createLeftRightCombos = void 0;
var conversions_1 = require("./conversions");
function createLeftRightCombos(demon, comp, squareChart, recipeConfig) {
    var fissionCalculator = recipeConfig.fissionCalculator, triFissionCalculator = recipeConfig.triFissionCalculator;
    var normalChart = squareChart.normalChart;
    var triExclusiveRaces = normalChart.races
        .filter(function (r) { return Object.keys(normalChart.getRaceFissions(r)).length === 0; })
        .reduce(function (acc, i) { acc[i] = 1; return acc; }, {});
    var stepR = comp.getSpecialNameEntries(demon);
    if (stepR.length > 1) {
        return stepR.reduce(function (acc, name1) { acc[name1] = stepR.filter(function (n) { return n !== name1; }); return acc; }, {});
    }
    if (triExclusiveRaces[comp.getDemon(demon).race] && triFissionCalculator) {
        var trios = {};
        for (var _i = 0, _a = triFissionCalculator.getFusions(demon, comp, squareChart).map(function (p) { return (0, conversions_1.toDemonTrio)(p, comp); }); _i < _a.length; _i++) {
            var _b = _a[_i], d1 = _b.d1, d2 = _b.d2, d3 = _b.d3;
            var fusable = [d1, d2, d3].filter(function (d) { return !triExclusiveRaces[d.race]; });
            if (fusable.length < 2) {
                continue;
            }
            var name1 = fusable[0].name;
            var name2 = fusable[1].name;
            if (!trios[name1]) {
                trios[name1] = {};
            }
            if (!trios[name2]) {
                trios[name2] = {};
            }
            trios[name1][name2] = 1;
            trios[name2][name1] = 1;
        }
        return Object.entries(trios).reduce(function (acc, _a) {
            var k = _a[0], v = _a[1];
            acc[k] = Object.keys(v);
            return acc;
        }, {});
    }
    var combos = {};
    for (var _c = 0, _d = fissionCalculator.getFusions(demon, comp, normalChart).map(function (p) { return (0, conversions_1.toFusionPair)(p, comp); }); _c < _d.length; _c++) {
        var _e = _d[_c], name1 = _e.name1, race1 = _e.race1, name2 = _e.name2, race2 = _e.race2;
        if (triExclusiveRaces[race1] && comp.getSpecialNameEntries(name1).length < 2 ||
            triExclusiveRaces[race2] && comp.getSpecialNameEntries(name2).length < 2) {
            continue;
        }
        if (!combos[name1]) {
            combos[name1] = [];
        }
        if (!combos[name2]) {
            combos[name2] = [];
        }
        combos[name1].push(name2);
        combos[name2].push(name1);
    }
    return combos;
}
exports.createLeftRightCombos = createLeftRightCombos;
function createLeftRightRecipe(lrConfig, comp, squareChart, recipeConfig) {
    var fissionCalculator = recipeConfig.fissionCalculator, inheritElems = recipeConfig.inheritElems, triFissionCalculator = recipeConfig.triFissionCalculator;
    var normalChart = squareChart.normalChart;
    var result = lrConfig.result, targetL = lrConfig.targetL, targetR = lrConfig.targetR, ingredLs = lrConfig.ingredLs, ingredRs = lrConfig.ingredRs;
    var newIngredLs = Object.entries(ingredLs).reduce(function (acc, _a) {
        var skill = _a[0], demon = _a[1];
        if (demon != targetL) {
            acc[skill] = demon;
        }
        return acc;
    }, {});
    var newIngredRs = Object.entries(ingredRs).reduce(function (acc, _a) {
        var skill = _a[0], demon = _a[1];
        if (demon != targetR) {
            acc[skill] = demon;
        }
        return acc;
    }, {});
    var inheritLs = canInheritIngreds(newIngredLs, comp, inheritElems);
    var inheritRs = canInheritIngreds(newIngredRs, comp, inheritElems);
    var ingredLookup = [targetL, targetR].reduce(function (acc, s) { acc[s] = 1; return acc; }, {});
    var chain1 = createFusionFull(inheritLs.map(function (i) { return i.demon; }), inheritLs.map(function (i) { return i.inherit; }), targetL, comp, squareChart.normalChart, recipeConfig);
    var chain2 = createFusionFull(inheritRs.map(function (i) { return i.demon; }), inheritRs.map(function (i) { return i.inherit; }), targetR, comp, squareChart.normalChart, recipeConfig);
    var stepR = comp.getSpecialNameEntries(result);
    if (stepR.length < 2) {
        var pairR = fissionCalculator
            .getFusions(result, comp, normalChart)
            .find(function (p) { return ingredLookup[p.name1] && ingredLookup[p.name2]; });
        if (pairR) {
            stepR = [pairR.name1, pairR.name2];
        }
    }
    if (stepR.length < 2 && triFissionCalculator) {
        var pairR = triFissionCalculator
            .getFusions(result, comp, squareChart)
            .find(function (_a) {
            var name1 = _a.name1, name2 = _a.name2, name3 = _a.name3;
            return 1 < [name1, name2, name3].reduce(function (acc, n) { return acc + (ingredLookup[n] || 0); }, 0);
        });
        if (pairR) {
            stepR = [pairR.name1, pairR.name2, pairR.name3];
        }
    }
    return {
        skills: Object.assign({}, ingredLs, ingredRs),
        chain1: chain1,
        chain2: chain2,
        stepR: stepR,
        result: result
    };
}
exports.createLeftRightRecipe = createLeftRightRecipe;
function createSkillsRecipe(demon, ingreds, skills, comp, squareChart, recipeConfig) {
    var fissionCalculator = recipeConfig.fissionCalculator, inheritElems = recipeConfig.inheritElems, restrictInherits = recipeConfig.restrictInherits, triFissionCalculator = recipeConfig.triFissionCalculator;
    var normalChart = squareChart.normalChart;
    var demonR = comp.getDemon(demon);
    var triExclusiveRaces = normalChart.races
        .filter(function (r) { return Object.keys(normalChart.getRaceFissions(r)).length === 0; })
        .reduce(function (acc, i) { acc[i] = 1; return acc; }, {});
    var skillRef = {};
    for (var _i = 0, _a = Object.entries(skills); _i < _a.length; _i++) {
        var _b = _a[_i], sname = _b[0], dname = _b[1];
        if (dname !== '-' && dname !== demonR.name) {
            skillRef[sname] = dname;
        }
    }
    var skillsI = Object.keys(skills).map(function (s) { return comp.getSkill(s); });
    var canInheritI = canInheritCode(skillsI.map(function (s) { return s.inherit; }), inheritElems);
    var stepR = comp.getSpecialNameEntries(demon);
    if (stepR.length < 2 && triExclusiveRaces[demonR.race]) {
        var trioR = triFissionCalculator
            .getFusions(demon, comp, squareChart)
            .map(function (p) { return (0, conversions_1.toDemonTrio)(p, comp); })
            .sort(function (a, b) { return a.price - b.price; })
            .find(function (t) {
            return (canInheritI & (t.d1.inherits | t.d2.inherits)) === canInheritI &&
                !triExclusiveRaces[t.d1.race] &&
                !triExclusiveRaces[t.d2.race] &&
                !triExclusiveRaces[t.d3.race];
        });
        if (trioR) {
            stepR = [trioR.d1.name, trioR.d2.name, trioR.d3.name];
        }
    }
    if (stepR.length < 2) {
        var pairR = fissionCalculator
            .getFusions(demon, comp, normalChart)
            .map(function (p) { return (0, conversions_1.toFusionPair)(p, comp); })
            .sort(function (a, b) { return a.price - b.price; })
            .find(function (p) {
            return (canInheritI & (comp.getDemon(p.name1).inherits | comp.getDemon(p.name2).inherits)) === canInheritI &&
                comp.getDemon(p.name1).fusion !== 'accident' &&
                comp.getDemon(p.name2).fusion !== 'accident' &&
                !triExclusiveRaces[comp.getDemon(p.name1).race] &&
                !triExclusiveRaces[comp.getDemon(p.name2).race];
        });
        if (pairR) {
            stepR = [pairR.name1, pairR.name2];
        }
    }
    var ingredsR = stepR.map(function (i) { return comp.getDemon(i); }).sort(function (a, b) { return b.price - a.price; });
    var skillsR = Object.keys(skillRef).map(function (s) { return comp.getSkill(s); });
    var canInheritR = canInheritCode(skillsR.map(function (s) { return s.inherit; }), inheritElems);
    var skillInheritsR = skillsR.map(function (s) { return canInheritCode([s.inherit], inheritElems); });
    var leftIngredR, rightIngredR, inheritScore = 0;
    for (var i = 0; i < ingredsR.length; i++) {
        var leftIngred = ingredsR[i];
        for (var _c = 0, _d = ingredsR.slice(i + 1); _c < _d.length; _c++) {
            var rightIngred = _d[_c];
            if ((canInheritR & (leftIngred.inherits | rightIngred.inherits)) === canInheritR) {
                var leftScore = (canInheritR & leftIngred.inherits).toString(2).split('1').length;
                var rightScore = (canInheritR & rightIngred.inherits).toString(2).split('1').length;
                var totalScore = leftScore * rightScore;
                if (inheritScore < totalScore) {
                    leftIngredR = leftIngred;
                    rightIngredR = rightIngred;
                    inheritScore = totalScore;
                }
            }
        }
    }
    var recipe = { chain1: [], chain2: [], stepR: stepR, skills: skillRef, result: demon };
    if (!leftIngredR) {
        return recipe;
    }
    var skillIngreds = Object.values(skillRef).filter(function (d, i, a) { return a.indexOf(d) === i; });
    var blankIngreds = ingreds.filter(function (d) { return !skillIngreds.includes(d); });
    var halfPoint = Math.ceil(skillIngreds.length / 2);
    skillIngreds.sort(function (a, b) { return normalChart.getLightDark(comp.getDemon(a).race) - normalChart.getLightDark(comp.getDemon(b).race); });
    var leftIngreds = skillIngreds.slice(0, halfPoint);
    var leftInherits = Array(leftIngreds.length).fill(0);
    var rightIngreds = skillIngreds.slice(halfPoint);
    var rightInherits = Array(rightIngreds.length).fill(0);
    if (restrictInherits) {
        var _e = divideInheritSkills(leftIngredR.inherits, rightIngredR.inherits, skillInheritsR, skillsR.map(function (s) { return s.name; })), leftSkills = _e.left, rightSkills = _e.right;
        leftIngreds = leftSkills.map(function (s) { return skillRef[s]; });
        leftInherits = canInheritChain(leftSkills.map(function (s) { return comp.getSkill(s).inherit; }), inheritElems);
        rightIngreds = rightSkills.map(function (s) { return skillRef[s]; });
        rightInherits = canInheritChain(rightSkills.map(function (s) { return comp.getSkill(s).inherit; }), inheritElems);
    }
    halfPoint = Math.ceil(blankIngreds.length / 2);
    leftIngreds = blankIngreds.slice(0, halfPoint).concat(leftIngreds);
    leftInherits = Array(halfPoint).fill(0).concat(leftInherits);
    rightIngreds = blankIngreds.slice(halfPoint).concat(rightIngreds);
    rightInherits = Array(blankIngreds.length - halfPoint).fill(0).concat(rightInherits);
    recipe.chain1 = createFusionFull(leftIngreds, leftInherits, leftIngredR.name, comp, normalChart, recipeConfig);
    recipe.chain2 = createFusionFull(rightIngreds, rightInherits, rightIngredR.name, comp, normalChart, recipeConfig);
    return recipe;
}
exports.createSkillsRecipe = createSkillsRecipe;
function canInheritCode(includeElems, inheritElems) {
    return parseInt(inheritElems.map(function (e) { return includeElems.includes(e) ? '1' : '0'; }).join(''), 2) || 0;
}
function canInheritChain(includeElems, inheritElems) {
    return includeElems.map(function (e, i, a) { return canInheritCode(a.slice(0, i + 1), inheritElems); });
}
function canInheritIngreds(skillRef, comp, inheritElems) {
    var ingredInherits = [];
    var demonLookup = {};
    for (var _i = 0, _a = Object.entries(skillRef); _i < _a.length; _i++) {
        var _b = _a[_i], skill = _b[0], demon = _b[1];
        if (!demonLookup[demon]) {
            demonLookup[demon] = [];
        }
        demonLookup[demon].push(skill);
    }
    for (var _c = 0, _d = Object.entries(demonLookup).sort(function (a, b) { return a[1].length - b[1].length; }).entries(); _c < _d.length; _c++) {
        var _e = _d[_c], i = _e[0], _f = _e[1], demon = _f[0], snames = _f[1];
        var prevCode = i > 0 ? ingredInherits[i - 1].inherit : 0;
        ingredInherits.push({
            demon: demon,
            inherit: prevCode | canInheritCode(snames.map(function (s) { return comp.getSkill(s).element; }), inheritElems)
        });
    }
    return ingredInherits;
}
function divideInheritSkills(leftInherit, rightInherit, skillInherits, skills) {
    var left = [], right = [];
    var leftElems = [], rightElems = [];
    var commands = {};
    var passives = [];
    for (var i = 0; i < skillInherits.length; i++) {
        var elem = skillInherits[i];
        if (elem === 0) {
            passives.push(skills[i]);
            continue;
        }
        if (!commands.hasOwnProperty(elem)) {
            commands[elem] = [];
        }
        commands[elem].push(skills[i]);
    }
    for (var _i = 0, _a = Object.keys(commands).sort(); _i < _a.length; _i++) {
        var inheritStr = _a[_i];
        var canInherit = parseInt(inheritStr);
        if (leftElems.length <= rightElems.length) {
            if ((canInherit & leftInherit) === canInherit) {
                leftElems.push(canInherit);
            }
            else {
                rightElems.push(canInherit);
            }
        }
        else {
            if ((canInherit & rightInherit) === canInherit) {
                rightElems.push(canInherit);
            }
            else {
                leftElems.push(canInherit);
            }
        }
    }
    for (var _b = 0, leftElems_1 = leftElems; _b < leftElems_1.length; _b++) {
        var elem = leftElems_1[_b];
        left = left.concat(commands[elem]);
    }
    for (var _c = 0, rightElems_1 = rightElems; _c < rightElems_1.length; _c++) {
        var elem = rightElems_1[_c];
        right = right.concat(commands[elem]);
    }
    for (var _d = 0, passives_1 = passives; _d < passives_1.length; _d++) {
        var skill = passives_1[_d];
        if (left.length < right.length) {
            left.push(skill);
        }
        else {
            right.push(skill);
        }
    }
    return { left: left.reverse(), right: right.reverse() };
}
function createFusionFull(ingreds, inheritChain, result, comp, chart, recipeConfig) {
    var ingredR = result;
    var chain = [ingredR];
    var specIngreds = comp.getSpecialNameEntries(ingredR);
    var inheritR = inheritChain[inheritChain.length - 1];
    if (specIngreds.length !== 0) {
        ingredR = specIngreds.find(function (d) { return comp.getSpecialNameEntries(d).length === 0; });
        if (!ingredR) {
            return [];
        } // All ingreds are also special fusions
        chain.unshift(specIngreds.filter(function (d) { return d !== ingredR; }).join(' x '));
        chain.unshift(ingredR);
    }
    if (ingreds.length > 0) {
        var chain1 = createFusionChain(ingreds, inheritChain, comp, chart, recipeConfig);
        if (chain1.length === 0) {
            return [];
        }
        var ingred1 = chain1[chain1.length - 1];
        var chain2 = createFusionPath(ingred1, ingredR, inheritR, comp, chart, recipeConfig);
        if (chain2.length === 0) {
            var demonR_1 = comp.getDemon(ingredR);
            var sameRaceR = comp.getResultDemonLvls(demonR_1.race)
                .filter(function (l) { return l < 100; })
                .map(function (l) { return comp.reverseLookupDemon(demonR_1.race, l); })
                .filter(function (i) { return i !== ingredR; });
            for (var _i = 0, _a = chart.elementDemons.concat(sameRaceR); _i < _a.length; _i++) {
                var elem = _a[_i];
                if ((inheritR & comp.getDemon(elem).inherits) !== inheritR) {
                    continue;
                }
                var chain3 = createFusionPath(ingred1, elem, inheritR, comp, chart, recipeConfig);
                var chain4 = createFusionPath(elem, ingredR, inheritR, comp, chart, recipeConfig);
                if (chain3.length !== 0 && chain4.length !== 0) {
                    chain2 = chain3.concat(chain4.slice(1));
                    break;
                }
            }
        }
        if (chain2.length === 0) {
            return [];
        }
        chain = chain1.concat(chain2.slice(1), chain.slice(1));
    }
    return chain;
}
function createFusionPath(ingredA, ingredE, inheritR, comp, chart, recipeConfig) {
    var fissionCalculator = recipeConfig.fissionCalculator, fusionCalculator = recipeConfig.fusionCalculator;
    var chain = [ingredA];
    if (ingredA === ingredE) {
        return chain;
    }
    var pairsA = fusionCalculator
        .getFusions(ingredA, comp, chart)
        .map(function (p) { return (0, conversions_1.toFusionPairResult)(p, comp); })
        .sort(function (a, b) { return a.price - b.price; });
    for (var _i = 0, pairsA_1 = pairsA; _i < pairsA_1.length; _i++) {
        var pairA = pairsA_1[_i];
        if (pairA.name2 === ingredE) {
            chain.push(pairA.name1);
            chain.push(ingredE);
            return chain;
        }
    }
    var pairsE = fissionCalculator
        .getFusions(ingredE, comp, chart)
        .map(function (p) { return (0, conversions_1.toFusionPair)(p, comp); })
        .sort(function (a, b) { return a.price - b.price; });
    pairsA.sort(function (a, b) { return b.price - a.price; });
    var lookupA = pairsA.reduce(function (acc, p) { acc[p.name2] = p.name1; return acc; }, {});
    for (var _a = 0, pairsE_1 = pairsE; _a < pairsE_1.length; _a++) {
        var pairE = pairsE_1[_a];
        if (lookupA[pairE.name1] && (inheritR & comp.getDemon(pairE.name1).inherits) === inheritR) {
            chain.push(lookupA[pairE.name1]);
            chain.push(pairE.name1);
            chain.push(pairE.name2);
            chain.push(ingredE);
            return chain;
        }
        if (lookupA[pairE.name2] && (inheritR & comp.getDemon(pairE.name2).inherits) === inheritR) {
            chain.push(lookupA[pairE.name2]);
            chain.push(pairE.name2);
            chain.push(pairE.name1);
            chain.push(ingredE);
            return chain;
        }
    }
    return [];
}
function createFusionChain(ingreds, inheritChain, comp, chart, recipeConfig) {
    var fusionCalculator = recipeConfig.fusionCalculator;
    var chain = ingreds.slice(0, 1);
    if (ingreds.length < 2) {
        return chain;
    }
    var ingredA = chain[0];
    var inheritA = inheritChain[0];
    for (var i = 1; i < ingreds.length; i++) {
        var ingredD = ingreds[i];
        var inheritD = inheritChain[i];
        var pairsA = fusionCalculator
            .getFusions(ingredA, comp, chart)
            .map(function (p) { return (0, conversions_1.toFusionPairResult)(p, comp); })
            .sort(function (a, b) { return a.price - b.price; });
        var foundPair = false;
        for (var _i = 0, pairsA_2 = pairsA; _i < pairsA_2.length; _i++) {
            var pairA = pairsA_2[_i];
            if (pairA.name1 === ingredD && (inheritD & comp.getDemon(pairA.name2).inherits) === inheritD) {
                chain.push(ingredD);
                chain.push(pairA.name2);
                ingredA = chain[chain.length - 1];
                inheritA = inheritD;
                foundPair = true;
                break;
            }
        }
        if (foundPair) {
            continue;
        }
        var pairsD = fusionCalculator.getFusions(ingredD, comp, chart);
        var lookupD = pairsD.reduce(function (acc, p) { acc[p.name1] = p.name2; return acc; }, {});
        for (var _a = 0, pairsA_3 = pairsA; _a < pairsA_3.length; _a++) {
            var pairA = pairsA_3[_a];
            if (lookupD[pairA.name2] &&
                (inheritA & comp.getDemon(pairA.name2).inherits) === inheritA &&
                (inheritD & comp.getDemon(lookupD[pairA.name2]).inherits) === inheritD) {
                chain.push(pairA.name1);
                chain.push(pairA.name2);
                chain.push(ingredD);
                chain.push(lookupD[pairA.name2]);
                ingredA = chain[chain.length - 1];
                inheritA = inheritD;
                foundPair = true;
                break;
            }
        }
        if (!foundPair) {
            return [];
        }
    }
    return chain;
}
