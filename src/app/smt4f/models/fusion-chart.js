"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionChart = void 0;
var smt_fusion_chart_1 = require("../../compendium/models/smt-fusion-chart");
var FusionChart = exports.FusionChart = /** @class */ (function (_super) {
    __extends(FusionChart, _super);
    function FusionChart(compConfig) {
        var _this = _super.call(this) || this;
        _this.initCharts(compConfig);
        return _this;
    }
    FusionChart.prototype.initCharts = function (compConfig) {
        var races = compConfig.normalTable['races'];
        var table = compConfig.normalTable['table'];
        var elems = compConfig.elementTable['elems'];
        var elemRaces = compConfig.elementTable['races'];
        var elemTable = compConfig.elementTable['table'];
        this.lvlModifier = compConfig.lvlModifier;
        this.elementDemons = elems;
        this.fusionChart = smt_fusion_chart_1.SmtFusionChart.loadFusionTableJson(races, table);
        this.fissionChart = smt_fusion_chart_1.SmtFusionChart.loadFissionTableJson(races, elems, table);
        this.elementChart = smt_fusion_chart_1.SmtFusionChart.loadElementTableJson(elemRaces, elems, elemTable);
        this.races = races;
        this.raceOrder = compConfig.raceOrder;
        if (compConfig.appCssClasses.includes('smtsj')) {
            for (var _i = 0, _a = Object.entries({ Beast: 'UMA', Genma: 'Fiend', Deity: 'Enigma' }); _i < _a.length; _i++) {
                var _b = _a[_i], raceR = _b[0], raceQ = _b[1];
                this.fissionChart[raceQ] = this.fissionChart[raceR];
            }
        }
    };
    FusionChart.prototype.getLightDark = function (race) {
        if (FusionChart.LIGHT_RACES.indexOf(race) !== -1) {
            return 1;
        }
        if (FusionChart.DARK_RACES.indexOf(race) !== -1) {
            return -1;
        }
        return 0;
    };
    FusionChart.LIGHT_RACES = [
        'Herald', 'Megami', 'Avian', 'Tree',
        'Deity', 'Avatar', 'Holy', 'Genma',
        'Fury', 'Lady', 'Dragon', 'Kishin',
        'Enigma', 'Entity', 'Wargod',
        'Amatsu', 'Kunitsu', 'Godly', 'Chaos', 'Geist',
        '大天使', '女神', '霊鳥', '神樹',
        '魔神', '神獣', '聖獣', '幻魔',
        '破壊神', '地母神', '龍神', '鬼神',
        '秘神', '威霊', '軍神',
        '天津神', '国津神', '神霊', '混沌王',
    ];
    FusionChart.DARK_RACES = [
        'Vile', 'Raptor', 'Wood',
        'Reaper', 'Wilder', 'Jaki', 'Vermin',
        'Tyrant', 'Drake', 'Spirit',
        'Haunt', 'Ghost', 'Zealot',
        '邪神', '凶鳥', '妖樹',
        '死神', '妖獣', '邪鬼', '幽虫',
        '魔王', '邪龍', '悪霊',
        '幽鬼', '幽鬼', '狂神'
    ];
    return FusionChart;
}(smt_fusion_chart_1.SmtFusionChart));
