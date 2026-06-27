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
exports.TripleFusionTableComponent = void 0;
var core_1 = require("@angular/core");
var conversions_1 = require("../models/conversions");
var TripleFusionTableComponent = exports.TripleFusionTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-triple-fusion-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-fusion-trio-table\n      [title]=\"'Result = Lvl ' + compendium.getDemon(currentDemon).currLvl + ' ' + currentDemon +  ' x Ingredient 2 x Ingredient 3'\"\n      [raceOrder]=\"chart.normalChart.raceOrder\"\n      [leftHeader]=\"'Result'\"\n      [rowData]=\"fusionTrios\">\n    </app-fusion-trio-table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripleFusionTableComponent = _classThis = /** @class */ (function () {
        function TripleFusionTableComponent_1(route, currentDemonService, changeDetectorRef, fusionTrioService) {
            var _this = this;
            this.route = route;
            this.currentDemonService = currentDemonService;
            this.changeDetectorRef = changeDetectorRef;
            this.fusionTrioService = fusionTrioService;
            this.subscriptions = [];
            this.fusionTrios = [];
            this.toDemonTrio = function (names) { return (0, conversions_1.toDemonTrioResult)(names, _this.compendium); };
            this.sortDemonTrio = function (a, b) { return a.price - b.price; };
        }
        TripleFusionTableComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.pairCalculator = this.fusionTrioService.fusionCalculator;
            this.calculator = this.fusionTrioService.triFusionCalculator;
            this.subscriptions.push(this.fusionTrioService.compendium.subscribe(function (compendium) {
                _this.compendium = compendium;
                _this.checkFusions();
            }));
            this.subscriptions.push(this.fusionTrioService.squareChart.subscribe(function (chart) {
                _this.chart = chart;
                _this.checkFusions();
            }));
            this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(function (name) {
                _this.currentDemon = name;
                _this.checkFusions();
            }));
        };
        TripleFusionTableComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        TripleFusionTableComponent_1.prototype.checkFusions = function () {
            if (this.compendium && this.chart && this.currentDemon) {
                this.changeDetectorRef.markForCheck();
                this.getFusions();
            }
        };
        TripleFusionTableComponent_1.prototype.getFusions = function () {
            var _this = this;
            var names = this.calculator.getFusions(this.currentDemon, this.compendium, this.chart);
            var demons = names.map(this.toDemonTrio);
            var fusions = {};
            for (var _i = 0, demons_1 = demons; _i < demons_1.length; _i++) {
                var trio = demons_1[_i];
                if (!fusions[trio.d3.name]) {
                    fusions[trio.d3.name] = [];
                }
                fusions[trio.d3.name].push(trio);
            }
            for (var _a = 0, _b = Object.values(fusions); _a < _b.length; _a++) {
                var recipes = _b[_a];
                recipes.sort(this.sortDemonTrio);
            }
            this.fusionTrios = Object.entries(fusions).map(function (recipe) { return ({
                demon: _this.compendium.getDemon(recipe[0]),
                minPrice: recipe[1][0].price,
                fusions: recipe[1]
            }); });
        };
        return TripleFusionTableComponent_1;
    }());
    __setFunctionName(_classThis, "TripleFusionTableComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        TripleFusionTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripleFusionTableComponent = _classThis;
}();
