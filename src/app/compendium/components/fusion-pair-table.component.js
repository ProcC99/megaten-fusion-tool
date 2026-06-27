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
exports.FusionPairTableComponent = exports.FusionPairTableHeaderComponent = exports.FusionPairTableRowComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var sorted_table_component_1 = require("../../shared/sorted-table.component");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var FusionPairTableRowComponent = exports.FusionPairTableRowComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tr.app-fusion-pair-table-row',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <td class=\"price\">{{ data.price }}</td>\n    <td>{{ data.race1 }}</td>\n    <td>{{ data.lvl1 | lvlToNumber }}</td>\n    <td><a routerLink=\"{{ leftBaseUrl }}/{{ data.name1 }}\">{{ data.name1 }}</a></td>\n    <td>{{ data.race2 }}</td>\n    <td>{{ data.lvl2 | lvlToNumber }}</td>\n    <td><a routerLink=\"{{ rightBaseUrl }}/{{ data.name2 }}\">{{ data.name2 }}</a></td>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var _leftBaseUrl_decorators;
    var _leftBaseUrl_initializers = [];
    var _rightBaseUrl_decorators;
    var _rightBaseUrl_initializers = [];
    var FusionPairTableRowComponent = _classThis = /** @class */ (function () {
        function FusionPairTableRowComponent_1() {
            this.data = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _data_initializers, void 0));
            this.leftBaseUrl = __runInitializers(this, _leftBaseUrl_initializers, void 0);
            this.rightBaseUrl = __runInitializers(this, _rightBaseUrl_initializers, void 0);
        }
        return FusionPairTableRowComponent_1;
    }());
    __setFunctionName(_classThis, "FusionPairTableRowComponent");
    (function () {
        _data_decorators = [(0, core_1.Input)()];
        _leftBaseUrl_decorators = [(0, core_1.Input)()];
        _rightBaseUrl_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } } }, _data_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _leftBaseUrl_decorators, { kind: "field", name: "leftBaseUrl", static: false, private: false, access: { has: function (obj) { return "leftBaseUrl" in obj; }, get: function (obj) { return obj.leftBaseUrl; }, set: function (obj, value) { obj.leftBaseUrl = value; } } }, _leftBaseUrl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _rightBaseUrl_decorators, { kind: "field", name: "rightBaseUrl", static: false, private: false, access: { has: function (obj) { return "rightBaseUrl" in obj; }, get: function (obj) { return obj.rightBaseUrl; }, set: function (obj, value) { obj.rightBaseUrl = value; } } }, _rightBaseUrl_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionPairTableRowComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionPairTableRowComponent = _classThis;
}();
var FusionPairTableHeaderComponent = exports.FusionPairTableHeaderComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'tfoot.app-fusion-pair-table-header',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <tr>\n      <th colspan=\"7\" class=\"title\">{{ title }}</th>\n    </tr>\n    <tr>\n      <th rowSpan=\"2\" [style.width.%]=\"10\" [ngClass]=\"[ 'sortable', sortDirClass(1) ]\" (click)=\"nextSortFunIndex(1)\">{{ msgs.Price | translateComp:lang }}</th>\n      <th colspan=\"3\" [style.width.%]=\"45\">{{ leftHeader }}</th>\n      <th colspan=\"3\" [style.width.%]=\"45\">{{ rightHeader }}</th>\n    </tr>\n    <tr>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(2) ]\" (click)=\"nextSortFunIndex(2)\">{{ msgs.Race | translateComp:lang }}</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(3) ]\" (click)=\"nextSortFunIndex(3)\">Lvl</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(4) ]\" (click)=\"nextSortFunIndex(4)\">{{ msgs.Name | translateComp:lang }}</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(5) ]\" (click)=\"nextSortFunIndex(5)\">{{ msgs.Race | translateComp:lang }}</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(6) ]\" (click)=\"nextSortFunIndex(6)\">Lvl</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(7) ]\" (click)=\"nextSortFunIndex(7)\">{{ msgs.Name | translateComp:lang }}</th>\n    </tr>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _title_decorators;
    var _title_initializers = [];
    var _leftHeader_decorators;
    var _leftHeader_initializers = [];
    var _rightHeader_decorators;
    var _rightHeader_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var FusionPairTableHeaderComponent = _classThis_1 = /** @class */ (function (_super) {
        __extends(FusionPairTableHeaderComponent_1, _super);
        function FusionPairTableHeaderComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.title = (__runInitializers(_this, _instanceExtraInitializers_1), __runInitializers(_this, _title_initializers, void 0));
            _this.leftHeader = __runInitializers(_this, _leftHeader_initializers, void 0);
            _this.rightHeader = __runInitializers(_this, _rightHeader_initializers, void 0);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.msgs = translations_json_1.default.FusionPairTableComponent;
            return _this;
        }
        return FusionPairTableHeaderComponent_1;
    }(sorted_table_component_1.SortedTableHeaderComponent));
    __setFunctionName(_classThis_1, "FusionPairTableHeaderComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _leftHeader_decorators = [(0, core_1.Input)()];
        _rightHeader_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _leftHeader_decorators, { kind: "field", name: "leftHeader", static: false, private: false, access: { has: function (obj) { return "leftHeader" in obj; }, get: function (obj) { return obj.leftHeader; }, set: function (obj, value) { obj.leftHeader = value; } } }, _leftHeader_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _rightHeader_decorators, { kind: "field", name: "rightHeader", static: false, private: false, access: { has: function (obj) { return "rightHeader" in obj; }, get: function (obj) { return obj.rightHeader; }, set: function (obj, value) { obj.rightHeader = value; } } }, _rightHeader_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        FusionPairTableHeaderComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return FusionPairTableHeaderComponent = _classThis_1;
}();
var FusionPairTableComponent = exports.FusionPairTableComponent = function () {
    var _classDecorators_2 = [(0, core_1.Component)({
            selector: 'app-fusion-pair-table',
            providers: [position_edges_service_1.PositionEdgesService],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <div>\n      <table appPositionSticky class=\"list-table\">\n        <tfoot #stickyHeader appColumnWidths\n          class=\"app-fusion-pair-table-header\"\n          [lang]=\"lang\"\n          [title]=\"title\"\n          [leftHeader]=\"leftHeader\"\n          [rightHeader]=\"rightHeader\"\n          [sortFunIndex]=\"sortFunIndex\"\n          (sortFunIndexChanged)=\"sortFunIndex = $event\">\n        </tfoot>\n      </table>\n      <table class=\"list-table\">\n        <tfoot #hiddenHeader appColumnWidths\n          class=\"app-fusion-pair-table-header\"\n          [lang]=\"lang\"\n          [title]=\"title\"\n          [leftHeader]=\"leftHeader\"\n          [rightHeader]=\"rightHeader\"\n          [style.visibility]=\"'collapse'\">\n        </tfoot>\n        <tbody>\n          <tr *ngIf=\"!rowData.length\">\n            <td colspan=\"7\">{{ msgs.NoFusionsFound | translateComp:lang }}</td>\n          </tr>\n          <tr *ngFor=\"let data of rowData.slice(0, currRow)\"\n            class=\"app-fusion-pair-table-row\"\n            [ngClass]=\"data.notes\"\n            [data]=\"data\"\n            [leftBaseUrl]=\"leftBaseUrl\"\n            [rightBaseUrl]=\"rightBaseUrl\">\n          </tr>\n          <tr *ngIf=\"currRow < rowData.length\">\n            <th class=\"nav\" colspan=\"7\"\n              [style.height.em]=\"2\"\n              (click)=\"currRow = currRow + incrRow\">\n              Show next {{ incrRow }} out of {{ rowData.length - currRow }}\n            </th>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  "
        })];
    var _classDescriptor_2;
    var _classExtraInitializers_2 = [];
    var _classThis_2;
    var _instanceExtraInitializers_2 = [];
    var _raceOrder_decorators;
    var _raceOrder_initializers = [];
    var _leftHeader_decorators;
    var _leftHeader_initializers = [];
    var _rightHeader_decorators;
    var _rightHeader_initializers = [];
    var _leftBaseUrl_decorators;
    var _leftBaseUrl_initializers = [];
    var _rightBaseUrl_decorators;
    var _rightBaseUrl_initializers = [];
    var _initRow_decorators;
    var _initRow_initializers = [];
    var _incrRow_decorators;
    var _incrRow_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _set_title_decorators;
    var FusionPairTableComponent = _classThis_2 = /** @class */ (function (_super) {
        __extends(FusionPairTableComponent_1, _super);
        function FusionPairTableComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._title = (__runInitializers(_this, _instanceExtraInitializers_2), 'Ingredient 1 x Ingredient 2 = Result');
            _this.raceOrder = __runInitializers(_this, _raceOrder_initializers, void 0);
            _this.leftHeader = __runInitializers(_this, _leftHeader_initializers, 'Ingredient 1');
            _this.rightHeader = __runInitializers(_this, _rightHeader_initializers, 'Ingredient 2');
            _this.leftBaseUrl = __runInitializers(_this, _leftBaseUrl_initializers, '../..');
            _this.rightBaseUrl = __runInitializers(_this, _rightBaseUrl_initializers, '../..');
            _this.initRow = __runInitializers(_this, _initRow_initializers, 500);
            _this.incrRow = __runInitializers(_this, _incrRow_initializers, 500);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.msgs = translations_json_1.default.FusionPairTableComponent;
            _this.sortFuns = [];
            _this.currRow = _this.initRow;
            return _this;
        }
        Object.defineProperty(FusionPairTableComponent_1.prototype, "title", {
            get: function () {
                return this._title;
            },
            set: function (title) {
                this._title = title;
                this.currRow = this.initRow;
            },
            enumerable: false,
            configurable: true
        });
        FusionPairTableComponent_1.prototype.ngOnInit = function () {
            this.nextSortFuns();
        };
        FusionPairTableComponent_1.prototype.nextSortFuns = function () {
            var _this = this;
            this.sortFuns = [];
            if (this.raceOrder) {
                this.sortFuns.push(function (f1, f2) { return f1.price - f2.price; }, function (f1, f2) { return f1.price - f2.price; }, function (f1, f2) { return (_this.raceOrder[f1.race1] - _this.raceOrder[f2.race1]) * 200 + f2.lvl1 - f1.lvl1; }, function (f1, f2) { return f1.lvl1 - f2.lvl1; }, function (f1, f2) { return f1.name1.localeCompare(f2.name1); }, function (f1, f2) { return (_this.raceOrder[f1.race2] - _this.raceOrder[f2.race2]) * 200 + f2.lvl2 - f1.lvl2; }, function (f1, f2) { return f1.lvl2 - f2.lvl2; }, function (f1, f2) { return f1.name2.localeCompare(f2.name2); });
                this.sort();
            }
        };
        FusionPairTableComponent_1.prototype.getSortFun = function (sortFunIndex) {
            return this.sortFuns[sortFunIndex];
        };
        return FusionPairTableComponent_1;
    }(sorted_table_component_1.SortedTableComponent));
    __setFunctionName(_classThis_2, "FusionPairTableComponent");
    (function () {
        _raceOrder_decorators = [(0, core_1.Input)()];
        _leftHeader_decorators = [(0, core_1.Input)()];
        _rightHeader_decorators = [(0, core_1.Input)()];
        _leftBaseUrl_decorators = [(0, core_1.Input)()];
        _rightBaseUrl_decorators = [(0, core_1.Input)()];
        _initRow_decorators = [(0, core_1.Input)()];
        _incrRow_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _set_title_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis_2, null, _set_title_decorators, { kind: "setter", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, set: function (obj, value) { obj.title = value; } } }, null, _instanceExtraInitializers_2);
        __esDecorate(null, null, _raceOrder_decorators, { kind: "field", name: "raceOrder", static: false, private: false, access: { has: function (obj) { return "raceOrder" in obj; }, get: function (obj) { return obj.raceOrder; }, set: function (obj, value) { obj.raceOrder = value; } } }, _raceOrder_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _leftHeader_decorators, { kind: "field", name: "leftHeader", static: false, private: false, access: { has: function (obj) { return "leftHeader" in obj; }, get: function (obj) { return obj.leftHeader; }, set: function (obj, value) { obj.leftHeader = value; } } }, _leftHeader_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _rightHeader_decorators, { kind: "field", name: "rightHeader", static: false, private: false, access: { has: function (obj) { return "rightHeader" in obj; }, get: function (obj) { return obj.rightHeader; }, set: function (obj, value) { obj.rightHeader = value; } } }, _rightHeader_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _leftBaseUrl_decorators, { kind: "field", name: "leftBaseUrl", static: false, private: false, access: { has: function (obj) { return "leftBaseUrl" in obj; }, get: function (obj) { return obj.leftBaseUrl; }, set: function (obj, value) { obj.leftBaseUrl = value; } } }, _leftBaseUrl_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _rightBaseUrl_decorators, { kind: "field", name: "rightBaseUrl", static: false, private: false, access: { has: function (obj) { return "rightBaseUrl" in obj; }, get: function (obj) { return obj.rightBaseUrl; }, set: function (obj, value) { obj.rightBaseUrl = value; } } }, _rightBaseUrl_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _initRow_decorators, { kind: "field", name: "initRow", static: false, private: false, access: { has: function (obj) { return "initRow" in obj; }, get: function (obj) { return obj.initRow; }, set: function (obj, value) { obj.initRow = value; } } }, _initRow_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _incrRow_decorators, { kind: "field", name: "incrRow", static: false, private: false, access: { has: function (obj) { return "incrRow" in obj; }, get: function (obj) { return obj.incrRow; }, set: function (obj, value) { obj.incrRow = value; } } }, _incrRow_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, _classDescriptor_2 = { value: _classThis_2 }, _classDecorators_2, { kind: "class", name: _classThis_2.name }, null, _classExtraInitializers_2);
        FusionPairTableComponent = _classThis_2 = _classDescriptor_2.value;
        __runInitializers(_classThis_2, _classExtraInitializers_2);
    })();
    return FusionPairTableComponent = _classThis_2;
}();
