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
exports.ColumnWidthsDirective = void 0;
var core_1 = require("@angular/core");
var ColumnWidthsDirective = exports.ColumnWidthsDirective = function () {
    var _classDecorators = [(0, core_1.Directive)({
            selector: '[appColumnWidths]'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _borderWidth_decorators;
    var _borderWidth_initializers = [];
    var _set_colWidths_decorators;
    var ColumnWidthsDirective = _classThis = /** @class */ (function () {
        function ColumnWidthsDirective_1(elementRef, renderer) {
            this.elementRef = (__runInitializers(this, _instanceExtraInitializers), elementRef);
            this.renderer = renderer;
            this.borderWidth = __runInitializers(this, _borderWidth_initializers, 2);
        }
        Object.defineProperty(ColumnWidthsDirective_1.prototype, "colWidths", {
            get: function () {
                var colWidths = [];
                var rows = this.elementRef.nativeElement.children;
                if (rows.length) {
                    for (var _i = 0, _a = rows[rows.length - 1].children; _i < _a.length; _i++) {
                        var column = _a[_i];
                        colWidths.push(column.getBoundingClientRect().width - 2 * this.borderWidth);
                    }
                }
                return colWidths;
            },
            set: function (colWidths) {
                var rows = this.elementRef.nativeElement.children;
                if (rows.length) {
                    var cols = rows[rows.length - 1].children;
                    for (var i = 0; i < cols.length; i++) {
                        this.renderer.setStyle(cols[i], 'width', "".concat(colWidths[i], "px"));
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        return ColumnWidthsDirective_1;
    }());
    __setFunctionName(_classThis, "ColumnWidthsDirective");
    (function () {
        _borderWidth_decorators = [(0, core_1.Input)()];
        _set_colWidths_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis, null, _set_colWidths_decorators, { kind: "setter", name: "colWidths", static: false, private: false, access: { has: function (obj) { return "colWidths" in obj; }, set: function (obj, value) { obj.colWidths = value; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _borderWidth_decorators, { kind: "field", name: "borderWidth", static: false, private: false, access: { has: function (obj) { return "borderWidth" in obj; }, get: function (obj) { return obj.borderWidth; }, set: function (obj, value) { obj.borderWidth = value; } } }, _borderWidth_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        ColumnWidthsDirective = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ColumnWidthsDirective = _classThis;
}();
