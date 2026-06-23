"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompendiumModule = exports.createCompConfig = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var compendium_routing_module_1 = require("./compendium-routing.module");
var fusion_data_service_1 = require("../smt4f/fusion-data.service");
var skill_fusion_generator_component_1 = require("./components/skill-fusion-generator.component");
var constants_1 = require("../compendium/constants");
var smt4_compendium_module_1 = require("../smt4f/smt4-compendium.module");
var skill_importer_1 = require("../pq2/models/skill-importer");
var comp_config_json_1 = __importDefault(require("./data/comp-config.json"));
var fusion_chart_json_1 = __importDefault(require("./data/fusion-chart.json"));
var element_chart_json_1 = __importDefault(require("./data/element-chart.json"));
var special_recipes_json_1 = __importDefault(require("./data/special-recipes.json"));
var price_pbox_json_1 = __importDefault(require("./data/price-pbox.json"));
var van_demon_data_json_1 = __importDefault(require("./data/van-demon-data.json"));
var van_skill_data_json_1 = __importDefault(require("./data/van-skill-data.json"));
var van_demon_unlocks_json_1 = __importDefault(require("./data/van-demon-unlocks.json"));
var ove_demon_data_json_1 = __importDefault(require("./data/ove-demon-data.json"));
var ove_skill_data_json_1 = __importDefault(require("./data/ove-skill-data.json"));
var ove_demon_unlocks_json_1 = __importDefault(require("./data/ove-demon-unlocks.json"));
function estimateDesuPrice(demon, statPrices, skillPrices) {
    var stats = demon.stats;
    var statPrice = statPrices[stats.slice(stats.length - 4).reduce(function (acc, s) { return acc + s; }, 0)];
    var skills = demon.skills;
    var skillPrice = Object.entries(skills).reduce(function (acc, _a) {
        var sname = _a[0], slvl = _a[1];
        return acc + (slvl < 2 ? skillPrices[sname] : 0);
    }, 0);
    return statPrice + skillPrice + (demon.race === 'Element' ? 1000 : demon.race === 'Mitama' ? 3000 : 0);
}
function createCompConfig() {
    var races = comp_config_json_1.default.races;
    var resistElems = comp_config_json_1.default.resistElems;
    var skillElems = resistElems.concat(comp_config_json_1.default.skillElems);
    var compConfigs = {};
    var skillData = [];
    var statPrices = Array(price_pbox_json_1.default.statTable.length + 1).fill(0);
    var skillRanks = Array(price_pbox_json_1.default.skillTable.length + 1).fill(0);
    var skillPrices = {};
    statPrices[0] = price_pbox_json_1.default.statBase;
    var statStep = price_pbox_json_1.default.statStep;
    for (var i = 1; i < statPrices.length; i++) {
        statStep += price_pbox_json_1.default.statTable[i - 1];
        statPrices[i] = statPrices[i - 1] + statStep;
    }
    for (var i = 1; i < skillRanks.length; i++) {
        skillRanks[i] = skillRanks[i - 1] + price_pbox_json_1.default.skillTable[i - 1];
    }
    var COST_HP = 2 << 10;
    var COST_MP = (3 << 10) - 1000;
    for (var _i = 0, _a = [van_skill_data_json_1.default, ove_skill_data_json_1.default]; _i < _a.length; _i++) {
        var skillJson = _a[_i];
        var gameSkills = {};
        skillData.push(gameSkills);
        for (var _b = 0, _c = Object.values(skillJson); _b < _c.length; _b++) {
            var row = _c[_b];
            var _d = row.a, sname = _d[0], element = _d[1], target = _d[2], nums = row.b, descs = row.c;
            var _e = nums.slice(0, 2), rank = _e[0], cost = _e[1];
            var card = descs[2];
            skillPrices[sname] = skillRanks[rank];
            gameSkills[sname] = {
                element: element,
                rank: rank,
                target: target === '-' ? 'Self' : target,
                cost: cost ? cost + (cost > 1000 ? COST_MP : COST_HP) : 0,
                effect: (0, skill_importer_1.skillRowToEffect)(nums, descs, false),
            };
        }
    }
    for (var _f = 0, _g = [van_demon_data_json_1.default, ove_demon_data_json_1.default]; _f < _g.length; _f++) {
        var demonJson = _g[_f];
        for (var _h = 0, _j = Object.values(demonJson); _h < _j.length; _h++) {
            var entry = _j[_h];
            entry['price'] = estimateDesuPrice(entry, statPrices, skillPrices) / 2;
        }
    }
    for (var _k = 0, _l = ['ds1', 'dso']; _k < _l.length; _k++) {
        var game = _l[_k];
        compConfigs[game] = {
            appTitle: 'Devil Survivor',
            races: comp_config_json_1.default.races,
            raceOrder: comp_config_json_1.default.races.reduce(function (acc, t, i) { acc[t] = i; return acc; }, {}),
            appCssClasses: ['smt4', 'ds1'],
            lang: 'en',
            affinityElems: [],
            skillData: skillData.slice(0, 1),
            fusionSpells: {},
            skillElems: skillElems,
            elemOrder: skillElems.reduce(function (acc, t, i) { acc[t] = i; return acc; }, {}),
            resistCodes: comp_config_json_1.default.resistCodes,
            affinityBonuses: { costs: [], upgrades: [] },
            lvlModifier: 0.5,
            maxSkillSlots: 6,
            hasLightDark: false,
            hasSkillRanks: true,
            hasNonelemInheritance: false,
            demonData: [van_demon_data_json_1.default],
            evolveData: {},
            alignments: {},
            baseStats: comp_config_json_1.default.baseStats,
            resistElems: comp_config_json_1.default.resistElems,
            ailmentElems: [],
            demonUnlocks: van_demon_unlocks_json_1.default,
            normalTable: fusion_chart_json_1.default,
            elementTable: element_chart_json_1.default,
            specialRecipes: special_recipes_json_1.default,
            settingsKey: 'ds1-fusion-tool-settings',
            settingsVersion: 2401131500,
            defaultRecipeDemon: 'Pixie',
            elementRace: 'Element'
        };
    }
    compConfigs.dso.appTitle = 'Devil Survivor Overclocked';
    compConfigs.dso.appCssClasses = ['smt4', 'dso'];
    compConfigs.dso.settingsKey = 'dso-fusion-tool-settings';
    compConfigs.dso.demonData = [van_demon_data_json_1.default, ove_demon_data_json_1.default];
    compConfigs.dso.skillData = skillData;
    compConfigs.dso.demonUnlocks = van_demon_unlocks_json_1.default.concat(ove_demon_unlocks_json_1.default);
    return {
        appTitle: 'Devil Survivor',
        raceOrder: races.reduce(function (acc, x, i) { acc[x] = i; return acc; }, {}),
        configs: compConfigs
    };
}
exports.createCompConfig = createCompConfig;
var SMT_COMP_CONFIG = createCompConfig();
var CompendiumModule = exports.CompendiumModule = function () {
    var _classDecorators = [(0, core_1.NgModule)({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                smt4_compendium_module_1.Smt4CompendiumModule,
                compendium_routing_module_1.DesuCompendiumRoutingModule
            ],
            declarations: [
                skill_fusion_generator_component_1.SkillFusionGeneratorComponent
            ],
            providers: [
                platform_browser_1.Title,
                fusion_data_service_1.FusionDataService,
                [{ provide: constants_1.FUSION_DATA_SERVICE, useExisting: fusion_data_service_1.FusionDataService }],
                [{ provide: constants_1.COMPENDIUM_CONFIG, useValue: SMT_COMP_CONFIG }]
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CompendiumModule = _classThis = /** @class */ (function () {
        function CompendiumModule_1() {
        }
        return CompendiumModule_1;
    }());
    __setFunctionName(_classThis, "CompendiumModule");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        CompendiumModule = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompendiumModule = _classThis;
}();
