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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemonListHeaderComponent = void 0;
var core_1 = require("@angular/core");
var sorted_table_component_1 = require("../../shared/sorted-table.component");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var DemonListHeaderComponent = exports.DemonListHeaderComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tfoot.app-demon-list-header',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <tr>\n      <th class=\"nav\" [style.height.em]=\"1\" [attr.colSpan]=\"hasInherits ? 4 : 3\" (click)=\"showFilter = true\">\n        <ng-container *ngIf=\"!showFilter\">Show {{ (isPersona ? msgs.Persona : msgs.Demon) | translateComp:lang }} Filter</ng-container>\n        <input *ngIf=\"showFilter\" type=\"text\"\n          placeholder=\"name, race, etc.\"\n          (input)=\"searchTagsChanged.emit($any($event.target).value.toLocaleLowerCase())\"/>\n      </th>\n      <th *ngIf=\"statColIndices.length\" [attr.colSpan]=\"statColIndices.length\">{{ msgs.Stats | translateComp:lang }}</th>\n      <th *ngIf=\"resistColIndices.length\" [attr.colSpan]=\"resistColIndices.length\">{{ msgs.Resistances | translateComp:lang }}</th>\n      <th *ngIf=\"affinityColIndices.length\" [attr.colSpan]=\"affinityColIndices.length\">{{ msgs.Affinities | translateComp:lang }}</th>\n      <th *ngIf=\"isEnemy\" colspan=\"2\">Enemy</th>\n    </tr>\n    <tr>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(1)\" (click)=\"nextSortFunIndex(1)\"><span>{{ msgs.Race | translateComp:lang }}</span></th>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(2)\" (click)=\"nextSortFunIndex(2)\"><span>Lvl</span></th>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(3)\" (click)=\"nextSortFunIndex(3)\"><span>{{ msgs.Name | translateComp:lang }}</span></th>\n      <th *ngIf=\"hasInherits\" class=\"sortable\" [ngClass]=\"sortDirClass(4)\" (click)=\"nextSortFunIndex(4)\">Inherits</th>\n      <th *ngFor=\"let pair of statColIndices\" class=\"sortable\" (click)=\"nextSortFunIndex(pair.index)\">\n        {{ pair.stat }}\n      </th>\n      <th *ngFor=\"let pair of resistColIndices\"\n        class=\"sortable\"\n        (click)=\"nextSortFunIndex(pair.index)\">\n        <div class=\"element-icon {{ pair.elem }}\"></div>\n      </th>\n      <th *ngFor=\"let pair of affinityColIndices\"\n        class=\"sortable\"\n        (click)=\"nextSortFunIndex(pair.index)\">\n        <div class=\"element-icon {{ pair.elem }}\"></div>\n      </th>\n      <th *ngIf=\"isEnemy\">Drops</th>\n      <th *ngIf=\"isEnemy\">Appears</th>\n    </tr>\n  ",
            styles: ["\n    th { white-space: nowrap; }\n    th input { width: 80%; }\n    span { padding-right: 0.6em; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _isEnemy_decorators;
    var _isEnemy_initializers = [];
    var _isPersona_decorators;
    var _isPersona_initializers = [];
    var _hasInherits_decorators;
    var _hasInherits_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _statHeaders_decorators;
    var _statHeaders_initializers = [];
    var _resistHeaders_decorators;
    var _resistHeaders_initializers = [];
    var _affinityHeaders_decorators;
    var _affinityHeaders_initializers = [];
    var _searchTagsChanged_decorators;
    var _searchTagsChanged_initializers = [];
    var DemonListHeaderComponent = _classThis = /** @class */ (function (_super) {
        __extends(DemonListHeaderComponent_1, _super);
        function DemonListHeaderComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isEnemy = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _isEnemy_initializers, false));
            _this.isPersona = __runInitializers(_this, _isPersona_initializers, false);
            _this.hasInherits = __runInitializers(_this, _hasInherits_initializers, false);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.statHeaders = __runInitializers(_this, _statHeaders_initializers, []);
            _this.resistHeaders = __runInitializers(_this, _resistHeaders_initializers, []);
            _this.affinityHeaders = __runInitializers(_this, _affinityHeaders_initializers, []);
            _this.searchTagsChanged = __runInitializers(_this, _searchTagsChanged_initializers, new core_1.EventEmitter());
            _this.statColIndices = [];
            _this.resistColIndices = [];
            _this.reslvlColIndices = [];
            _this.affinityColIndices = [];
            _this.msgs = translations_json_1.default.DemonListComponent;
            _this.showFilter = false;
            return _this;
        }
        DemonListHeaderComponent_1.prototype.ngOnInit = function () {
            this.nextColIndices();
        };
        DemonListHeaderComponent_1.prototype.nextColIndices = function () {
            var index = this.hasInherits ? 5 : 4;
            if (this.statHeaders) {
                this.statColIndices = this.statHeaders.map(function (stat, i) { return ({ stat: stat, index: i + index }); });
                index += this.statHeaders.length;
            }
            if (this.resistHeaders) {
                this.resistColIndices = this.resistHeaders.map(function (elem, i) { return ({ elem: elem, index: i + index }); });
                index += this.resistHeaders.length;
            }
            if (this.affinityHeaders) {
                this.affinityColIndices = this.affinityHeaders.map(function (elem, i) { return ({ elem: elem, index: i + index }); });
            }
        };
        return DemonListHeaderComponent_1;
    }(sorted_table_component_1.SortedTableHeaderComponent));
    __setFunctionName(_classThis, "DemonListHeaderComponent");
    (function () {
        _isEnemy_decorators = [(0, core_1.Input)()];
        _isPersona_decorators = [(0, core_1.Input)()];
        _hasInherits_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _statHeaders_decorators = [(0, core_1.Input)()];
        _resistHeaders_decorators = [(0, core_1.Input)()];
        _affinityHeaders_decorators = [(0, core_1.Input)()];
        _searchTagsChanged_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _isEnemy_decorators, { kind: "field", name: "isEnemy", static: false, private: false, access: { has: function (obj) { return "isEnemy" in obj; }, get: function (obj) { return obj.isEnemy; }, set: function (obj, value) { obj.isEnemy = value; } } }, _isEnemy_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isPersona_decorators, { kind: "field", name: "isPersona", static: false, private: false, access: { has: function (obj) { return "isPersona" in obj; }, get: function (obj) { return obj.isPersona; }, set: function (obj, value) { obj.isPersona = value; } } }, _isPersona_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasInherits_decorators, { kind: "field", name: "hasInherits", static: false, private: false, access: { has: function (obj) { return "hasInherits" in obj; }, get: function (obj) { return obj.hasInherits; }, set: function (obj, value) { obj.hasInherits = value; } } }, _hasInherits_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _statHeaders_decorators, { kind: "field", name: "statHeaders", static: false, private: false, access: { has: function (obj) { return "statHeaders" in obj; }, get: function (obj) { return obj.statHeaders; }, set: function (obj, value) { obj.statHeaders = value; } } }, _statHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _resistHeaders_decorators, { kind: "field", name: "resistHeaders", static: false, private: false, access: { has: function (obj) { return "resistHeaders" in obj; }, get: function (obj) { return obj.resistHeaders; }, set: function (obj, value) { obj.resistHeaders = value; } } }, _resistHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _affinityHeaders_decorators, { kind: "field", name: "affinityHeaders", static: false, private: false, access: { has: function (obj) { return "affinityHeaders" in obj; }, get: function (obj) { return obj.affinityHeaders; }, set: function (obj, value) { obj.affinityHeaders = value; } } }, _affinityHeaders_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _searchTagsChanged_decorators, { kind: "field", name: "searchTagsChanged", static: false, private: false, access: { has: function (obj) { return "searchTagsChanged" in obj; }, get: function (obj) { return obj.searchTagsChanged; }, set: function (obj, value) { obj.searchTagsChanged = value; } } }, _searchTagsChanged_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonListHeaderComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonListHeaderComponent = _classThis;
}();
