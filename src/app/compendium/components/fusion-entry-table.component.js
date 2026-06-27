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
exports.FusionEntryTableComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var FusionEntryTableComponent = exports.FusionEntryTableComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fusion-entry-table',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table [ngClass]=\"isFusion ? 'list-table' : 'entry-table'\">\n      <thead>\n        <tr><th colspan=\"4\" class=\"title\">{{ title }}</th></tr>\n        <tr>\n          <th>{{ msgs.Price | translateComp:lang }}</th>\n          <th>{{ msgs.Race | translateComp:lang }}</th>\n          <th>Lvl</th>\n          <th>{{ msgs.Name | translateComp:lang }}</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let data of rowData\">\n          <td>{{ data.price }}</td>\n          <td>{{ data.race1 }}</td>\n          <td>{{ data.lvl1 | lvlToNumber }}</td>\n          <td><a routerLink=\"{{ baseUrl }}/{{ data.name1 }}\">{{ data.name1 }}</a></td>\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _baseUrl_decorators;
    var _baseUrl_initializers = [];
    var _rowData_decorators;
    var _rowData_initializers = [];
    var _isFusion_decorators;
    var _isFusion_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var FusionEntryTableComponent = _classThis = /** @class */ (function () {
        function FusionEntryTableComponent_1() {
            this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, 'Special Fusion Ingredients'));
            this.baseUrl = __runInitializers(this, _baseUrl_initializers, '../..');
            this.rowData = __runInitializers(this, _rowData_initializers, void 0);
            this.isFusion = __runInitializers(this, _isFusion_initializers, false);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.msgs = translations_json_1.default.FusionPairTableComponent;
        }
        return FusionEntryTableComponent_1;
    }());
    __setFunctionName(_classThis, "FusionEntryTableComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _baseUrl_decorators = [(0, core_1.Input)()];
        _rowData_decorators = [(0, core_1.Input)()];
        _isFusion_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _baseUrl_decorators, { kind: "field", name: "baseUrl", static: false, private: false, access: { has: function (obj) { return "baseUrl" in obj; }, get: function (obj) { return obj.baseUrl; }, set: function (obj, value) { obj.baseUrl = value; } } }, _baseUrl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _rowData_decorators, { kind: "field", name: "rowData", static: false, private: false, access: { has: function (obj) { return "rowData" in obj; }, get: function (obj) { return obj.rowData; }, set: function (obj, value) { obj.rowData = value; } } }, _rowData_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isFusion_decorators, { kind: "field", name: "isFusion", static: false, private: false, access: { has: function (obj) { return "isFusion" in obj; }, get: function (obj) { return obj.isFusion; }, set: function (obj, value) { obj.isFusion = value; } } }, _isFusion_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionEntryTableComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionEntryTableComponent = _classThis;
}();
