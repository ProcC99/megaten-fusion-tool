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
exports.SmtFissionTableComponent = exports.SmtFissionTableComponentTemplate = void 0;
var core_1 = require("@angular/core");
var conversions_1 = require("../models/conversions");
var translations_json_1 = __importDefault(require("../data/translations.json"));
exports.SmtFissionTableComponentTemplate = "\n  <table *ngIf=\"fusionPrereq\" class=\"list-table\">\n    <thead><tr><th class=\"title\">{{ msgs.SpecialFusionCondition | translateComp:lang }}</th></tr></thead>\n    <tbody><tr><td>{{ fusionPrereq }}</td></tr></tbody>\n  </table>\n  <app-fusion-entry-table *ngIf=\"fusionEntries.length\"\n    [lang]=\"lang\"\n    [title]=\"(msgs.SpecialFusionIngredients | translateComp:lang) + currentDemon\"\n    [baseUrl]=\"hasFissionFromDemons ? '../../demons' : '../..'\"\n    [rowData]=\"fusionEntries\"\n    [isFusion]=\"true\">\n  </app-fusion-entry-table>\n  <app-fusion-pair-table *ngIf=\"fusionPairs.length || !fusionEntries.length\"\n    [lang]=\"lang\"\n    [title]=\"(msgs.Title | translateComp:lang) + currentDemon\"\n    [leftHeader]=\"msgs.LeftHeader | translateComp:lang\"\n    [rightHeader]=\"msgs.RightHeader | translateComp:lang\"\n    [leftBaseUrl]=\"hasFissionFromDemons ? '../../demons' : '../..'\"\n    [rightBaseUrl]=\"hasFissionFromDemons ? '../../demons' : '../..'\"\n    [raceOrder]=\"fusionChart.raceOrder\"\n    [rowData]=\"fusionPairs\">\n  </app-fusion-pair-table>\n";
var SmtFissionTableComponent = exports.SmtFissionTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-smt-fission-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: exports.SmtFissionTableComponentTemplate
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SmtFissionTableComponent = _classThis = /** @class */ (function () {
        function SmtFissionTableComponent_1(currentDemonService, changeDetectorRef, fusionDataService) {
            var _this = this;
            this.currentDemonService = currentDemonService;
            this.changeDetectorRef = changeDetectorRef;
            this.fusionDataService = fusionDataService;
            this.fusionPrereq = '';
            this.lang = 'en';
            this.hasFissionFromDemons = false;
            this.fusionEntries = [];
            this.fusionPairs = [];
            this.msgs = translations_json_1.default.SmtFissionTableComponent;
            this.subscriptions = [];
            this.toFusionEntry = function (currentDemon) { return function (name) { return (0, conversions_1.toFusionEntry)(name, _this.compendium); }; };
            this.toFusionPair = function (currentDemon) { return function (names) { return (0, conversions_1.toFusionPair)(names, _this.compendium); }; };
        }
        SmtFissionTableComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.calculator = this.fusionDataService.fissionCalculator;
            this.lang = this.fusionDataService.lang;
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (compendium) {
                _this.compendium = compendium;
                _this.getReverseFissions();
            }));
            this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(function (fusionChart) {
                _this.fusionChart = fusionChart;
                _this.getReverseFissions();
            }));
            this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(function (name) {
                _this.currentDemon = name;
                _this.getReverseFissions();
            }));
        };
        SmtFissionTableComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        SmtFissionTableComponent_1.prototype.getFusionPairs = function () {
            return this.calculator
                .getFusions(this.currentDemon, this.compendium, this.fusionChart)
                .map(this.toFusionPair(this.currentDemon));
        };
        SmtFissionTableComponent_1.prototype.getReverseFissions = function () {
            if (this.compendium && this.fusionChart && this.currentDemon) {
                this.changeDetectorRef.markForCheck();
                this.fusionPrereq = this.compendium
                    .getDemon(this.currentDemon).prereq;
                this.fusionEntries = this.compendium
                    .getSpecialNameEntries(this.currentDemon)
                    .map(this.toFusionEntry(this.currentDemon));
                this.fusionPairs = this.getFusionPairs();
            }
        };
        return SmtFissionTableComponent_1;
    }());
    __setFunctionName(_classThis, "SmtFissionTableComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SmtFissionTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmtFissionTableComponent = _classThis;
}();
