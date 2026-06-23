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
exports.DemonInheritsComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var DemonInheritsComponent = exports.DemonInheritsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-inherits',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table class=\"entry-table\">\n      <thead>\n        <tr>\n          <th *ngIf=\"!hasLvls\" [attr.colspan]=\"inheritHeaders.length\" class=\"title\">Inheritable Skills</th>\n          <th *ngIf=\"hasLvls && inheritHeaders.length\" [attr.colspan]=\"inheritHeaders.length\" class=\"title\">\n            {{ msgs.SkillAffinities | translateComp:lang }}\n          </th>\n        </tr>\n        <tr [ngClass]=\"{ capitalize: !hasIcons }\">\n          <th *ngFor=\"let element of inheritHeaders\" [style.width.%]=\"100 / inheritHeaders.length\">\n            <ng-container *ngIf=\"!hasIcons\">{{ element }}</ng-container>\n            <div *ngIf=\"hasIcons\" class=\"element-icon {{ element }}\">{{ element }}</div>\n          </th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngIf=\"!hasLvls && !hasChance\">\n          <td *ngFor=\"let inherit of inherits\" [style.color]=\"inherit ? null : 'transparent'\">\n            {{ inherit ? 'yes' : 'no' }}\n          </td>\n        </tr>\n        <tr *ngIf=\"hasChance\">\n          <td *ngFor=\"let affinity of inherits\" class=\"affinity{{ affinity | roundInheritPercent }}\">\n            {{ affinity }}%\n          </td>\n        </tr>\n        <tr *ngIf=\"hasLvls\">\n          <td *ngFor=\"let affinity of inherits\" class=\"affinity{{ affinity }}\">\n            {{ affinity | affinityToString }}\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  ",
            styles: ["\n    .capitalize { text-transform: capitalize; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _inheritHeaders_decorators;
    var _inheritHeaders_initializers = [];
    var _inherits_decorators;
    var _inherits_initializers = [];
    var _hasChance_decorators;
    var _hasChance_initializers = [];
    var _hasIcons_decorators;
    var _hasIcons_initializers = [];
    var _hasLvls_decorators;
    var _hasLvls_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var DemonInheritsComponent = _classThis = /** @class */ (function () {
        function DemonInheritsComponent_1() {
            this.inheritHeaders = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _inheritHeaders_initializers, []));
            this.inherits = __runInitializers(this, _inherits_initializers, []);
            this.hasChance = __runInitializers(this, _hasChance_initializers, false);
            this.hasIcons = __runInitializers(this, _hasIcons_initializers, true);
            this.hasLvls = __runInitializers(this, _hasLvls_initializers, false);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.msgs = translations_json_1.default.DemonInheritsComponent;
        }
        return DemonInheritsComponent_1;
    }());
    __setFunctionName(_classThis, "DemonInheritsComponent");
    (function () {
        _inheritHeaders_decorators = [(0, core_1.Input)()];
        _inherits_decorators = [(0, core_1.Input)()];
        _hasChance_decorators = [(0, core_1.Input)()];
        _hasIcons_decorators = [(0, core_1.Input)()];
        _hasLvls_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _inheritHeaders_decorators, { kind: "field", name: "inheritHeaders", static: false, private: false, access: { has: function (obj) { return "inheritHeaders" in obj; }, get: function (obj) { return obj.inheritHeaders; }, set: function (obj, value) { obj.inheritHeaders = value; } } }, _inheritHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inherits_decorators, { kind: "field", name: "inherits", static: false, private: false, access: { has: function (obj) { return "inherits" in obj; }, get: function (obj) { return obj.inherits; }, set: function (obj, value) { obj.inherits = value; } } }, _inherits_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasChance_decorators, { kind: "field", name: "hasChance", static: false, private: false, access: { has: function (obj) { return "hasChance" in obj; }, get: function (obj) { return obj.hasChance; }, set: function (obj, value) { obj.hasChance = value; } } }, _hasChance_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasIcons_decorators, { kind: "field", name: "hasIcons", static: false, private: false, access: { has: function (obj) { return "hasIcons" in obj; }, get: function (obj) { return obj.hasIcons; }, set: function (obj, value) { obj.hasIcons = value; } } }, _hasIcons_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasLvls_decorators, { kind: "field", name: "hasLvls", static: false, private: false, access: { has: function (obj) { return "hasLvls" in obj; }, get: function (obj) { return obj.hasLvls; }, set: function (obj, value) { obj.hasLvls = value; } } }, _hasLvls_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonInheritsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonInheritsComponent = _classThis;
}();
