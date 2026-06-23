"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMitamaNamePairs = exports.toDemonTrioResult = exports.toDemonTrio = exports.toFusionPairResult = exports.toFusionPair = exports.toFusionEntry = void 0;
function toFusionEntry(name, compendium) {
    var demon = compendium.getDemon(name);
    return {
        price: demon.price,
        race1: demon.race,
        lvl1: demon.currLvl,
        name1: name
    };
}
exports.toFusionEntry = toFusionEntry;
function toFusionPair(names, compendium) {
    var demon1 = compendium.getDemon(names.name1);
    var demon2 = compendium.getDemon(names.name2);
    return {
        price: demon1.price + demon2.price,
        race1: demon1.race,
        lvl1: demon1.currLvl,
        name1: names.name1,
        race2: demon2.race,
        lvl2: demon2.currLvl,
        name2: names.name2
    };
}
exports.toFusionPair = toFusionPair;
function toFusionPairResult(names, compendium) {
    var demon1 = compendium.getDemon(names.name1);
    var demon2 = compendium.getDemon(names.name2);
    return {
        price: demon1.price,
        race1: demon1.race,
        lvl1: demon1.currLvl,
        name1: names.name1,
        race2: demon2.race,
        lvl2: demon2.lvl,
        name2: names.name2
    };
}
exports.toFusionPairResult = toFusionPairResult;
function toDemonTrio(names, compendium) {
    var d1 = compendium.getDemon(names.name1);
    var d2 = compendium.getDemon(names.name2);
    var d3 = compendium.getDemon(names.name3);
    return {
        price: d1.price + d2.price + d3.price,
        d1: d1,
        d2: d2,
        d3: d3
    };
}
exports.toDemonTrio = toDemonTrio;
function toDemonTrioResult(names, compendium) {
    var d1 = compendium.getDemon(names.name1);
    var d2 = compendium.getDemon(names.name2);
    var d3 = compendium.getDemon(names.name3);
    return {
        price: d1.price + d2.price,
        d1: d1,
        d2: d2,
        d3: d3
    };
}
exports.toDemonTrioResult = toDemonTrioResult;
function toMitamaNamePairs(elemDemons, mitamaTable) {
    var namePairs = {};
    if (!mitamaTable) {
        return namePairs;
    }
    for (var i = 0; i < mitamaTable.length; i++) {
        for (var j = 0; j < mitamaTable[i].length - 1; j++) {
            var nameR = mitamaTable[i][j];
            if (!namePairs[nameR]) {
                namePairs[nameR] = [];
            }
            namePairs[nameR].push({ name1: elemDemons[j], name2: elemDemons[i] });
        }
    }
    return namePairs;
}
exports.toMitamaNamePairs = toMitamaNamePairs;
