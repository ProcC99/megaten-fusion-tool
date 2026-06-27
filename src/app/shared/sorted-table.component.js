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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedTableComponent = exports.SortedTableHeaderComponent = void 0;
var core_1 = require("@angular/core");
var column_widths_directive_1 = require("./column-widths.directive");
var position_sticky_directive_1 = require("../shared/position-sticky.directive");
var SortedTableHeaderComponent = exports.SortedTableHeaderComponent = function () {
    var _classDecorators = [(0, core_1.Directive)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _sortFunIndexChanged_decorators;
    var _sortFunIndexChanged_initializers = [];
    var _set_sortFunIndex_decorators;
    var SortedTableHeaderComponent = _classThis = /** @class */ (function () {
        function SortedTableHeaderComponent_1() {
            this.sortAsc = (__runInitializers(this, _instanceExtraInitializers), true);
            this.sortAscIndex = 1;
            this.sortFunIndexChanged = __runInitializers(this, _sortFunIndexChanged_initializers, new core_1.EventEmitter());
        }
        Object.defineProperty(SortedTableHeaderComponent_1.prototype, "sortFunIndex", {
            get: function () {
                return (this.sortAsc ? 1 : -1) * this.sortAscIndex;
            },
            set: function (sortFunIndex) {
                this.sortAsc = sortFunIndex > 0;
                this.sortAscIndex = (this.sortAsc ? 1 : -1) * sortFunIndex;
            },
            enumerable: false,
            configurable: true
        });
        SortedTableHeaderComponent_1.prototype.sortDirClass = function (sortAscIndex) {
            return this.sortAscIndex !== sortAscIndex ? 'none' :
                this.sortAsc ? 'asc' : 'desc';
        };
        SortedTableHeaderComponent_1.prototype.nextSortFunIndex = function (sortAscIndex) {
            this.sortAsc = this.sortAscIndex !== sortAscIndex ? true : !this.sortAsc;
            this.sortAscIndex = sortAscIndex;
            this.sortFunIndexChanged.emit(this.sortFunIndex);
        };
        return SortedTableHeaderComponent_1;
    }());
    __setFunctionName(_classThis, "SortedTableHeaderComponent");
    (function () {
        _sortFunIndexChanged_decorators = [(0, core_1.Output)()];
        _set_sortFunIndex_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis, null, _set_sortFunIndex_decorators, { kind: "setter", name: "sortFunIndex", static: false, private: false, access: { has: function (obj) { return "sortFunIndex" in obj; }, set: function (obj, value) { obj.sortFunIndex = value; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _sortFunIndexChanged_decorators, { kind: "field", name: "sortFunIndexChanged", static: false, private: false, access: { has: function (obj) { return "sortFunIndexChanged" in obj; }, get: function (obj) { return obj.sortFunIndexChanged; }, set: function (obj, value) { obj.sortFunIndexChanged = value; } } }, _sortFunIndexChanged_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SortedTableHeaderComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SortedTableHeaderComponent = _classThis;
}();
var SortedTableComponent = exports.SortedTableComponent = function () {
    var _classDecorators_1 = [(0, core_1.Directive)()];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _stickyTable_decorators;
    var _stickyTable_initializers = [];
    var _stickyHeader_decorators;
    var _stickyHeader_initializers = [];
    var _hiddenHeader_decorators;
    var _hiddenHeader_initializers = [];
    var _set_rowData_decorators;
    var _set_sortFunIndex_decorators;
    var SortedTableComponent = _classThis_1 = /** @class */ (function () {
        function SortedTableComponent_1() {
            this.stickyTable = (__runInitializers(this, _instanceExtraInitializers_1), __runInitializers(this, _stickyTable_initializers, void 0));
            this.stickyHeader = __runInitializers(this, _stickyHeader_initializers, void 0);
            this.hiddenHeader = __runInitializers(this, _hiddenHeader_initializers, void 0);
            this._rowData = [];
            this._sortFunIndex = 0;
        }
        Object.defineProperty(SortedTableComponent_1.prototype, "rowData", {
            get: function () {
                return this._rowData;
            },
            set: function (rowData) {
                this._rowData = rowData;
                this.sort();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SortedTableComponent_1.prototype, "sortFunIndex", {
            get: function () {
                return this._sortFunIndex;
            },
            set: function (sortFunIndex) {
                this._sortFunIndex = sortFunIndex;
                this.sort();
            },
            enumerable: false,
            configurable: true
        });
        SortedTableComponent_1.prototype.sort = function () {
            var _this = this;
            if (this.sortFunIndex >= 0) {
                this.rowData.sort(this.getSortFun(this.sortFunIndex));
            }
            else if (this.sortFunIndex < 0) {
                this.rowData.sort(function (a, b) { return _this.getSortFun(-1 * _this.sortFunIndex)(b, a); });
            }
            setTimeout(this.matchColWidths.bind(this));
        };
        SortedTableComponent_1.prototype.matchColWidths = function () {
            if (this.stickyHeader && this.hiddenHeader) {
                this.stickyHeader.colWidths = this.hiddenHeader.colWidths;
            }
        };
        return SortedTableComponent_1;
    }());
    __setFunctionName(_classThis_1, "SortedTableComponent");
    (function () {
        _stickyTable_decorators = [(0, core_1.ViewChild)(position_sticky_directive_1.PositionStickyDirective)];
        _stickyHeader_decorators = [(0, core_1.ViewChild)('stickyHeader', { read: column_widths_directive_1.ColumnWidthsDirective })];
        _hiddenHeader_decorators = [(0, core_1.ViewChild)('hiddenHeader', { read: column_widths_directive_1.ColumnWidthsDirective })];
        _set_rowData_decorators = [(0, core_1.Input)()];
        _set_sortFunIndex_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis_1, null, _set_rowData_decorators, { kind: "setter", name: "rowData", static: false, private: false, access: { has: function (obj) { return "rowData" in obj; }, set: function (obj, value) { obj.rowData = value; } } }, null, _instanceExtraInitializers_1);
        __esDecorate(_classThis_1, null, _set_sortFunIndex_decorators, { kind: "setter", name: "sortFunIndex", static: false, private: false, access: { has: function (obj) { return "sortFunIndex" in obj; }, set: function (obj, value) { obj.sortFunIndex = value; } } }, null, _instanceExtraInitializers_1);
        __esDecorate(null, null, _stickyTable_decorators, { kind: "field", name: "stickyTable", static: false, private: false, access: { has: function (obj) { return "stickyTable" in obj; }, get: function (obj) { return obj.stickyTable; }, set: function (obj, value) { obj.stickyTable = value; } } }, _stickyTable_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _stickyHeader_decorators, { kind: "field", name: "stickyHeader", static: false, private: false, access: { has: function (obj) { return "stickyHeader" in obj; }, get: function (obj) { return obj.stickyHeader; }, set: function (obj, value) { obj.stickyHeader = value; } } }, _stickyHeader_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _hiddenHeader_decorators, { kind: "field", name: "hiddenHeader", static: false, private: false, access: { has: function (obj) { return "hiddenHeader" in obj; }, get: function (obj) { return obj.hiddenHeader; }, set: function (obj, value) { obj.hiddenHeader = value; } } }, _hiddenHeader_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        SortedTableComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return SortedTableComponent = _classThis_1;
}();
