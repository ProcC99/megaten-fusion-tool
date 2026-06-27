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
exports.FusionDataService = void 0;
var core_1 = require("@angular/core");
var compendium_1 = require("./models/compendium");
var fusion_chart_1 = require("./models/fusion-chart");
var constants_1 = require("../compendium/constants");
var configurable_fusion_data_service_1 = require("../compendium/bases/configurable-fusion-data.service");
var fusion_settings_1 = require("../compendium/models/fusion-settings");
var translator_1 = require("../compendium/models/translator");
var translations_json_1 = __importDefault(require("../compendium/data/translations.json"));
var FusionDataService = exports.FusionDataService = function () {
    var _classDecorators = [(0, core_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FusionDataService = _classThis = /** @class */ (function (_super) {
        __extends(FusionDataService_1, _super);
        function FusionDataService_1(compConfigSet, translator, router) {
            var _this = this;
            var parts = router.url.split('/');
            var defaultGame = Object.keys(compConfigSet.configs)[0];
            var compConfig = compConfigSet.configs[parts[2] || parts[1]] ||
                compConfigSet.configs[parts[1]] ||
                compConfigSet.configs[defaultGame];
            var lang = translator.supportedLanguages.includes(parts[1]) ? parts[1] : 'en';
            var dummyRecipe = { '-': [compConfig.defaultRecipeDemon] };
            var races = translator.translateRaces(compConfig.races, lang);
            var newCompConfig = {
                appTitle: translator.translateAppTitle(compConfig.appTitle, lang),
                lang: lang,
                races: races,
                raceOrder: races.reduce(function (acc, t, i) { acc[t] = i; return acc; }, {}),
                appCssClasses: compConfig.appCssClasses,
                affinityElems: compConfig.affinityElems,
                skillData: compConfig.skillData.map(function (d) { return translator.translateSkillData(d, lang); }),
                skillElems: compConfig.skillElems,
                elemOrder: compConfig.elemOrder,
                resistCodes: compConfig.resistCodes,
                affinityBonuses: compConfig.affinityBonuses,
                lvlModifier: compConfig.lvlModifier,
                maxSkillSlots: compConfig.maxSkillSlots,
                hasLightDark: compConfig.hasLightDark,
                hasSkillRanks: compConfig.hasSkillRanks,
                hasNonelemInheritance: compConfig.hasNonelemInheritance,
                demonData: compConfig.demonData.map(function (d) { return translator.translateDemonData(d, lang); }),
                fusionSpells: translator.translateFusionSpells(compConfig.fusionSpells, lang),
                evolveData: translator.translateEvolutions(compConfig.evolveData, lang),
                alignments: compConfig.alignments,
                baseStats: translator.translateElems(compConfig.baseStats, lang),
                resistElems: compConfig.resistElems,
                ailmentElems: translator.translateElems(compConfig.ailmentElems, lang),
                demonUnlocks: translator.translateDemonUnlocks(compConfig.demonUnlocks, lang),
                normalTable: translator.translateFusionChart(compConfig.normalTable, lang),
                elementTable: translator.translateFusionChart(compConfig.elementTable, lang),
                specialRecipes: translator.translateSpecialRecipes(compConfig.specialRecipes, lang),
                defaultRecipeDemon: translator.translateSpecialRecipes(dummyRecipe, lang)['-'][0],
                elementRace: translator.translateRaces([compConfig.elementRace], lang)[0],
                settingsKey: translator.translateSettingsKey(compConfig.settingsKey, lang),
                settingsVersion: compConfig.settingsVersion
            };
            var fusionSettings = new fusion_settings_1.FusionSettings(newCompConfig.demonUnlocks, []);
            _this = _super.call(this, new compendium_1.Compendium(newCompConfig, fusionSettings.demonToggles), new fusion_chart_1.FusionChart(newCompConfig), fusionSettings, newCompConfig.settingsKey, newCompConfig.settingsVersion) || this;
            _this.fissionCalculator = constants_1.SMT_NORMAL_FISSION_CALCULATOR;
            _this.fusionCalculator = constants_1.SMT_NORMAL_FUSION_CALCULATOR;
            _this.lang = lang;
            _this.compConfig = newCompConfig;
            _this.appName = newCompConfig.appTitle + (0, translator_1.translateComp)(translations_json_1.default.CompendiumComponent.FusionCalculator, newCompConfig.lang);
            return _this;
        }
        return FusionDataService_1;
    }(configurable_fusion_data_service_1.ConfigurableFusionDataService));
    __setFunctionName(_classThis, "FusionDataService");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionDataService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionDataService = _classThis;
}();
