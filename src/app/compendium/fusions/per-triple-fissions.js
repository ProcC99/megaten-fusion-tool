"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitWithElementPair = exports.splitWithPrevLvl = exports.splitWithSameRace = exports.splitWithDiffRace = void 0;
var per_triple_fusions_1 = require("./per-triple-fusions");
var smt_nonelem_fissions_1 = require("./smt-nonelem-fissions");
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
function splitWithDiffRace(nameR, comp, chart) {
    var normChart = chart.normalChart, trioChart = chart.tripleChart;
    var raceOrder = normChart.raceOrder;
    var _a = comp.getDemon(nameR), raceR = _a.race, lvlR = _a.lvl;
    var lvlMod = 3 * trioChart.lvlModifier;
    var recipes = [];
    var binRs = comp.getResultDemonLvls(raceR);
    var binR = binRs.indexOf(lvlR);
    if (binR === -1) {
        return recipes;
    }
    var fissionT1T2s = {};
    for (var _i = 0, _b = Object.entries(trioChart.getRaceFissions(raceR)); _i < _b.length; _i++) {
        var _c = _b[_i], raceT1 = _c[0], raceT2s = _c[1];
        if (!fissionT1T2s[raceT1]) {
            fissionT1T2s[raceT1] = [];
        }
        for (var _d = 0, raceT2s_1 = raceT2s; _d < raceT2s_1.length; _d++) {
            var raceT2 = raceT2s_1[_d];
            if (!fissionT1T2s[raceT2]) {
                fissionT1T2s[raceT2] = [];
            }
            if (raceT1 !== raceT2) {
                fissionT1T2s[raceT1].push(raceT2);
            }
            fissionT1T2s[raceT2].push(raceT1);
        }
    }
    var fissionT1N1N2s = {};
    for (var _e = 0, _f = Object.entries(fissionT1T2s); _e < _f.length; _e++) {
        var _g = _f[_e], raceT1 = _g[0], raceT2s = _g[1];
        fissionT1N1N2s[raceT1] = {};
        for (var _h = 0, raceT2s_2 = raceT2s; _h < raceT2s_2.length; _h++) {
            var raceT2 = raceT2s_2[_h];
            for (var _j = 0, _k = Object.entries(normChart.getRaceFissions(raceT2)); _j < _k.length; _j++) {
                var _l = _k[_j], raceN1 = _l[0], raceN2s = _l[1];
                if (!fissionT1N1N2s[raceT1][raceN1]) {
                    fissionT1N1N2s[raceT1][raceN1] = [];
                }
                fissionT1N1N2s[raceT1][raceN1] = fissionT1N1N2s[raceT1][raceN1].concat(raceN2s);
            }
        }
        for (var _m = 0, raceT2s_3 = raceT2s; _m < raceT2s_3.length; _m++) {
            var raceT2 = raceT2s_3[_m];
            if (raceT1 !== raceT2) {
                if (!fissionT1N1N2s[raceT1][raceT2]) {
                    fissionT1N1N2s[raceT1][raceT2] = [];
                }
                fissionT1N1N2s[raceT1][raceT2].push(raceT2);
            }
        }
    }
    var minLvlR = binRs[binR - 1] ? 3 * binRs[binR - 1] - lvlMod : 0;
    var maxLvlR = 3 * lvlR - lvlMod;
    for (var _o = 0, _p = Object.entries(fissionT1N1N2s); _o < _p.length; _o++) {
        var _q = _p[_o], raceT1 = _q[0], raceT2s = _q[1];
        for (var _r = 0, _s = comp.getIngredientDemonLvls(raceT1); _r < _s.length; _r++) {
            var lvlT1 = _s[_r];
            var name1 = comp.reverseLookupDemon(raceT1, lvlT1);
            var clvlT1 = comp.getDemon(name1).currLvl;
            if (name1 !== nameR) {
                var minLvlT2 = minLvlR - lvlT1;
                var maxLvlT2 = maxLvlR - lvlT1;
                for (var _t = 0, _u = Object.entries(raceT2s); _t < _u.length; _t++) {
                    var _v = _u[_t], raceN1 = _v[0], raceN2s = _v[1];
                    for (var _w = 0, _x = comp.getIngredientDemonLvls(raceN1); _w < _x.length; _w++) {
                        var lvlN1 = _x[_w];
                        var name2 = comp.reverseLookupDemon(raceN1, lvlN1);
                        var clvlN1 = comp.getDemon(name2).currLvl;
                        if (name2 !== name1 &&
                            name2 !== nameR &&
                            (clvlT1 > clvlN1 || (clvlT1 === clvlN1 && raceOrder[raceT1] < raceOrder[raceN1]))) {
                            var minLvlN2 = minLvlT2 - lvlN1;
                            var maxLvlN2 = maxLvlT2 - lvlN1;
                            for (var _y = 0, raceN2s_1 = raceN2s; _y < raceN2s_1.length; _y++) {
                                var raceN2 = raceN2s_1[_y];
                                for (var _z = 0, _0 = comp.getIngredientDemonLvls(raceN2); _z < _0.length; _z++) {
                                    var lvlN2 = _0[_z];
                                    var name3 = comp.reverseLookupDemon(raceN2, lvlN2);
                                    var clvlN2 = comp.getDemon(name3).currLvl;
                                    if (name3 !== name2 &&
                                        name3 !== name1 &&
                                        name3 !== nameR &&
                                        (raceN1 !== raceN2 || lvlN1 < lvlN2) &&
                                        (clvlT1 > clvlN2 || (clvlT1 === clvlN2 && raceOrder[raceT1] < raceOrder[raceN2]))) {
                                        if (minLvlN2 < lvlN2 && lvlN2 <= maxLvlN2) {
                                            recipes.push({ name1: name1, name2: name2, name3: name3 });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return recipes;
}
exports.splitWithDiffRace = splitWithDiffRace;
function splitWithSameRace(nameR, comp, chart) {
    var normChart = chart.normalChart, trioChart = chart.tripleChart;
    var _a = comp.getDemon(nameR), raceR = _a.race, lvlR = _a.lvl;
    var lvlMod = trioChart.lvlModifier;
    var recipes = [];
    var lvlT1s = comp.getIngredientDemonLvls(raceR).filter(function (lvl) { return lvl !== lvlR; });
    var lvlRs = comp.getResultDemonLvls(raceR);
    var _loop_1 = function (i) {
        var lvlT1 = lvlT1s[i];
        var binN1s = lvlRs.filter(function (lvl) { return lvl !== lvlT1; });
        var name1 = comp.reverseLookupDemon(raceR, lvlT1);
        var _loop_2 = function (j) {
            var lvlN1 = lvlT1s[j];
            var binN2s = binN1s.filter(function (lvl) { return lvl !== lvlN1; });
            var name2 = comp.reverseLookupDemon(raceR, lvlN1);
            var _loop_3 = function (k) {
                var lvlN2 = lvlT1s[k];
                var binRs = binN2s.filter(function (lvl) { return lvl !== lvlN2; });
                var name3 = comp.reverseLookupDemon(raceR, lvlN2);
                var lvlRp = (lvlT1 + lvlN1 + lvlN2) / 3 + lvlMod;
                var binR = findBin(lvlRp, binRs);
                if (binR !== -1 && binRs[binR] === lvlR) {
                    recipes.push({ name1: name1, name2: name2, name3: name3 });
                }
            };
            for (var k = j + 1; k < lvlT1s.length; k++) {
                _loop_3(k);
            }
        };
        for (var j = i + 1; j < lvlT1s.length; j++) {
            _loop_2(j);
        }
    };
    for (var i = 0; i < lvlT1s.length; i++) {
        _loop_1(i);
    }
    return recipes;
}
exports.splitWithSameRace = splitWithSameRace;
function splitWithPrevLvl(nameR, comp, chart) {
    var _a = comp.getDemon(nameR), raceR = _a.race, lvlR = _a.lvl;
    var lvlRs = comp.getResultDemonLvls(raceR).slice();
    if (0 < lvlRs.indexOf(lvlR)) {
        var prevNameR_1 = comp.reverseLookupDemon(raceR, lvlRs[lvlRs.indexOf(lvlR) - 1]);
        var rankUpRs = [].concat((0, per_triple_fusions_1.fuseT1WithDiffRace)(prevNameR_1, comp, chart).filter(function (trio) { return trio.name3 === nameR; }), (0, per_triple_fusions_1.fuseN1WithDiffRace)(prevNameR_1, comp, chart).filter(function (trio) { return trio.name3 === nameR; }));
        return rankUpRs.map(function (trio) { return ({ name1: trio.name1, name2: trio.name2, name3: prevNameR_1 }); });
    }
    else {
        return [];
    }
}
exports.splitWithPrevLvl = splitWithPrevLvl;
function splitWithElementPair(name, comp, chart) {
    return (0, smt_nonelem_fissions_1.splitWithElement)(name, comp, chart.tripleChart).map(function (pair) {
        var _a = pair.name2.split(' x '), name2 = _a[0], name3 = _a[1];
        return { name1: pair.name1, name2: name2, name3: name3 };
    });
}
exports.splitWithElementPair = splitWithElementPair;
