"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtFusionChart = void 0;
var SmtFusionChart = exports.SmtFusionChart = /** @class */ (function () {
    function SmtFusionChart() {
    }
    SmtFusionChart.loadFusionTableJson = function (races, table) {
        var fusionTable = {};
        var isInverted = table[0].length === 1;
        for (var _i = 0, races_1 = races; _i < races_1.length; _i++) {
            var race = races_1[_i];
            fusionTable[race] = {};
        }
        for (var r = 0; r < table.length; r++) {
            var raceA = races[r];
            var row = table[r];
            var cOffset = isInverted ? 0 : races.length - row.length;
            for (var c = 0; c < row.length; c++) {
                var raceB = races[c + cOffset];
                var raceR = row[c];
                if (raceR !== '-') {
                    fusionTable[raceA][raceB] = raceR;
                    fusionTable[raceB][raceA] = raceR;
                }
            }
        }
        return fusionTable;
    };
    SmtFusionChart.loadFissionTableJson = function (races, elems, table) {
        var fissionTable = {};
        var isInverted = table[0].length === 1;
        for (var r = 0; r < table.length; r++) {
            var raceA = races[r];
            var row = table[r];
            var cOffset = isInverted ? 0 : races.length - row.length;
            for (var c = 0; c < row.length; c++) {
                var raceB = races[c + cOffset];
                var raceR = row[c];
                if (raceR !== '-') {
                    if (!fissionTable[raceR]) {
                        fissionTable[raceR] = {};
                    }
                    if (!fissionTable[raceR][raceA]) {
                        fissionTable[raceR][raceA] = [];
                    }
                    fissionTable[raceR][raceA].push(raceB);
                }
            }
        }
        return fissionTable;
    };
    SmtFusionChart.loadElementTableJson = function (races, elems, table) {
        var elementTable = {};
        for (var _i = 0, elems_1 = elems; _i < elems_1.length; _i++) {
            var elem = elems_1[_i];
            elementTable[elem] = {};
        }
        for (var r = 0; r < table.length; r++) {
            var race = races[r];
            var row = table[r];
            for (var c = 0; c < row.length; c++) {
                var elem = elems[c];
                var modi = table[r][c];
                if (modi) {
                    elementTable[elem][race] = modi;
                }
            }
        }
        return elementTable;
    };
    SmtFusionChart.mergeFusionTables = function (table1, table2) {
        var table = {};
        for (var _i = 0, _a = Object.entries(table1); _i < _a.length; _i++) {
            var _b = _a[_i], raceA = _b[0], raceBs = _b[1];
            table[raceA] = Object.assign({}, raceBs);
        }
        for (var _c = 0, _d = Object.entries(table2); _c < _d.length; _c++) {
            var _e = _d[_c], raceA = _e[0], raceBs = _e[1];
            table[raceA] = Object.assign(table[raceA] || {}, raceBs);
        }
        return table;
    };
    SmtFusionChart.mergeFissionTables = function (table1, table2) {
        var table = {};
        for (var _i = 0, _a = Object.entries(table1); _i < _a.length; _i++) {
            var _b = _a[_i], raceR = _b[0], raceAs = _b[1];
            table[raceR] = {};
            for (var _c = 0, _d = Object.entries(raceAs); _c < _d.length; _c++) {
                var _e = _d[_c], raceA = _e[0], raceBs = _e[1];
                table[raceR][raceA] = raceBs.slice();
            }
        }
        for (var _f = 0, _g = Object.entries(table2); _f < _g.length; _f++) {
            var _h = _g[_f], raceR = _h[0], raceAs = _h[1];
            table[raceR] = table[raceR] || {};
            for (var _j = 0, _k = Object.entries(raceAs); _j < _k.length; _j++) {
                var _l = _k[_j], raceA = _l[0], raceBs = _l[1];
                table[raceR][raceA] = raceBs.concat(table[raceR][raceA] || []);
            }
        }
        return table;
    };
    SmtFusionChart.prototype.getLightDark = function (race) {
        if (SmtFusionChart.LIGHT_RACES.indexOf(race) !== -1) {
            return 1;
        }
        else if (SmtFusionChart.DARK_RACES.indexOf(race) !== -1) {
            return -1;
        }
        else {
            return 0;
        }
    };
    SmtFusionChart.prototype.getRaceFissions = function (race) {
        return this.fissionChart[race] || {};
    };
    SmtFusionChart.prototype.getRaceFusions = function (race) {
        return this.fusionChart[race] || {};
    };
    SmtFusionChart.prototype.getRaceFusion = function (raceA, raceB) {
        return this.getRaceFusions(raceA)[raceB] || '';
    };
    SmtFusionChart.prototype.getElemModifiers = function (race) {
        var modifiers = {};
        for (var _i = 0, _a = Object.entries(this.elementChart); _i < _a.length; _i++) {
            var _b = _a[_i], elem = _b[0], races = _b[1];
            var mod = races[race];
            if (mod) {
                if (!modifiers[mod]) {
                    modifiers[mod] = [];
                }
                modifiers[mod].push(elem);
            }
        }
        return modifiers;
    };
    SmtFusionChart.prototype.getElemFusions = function (elem) {
        return this.elementChart[elem] || {};
    };
    SmtFusionChart.prototype.isConvertedRace = function (race) {
        return false;
    };
    SmtFusionChart.LIGHT_RACES = [
        'Herald', 'Megami', 'Avian', 'Tree',
        'Deity', 'Avatar', 'Holy', 'Genma',
        'Fury', 'Lady', 'Dragon', 'Kishin',
        'Enigma', 'Geist', 'Entity',
        'Amatsu', 'Kunitsu', 'Godly', 'Chaos'
    ];
    SmtFusionChart.DARK_RACES = [
        'Vile', 'Raptor', 'Wood',
        'Reaper', 'Wilder', 'Jaki', 'Vermin',
        'Tyrant', 'Drake', 'Spirit',
        'Haunt', 'Ghost', 'Zealot'
    ];
    return SmtFusionChart;
}());
