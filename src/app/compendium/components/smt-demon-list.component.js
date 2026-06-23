"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.SmtDemonListComponent = exports.SmtDemonListRowComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var demon_list_component_1 = require("../bases/demon-list.component");
var SmtDemonListRowComponent = exports.SmtDemonListRowComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tr.app-smt-demon-list-row',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <td [ngClass]=\"['align', data.align ? data.align : 'none']\">{{ data.race }}</td>\n    <td *ngIf=\"!hasCurrLvl\">{{ data.lvl | lvlToNumber }}</td>\n    <td *ngIf=\"hasCurrLvl\" style=\"text-align: center;\">\n      <button *ngIf=\"!currOffset\" (click)=\"updateCurrRange()\">{{ data.currLvl }} &#9998;</button>\n      <select *ngIf=\"currOffset\" (change)=\"emitValidLvl($event)\">\n        <option [value]=\"data.currLvl\">{{ data.currLvl }}</option>\n        <option *ngFor=\"let _ of currRange; let i = index\" [value]=\"i + currOffset\">{{ i + currOffset }}</option>\n      </select>\n    </td>\n    <td><a [routerLink]=\"data.name\">{{ data.name }}</a></td>\n    <td *ngIf=\"hasInherits\"><div [ngClass]=\"['element-icon', 'inherit-icon', 'i' + data.inherits]\">{{ data.inherits }}</div></td>\n    <td *ngFor=\"let stat of data.stats\">{{ stat }}</td>\n    <td *ngFor=\"let resist of data.resists\" [ngClass]=\"['resists', resist | reslvlToColor]\">\n      {{ resist | reslvlToStringLocale:lang }}\n    </td>\n    <ng-container *ngIf=\"hasAffinity\">\n      <td *ngFor=\"let affinity of data.affinities\" [ngClass]=\"'affinity' + affinity\">\n        {{ affinity | affinityToString }}\n      </td>\n    </ng-container>\n    <td *ngIf=\"isEnemy\">{{ data.drop }}</td>\n    <td *ngIf=\"isEnemy\">{{ data.area }}</td>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _isEnemy_decorators;
    var _isEnemy_initializers = [];
    var _hasCurrLvl_decorators;
    var _hasCurrLvl_initializers = [];
    var _hasInherits_decorators;
    var _hasInherits_initializers = [];
    var _hasAffinity_decorators;
    var _hasAffinity_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var _currLvl_decorators;
    var _currLvl_initializers = [];
    var SmtDemonListRowComponent = _classThis = /** @class */ (function () {
        function SmtDemonListRowComponent_1() {
            this.isEnemy = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _isEnemy_initializers, false));
            this.hasCurrLvl = __runInitializers(this, _hasCurrLvl_initializers, false);
            this.hasInherits = __runInitializers(this, _hasInherits_initializers, false);
            this.hasAffinity = __runInitializers(this, _hasAffinity_initializers, false);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.data = __runInitializers(this, _data_initializers, void 0);
            this.currLvl = __runInitializers(this, _currLvl_initializers, new core_1.EventEmitter());
            this.currOffset = 0;
            this.currRange = Array(0);
        }
        SmtDemonListRowComponent_1.prototype.updateCurrRange = function () {
            if (this.currOffset !== 0) {
                return;
            }
            this.currOffset = Math.floor(this.data.lvl);
            this.currRange = Array(100 - this.currOffset);
        };
        SmtDemonListRowComponent_1.prototype.emitValidLvl = function (lvlEvent) {
            var lvl = parseInt(lvlEvent.target.value, 10);
            if (this.data.currLvl !== lvl && 0 < lvl && lvl < 100 && Number.isInteger(lvl)) {
                this.data.currLvl = lvl;
                this.currLvl.emit(lvl);
            }
        };
        return SmtDemonListRowComponent_1;
    }());
    __setFunctionName(_classThis, "SmtDemonListRowComponent");
    (function () {
        _isEnemy_decorators = [(0, core_1.Input)()];
        _hasCurrLvl_decorators = [(0, core_1.Input)()];
        _hasInherits_decorators = [(0, core_1.Input)()];
        _hasAffinity_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _data_decorators = [(0, core_1.Input)()];
        _currLvl_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _isEnemy_decorators, { kind: "field", name: "isEnemy", static: false, private: false, access: { has: function (obj) { return "isEnemy" in obj; }, get: function (obj) { return obj.isEnemy; }, set: function (obj, value) { obj.isEnemy = value; } } }, _isEnemy_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasCurrLvl_decorators, { kind: "field", name: "hasCurrLvl", static: false, private: false, access: { has: function (obj) { return "hasCurrLvl" in obj; }, get: function (obj) { return obj.hasCurrLvl; }, set: function (obj, value) { obj.hasCurrLvl = value; } } }, _hasCurrLvl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasInherits_decorators, { kind: "field", name: "hasInherits", static: false, private: false, access: { has: function (obj) { return "hasInherits" in obj; }, get: function (obj) { return obj.hasInherits; }, set: function (obj, value) { obj.hasInherits = value; } } }, _hasInherits_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasAffinity_decorators, { kind: "field", name: "hasAffinity", static: false, private: false, access: { has: function (obj) { return "hasAffinity" in obj; }, get: function (obj) { return obj.hasAffinity; }, set: function (obj, value) { obj.hasAffinity = value; } } }, _hasAffinity_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } } }, _data_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _currLvl_decorators, { kind: "field", name: "currLvl", static: false, private: false, access: { has: function (obj) { return "currLvl" in obj; }, get: function (obj) { return obj.currLvl; }, set: function (obj, value) { obj.currLvl = value; } } }, _currLvl_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SmtDemonListRowComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmtDemonListRowComponent = _classThis;
}();
var SmtDemonListComponent = exports.SmtDemonListComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-smt-demon-list',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: [position_edges_service_1.PositionEdgesService],
            template: "\n    <table appPositionSticky class=\"list-table\">\n      <tfoot #stickyHeader appColumnWidths\n        class=\"app-demon-list-header sticky-header\"\n        [isPersona]=\"isPersona\"\n        [isEnemy]=\"isEnemy\"\n        [lang]=\"lang\"\n        [hasInherits]=\"!!inheritOrder\"\n        [statHeaders]=\"statHeaders\"\n        [resistHeaders]=\"resistHeaders\"\n        [affinityHeaders]=\"affinityHeaders\"\n        [sortFunIndex]=\"sortFunIndex\"\n        (sortFunIndexChanged)=\"sortFunIndex = $event\"\n        (searchTagsChanged)=\"searchTags = $event\">\n      </tfoot>\n    </table>\n    <table class=\"list-table\">\n      <tfoot #hiddenHeader appColumnWidths\n        class=\"app-demon-list-header\"\n        [isPersona]=\"isPersona\"\n        [isEnemy]=\"isEnemy\"\n        [lang]=\"lang\"\n        [hasInherits]=\"!!inheritOrder\"\n        [statHeaders]=\"statHeaders\"\n        [resistHeaders]=\"resistHeaders\"\n        [affinityHeaders]=\"affinityHeaders\"\n        [style.visibility]=\"'collapse'\">\n      </tfoot>\n      <tbody>\n        <tr *ngFor=\"let data of rowData\"\n          class=\"app-smt-demon-list-row\"\n          [isEnemy]=\"isEnemy\"\n          [hasCurrLvl]=\"hasCurrLvl\"\n          [hasInherits]=\"!!inheritOrder\"\n          [hasAffinity]=\"!!affinityHeaders\"\n          [lang]=\"lang\"\n          [ngClass]=\"{\n            special: data.fusion === 'special',\n            exception: data.fusion !== 'special' && data.fusion !== 'normal',\n            hidden: !data.searchTags.includes(searchTags)\n          }\"\n          [data]=\"data\"\n          (currLvl)=\"lvlChanged.emit({ demon: data.name, currLvl: $event })\">\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _isPersona_decorators;
    var _isPersona_initializers = [];
    var _isEnemy_decorators;
    var _isEnemy_initializers = [];
    var _hasCurrLvl_decorators;
    var _hasCurrLvl_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _lvlChanged_decorators;
    var _lvlChanged_initializers = [];
    var SmtDemonListComponent = _classThis_1 = /** @class */ (function (_super) {
        __extends(SmtDemonListComponent_1, _super);
        function SmtDemonListComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isPersona = (__runInitializers(_this, _instanceExtraInitializers_1), __runInitializers(_this, _isPersona_initializers, false));
            _this.isEnemy = __runInitializers(_this, _isEnemy_initializers, false);
            _this.hasCurrLvl = __runInitializers(_this, _hasCurrLvl_initializers, false);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.lvlChanged = __runInitializers(_this, _lvlChanged_initializers, new core_1.EventEmitter());
            _this.searchTags = '';
            return _this;
        }
        return SmtDemonListComponent_1;
    }(demon_list_component_1.DemonListComponent));
    __setFunctionName(_classThis_1, "SmtDemonListComponent");
    (function () {
        _isPersona_decorators = [(0, core_1.Input)()];
        _isEnemy_decorators = [(0, core_1.Input)()];
        _hasCurrLvl_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _lvlChanged_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _isPersona_decorators, { kind: "field", name: "isPersona", static: false, private: false, access: { has: function (obj) { return "isPersona" in obj; }, get: function (obj) { return obj.isPersona; }, set: function (obj, value) { obj.isPersona = value; } } }, _isPersona_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _isEnemy_decorators, { kind: "field", name: "isEnemy", static: false, private: false, access: { has: function (obj) { return "isEnemy" in obj; }, get: function (obj) { return obj.isEnemy; }, set: function (obj, value) { obj.isEnemy = value; } } }, _isEnemy_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _hasCurrLvl_decorators, { kind: "field", name: "hasCurrLvl", static: false, private: false, access: { has: function (obj) { return "hasCurrLvl" in obj; }, get: function (obj) { return obj.hasCurrLvl; }, set: function (obj, value) { obj.hasCurrLvl = value; } } }, _hasCurrLvl_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _lvlChanged_decorators, { kind: "field", name: "lvlChanged", static: false, private: false, access: { has: function (obj) { return "lvlChanged" in obj; }, get: function (obj) { return obj.lvlChanged; }, set: function (obj, value) { obj.lvlChanged = value; } } }, _lvlChanged_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        SmtDemonListComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return SmtDemonListComponent = _classThis_1;
}();
