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
exports.RecipeGeneratorContainerComponent = void 0;
var core_1 = require("@angular/core");
var translator_1 = require("../../compendium/models/translator");
var translations_json_1 = __importDefault(require("../../compendium/data/translations.json"));
var RecipeGeneratorContainerComponent = exports.RecipeGeneratorContainerComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-recipe-generator-container',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-recipe-generator\n      [maxSkills]=\"maxSkills\"\n      [compendium]=\"compendium\"\n      [squareChart]=\"squareChart\"\n      [recipeConfig]=\"recipeConfig\"\n      [lang]=\"lang\">\n    </app-recipe-generator>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RecipeGeneratorContainerComponent = _classThis = /** @class */ (function () {
        function RecipeGeneratorContainerComponent_1(fusionDataService, title) {
            this.fusionDataService = fusionDataService;
            this.title = title;
            this.subscriptions = [];
            this.maxSkills = 8;
            this.lang = 'en';
            var compConfig = this.fusionDataService.compConfig;
            this.lang = compConfig.lang;
            this.appName = (0, translator_1.translateComp)(translations_json_1.default.RecipeGeneratorComponent.AppTitle, this.lang) + fusionDataService.appName;
            this.maxSkills = compConfig.maxSkillSlots;
            this.recipeConfig = {
                fissionCalculator: this.fusionDataService.fissionCalculator,
                fusionCalculator: this.fusionDataService.fusionCalculator,
                races: compConfig.races,
                skillElems: compConfig.skillElems,
                inheritElems: compConfig.affinityElems,
                displayElems: (0, translator_1.translateCompSet)(translations_json_1.default.ElementIcon, this.lang),
                restrictInherits: compConfig.appCssClasses.includes('sh2') || compConfig.appCssClasses.includes('smt3'),
                triFissionCalculator: null,
                triFusionCalculator: null,
                defaultDemon: compConfig.defaultRecipeDemon
            };
        }
        RecipeGeneratorContainerComponent_1.prototype.ngOnInit = function () { this.title.setTitle(this.appName); this.subscribeAll(); };
        RecipeGeneratorContainerComponent_1.prototype.ngOnDestroy = function () { this.unsubscribeAll(); };
        RecipeGeneratorContainerComponent_1.prototype.subscribeAll = function () {
            var _this = this;
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (comp) {
                _this.compendium = comp;
            }));
            this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(function (chart) {
                _this.squareChart = { normalChart: chart, tripleChart: chart };
            }));
        };
        RecipeGeneratorContainerComponent_1.prototype.unsubscribeAll = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return RecipeGeneratorContainerComponent_1;
    }());
    __setFunctionName(_classThis, "RecipeGeneratorContainerComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        RecipeGeneratorContainerComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecipeGeneratorContainerComponent = _classThis;
}();
