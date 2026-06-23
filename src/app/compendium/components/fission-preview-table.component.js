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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrioFissionPreviewComponent = exports.SmtFissionPreviewComponent = exports.FissionPreviewTableComponent = void 0;
var core_1 = require("@angular/core");
var conversions_1 = require("../models/conversions");
var FissionPreviewTableComponent = exports.FissionPreviewTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fission-preview-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table class=\"entry-table\">\n      <tbody>\n        <tr><th class=\"title\">Fission Previews</th></tr>\n        <tr *ngFor=\"let preview of fissionPreviews\">\n          <th>{{ preview }}</th>\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _pairCalculator_decorators;
    var _pairCalculator_initializers = [];
    var _trioCalculator_decorators;
    var _trioCalculator_initializers = [];
    var _pairChart_decorators;
    var _pairChart_initializers = [];
    var _trioChart_decorators;
    var _trioChart_initializers = [];
    var _compendium_decorators;
    var _compendium_initializers = [];
    var FissionPreviewTableComponent = _classThis = /** @class */ (function () {
        function FissionPreviewTableComponent_1() {
            this.pairCalculator = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _pairCalculator_initializers, void 0));
            this.trioCalculator = __runInitializers(this, _trioCalculator_initializers, void 0);
            this.pairChart = __runInitializers(this, _pairChart_initializers, void 0);
            this.trioChart = __runInitializers(this, _trioChart_initializers, void 0);
            this.compendium = __runInitializers(this, _compendium_initializers, void 0);
        }
        FissionPreviewTableComponent_1.prototype.ngOnChanges = function () {
            var _this = this;
            if (this.compendium && this.pairChart && (this.trioChart || !this.trioCalculator)) {
                var previews = [];
                var _loop_1 = function (demon) {
                    var fusionEntries = this_1.compendium
                        .getSpecialNameEntries(demon.name);
                    if (fusionEntries.length > 0) {
                        previews.push("".concat(demon.name, " = ").concat(fusionEntries.join(' x ')));
                        return "continue";
                    }
                    var fusionPairs = this_1.pairCalculator
                        .getFusions(demon.name, this_1.compendium, this_1.pairChart)
                        .map(function (p) { return (0, conversions_1.toFusionPair)(p, _this.compendium); });
                    var fusionPairsValid = fusionPairs.length > 0 && (fusionPairs.filter(function (p) { return p.race1 !== demon.race; }).length > 0 ||
                        !this_1.trioCalculator ||
                        this_1.trioCalculator.getFusions(demon.name, this_1.compendium, this_1.trioChart).length === 0);
                    if (fusionPairsValid) {
                        fusionPairs.sort(function (a, b) { return a.price - b.price; });
                        var previewPairs = fusionPairs.slice(0, 3).map(function (p) { return "".concat(p.name1, " x ").concat(p.name2); }).join(', ');
                        previews.push("".concat(demon.name, " = ").concat(previewPairs) + (fusionPairs.length > 3 ? ", ".concat(fusionPairs.length - 3, " more...") : ''));
                        return "continue";
                    }
                    if (this_1.trioCalculator) {
                        var fusionTrios = this_1.trioCalculator
                            .getFusions(demon.name, this_1.compendium, this_1.trioChart)
                            .map(function (t) { return (0, conversions_1.toDemonTrio)(t, _this.compendium); })
                            .filter(function (t) { return t.d1.race !== demon.race; });
                        if (fusionTrios.length > 0) {
                            fusionTrios.sort(function (a, b) { return a.price - b.price; });
                            var previewTrios = fusionTrios.slice(0, 3).map(function (t) { return "".concat(t.d1.name, " x ").concat(t.d2.name, " x ").concat(t.d3.name); }).join(', ');
                            previews.push("".concat(demon.name, " = ").concat(previewTrios) + (fusionTrios.length > 3 ? ", ".concat(fusionTrios.length - 3, " more...") : ''));
                            return "continue";
                        }
                    }
                    if (demon.prereq) {
                        previews.push("".concat(demon.name, " = ").concat(demon.prereq));
                        return "continue";
                    }
                    previews.push("".concat(demon.name, " = No fusions found!"));
                };
                var this_1 = this;
                for (var _i = 0, _a = this.compendium.allDemons.filter(function (d) { return !d.isEnemy; }); _i < _a.length; _i++) {
                    var demon = _a[_i];
                    _loop_1(demon);
                }
                this.fissionPreviews = previews;
            }
        };
        return FissionPreviewTableComponent_1;
    }());
    __setFunctionName(_classThis, "FissionPreviewTableComponent");
    (function () {
        _pairCalculator_decorators = [(0, core_1.Input)()];
        _trioCalculator_decorators = [(0, core_1.Input)()];
        _pairChart_decorators = [(0, core_1.Input)()];
        _trioChart_decorators = [(0, core_1.Input)()];
        _compendium_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _pairCalculator_decorators, { kind: "field", name: "pairCalculator", static: false, private: false, access: { has: function (obj) { return "pairCalculator" in obj; }, get: function (obj) { return obj.pairCalculator; }, set: function (obj, value) { obj.pairCalculator = value; } } }, _pairCalculator_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _trioCalculator_decorators, { kind: "field", name: "trioCalculator", static: false, private: false, access: { has: function (obj) { return "trioCalculator" in obj; }, get: function (obj) { return obj.trioCalculator; }, set: function (obj, value) { obj.trioCalculator = value; } } }, _trioCalculator_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _pairChart_decorators, { kind: "field", name: "pairChart", static: false, private: false, access: { has: function (obj) { return "pairChart" in obj; }, get: function (obj) { return obj.pairChart; }, set: function (obj, value) { obj.pairChart = value; } } }, _pairChart_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _trioChart_decorators, { kind: "field", name: "trioChart", static: false, private: false, access: { has: function (obj) { return "trioChart" in obj; }, get: function (obj) { return obj.trioChart; }, set: function (obj, value) { obj.trioChart = value; } } }, _trioChart_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compendium_decorators, { kind: "field", name: "compendium", static: false, private: false, access: { has: function (obj) { return "compendium" in obj; }, get: function (obj) { return obj.compendium; }, set: function (obj, value) { obj.compendium = value; } } }, _compendium_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FissionPreviewTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FissionPreviewTableComponent = _classThis;
}();
var SmtFissionPreviewComponent = exports.SmtFissionPreviewComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-smt-fission-preview',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-fission-preview-table\n      [pairCalculator]=\"calculator\"\n      [pairChart]=\"fusionChart\"\n      [compendium]=\"compendium\">\n    <app-fission-preview-table>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var SmtFissionPreviewComponent = _classThis_1 = /** @class */ (function () {
        function SmtFissionPreviewComponent_1(fusionDataService) {
            this.fusionDataService = fusionDataService;
            this.subscriptions = [];
        }
        SmtFissionPreviewComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.calculator = this.fusionDataService.fissionCalculator;
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (compendium) {
                _this.compendium = compendium;
            }));
            this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(function (fusionChart) {
                _this.fusionChart = fusionChart;
            }));
        };
        SmtFissionPreviewComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return SmtFissionPreviewComponent_1;
    }());
    __setFunctionName(_classThis_1, "SmtFissionPreviewComponent");
    (function () {
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        SmtFissionPreviewComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return SmtFissionPreviewComponent = _classThis_1;
}();
var TrioFissionPreviewComponent = exports.TrioFissionPreviewComponent = function () {
    var _classDecorators_2 = [(0, core_1.Component)({
            selector: 'app-trio-fission-preview',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-fission-preview-table\n      [pairCalculator]=\"pairCalculator\"\n      [trioCalculator]=\"trioCalculator\"\n      [pairChart]=\"fusionChart.normalChart\"\n      [trioChart]=\"fusionChart\"\n      [compendium]=\"compendium\">\n    <app-fission-preview-table>\n  "
        })];
    var _classDescriptor_2;
    var _classExtraInitializers_2 = [];
    var _classThis_2;
    var TrioFissionPreviewComponent = _classThis_2 = /** @class */ (function () {
        function TrioFissionPreviewComponent_1(fusionTrioService) {
            this.fusionTrioService = fusionTrioService;
            this.subscriptions = [];
        }
        TrioFissionPreviewComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.pairCalculator = this.fusionTrioService.fissionCalculator;
            this.trioCalculator = this.fusionTrioService.triFissionCalculator;
            this.subscriptions.push(this.fusionTrioService.compendium.subscribe(function (compendium) {
                _this.compendium = compendium;
            }));
            this.subscriptions.push(this.fusionTrioService.squareChart.subscribe(function (chart) {
                _this.fusionChart = chart;
            }));
        };
        TrioFissionPreviewComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return TrioFissionPreviewComponent_1;
    }());
    __setFunctionName(_classThis_2, "TrioFissionPreviewComponent");
    (function () {
        __esDecorate(null, _classDescriptor_2 = { value: _classThis_2 }, _classDecorators_2, { kind: "class", name: _classThis_2.name }, null, _classExtraInitializers_2);
        TrioFissionPreviewComponent = _classThis_2 = _classDescriptor_2.value;
        __runInitializers(_classThis_2, _classExtraInitializers_2);
    })();
    return TrioFissionPreviewComponent = _classThis_2;
}();
