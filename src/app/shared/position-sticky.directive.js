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
exports.PositionStickyDirective = void 0;
var core_1 = require("@angular/core");
var PositionStickyDirective = exports.PositionStickyDirective = function () {
    var _classDecorators = [(0, core_1.Directive)({
            selector: '[appPositionSticky]'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _cPositionSticky_decorators;
    var _cPositionSticky_initializers = [];
    var _sZIndex_decorators;
    var _sZIndex_initializers = [];
    var _set_edges_decorators;
    var PositionStickyDirective = _classThis = /** @class */ (function () {
        function PositionStickyDirective_1(elementRef, renderer, edgesService) {
            this.elementRef = (__runInitializers(this, _instanceExtraInitializers), elementRef);
            this.renderer = renderer;
            this.edgesService = edgesService;
            this.cPositionSticky = __runInitializers(this, _cPositionSticky_initializers, true);
            this.sZIndex = __runInitializers(this, _sZIndex_initializers, 0);
            this.subscriptions = [];
            this._edges = { top: 0, bottom: 0, left: 0, right: 0, zIndex: 10 };
        }
        PositionStickyDirective_1.prototype.ngOnInit = function () {
            var _this = this;
            this.subscriptions.push(this.edgesService.parentEdges.subscribe(function (edges) {
                _this.edges = edges;
            }));
        };
        PositionStickyDirective_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        PositionStickyDirective_1.prototype.nextEdges = function () {
            var _this = this;
            setTimeout(function () { return _this.edgesService.nextEdges(_this.edges); });
        };
        Object.defineProperty(PositionStickyDirective_1.prototype, "edges", {
            get: function () {
                return Object.assign({}, this._edges, {
                    top: this._edges.top + this.elementRef.nativeElement.clientHeight,
                    zIndex: this._edges.zIndex - 1
                });
            },
            set: function (edges) {
                this._edges = edges;
                this.sZIndex = edges.zIndex;
                this.renderer.setStyle(this.elementRef.nativeElement, 'top', "".concat(edges.top, "px"));
                this.nextEdges();
            },
            enumerable: false,
            configurable: true
        });
        return PositionStickyDirective_1;
    }());
    __setFunctionName(_classThis, "PositionStickyDirective");
    (function () {
        _cPositionSticky_decorators = [(0, core_1.HostBinding)('class.position-sticky')];
        _sZIndex_decorators = [(0, core_1.HostBinding)('style.zIndex')];
        _set_edges_decorators = [(0, core_1.Input)()];
        __esDecorate(_classThis, null, _set_edges_decorators, { kind: "setter", name: "edges", static: false, private: false, access: { has: function (obj) { return "edges" in obj; }, set: function (obj, value) { obj.edges = value; } } }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _cPositionSticky_decorators, { kind: "field", name: "cPositionSticky", static: false, private: false, access: { has: function (obj) { return "cPositionSticky" in obj; }, get: function (obj) { return obj.cPositionSticky; }, set: function (obj, value) { obj.cPositionSticky = value; } } }, _cPositionSticky_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _sZIndex_decorators, { kind: "field", name: "sZIndex", static: false, private: false, access: { has: function (obj) { return "sZIndex" in obj; }, get: function (obj) { return obj.sZIndex; }, set: function (obj, value) { obj.sZIndex = value; } } }, _sZIndex_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        PositionStickyDirective = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PositionStickyDirective = _classThis;
}();
