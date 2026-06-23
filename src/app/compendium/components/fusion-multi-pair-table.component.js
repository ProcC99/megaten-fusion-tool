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
exports.FusionMultiPairTableComponent = void 0;
var core_1 = require("@angular/core");
var FusionMultiPairTableComponent = exports.FusionMultiPairTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fusion-multi-pair-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table class=\"entry-table\">\n      <thead>\n        <tr><th colspan=5 class=\"title\">{{ leftHeader }} 1 x {{ rightHeader }} 2 = {{ resultName }}</th></tr>\n        <tr><th rowspan=2>Price</th><th colspan=3>{{ leftHeader }} 1</th><th>{{ rightHeader }} 2</th></tr>\n        <tr><th>Names</th><th>MinLvl</th><th>MaxLvl</th><th>Names</th></tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let row of rowData\">\n          <td>{{ row.price }}</td>\n          <td>\n            <ul class=\"comma-list\">\n              <li *ngFor=\"let name of row.names1\"><a routerLink=\"../{{ name }}\">{{ name }} </a></li>\n            </ul>\n          </td>\n          <td>{{ row.lvl1 }}</td>\n          <td>{{ row.lvl2 }}</td>\n          <td>\n            <ul *ngIf=\"leftHeader === rightHeader\" class=\"comma-list\">\n              <li *ngFor=\"let name of row.names2\"><a routerLink=\"../{{ name }}\">{{ name }} </a></li>\n            </ul>\n            <ul *ngIf=\"leftHeader !== rightHeader\" class=\"comma-list\">\n              <li *ngFor=\"let name of row.names2\">{{ name }} </li>\n            </ul>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _leftHeader_decorators;
    var _leftHeader_initializers = [];
    var _rightHeader_decorators;
    var _rightHeader_initializers = [];
    var _resultName_decorators;
    var _resultName_initializers = [];
    var _rowData_decorators;
    var _rowData_initializers = [];
    var FusionMultiPairTableComponent = _classThis = /** @class */ (function () {
        function FusionMultiPairTableComponent_1() {
            this.leftHeader = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _leftHeader_initializers, 'Ingredient'));
            this.rightHeader = __runInitializers(this, _rightHeader_initializers, 'Ingredient');
            this.resultName = __runInitializers(this, _resultName_initializers, 'Result');
            this.rowData = __runInitializers(this, _rowData_initializers, void 0);
        }
        return FusionMultiPairTableComponent_1;
    }());
    __setFunctionName(_classThis, "FusionMultiPairTableComponent");
    (function () {
        _leftHeader_decorators = [(0, core_1.Input)()];
        _rightHeader_decorators = [(0, core_1.Input)()];
        _resultName_decorators = [(0, core_1.Input)()];
        _rowData_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _leftHeader_decorators, { kind: "field", name: "leftHeader", static: false, private: false, access: { has: function (obj) { return "leftHeader" in obj; }, get: function (obj) { return obj.leftHeader; }, set: function (obj, value) { obj.leftHeader = value; } } }, _leftHeader_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _rightHeader_decorators, { kind: "field", name: "rightHeader", static: false, private: false, access: { has: function (obj) { return "rightHeader" in obj; }, get: function (obj) { return obj.rightHeader; }, set: function (obj, value) { obj.rightHeader = value; } } }, _rightHeader_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _resultName_decorators, { kind: "field", name: "resultName", static: false, private: false, access: { has: function (obj) { return "resultName" in obj; }, get: function (obj) { return obj.resultName; }, set: function (obj, value) { obj.resultName = value; } } }, _resultName_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _rowData_decorators, { kind: "field", name: "rowData", static: false, private: false, access: { has: function (obj) { return "rowData" in obj; }, get: function (obj) { return obj.rowData; }, set: function (obj, value) { obj.rowData = value; } } }, _rowData_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionMultiPairTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionMultiPairTableComponent = _classThis;
}();
