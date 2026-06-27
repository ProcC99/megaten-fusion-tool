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
exports.FusionChartContainerComponent = void 0;
var core_1 = require("@angular/core");
var FusionChartContainerComponent = exports.FusionChartContainerComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fusion-chart-container',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-fusion-chart *ngIf=\"hasLightDark\"\n      [lang]=\"lang\"\n      [normChart]=\"normChart\"\n      [tripChart]=\"normChart\"\n      [normTitle]=\"'Light and Neutral Normal Fusions'\"\n      [tripTitle]=\"'Dark Normal Fusions'\"\n      [mitaTable]=\"mitamaTable\">\n    </app-fusion-chart>\n    <app-fusion-chart *ngIf=\"!hasLightDark\"\n      [lang]=\"lang\"\n      [filterDarks]=\"false\"\n      [normChart]=\"normChart\"\n      [mitaTable]=\"mitamaTable\">\n    </app-fusion-chart>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FusionChartContainerComponent = _classThis = /** @class */ (function () {
        function FusionChartContainerComponent_1(changeDetectorRef, fusionDataService) {
            this.changeDetectorRef = changeDetectorRef;
            this.fusionDataService = fusionDataService;
            this.subscriptions = [];
            this.lang = 'en';
        }
        FusionChartContainerComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            var compConfig = this.fusionDataService.compConfig;
            this.lang = compConfig.lang;
            this.mitamaTable = compConfig.elementTable.pairs || null;
            this.hasLightDark = compConfig.hasLightDark;
            this.subscriptions.push(this.fusionDataService.fusionChart.subscribe(function (fusionChart) {
                _this.changeDetectorRef.markForCheck();
                _this.normChart = fusionChart;
            }));
        };
        FusionChartContainerComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return FusionChartContainerComponent_1;
    }());
    __setFunctionName(_classThis, "FusionChartContainerComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionChartContainerComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionChartContainerComponent = _classThis;
}();
