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
exports.FusionTrioTableComponent = exports.FusionTrioTableHeaderComponent = exports.FusionTrioTableRowComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var sorted_table_component_1 = require("../../shared/sorted-table.component");
var FusionTrioTableRowComponent = exports.FusionTrioTableRowComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tbody.app-fusion-trio-table-row',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <tr *ngIf=\"!showing\">\n      <th class=\"nav\"\n        [style.height.em]=\"1\"\n        (click)=\"toggleShowing.emit(showIndex)\">\n        Show\n      </th>\n      <td>{{ trio.minPrice }}</td>\n      <td>{{ trio.demon.race }}</td>\n      <td>{{ trio.demon.currLvl }}</td>\n      <td><a routerLink=\"{{ baseUrl }}/{{ trio.demon.name }}\">{{ trio.demon.name }}</a></td>\n      <td colspan=\"6\" [style.color]=\"'#666'\">{{ trio.fusions.length }} recipes hidden</td>\n    </tr>\n    <ng-container *ngIf=\"showing\">\n      <tr>\n        <th class=\"nav active\"\n          [style.height.em]=\"1\"\n          [attr.rowspan]=\"trio.fusions.length + 1\"\n          (click)=\"toggleShowing.emit(showIndex)\">\n          Hide\n        </th>\n      </tr>\n      <tr *ngFor=\"let recipe of trio.fusions\">\n        <td>{{ recipe.price }}</td>\n        <td>{{ trio.demon.race }}</td>\n        <td>{{ trio.demon.currLvl }}</td>\n        <td><a routerLink=\"{{ baseUrl }}/{{ trio.demon.name }}\">{{ trio.demon.name }}</a></td>\n        <ng-container *ngFor=\"let demon of [ recipe.d1, recipe.d2, recipe.d3 ]\">\n          <ng-container *ngIf=\"trio.demon !== demon\">\n            <td>{{ demon.race }}</td>\n            <td>{{ demon.currLvl }}</td>\n            <td><a routerLink=\"{{ baseUrl }}/{{ demon.name }}\">{{ demon.name }}</a></td>\n          </ng-container>\n        </ng-container>\n      </tr>\n    </ng-container>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _trio_decorators;
    var _trio_initializers = [];
    var _showing_decorators;
    var _showing_initializers = [];
    var _showIndex_decorators;
    var _showIndex_initializers = [];
    var _baseUrl_decorators;
    var _baseUrl_initializers = [];
    var _toggleShowing_decorators;
    var _toggleShowing_initializers = [];
    var FusionTrioTableRowComponent = _classThis = /** @class */ (function () {
        function FusionTrioTableRowComponent_1() {
            this.trio = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _trio_initializers, void 0));
            this.showing = __runInitializers(this, _showing_initializers, void 0);
            this.showIndex = __runInitializers(this, _showIndex_initializers, void 0);
            this.baseUrl = __runInitializers(this, _baseUrl_initializers, '../../..');
            this.toggleShowing = __runInitializers(this, _toggleShowing_initializers, new core_1.EventEmitter());
        }
        return FusionTrioTableRowComponent_1;
    }());
    __setFunctionName(_classThis, "FusionTrioTableRowComponent");
    (function () {
        _trio_decorators = [(0, core_1.Input)()];
        _showing_decorators = [(0, core_1.Input)()];
        _showIndex_decorators = [(0, core_1.Input)()];
        _baseUrl_decorators = [(0, core_1.Input)()];
        _toggleShowing_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _trio_decorators, { kind: "field", name: "trio", static: false, private: false, access: { has: function (obj) { return "trio" in obj; }, get: function (obj) { return obj.trio; }, set: function (obj, value) { obj.trio = value; } } }, _trio_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _showing_decorators, { kind: "field", name: "showing", static: false, private: false, access: { has: function (obj) { return "showing" in obj; }, get: function (obj) { return obj.showing; }, set: function (obj, value) { obj.showing = value; } } }, _showing_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _showIndex_decorators, { kind: "field", name: "showIndex", static: false, private: false, access: { has: function (obj) { return "showIndex" in obj; }, get: function (obj) { return obj.showIndex; }, set: function (obj, value) { obj.showIndex = value; } } }, _showIndex_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _baseUrl_decorators, { kind: "field", name: "baseUrl", static: false, private: false, access: { has: function (obj) { return "baseUrl" in obj; }, get: function (obj) { return obj.baseUrl; }, set: function (obj, value) { obj.baseUrl = value; } } }, _baseUrl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _toggleShowing_decorators, { kind: "field", name: "toggleShowing", static: false, private: false, access: { has: function (obj) { return "toggleShowing" in obj; }, get: function (obj) { return obj.toggleShowing; }, set: function (obj, value) { obj.toggleShowing = value; } } }, _toggleShowing_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        FusionTrioTableRowComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FusionTrioTableRowComponent = _classThis;
}();
var FusionTrioTableHeaderComponent = exports.FusionTrioTableHeaderComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'tfoot.app-fusion-trio-table-header',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <tr>\n      <th colspan=\"11\" class=\"title\">{{ title }}</th>\n    </tr>\n    <tr>\n      <th class=\"sortable\" rowspan=\"2\" [style.width.%]=\"8\" (click)=\"toggleHideAll()\">Hide All</th>\n      <th rowSpan=\"2\" [style.width.%]=\"8\" [ngClass]=\"[ 'sortable', sortDirClass(1) ]\" (click)=\"nextSortFunIndex(1)\">Price</th>\n      <th colspan=\"3\" [style.width.%]=\"28\">{{ leftHeader }}</th>\n      <th colspan=\"3\" [style.width.%]=\"28\">Ingredient 2</th>\n      <th colspan=\"3\" [style.width.%]=\"28\">Ingredient 3</th>\n    </tr>\n    <tr>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(2) ]\" (click)=\"nextSortFunIndex(2)\">Race</th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(3) ]\" (click)=\"nextSortFunIndex(3)\">Lvl<span>--</span></th>\n      <th [ngClass]=\"[ 'sortable', sortDirClass(4) ]\" (click)=\"nextSortFunIndex(4)\">Name</th>\n      <th>Race</th>\n      <th>Lvl</th>\n      <th>Name</th>\n      <th>Race</th>\n      <th>Lvl</th>\n      <th>Name</th>\n    </tr>\n  ",
            styles: ["\n    span {\n      color: transparent;\n    }\n  "]
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _title_decorators;
    var _title_initializers = [];
    var _leftHeader_decorators;
    var _leftHeader_initializers = [];
    var _hideAll_decorators;
    var _hideAll_initializers = [];
    var FusionTrioTableHeaderComponent = _classThis_1 = /** @class */ (function (_super) {
        __extends(FusionTrioTableHeaderComponent_1, _super);
        function FusionTrioTableHeaderComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.title = (__runInitializers(_this, _instanceExtraInitializers_1), __runInitializers(_this, _title_initializers, void 0));
            _this.leftHeader = __runInitializers(_this, _leftHeader_initializers, void 0);
            _this.hideAll = __runInitializers(_this, _hideAll_initializers, new core_1.EventEmitter());
            return _this;
        }
        FusionTrioTableHeaderComponent_1.prototype.toggleHideAll = function () {
            this.hideAll.emit(true);
        };
        return FusionTrioTableHeaderComponent_1;
    }(sorted_table_component_1.SortedTableHeaderComponent));
    __setFunctionName(_classThis_1, "FusionTrioTableHeaderComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _leftHeader_decorators = [(0, core_1.Input)()];
        _hideAll_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _leftHeader_decorators, { kind: "field", name: "leftHeader", static: false, private: false, access: { has: function (obj) { return "leftHeader" in obj; }, get: function (obj) { return obj.leftHeader; }, set: function (obj, value) { obj.leftHeader = value; } } }, _leftHeader_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _hideAll_decorators, { kind: "field", name: "hideAll", static: false, private: false, access: { has: function (obj) { return "hideAll" in obj; }, get: function (obj) { return obj.hideAll; }, set: function (obj, value) { obj.hideAll = value; } } }, _hideAll_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        FusionTrioTableHeaderComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return FusionTrioTableHeaderComponent = _classThis_1;
}();
var FusionTrioTableComponent = exports.FusionTrioTableComponent = function () {
    var _classDecorators_2 = [(0, core_1.Component)({
            selector: 'app-fusion-trio-table',
            providers: [position_edges_service_1.PositionEdgesService],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <div>\n      <table appPositionSticky class=\"list-table\">\n        <tfoot #stickyHeader appColumnWidths\n          class=\"app-fusion-trio-table-header\"\n          [title]=\"title\"\n          [leftHeader]=\"leftHeader\"\n          [sortFunIndex]=\"sortFunIndex\"\n          (hideAll)=\"toggleHideAll()\"\n          (sortFunIndexChanged)=\"sortFunIndex = $event\">\n        </tfoot>\n      </table>\n      <table class=\"list-table\">\n        <tfoot #hiddenHeader appColumnWidths\n          class=\"app-fusion-trio-table-header\"\n          [title]=\"title\"\n          [leftHeader]=\"leftHeader\"\n          [style.visibility]=\"'collapse'\">\n        </tfoot>\n        <tbody *ngIf=\"!rowData.length\">\n          <tr><td colspan=\"11\">No fusions found!</td></tr>\n        </tbody>\n        <tbody *ngFor=\"let data of rowData; let i = index\"\n          class=\"app-fusion-trio-table-row\"\n          [trio]=\"data\"\n          [showing]=\"showing[i]\"\n          [showIndex]=\"i\"\n          (toggleShowing)=\"toggleShowing($event)\">\n        </tbody>\n      </table>\n    </div>\n  "
        })];
    var _classDescriptor_2;
    var _classExtraInitializers_2 = [];
    var _classThis_2;
    var _instanceExtraInitializers_2 = [];
    var _title_decorators;
    var _title_initializers = [];
    var _leftHeader_decorators;
    var _leftHeader_initializers = [];
    var _raceOrder_decorators;
    var _raceOrder_initializers = [];
    var FusionTrioTableComponent = _classThis_2 = /** @class */ (function (_super) {
        __extends(FusionTrioTableComponent_1, _super);
        function FusionTrioTableComponent_1(changeDetector) {
            var _this = _super.call(this) || this;
            _this.changeDetector = (__runInitializers(_this, _instanceExtraInitializers_2), changeDetector);
            _this.title = __runInitializers(_this, _title_initializers, 'Fusion Trio Table');
            _this.leftHeader = __runInitializers(_this, _leftHeader_initializers, 'Ingredient 1');
            _this.raceOrder = __runInitializers(_this, _raceOrder_initializers, void 0);
            _this.showing = [];
            _this.sortFuns = [];
            return _this;
        }
        FusionTrioTableComponent_1.prototype.ngOnInit = function () {
            this.nextSortFuns();
        };
        FusionTrioTableComponent_1.prototype.ngAfterViewChecked = function () {
            this.matchColWidths();
        };
        FusionTrioTableComponent_1.prototype.toggleShowing = function (hideIndex) {
            this.showing[hideIndex] = !this.showing[hideIndex];
        };
        FusionTrioTableComponent_1.prototype.toggleHideAll = function () {
            for (var i = 0; i < this.showing.length; i++) {
                this.showing[i] = false;
            }
        };
        FusionTrioTableComponent_1.prototype.nextSortFuns = function () {
            var _this = this;
            this.sortFuns = [];
            if (this.raceOrder) {
                this.sortFuns.push(function (a, b) { return a.minPrice - b.minPrice; }, function (a, b) { return a.minPrice - b.minPrice; }, function (a, b) { return (_this.raceOrder[a.demon.race] - _this.raceOrder[b.demon.race]) * 200 + a.demon.currLvl - b.demon.currLvl; }, function (a, b) { return a.demon.currLvl - b.demon.currLvl; }, function (a, b) { return a.demon.name.localeCompare(b.demon.name); });
                this.sort();
            }
        };
        FusionTrioTableComponent_1.prototype.getSortFun = function (sortFunIndex) {
            return this.sortFuns[sortFunIndex];
        };
        return FusionTrioTableComponent_1;
    }(sorted_table_component_1.SortedTableComponent));
    __setFunctionName(_classThis_2, "FusionTrioTableComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _leftHeader_decorators = [(0, core_1.Input)()];
        _raceOrder_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _leftHeader_decorators, { kind: "field", name: "leftHeader", static: false, private: false, access: { has: function (obj) { return "leftHeader" in obj; }, get: function (obj) { return obj.leftHeader; }, set: function (obj, value) { obj.leftHeader = value; } } }, _leftHeader_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, null, _raceOrder_decorators, { kind: "field", name: "raceOrder", static: false, private: false, access: { has: function (obj) { return "raceOrder" in obj; }, get: function (obj) { return obj.raceOrder; }, set: function (obj, value) { obj.raceOrder = value; } } }, _raceOrder_initializers, _instanceExtraInitializers_2);
        __esDecorate(null, _classDescriptor_2 = { value: _classThis_2 }, _classDecorators_2, { kind: "class", name: _classThis_2.name }, null, _classExtraInitializers_2);
        FusionTrioTableComponent = _classThis_2 = _classDescriptor_2.value;
        __runInitializers(_classThis_2, _classExtraInitializers_2);
    })();
    return FusionTrioTableComponent = _classThis_2;
}();
