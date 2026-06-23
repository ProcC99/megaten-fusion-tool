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
exports.SmtFusionsComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var position_sticky_directive_1 = require("../../shared/position-sticky.directive");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var SmtFusionsComponent = exports.SmtFusionsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-smt-fusions',
            providers: [position_edges_service_1.PositionEdgesService],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <div>\n      <table #stickyTable appPositionSticky class=\"list-table\">\n        <thead>\n          <tr>\n            <th *ngFor=\"let option of fusionOptions\"\n              class=\"nav\"\n              routerLinkActive=\"active\"\n              [routerLink]=\"option.link\"\n              [style.width.%]=\"100 / fusionOptions.length\"\n              [routerLinkActiveOptions]=\"{ exact: true }\">\n              <a [routerLink]=\"option.link\">{{ option.title | translateComp:lang }}</a>\n            </th>\n          </tr>\n          <tr *ngIf=\"excludedDlc\">\n            <th [attr.colspan]=\"fusionOptions.length\" class=\"title\">\n              {{ msgs.DlcExcluded | translateComp:lang }}\n            </th>\n          <tr>\n          <tr *ngIf=\"showFusionAlert\">\n            <th [attr.colspan]=\"fusionOptions.length\" class=\"title\"><ng-content></ng-content></th>\n          <tr>\n        </thead>\n      </table>\n      <router-outlet></router-outlet>\n    </div>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _stickyTable_decorators;
    var _stickyTable_initializers = [];
    var _hasTripleFusion_decorators;
    var _hasTripleFusion_initializers = [];
    var _showFusionAlert_decorators;
    var _showFusionAlert_initializers = [];
    var _excludedDlc_decorators;
    var _excludedDlc_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var SmtFusionsComponent = _classThis = /** @class */ (function () {
        function SmtFusionsComponent_1() {
            this.stickyTable = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _stickyTable_initializers, void 0));
            this.hasTripleFusion = __runInitializers(this, _hasTripleFusion_initializers, false);
            this.showFusionAlert = __runInitializers(this, _showFusionAlert_initializers, false);
            this.excludedDlc = __runInitializers(this, _excludedDlc_initializers, false);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.msgs = translations_json_1.default.SmtFusionsComponent;
            this.fusionOptions = [
                { title: this.msgs.NormalFissions, link: 'fissions' },
                { title: this.msgs.NormalFusions, link: 'fusions' }
            ];
        }
        SmtFusionsComponent_1.prototype.ngOnInit = function () {
            if (this.hasTripleFusion) {
                this.fusionOptions = [
                    { title: this.msgs.DoubleFissions, link: 'fissions' },
                    { title: this.msgs.TripleFissions, link: 'fissions/triple' },
                    { title: this.msgs.TripleFusions, link: 'fusions/triple' },
                    { title: this.msgs.DoubleFusions, link: 'fusions' }
                ];
            }
        };
        SmtFusionsComponent_1.prototype.ngOnChanges = function () {
            var _this = this;
            setTimeout(function () { return _this.stickyTable.nextEdges(); });
        };
        return SmtFusionsComponent_1;
    }());
    __setFunctionName(_classThis, "SmtFusionsComponent");
    (function () {
        _stickyTable_decorators = [(0, core_1.ViewChild)(position_sticky_directive_1.PositionStickyDirective)];
        _hasTripleFusion_decorators = [(0, core_1.Input)()];
        _showFusionAlert_decorators = [(0, core_1.Input)()];
        _excludedDlc_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _stickyTable_decorators, { kind: "field", name: "stickyTable", static: false, private: false, access: { has: function (obj) { return "stickyTable" in obj; }, get: function (obj) { return obj.stickyTable; }, set: function (obj, value) { obj.stickyTable = value; } } }, _stickyTable_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasTripleFusion_decorators, { kind: "field", name: "hasTripleFusion", static: false, private: false, access: { has: function (obj) { return "hasTripleFusion" in obj; }, get: function (obj) { return obj.hasTripleFusion; }, set: function (obj, value) { obj.hasTripleFusion = value; } } }, _hasTripleFusion_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _showFusionAlert_decorators, { kind: "field", name: "showFusionAlert", static: false, private: false, access: { has: function (obj) { return "showFusionAlert" in obj; }, get: function (obj) { return obj.showFusionAlert; }, set: function (obj, value) { obj.showFusionAlert = value; } } }, _showFusionAlert_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _excludedDlc_decorators, { kind: "field", name: "excludedDlc", static: false, private: false, access: { has: function (obj) { return "excludedDlc" in obj; }, get: function (obj) { return obj.excludedDlc; }, set: function (obj, value) { obj.excludedDlc = value; } } }, _excludedDlc_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SmtFusionsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmtFusionsComponent = _classThis;
}();
