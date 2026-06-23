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
exports.SkillListComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var sorted_table_component_1 = require("../../shared/sorted-table.component");
var SkillListComponent = exports.SkillListComponent = function () {
    var _classDecorators = [(0, core_1.Directive)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _elemOrder_decorators;
    var _elemOrder_initializers = [];
    var _inheritOrder_decorators;
    var _inheritOrder_initializers = [];
    var SkillListComponent = _classThis = /** @class */ (function (_super) {
        __extends(SkillListComponent_1, _super);
        function SkillListComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.elemOrder = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _elemOrder_initializers, void 0));
            _this.inheritOrder = __runInitializers(_this, _inheritOrder_initializers, void 0);
            _this.sortFuns = [];
            return _this;
        }
        SkillListComponent_1.prototype.ngOnInit = function () {
            this.nextSortFuns();
        };
        SkillListComponent_1.prototype.ngAfterViewChecked = function () {
            this.matchColWidths();
        };
        SkillListComponent_1.prototype.nextSortFuns = function () {
            var _this = this;
            this.sortFuns = [
                function (a, b) { return (_this.elemOrder[a.element] - _this.elemOrder[b.element]) * 10000 + a.rank - b.rank; },
                function (a, b) { return (_this.elemOrder[a.element] - _this.elemOrder[b.element]) * 10000 + a.rank - b.rank; },
                function (a, b) { return a.name.localeCompare(b.name); },
                function (a, b) { return b.cost - a.cost; },
                function (a, b) { return a.rank - b.rank; }
            ];
            if (this.inheritOrder) {
                this.sortFuns.push(function (a, b) { return (_this.inheritOrder[a.inherit] - _this.inheritOrder[b.inherit]); });
            }
        };
        SkillListComponent_1.prototype.getSortFun = function (sortFunIndex) {
            return this.sortFuns[sortFunIndex];
        };
        return SkillListComponent_1;
    }(sorted_table_component_1.SortedTableComponent));
    __setFunctionName(_classThis, "SkillListComponent");
    (function () {
        _elemOrder_decorators = [(0, core_2.Input)()];
        _inheritOrder_decorators = [(0, core_2.Input)()];
        __esDecorate(null, null, _elemOrder_decorators, { kind: "field", name: "elemOrder", static: false, private: false, access: { has: function (obj) { return "elemOrder" in obj; }, get: function (obj) { return obj.elemOrder; }, set: function (obj, value) { obj.elemOrder = value; } } }, _elemOrder_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inheritOrder_decorators, { kind: "field", name: "inheritOrder", static: false, private: false, access: { has: function (obj) { return "inheritOrder" in obj; }, get: function (obj) { return obj.inheritOrder; }, set: function (obj, value) { obj.inheritOrder = value; } } }, _inheritOrder_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SkillListComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SkillListComponent = _classThis;
}();
