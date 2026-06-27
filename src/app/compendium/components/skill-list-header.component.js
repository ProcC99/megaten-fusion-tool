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
exports.SkillListHeaderComponent = void 0;
var core_1 = require("@angular/core");
var sorted_table_component_1 = require("../../shared/sorted-table.component");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var SkillListHeaderComponent = exports.SkillListHeaderComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tfoot.app-skill-list-header',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <tr>\n      <th [attr.colSpan]=\"skillHeaderLen\">{{ msgs.Skill | translateComp:lang }}</th>\n      <th [attr.colSpan]=\"acquireHeaderLen\">{{ msgs.HowToAcquire | translateComp:lang }}</th>\n    </tr>\n    <tr>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(1)\" (click)=\"nextSortFunIndex(1)\"><span>{{ msgs.Elem | translateComp:lang }}</span></th>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(2)\" (click)=\"nextSortFunIndex(2)\"><span>{{ msgs.Name | translateComp:lang }}</span></th>\n      <th class=\"sortable\" [ngClass]=\"sortDirClass(3)\" (click)=\"nextSortFunIndex(3)\"><span class=\"cost\">{{ msgs.Cost | translateComp:lang }}</span></th>\n      <th>{{ msgs.Effect |  translateComp:lang }}</th>\n      <th *ngIf=\"hasTarget\">{{ msgs.Target | translateComp:lang }}</th>\n      <th *ngIf=\"hasRank\" class=\"sortable\" [ngClass]=\"sortDirClass(4)\" (click)=\"nextSortFunIndex(4)\"><span>{{ msgs.Rank | translateComp:lang }}</span></th>\n      <th *ngIf=\"hasInherit\" class=\"sortable\" [ngClass]=\"sortDirClass(5)\" (click)=\"nextSortFunIndex(5)\"><span>Inherit</span></th>\n      <th>{{ msgs.LearnedBy | translateComp:lang }}</th>\n      <th *ngIf=\"transferTitle\">{{ transferTitle }}</th>\n    </tr>\n  ",
            styles: ["\n    th { white-space: nowrap; }\n    span { padding: 0.6em; }\n    span.cost { padding: 1.2em; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _hasInherit_decorators;
    var _hasInherit_initializers = [];
    var _hasTarget_decorators;
    var _hasTarget_initializers = [];
    var _hasRank_decorators;
    var _hasRank_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _transferTitle_decorators;
    var _transferTitle_initializers = [];
    var SkillListHeaderComponent = _classThis = /** @class */ (function (_super) {
        __extends(SkillListHeaderComponent_1, _super);
        function SkillListHeaderComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hasInherit = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _hasInherit_initializers, false));
            _this.hasTarget = __runInitializers(_this, _hasTarget_initializers, true);
            _this.hasRank = __runInitializers(_this, _hasRank_initializers, true);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.transferTitle = __runInitializers(_this, _transferTitle_initializers, '');
            _this.skillHeaderLen = 4;
            _this.acquireHeaderLen = 1;
            _this.msgs = translations_json_1.default.SkillListComponent;
            return _this;
        }
        SkillListHeaderComponent_1.prototype.ngOnInit = function () {
            this.nextColIndices();
        };
        SkillListHeaderComponent_1.prototype.nextColIndices = function () {
            if (this.hasInherit) {
                this.skillHeaderLen += 1;
            }
            if (this.hasTarget) {
                this.skillHeaderLen += 1;
            }
            if (this.hasRank) {
                this.skillHeaderLen += 1;
            }
            if (this.transferTitle) {
                this.acquireHeaderLen += 1;
            }
        };
        return SkillListHeaderComponent_1;
    }(sorted_table_component_1.SortedTableHeaderComponent));
    __setFunctionName(_classThis, "SkillListHeaderComponent");
    (function () {
        _hasInherit_decorators = [(0, core_1.Input)()];
        _hasTarget_decorators = [(0, core_1.Input)()];
        _hasRank_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _transferTitle_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _hasInherit_decorators, { kind: "field", name: "hasInherit", static: false, private: false, access: { has: function (obj) { return "hasInherit" in obj; }, get: function (obj) { return obj.hasInherit; }, set: function (obj, value) { obj.hasInherit = value; } } }, _hasInherit_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasTarget_decorators, { kind: "field", name: "hasTarget", static: false, private: false, access: { has: function (obj) { return "hasTarget" in obj; }, get: function (obj) { return obj.hasTarget; }, set: function (obj, value) { obj.hasTarget = value; } } }, _hasTarget_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasRank_decorators, { kind: "field", name: "hasRank", static: false, private: false, access: { has: function (obj) { return "hasRank" in obj; }, get: function (obj) { return obj.hasRank; }, set: function (obj, value) { obj.hasRank = value; } } }, _hasRank_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _transferTitle_decorators, { kind: "field", name: "transferTitle", static: false, private: false, access: { has: function (obj) { return "transferTitle" in obj; }, get: function (obj) { return obj.transferTitle; }, set: function (obj, value) { obj.transferTitle = value; } } }, _transferTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SkillListHeaderComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SkillListHeaderComponent = _classThis;
}();
