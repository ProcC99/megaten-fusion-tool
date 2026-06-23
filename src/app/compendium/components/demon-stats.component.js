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
exports.DemonStatsComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var DemonStatsComponent = exports.DemonStatsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-stats',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <ng-container>\n      <h2 *ngIf=\"title.includes('Lvl')\">{{ title }}</h2>\n      <table class=\"entry-table\">\n        <thead>\n          <tr>\n            <th [attr.colSpan]=\"stats.length + fusionHeaders.length + (inherits ? 1 : 0) + (price ? 1 : 0)\" class=\"title\">\n              {{ title.includes('Lvl') ? (msgs.Stats | translateComp:lang) : title }}\n            </th>\n          </tr>\n          <tr>\n            <th *ngIf=\"price\">{{ msgs.Price | translateComp:lang }}</th>\n            <th *ngFor=\"let stat of statHeaders\">{{ stat }}</th>\n            <th *ngIf=\"inherits\">Inherits</th>\n            <th *ngFor=\"let fusion of fusionHeaders\">{{ fusion }}</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td *ngIf=\"price\" [attr.rowSpan]=\"growths.length\">{{ price }}</td>\n            <td *ngFor=\"let stat of stats\">{{ stat }}</td>\n            <td *ngIf=\"inherits\" [attr.rowSpan]=\"growths.length\"><div class=\"element-icon inherit-icon i{{ inherits }}\">{{ inherits }}</div></td>\n            <ng-content></ng-content>\n          </tr>\n          <tr *ngIf=\"growths.length\">\n            <td *ngFor=\"let growth of growths\">{{ growth }}%</td>\n          </tr>\n        </tbody>\n      </table>\n    <ng-container>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _statHeaders_decorators;
    var _statHeaders_initializers = [];
    var _stats_decorators;
    var _stats_initializers = [];
    var _growths_decorators;
    var _growths_initializers = [];
    var _fusionHeaders_decorators;
    var _fusionHeaders_initializers = [];
    var _inherits_decorators;
    var _inherits_initializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var DemonStatsComponent = _classThis = /** @class */ (function () {
        function DemonStatsComponent_1() {
            this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, 'Demon Entry'));
            this.statHeaders = __runInitializers(this, _statHeaders_initializers, []);
            this.stats = __runInitializers(this, _stats_initializers, []);
            this.growths = __runInitializers(this, _growths_initializers, []);
            this.fusionHeaders = __runInitializers(this, _fusionHeaders_initializers, []);
            this.inherits = __runInitializers(this, _inherits_initializers, void 0);
            this.price = __runInitializers(this, _price_initializers, 0);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.msgs = translations_json_1.default.DemonStatsComponent;
        }
        return DemonStatsComponent_1;
    }());
    __setFunctionName(_classThis, "DemonStatsComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _statHeaders_decorators = [(0, core_1.Input)()];
        _stats_decorators = [(0, core_1.Input)()];
        _growths_decorators = [(0, core_1.Input)()];
        _fusionHeaders_decorators = [(0, core_1.Input)()];
        _inherits_decorators = [(0, core_1.Input)()];
        _price_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _statHeaders_decorators, { kind: "field", name: "statHeaders", static: false, private: false, access: { has: function (obj) { return "statHeaders" in obj; }, get: function (obj) { return obj.statHeaders; }, set: function (obj, value) { obj.statHeaders = value; } } }, _statHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _stats_decorators, { kind: "field", name: "stats", static: false, private: false, access: { has: function (obj) { return "stats" in obj; }, get: function (obj) { return obj.stats; }, set: function (obj, value) { obj.stats = value; } } }, _stats_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _growths_decorators, { kind: "field", name: "growths", static: false, private: false, access: { has: function (obj) { return "growths" in obj; }, get: function (obj) { return obj.growths; }, set: function (obj, value) { obj.growths = value; } } }, _growths_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _fusionHeaders_decorators, { kind: "field", name: "fusionHeaders", static: false, private: false, access: { has: function (obj) { return "fusionHeaders" in obj; }, get: function (obj) { return obj.fusionHeaders; }, set: function (obj, value) { obj.fusionHeaders = value; } } }, _fusionHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inherits_decorators, { kind: "field", name: "inherits", static: false, private: false, access: { has: function (obj) { return "inherits" in obj; }, get: function (obj) { return obj.inherits; }, set: function (obj, value) { obj.inherits = value; } } }, _inherits_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } } }, _price_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonStatsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonStatsComponent = _classThis;
}();
