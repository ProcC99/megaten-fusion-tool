"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuseWithElementPair = exports.fuseWithSameRace = exports.fuseN1WithDiffRace = exports.fuseT1WithDiffRace = void 0;
var smt_nonelem_fusions_1 = require("./smt-nonelem-fusions");
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
    return index === bins.length ? -1 : index;
}
function fuseT1WithDiffRace(nameT1, comp, chart) {
    var normChart = chart.normalChart, trioChart = chart.tripleChart;
    var raceOrder = normChart.raceOrder;
    var _a = comp.getDemon(nameT1), raceT1 = _a.race, lvlT1 = _a.lvl, clvlT1 = _a.currLvl;
    var lvlMod = 3 * trioChart.lvlModifier;
    var recipes = [];
    var fusionT2Rs = trioChart.getRaceFusions(raceT1);
    var fusionN1N2Rs = {};
    for (var _i = 0, _b = Object.entries(fusionT2Rs); _i < _b.length; _i++) {
        var _c = _b[_i], raceT2 = _c[0], raceR = _c[1];
        if (!fusionN1N2Rs[raceT2]) {
            fusionN1N2Rs[raceT2] = {};
        }
        if (raceT1 !== raceT2) {
            fusionN1N2Rs[raceT2][raceT2] = raceR;
        }
        for (var _d = 0, _e = Object.entries(normChart.getRaceFissions(raceT2)); _d < _e.length; _d++) {
            var _f = _e[_d], raceN1 = _f[0], raceN2s = _f[1];
            if (!fusionN1N2Rs[raceN1]) {
                fusionN1N2Rs[raceN1] = {};
            }
            for (var _g = 0, raceN2s_1 = raceN2s; _g < raceN2s_1.length; _g++) {
                var raceN2 = raceN2s_1[_g];
                fusionN1N2Rs[raceN1][raceN2] = raceR;
            }
        }
    }
    for (var _h = 0, _j = Object.entries(fusionN1N2Rs); _h < _j.length; _h++) {
        var _k = _j[_h], raceN1 = _k[0], raceN2s = _k[1];
        var _loop_1 = function (lvlN1) {
            var name1 = comp.reverseLookupDemon(raceN1, lvlN1);
            var clvlN1 = comp.getDemon(name1).currLvl;
            if (name1 !== nameT1 &&
                (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1]))) {
                for (var _o = 0, _p = Object.entries(raceN2s); _o < _p.length; _o++) {
                    var _q = _p[_o], raceN2 = _q[0], raceR = _q[1];
                    var lvlRs = comp.getResultDemonLvls(raceR);
                    var binN2s = lvlRs.map(function (lvl) { return 3 * lvl - lvlMod - lvlT1 - lvlN1; });
                    for (var _r = 0, _s = comp.getIngredientDemonLvls(raceN2); _r < _s.length; _r++) {
                        var lvlN2 = _s[_r];
                        var name2 = comp.reverseLookupDemon(raceN2, lvlN2);
                        var clvlN2 = comp.getDemon(name2).currLvl;
                        if (name2 !== name1 &&
                            name2 !== nameT1 &&
                            (raceN1 !== raceN2 || lvlN1 < lvlN2) &&
                            (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))) {
                            if (comp.isElementDemon(raceR)) {
                                recipes.push({ name1: name1, name2: name2, name3: raceR });
                            }
                            else {
                                var binN2 = findBin(lvlN2, binN2s);
                                if (binN2 !== -1) {
                                    var name3 = comp.reverseLookupDemon(raceR, lvlRs[binN2]);
                                    if (name3 !== name2 && name3 !== name1 && name3 !== nameT1) {
                                        recipes.push({ name1: name1, name2: name2, name3: name3 });
                                    }
                                    else if (binN2 + 1 < lvlRs.length) {
                                        recipes.push({ name1: name1, name2: name2, name3: comp.reverseLookupDemon(raceR, lvlRs[binN2 + 1]) });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        for (var _l = 0, _m = comp.getIngredientDemonLvls(raceN1); _l < _m.length; _l++) {
            var lvlN1 = _m[_l];
            _loop_1(lvlN1);
        }
    }
    return recipes;
}
exports.fuseT1WithDiffRace = fuseT1WithDiffRace;
function fuseN1WithDiffRace(nameN1, comp, chart) {
    var normChart = chart.normalChart, trioChart = chart.tripleChart;
    var raceOrder = normChart.raceOrder;
    var _a = comp.getDemon(nameN1), raceN1 = _a.race, lvlN1 = _a.lvl, clvlN1 = _a.currLvl;
    var lvlMod = 3 * trioChart.lvlModifier;
    var recipes = [];
    var fusionN2T1Rs = {};
    fusionN2T1Rs[raceN1] = Object.assign({}, trioChart.getRaceFusions(raceN1));
    delete fusionN2T1Rs[raceN1][raceN1];
    for (var _i = 0, _b = Object.entries(normChart.getRaceFusions(raceN1)); _i < _b.length; _i++) {
        var _c = _b[_i], raceN2 = _c[0], raceT2 = _c[1];
        fusionN2T1Rs[raceN2] = trioChart.getRaceFusions(raceT2);
    }
    for (var _d = 0, _e = Object.entries(fusionN2T1Rs); _d < _e.length; _d++) {
        var _f = _e[_d], raceN2 = _f[0], raceT1s = _f[1];
        var _loop_2 = function (lvlN2) {
            var name1 = comp.reverseLookupDemon(raceN2, lvlN2);
            var clvlN2 = comp.getDemon(name1).currLvl;
            if (name1 !== nameN1) {
                for (var _j = 0, _k = Object.entries(raceT1s); _j < _k.length; _j++) {
                    var _l = _k[_j], raceT1 = _l[0], raceR = _l[1];
                    var lvlRs = comp.getResultDemonLvls(raceR);
                    var binT1s = lvlRs.map(function (lvl) { return 3 * lvl - lvlMod - lvlN1 - lvlN2; });
                    for (var _m = 0, _o = comp.getIngredientDemonLvls(raceT1); _m < _o.length; _m++) {
                        var lvlT1 = _o[_m];
                        var name2 = comp.reverseLookupDemon(raceT1, lvlT1);
                        var clvlT1 = comp.getDemon(name2).currLvl;
                        if (name2 !== name1 &&
                            name2 !== nameN1 &&
                            (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1])) &&
                            (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))) {
                            if (comp.isElementDemon(raceR)) {
                                recipes.push({ name1: name1, name2: name2, name3: raceR });
                            }
                            else {
                                var binT1 = findBin(lvlT1, binT1s);
                                if (binT1 !== -1) {
                                    var name3 = comp.reverseLookupDemon(raceR, lvlRs[binT1]);
                                    if (name3 !== name2 && name3 !== name1 && name3 !== nameN1) {
                                        recipes.push({ name1: name1, name2: name2, name3: name3 });
                                    }
                                    else if (binT1 + 1 < lvlRs.length) {
                                        recipes.push({ name1: name1, name2: name2, name3: comp.reverseLookupDemon(raceR, lvlRs[binT1 + 1]) });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        for (var _g = 0, _h = comp.getIngredientDemonLvls(raceN2); _g < _h.length; _g++) {
            var lvlN2 = _h[_g];
            _loop_2(lvlN2);
        }
    }
    return recipes;
}
exports.fuseN1WithDiffRace = fuseN1WithDiffRace;
function fuseWithSameRace(nameN1, comp, chart) {
    var normChart = chart.normalChart, trioChart = chart.tripleChart;
    var _a = comp.getDemon(nameN1), raceN1 = _a.race, lvlN1 = _a.lvl;
    var raceR = trioChart.getRaceFusions(raceN1)[raceN1];
    var recipes = [];
    if (!raceR) {
        return recipes;
    }
    var lvlT1s = comp.getIngredientDemonLvls(raceN1).filter(function (lvl) { return lvl !== lvlN1; });
    var binT1s = comp.getResultDemonLvls(raceN1).filter(function (lvl) { return lvl !== lvlN1; });
    var lvlMod = trioChart.lvlModifier;
    var _loop_3 = function (i) {
        var lvlT1 = lvlT1s[i];
        var binN2s = binT1s.filter(function (lvl) { return lvl !== lvlT1; });
        var name1 = comp.reverseLookupDemon(raceN1, lvlT1);
        var _loop_4 = function (j) {
            var lvlN2 = lvlT1s[j];
            var binRs = binN2s.filter(function (lvl) { return lvl !== lvlN2; });
            var name2 = comp.reverseLookupDemon(raceN1, lvlN2);
            if (comp.isElementDemon(raceR)) {
                recipes.push({ name1: name1, name2: name2, name3: raceR });
            }
            else {
                var lvlRp = (lvlT1 + lvlN1 + lvlN2) / 3 + lvlMod;
                var binR = findBin(lvlRp, binRs);
                if (binR !== -1) {
                    recipes.push({
                        name1: name1,
                        name2: name2,
                        name3: comp.reverseLookupDemon(raceN1, binRs[binR])
                    });
                }
            }
        };
        for (var j = i + 1; j < lvlT1s.length; j++) {
            _loop_4(j);
        }
    };
    for (var i = 0; i < lvlT1s.length; i++) {
        _loop_3(i);
    }
    return recipes;
}
exports.fuseWithSameRace = fuseWithSameRace;
function fuseWithElementPair(name, comp, chart) {
    return (0, smt_nonelem_fusions_1.fuseWithElement)(name, comp, chart.tripleChart).map(function (pair) {
        var _a = pair.name1.split(' x '), name1 = _a[0], name2 = _a[1];
        return { name1: name1, name2: name2, name3: pair.name2 };
    });
}
exports.fuseWithElementPair = fuseWithElementPair;
