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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemonListContainerComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var DemonListContainerComponent = exports.DemonListContainerComponent = function () {
    var _classDecorators = [(0, core_1.Directive)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DemonListContainerComponent = _classThis = /** @class */ (function () {
        function DemonListContainerComponent_1(title2, changeDetectorRef, fusionDataService2) {
            this.title2 = title2;
            this.changeDetectorRef = changeDetectorRef;
            this.fusionDataService2 = fusionDataService2;
            this.subscriptions = [];
            this.appName = 'List of Demons - Megami Tensei Fusion Tools';
            this.initListLen = 50;
            this.showAllies = true;
            this.showEnemies = false;
            this.defaultSortFun = function (a, b) { return a.name.localeCompare(b.name); };
        }
        DemonListContainerComponent_1.prototype.ngOnInit = function () {
            this.title2.setTitle(this.appName);
            this.subscriptions.push(this.fusionDataService2.compendium.subscribe(this.onCompendiumUpdated.bind(this)));
        };
        DemonListContainerComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        DemonListContainerComponent_1.prototype.onCompendiumUpdated = function (compendium) {
            var _this = this;
            this.changeDetectorRef.markForCheck();
            this.demons = rxjs_1.Observable.create(function (observer) {
                var demons = compendium.allDemons;
                if (!_this.showAllies) {
                    demons = demons.filter(function (d) { return d.isEnemy; });
                }
                if (!_this.showEnemies) {
                    demons = demons.filter(function (d) { return !d.isEnemy; });
                }
                demons.sort(_this.defaultSortFun);
                observer.next(demons.slice(0, _this.initListLen));
                setTimeout(function () { return observer.next(demons); });
            });
        };
        return DemonListContainerComponent_1;
    }());
    __setFunctionName(_classThis, "DemonListContainerComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonListContainerComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonListContainerComponent = _classThis;
}();
