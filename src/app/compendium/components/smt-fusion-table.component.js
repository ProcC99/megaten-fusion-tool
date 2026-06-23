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
exports.SmtFusionTableComponent = exports.SmtFusionTableComponentTemplate = void 0;
var core_1 = require("@angular/core");
var conversions_1 = require("../models/conversions");
var translations_json_1 = __importDefault(require("../data/translations.json"));
exports.SmtFusionTableComponentTemplate = "\n  <app-fusion-pair-table\n    [lang]=\"lang\"\n    [title]=\"currentDemon + (msgs.Title | translateComp:lang)\"\n    [leftHeader]=\"msgs.LeftHeader | translateComp:lang\"\n    [rightHeader]=\"msgs.RightHeader | translateComp:lang\"\n    [leftBaseUrl]=\"'../..'\"\n    [rightBaseUrl]=\"hasFusionToPersonas ? '../../personas' : '../..'\"\n    [raceOrder]=\"fusionChart.raceOrder\"\n    [rowData]=\"fusionPairs\">\n  </app-fusion-pair-table>\n";
var SmtFusionTableComponent = exports.SmtFusionTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-smt-fusion-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: exports.SmtFusionTableComponentTemplate
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SmtFusionTableComponent = _classThis = /** @class */ (function () {
        function SmtFusionTableComponent_1(currentDemonService, changeDetectorRef, fusionDataService) {
            var _this = this;
            this.currentDemonService = currentDemonService;
            this.changeDetectorRef = changeDetectorRef;
            this.fusionDataService = fusionDataService;
            this.lang = 'en';
            this.hasFusionToPersonas = false;
            this.fusionPairs = [];
            this.msgs = translations_json_1.default.SmtFusionTableComponent;
            this.subscriptions = [];
            this.toFusionPair = function (currentDemon) { return function (names) { return (0, conversions_1.toFusionPairResult)(names, _this.compendium); }; };
        }
        SmtFusionTableComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.calculator = this.fusionDataService.fusionCalculator;
            this.lang = this.fusionDataService.lang;
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (compendium) {
                _this.compendium = compendium;
                _this.getForwardFusions();
            }));
            this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(function (fusionChart) {
                _this.fusionChart = fusionChart;
                _this.getForwardFusions();
            }));
            this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(function (name) {
                _this.currentDemon = name;
                _this.getForwardFusions();
            }));
        };
        SmtFusionTableComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        SmtFusionTableComponent_1.prototype.getForwardFusions = function () {
            if (this.compendium && this.fusionChart && this.currentDemon) {
                this.changeDetectorRef.markForCheck();
                this.fusionPairs = this.calculator
                    .getFusions(this.currentDemon, this.compendium, this.fusionChart)
                    .map(this.toFusionPair(this.currentDemon));
            }
        };
        return SmtFusionTableComponent_1;
    }());
    __setFunctionName(_classThis, "SmtFusionTableComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SmtFusionTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmtFusionTableComponent = _classThis;
}();
