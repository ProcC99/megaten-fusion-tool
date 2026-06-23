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
exports.CompendiumComponent = exports.CompendiumHeaderComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var position_sticky_directive_1 = require("../../shared/position-sticky.directive");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var CompendiumHeaderComponent = exports.CompendiumHeaderComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-compendium-header',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table *ngIf=\"3 + otherLinks.length + (hasSettings ? 1 : 0); let hlength\"\n      [ngStyle]=\"{ marginLeft: 'auto', marginRight: 'auto', width: '1080px' }\">\n      <thead>\n        <tr>\n          <th class=\"nav\" routerLinkActive=\"active\"\n            [routerLink]=\"mainList + 's'\"\n            [routerLinkActiveOptions]=\"{ exact: true }\"\n            [style.width.%]=\"1 / hlength\">\n            <a [routerLink]=\"mainList + 's'\">\n              {{ (mainList === 'demon' ? msgs.DemonList : msgs.PersonaList) | translateComp:lang }}\n            </a>\n          </th>\n          <th class=\"nav\" routerLink=\"skills\" routerLinkActive=\"active\" [style.width.%]=\"1 / hlength\">\n            <a routerLink=\"skills\">\n              {{ msgs.SkillList | translateComp:lang }}\n            </a>\n          </th>\n          <th class=\"nav\" routerLink=\"chart\" routerLinkActive=\"active\" [style.width.%]=\"1 / hlength\">\n            <a routerLink=\"chart\">\n              {{ msgs.FusionChart | translateComp:lang }}\n            </a>\n          </th>\n          <th *ngFor=\"let l of otherLinks\" class=\"nav\" routerLinkActive=\"active\"\n            [routerLink]=\"l.link\"\n            [routerLinkActiveOptions]=\"{ exact: true }\"\n            [style.width.%]=\"1 / hlength\">\n            <a [routerLink]=\"l.link\">\n              {{ l.title }}\n            </a>\n          </th>\n          <th *ngIf=\"hasSettings\" class=\"nav\" routerLink=\"settings\" routerLinkActive=\"active\" [style.width.%]=\"1 / hlength\">\n            <a routerLink=\"settings\">\n              {{ msgs.FusionSettings | translateComp:lang }}\n            </a>\n          </th>\n        </tr>\n        <tr>\n          <th [attr.colspan]=\"hlength\" class=\"title\">{{ appName }}{{ msgs.FusionCalculator | translateComp:lang }}</th>\n        </tr>\n      </thead>\n    </table>\n  ",
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _appName_decorators;
    var _appName_initializers = [];
    var _mainList_decorators;
    var _mainList_initializers = [];
    var _hasSettings_decorators;
    var _hasSettings_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _otherLinks_decorators;
    var _otherLinks_initializers = [];
    var CompendiumHeaderComponent = _classThis = /** @class */ (function () {
        function CompendiumHeaderComponent_1() {
            this.appName = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _appName_initializers, 'Shin Megami Tensei'));
            this.mainList = __runInitializers(this, _mainList_initializers, 'demon');
            this.hasSettings = __runInitializers(this, _hasSettings_initializers, true);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.otherLinks = __runInitializers(this, _otherLinks_initializers, []);
            this.msgs = translations_json_1.default.CompendiumComponent;
        }
        return CompendiumHeaderComponent_1;
    }());
    __setFunctionName(_classThis, "CompendiumHeaderComponent");
    (function () {
        _appName_decorators = [(0, core_1.Input)()];
        _mainList_decorators = [(0, core_1.Input)()];
        _hasSettings_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _otherLinks_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _appName_decorators, { kind: "field", name: "appName", static: false, private: false, access: { has: function (obj) { return "appName" in obj; }, get: function (obj) { return obj.appName; }, set: function (obj, value) { obj.appName = value; } } }, _appName_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _mainList_decorators, { kind: "field", name: "mainList", static: false, private: false, access: { has: function (obj) { return "mainList" in obj; }, get: function (obj) { return obj.mainList; }, set: function (obj, value) { obj.mainList = value; } } }, _mainList_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasSettings_decorators, { kind: "field", name: "hasSettings", static: false, private: false, access: { has: function (obj) { return "hasSettings" in obj; }, get: function (obj) { return obj.hasSettings; }, set: function (obj, value) { obj.hasSettings = value; } } }, _hasSettings_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _otherLinks_decorators, { kind: "field", name: "otherLinks", static: false, private: false, access: { has: function (obj) { return "otherLinks" in obj; }, get: function (obj) { return obj.otherLinks; }, set: function (obj, value) { obj.otherLinks = value; } } }, _otherLinks_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        CompendiumHeaderComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompendiumHeaderComponent = _classThis;
}();
var CompendiumComponent = exports.CompendiumComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-demon-compendium',
            providers: [position_edges_service_1.PositionEdgesService],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <div [ngStyle]=\"{ marginLeft: 'auto', marginRight: 'auto', width: isChart ? 'auto' : '1080px' }\">\n      <div *ngIf=\"!isChart\" appPositionSticky>\n        <app-demon-compendium-header appPositionSticky\n          [appName]=\"appName\"\n          [mainList]=\"mainList\"\n          [hasSettings]=\"hasSettings\"\n          [lang]=\"lang\"\n          [otherLinks]=\"otherLinks\">\n        </app-demon-compendium-header>\n      </div>\n      <div *ngIf=\"isChart\">\n        <app-demon-compendium-header appPositionSticky\n          [appName]=\"appName\"\n          [mainList]=\"mainList\"\n          [hasSettings]=\"hasSettings\"\n          [lang]=\"lang\"\n          [otherLinks]=\"otherLinks\">\n        </app-demon-compendium-header>\n      </div>\n      <router-outlet></router-outlet>\n    </div>\n  ",
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _stickyTable_decorators;
    var _stickyTable_initializers = [];
    var _mainList_decorators;
    var _mainList_initializers = [];
    var _hasSettings_decorators;
    var _hasSettings_initializers = [];
    var _otherLinks_decorators;
    var _otherLinks_initializers = [];
    var CompendiumComponent = _classThis_1 = /** @class */ (function () {
        function CompendiumComponent_1(route) {
            this.route = (__runInitializers(this, _instanceExtraInitializers_1), route);
            this.subscriptions = [];
            this.stickyTable = __runInitializers(this, _stickyTable_initializers, void 0);
            this.mainList = __runInitializers(this, _mainList_initializers, 'demon');
            this.hasSettings = __runInitializers(this, _hasSettings_initializers, true);
            this.otherLinks = __runInitializers(this, _otherLinks_initializers, []);
        }
        CompendiumComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            this.subscriptions.push(this.route.data.subscribe(function (data) {
                _this.appName = data.appName || 'Shin Megami Tensei';
                _this.isChart = data.fusionTool === 'chart';
                _this.lang = data.lang;
            }));
            setTimeout(function () { return _this.stickyTable.nextEdges(); });
        };
        CompendiumComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return CompendiumComponent_1;
    }());
    __setFunctionName(_classThis_1, "CompendiumComponent");
    (function () {
        _stickyTable_decorators = [(0, core_1.ViewChild)(position_sticky_directive_1.PositionStickyDirective)];
        _mainList_decorators = [(0, core_1.Input)()];
        _hasSettings_decorators = [(0, core_1.Input)()];
        _otherLinks_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _stickyTable_decorators, { kind: "field", name: "stickyTable", static: false, private: false, access: { has: function (obj) { return "stickyTable" in obj; }, get: function (obj) { return obj.stickyTable; }, set: function (obj, value) { obj.stickyTable = value; } } }, _stickyTable_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _mainList_decorators, { kind: "field", name: "mainList", static: false, private: false, access: { has: function (obj) { return "mainList" in obj; }, get: function (obj) { return obj.mainList; }, set: function (obj, value) { obj.mainList = value; } } }, _mainList_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _hasSettings_decorators, { kind: "field", name: "hasSettings", static: false, private: false, access: { has: function (obj) { return "hasSettings" in obj; }, get: function (obj) { return obj.hasSettings; }, set: function (obj, value) { obj.hasSettings = value; } } }, _hasSettings_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _otherLinks_decorators, { kind: "field", name: "otherLinks", static: false, private: false, access: { has: function (obj) { return "otherLinks" in obj; }, get: function (obj) { return obj.otherLinks; }, set: function (obj, value) { obj.otherLinks = value; } } }, _otherLinks_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        CompendiumComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return CompendiumComponent = _classThis_1;
}();
