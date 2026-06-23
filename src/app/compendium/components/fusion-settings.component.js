"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FusionSettingsComponent = void 0;
var core_1 = require("@angular/core");
var translator_1 = require("../models/translator");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var FusionSettingsComponent = exports.FusionSettingsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-fusion-settings',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <ng-container>\n      <h2>{{ msgs.DlcTitle | translateComp:lang }}</h2>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th class=\"title\">Unlock Conditions</th></tr>\n        </thead>\n        <tbody>\n          <ng-container *ngIf=\"showEnableAll\">\n            <tr><th>All Demons</th></tr>\n            <tr>\n              <td>\n                <button (click)=\"toggledAll.emit(true)\" style=\"width: 50%;\">Enable All</button>\n                <button (click)=\"toggledAll.emit(false)\" style=\"width: 50%;\">Disable All</button>\n              </td>\n            </tr>\n          </ng-container>\n          <ng-container *ngFor=\"let cat of fusionSettings.displayHeaders\">\n            <tr><th>{{ cat.category }}</th></tr>\n            <tr *ngFor=\"let setting of cat.settings\">\n              <td>\n                <label>{{ setting.caption }}\n                  <input type=\"checkbox\"\n                    [checked]=\"setting.enabled\"\n                    (change)=\"toggledName.emit(setting.name)\">\n                </label>\n              </td>\n            </tr>\n          </ng-container>\n        </tbody>\n      </table>\n    </ng-container>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _dlcDemons_decorators;
    var _dlcDemons_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _fusionSettings_decorators;
    var _fusionSettings_initializers = [];
    var _showEnableAll_decorators;
    var _showEnableAll_initializers = [];
    var _toggledAll_decorators;
    var _toggledAll_initializers = [];
    var _toggledName_decorators;
    var _toggledName_initializers = [];
    var _set_appTitle_decorators;
    var FusionSettingsComponent = _classThis = /** @class */ (function () {
        function FusionSettingsComponent_1(title) {
            this.title = (__runInitializers(this, _instanceExtraInitializers), title);
            this.dlcDemons = __runInitializers(this, _dlcDemons_initializers, void 0);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.fusionSettings = __runInitializers(this, _fusionSettings_initializers, void 0);
            this.showEnableAll = __runInitializers(this, _showEnableAll_initializers, false);
            this.toggledAll = __runInitializers(this, _toggledAll_initializers, new core_1.EventEmitter());
            this.toggledName = __runInitializers(this, _toggledName_initializers, new core_1.EventEmitter());
            this.msgs = translations_json_1.default.FusionSettingsComponent;
        }
        Object.defineProperty(FusionSettingsComponent_1.prototype, "appTitle", {
            set: function (appTitle) {
                this.title.setTitle((0, translator_1.translateComp)(this.msgs.AppTitle, this.lang) + appTitle);
            },
            enumerable: false,
            configurable: true
        });
        return FusionSettingsComponent_1;
    }());
    __setFunctionName(_classThis, "FusionSettingsComponent");
    (function () {
        _dlcDemons_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _fusionSettings_decorators = [(0, core_1.Input)()];
        _showEnableAll_decorators = [(0, core_1.Input)()];
        _toggledAll_decorators = [(0, core_1.Output)()];
        _toggledName_decorators = [(0, core_1.Output)()];
        _set_appTitle_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis, null, _set_appTitle_decorators, { kind: "setter", name: "appTitle", static: false, private: false, access: { has: function (obj) { return "appTitle" in obj; }, set: function (obj, value) { obj.appTitle = value; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _dlcDemons_decorators, { kind: "field", name: "dlcDemons", static: false, private: false, access: { has: function (obj) { return "dlcDemons" in obj; }, get: function (obj) { return obj.dlcDemons; }, set: function (obj, value) { obj.dlcDemons = value; } } }, _dlcDemons_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _fusionSettings_decorators, { kind: "field", name: "fusionSettings", static: false, private: false, access: { has: function (obj) { return "fusionSettings" in obj; }, get: function (obj) { return obj.fusionSettings; }, set: function (obj, value) { obj.fusionSettings = value; } } }, _fusionSettings_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _showEnableAll_decorators, { kind: "field", name: "showEnableAll", static: false, private: false, access: { has: function (obj) { return "showEnableAll" in obj; }, get: function (obj) { return obj.showEnableAll; }, set: function (obj, value) { obj.showEnableAll = value; } } }, _showEnableAll_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _toggledAll_decorators, { kind: "field", name: "toggledAll", static: false, private: false, access: { has: function (obj) { return "toggledAll" in obj; }, get: function (obj) { return obj.toggledAll; }, set: function (obj, value) { obj.toggledAll = value; } } }, _toggledAll_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _toggledName_decorators, { kind: "field", name: "toggledName", static: false, private: false, access: { has: function (obj) { return "toggledName" in obj; }, get: function (obj) { return obj.toggledName; }, set: function (obj, value) { obj.toggledName = value; } } }, _toggledName_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionSettingsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionSettingsComponent = _classThis;
}();
