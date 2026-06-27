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
exports.DemonResistsComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var DemonResistsComponent = exports.DemonResistsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-resists',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table *ngIf=\"resistHeaders.length\" class=\"entry-table\">\n      <thead>\n        <tr><th [attr.colspan]=\"resistHeaders.length + ailmentHeaders.length\" class=\"title\">{{ title || (msgs.Resistances | translateComp:lang) }}</th></tr>\n        <tr>\n          <th [attr.colSpan]=\"resistHeaders.length\">{{ msgs.Element | translateComp:lang }}</th>\n          <th *ngIf=\"ailmentHeaders.length\" [attr.colSpan]=\"ailmentHeaders.length\">{{ msgs.Ailment | translateComp:lang }}</th>\n        </tr>\n        <tr>\n          <th *ngFor=\"let element of resistHeaders\"\n            [style.width.%]=\"(ailmentHeaders.length ? 50 : 100) / resistHeaders.length\">\n            <div [ngClass]=\"['element-icon', element]\">{{ element }}</div>\n          </th>\n          <th *ngFor=\"let ailment of ailmentHeaders\"\n            [style.width.%]=\"50 / ailmentHeaders.length\">\n            <div [ngClass]=\"['ailment-icon', ailment]\">{{ ailment }}</div>\n          </th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td *ngFor=\"let resist of resists\" [ngClass]=\"['resists', resist | reslvlToColor]\">\n            {{ resist | reslvlToStringLocale:lang }}\n          </td>\n          <td *ngFor=\"let resist of ailments\" [ngClass]=\"['resists', resist | reslvlToString]\">\n            {{ resist | reslvlToStringLocale:lang }}\n          </td>\n        </tr>\n        <tr>\n          <td *ngFor=\"let resist of resists\" [ngClass]=\"['resists', resist % 1024 === 40 ? 'no' : '']\">\n            {{ resist | resmodToString }}\n          </td>\n          <td *ngFor=\"let resist of ailments\" [ngClass]=\"['resists', resist % 1024 === 40 ? 'no' : '']\">\n            {{ resist | resmodToString }}\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _resistHeaders_decorators;
    var _resistHeaders_initializers = [];
    var _resists_decorators;
    var _resists_initializers = [];
    var _ailmentHeaders_decorators;
    var _ailmentHeaders_initializers = [];
    var _ailments_decorators;
    var _ailments_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var DemonResistsComponent = _classThis = /** @class */ (function () {
        function DemonResistsComponent_1() {
            this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, ''));
            this.resistHeaders = __runInitializers(this, _resistHeaders_initializers, []);
            this.resists = __runInitializers(this, _resists_initializers, []);
            this.ailmentHeaders = __runInitializers(this, _ailmentHeaders_initializers, []);
            this.ailments = __runInitializers(this, _ailments_initializers, []);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.msgs = translations_json_1.default.DemonResistsComponent;
        }
        return DemonResistsComponent_1;
    }());
    __setFunctionName(_classThis, "DemonResistsComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _resistHeaders_decorators = [(0, core_1.Input)()];
        _resists_decorators = [(0, core_1.Input)()];
        _ailmentHeaders_decorators = [(0, core_1.Input)()];
        _ailments_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _resistHeaders_decorators, { kind: "field", name: "resistHeaders", static: false, private: false, access: { has: function (obj) { return "resistHeaders" in obj; }, get: function (obj) { return obj.resistHeaders; }, set: function (obj, value) { obj.resistHeaders = value; } } }, _resistHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _resists_decorators, { kind: "field", name: "resists", static: false, private: false, access: { has: function (obj) { return "resists" in obj; }, get: function (obj) { return obj.resists; }, set: function (obj, value) { obj.resists = value; } } }, _resists_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _ailmentHeaders_decorators, { kind: "field", name: "ailmentHeaders", static: false, private: false, access: { has: function (obj) { return "ailmentHeaders" in obj; }, get: function (obj) { return obj.ailmentHeaders; }, set: function (obj, value) { obj.ailmentHeaders = value; } } }, _ailmentHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _ailments_decorators, { kind: "field", name: "ailments", static: false, private: false, access: { has: function (obj) { return "ailments" in obj; }, get: function (obj) { return obj.ailments; }, set: function (obj, value) { obj.ailments = value; } } }, _ailments_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonResistsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonResistsComponent = _classThis;
}();
