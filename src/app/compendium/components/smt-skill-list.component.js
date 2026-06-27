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
exports.SmtSkillListComponent = exports.SmtSkillListRowComponent = void 0;
var core_1 = require("@angular/core");
var position_edges_service_1 = require("../../shared/position-edges.service");
var skill_list_component_1 = require("../../compendium/bases/skill-list.component");
var SmtSkillListRowComponent = exports.SmtSkillListRowComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'tr.app-smt-skill-list-row',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <td><div class=\"element-icon {{ data.element }}\">{{ data.element }}</div></td>\n    <td>{{ data.name }}</td>\n    <td [style.color]=\"data.cost ? null: 'transparent'\">{{ data.cost | skillCostToString }}</td>\n    <td *ngIf=\"data.damage\">\n      {{ data.damage }}\n      {{ data.element }}\n      damage{{ data.hits ? ' x' + data.hits : '' }}{{ data.effect ? ', ' + data.effect : '' }}\n    </td>\n    <td *ngIf=\"!data.damage\">{{ data.effect }}</td>\n    <td *ngIf=\"hasTarget\"><div class=\"target-icon a{{ data.target || 'Self' }}\">{{ data.target || 'Self' }}</div></td>\n    <td *ngIf=\"hasRank\" [style.color]=\"data.rank !== 99 ? null: 'transparent'\">{{ data.rank }}</td>\n    <td *ngIf=\"hasInherit\"><div class=\"element-icon {{ data.inherit }}\">{{ data.inherit }}</div></td>\n    <td *ngIf=\"hasLvl\" [ngClass]=\"'lvl' + data.level.toString()\">{{ data.level | skillLevelToString }}</td>\n    <td *ngIf=\"hasLearned\">\n      <ul class=\"comma-list\">\n        <li *ngFor=\"let entry of data.learnedBy\">\n          <a routerLink=\"../{{ isPersona ? 'personas' : 'demons' }}/{{ entry.demon }}\">{{ entry.demon }}</a>\n          {{ entry.level | skillLevelToShortStringLocale:lang }}\n        </li>\n      </ul>\n    </td>\n    <td *ngIf=\"hasTransferTitle\">\n      <ul class=\"comma-list\">\n        <li *ngFor=\"let entry of data.transfer\">\n          <ng-container *ngIf=\"entry.level >= -99\">\n            <a routerLink=\"../{{ hasSkillCards ? 'personas' : 'demons' }}/{{ entry.demon }}\">{{ entry.demon }}</a>\n            {{ entry.level | skillLevelToShortStringLocale:lang }}\n          </ng-container>\n          <ng-container *ngIf=\"entry.level < -99\">{{ entry.demon }} </ng-container>\n        </li>\n      </ul>\n    </td>\n  "
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
    var _hasLearned_decorators;
    var _hasLearned_initializers = [];
    var _hasLvl_decorators;
    var _hasLvl_initializers = [];
    var _isPersona_decorators;
    var _isPersona_initializers = [];
    var _hasTransferTitle_decorators;
    var _hasTransferTitle_initializers = [];
    var _hasSkillCards_decorators;
    var _hasSkillCards_initializers = [];
    var _skillLvl_decorators;
    var _skillLvl_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var SmtSkillListRowComponent = _classThis = /** @class */ (function () {
        function SmtSkillListRowComponent_1() {
            this.hasInherit = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _hasInherit_initializers, false));
            this.hasTarget = __runInitializers(this, _hasTarget_initializers, true);
            this.hasRank = __runInitializers(this, _hasRank_initializers, true);
            this.hasLearned = __runInitializers(this, _hasLearned_initializers, true);
            this.hasLvl = __runInitializers(this, _hasLvl_initializers, false);
            this.isPersona = __runInitializers(this, _isPersona_initializers, false);
            this.hasTransferTitle = __runInitializers(this, _hasTransferTitle_initializers, false);
            this.hasSkillCards = __runInitializers(this, _hasSkillCards_initializers, false);
            this.skillLvl = __runInitializers(this, _skillLvl_initializers, -1);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.data = __runInitializers(this, _data_initializers, void 0);
        }
        return SmtSkillListRowComponent_1;
    }());
    __setFunctionName(_classThis, "SmtSkillListRowComponent");
    (function () {
        _hasInherit_decorators = [(0, core_1.Input)()];
        _hasTarget_decorators = [(0, core_1.Input)()];
        _hasRank_decorators = [(0, core_1.Input)()];
        _hasLearned_decorators = [(0, core_1.Input)()];
        _hasLvl_decorators = [(0, core_1.Input)()];
        _isPersona_decorators = [(0, core_1.Input)()];
        _hasTransferTitle_decorators = [(0, core_1.Input)()];
        _hasSkillCards_decorators = [(0, core_1.Input)()];
        _skillLvl_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _data_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _hasInherit_decorators, { kind: "field", name: "hasInherit", static: false, private: false, access: { has: function (obj) { return "hasInherit" in obj; }, get: function (obj) { return obj.hasInherit; }, set: function (obj, value) { obj.hasInherit = value; } } }, _hasInherit_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasTarget_decorators, { kind: "field", name: "hasTarget", static: false, private: false, access: { has: function (obj) { return "hasTarget" in obj; }, get: function (obj) { return obj.hasTarget; }, set: function (obj, value) { obj.hasTarget = value; } } }, _hasTarget_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasRank_decorators, { kind: "field", name: "hasRank", static: false, private: false, access: { has: function (obj) { return "hasRank" in obj; }, get: function (obj) { return obj.hasRank; }, set: function (obj, value) { obj.hasRank = value; } } }, _hasRank_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasLearned_decorators, { kind: "field", name: "hasLearned", static: false, private: false, access: { has: function (obj) { return "hasLearned" in obj; }, get: function (obj) { return obj.hasLearned; }, set: function (obj, value) { obj.hasLearned = value; } } }, _hasLearned_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasLvl_decorators, { kind: "field", name: "hasLvl", static: false, private: false, access: { has: function (obj) { return "hasLvl" in obj; }, get: function (obj) { return obj.hasLvl; }, set: function (obj, value) { obj.hasLvl = value; } } }, _hasLvl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _isPersona_decorators, { kind: "field", name: "isPersona", static: false, private: false, access: { has: function (obj) { return "isPersona" in obj; }, get: function (obj) { return obj.isPersona; }, set: function (obj, value) { obj.isPersona = value; } } }, _isPersona_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasTransferTitle_decorators, { kind: "field", name: "hasTransferTitle", static: false, private: false, access: { has: function (obj) { return "hasTransferTitle" in obj; }, get: function (obj) { return obj.hasTransferTitle; }, set: function (obj, value) { obj.hasTransferTitle = value; } } }, _hasTransferTitle_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasSkillCards_decorators, { kind: "field", name: "hasSkillCards", static: false, private: false, access: { has: function (obj) { return "hasSkillCards" in obj; }, get: function (obj) { return obj.hasSkillCards; }, set: function (obj, value) { obj.hasSkillCards = value; } } }, _hasSkillCards_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _skillLvl_decorators, { kind: "field", name: "skillLvl", static: false, private: false, access: { has: function (obj) { return "skillLvl" in obj; }, get: function (obj) { return obj.skillLvl; }, set: function (obj, value) { obj.skillLvl = value; } } }, _skillLvl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } } }, _data_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SmtSkillListRowComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmtSkillListRowComponent = _classThis;
}();
var SmtSkillListComponent = exports.SmtSkillListComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-smt-skill-list',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: [position_edges_service_1.PositionEdgesService],
            template: "\n    <table appPositionSticky class=\"list-table\">\n      <tfoot #stickyHeader appColumnWidths\n        class=\"app-skill-list-header sticky-header\"\n        [hasInherit]=\"!!inheritOrder\"\n        [hasTarget]=\"hasTarget\"\n        [hasRank]=\"hasRank\"\n        [lang]=\"lang\"\n        [transferTitle]=\"transferTitle\"\n        [sortFunIndex]=\"sortFunIndex\"\n        (sortFunIndexChanged)=\"sortFunIndex = $event\">\n      </tfoot>\n    </table>\n    <table class=\"list-table\">\n      <tfoot #hiddenHeader appColumnWidths\n        class=\"app-skill-list-header\"\n        [hasInherit]=\"!!inheritOrder\"\n        [hasTarget]=\"hasTarget\"\n        [hasRank]=\"hasRank\"\n        [lang]=\"lang\"\n        [transferTitle]=\"transferTitle\"\n        [style.visibility]=\"'collapse'\">\n      </tfoot>\n      <tbody>\n        <tr *ngFor=\"let data of rowData\"\n          class=\"app-smt-skill-list-row\"\n          [hasInherit]=\"!!inheritOrder\"\n          [hasTarget]=\"hasTarget\"\n          [hasRank]=\"hasRank\"\n          [isPersona]=\"isPersona\"\n          [hasTransferTitle]=\"!!transferTitle\"\n          [hasSkillCards]=\"transferTitle.includes('Card')\"\n          [lang]=\"lang\"\n          [data]=\"data\"\n          [ngClass]=\"{\n            extra: data.rank > 70 && data.rank < 90,\n            unique: data.rank > 90\n          }\">\n        </tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var _instanceExtraInitializers_1 = [];
    var _hasTarget_decorators;
    var _hasTarget_initializers = [];
    var _hasRank_decorators;
    var _hasRank_initializers = [];
    var _isPersona_decorators;
    var _isPersona_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _transferTitle_decorators;
    var _transferTitle_initializers = [];
    var SmtSkillListComponent = _classThis_1 = /** @class */ (function (_super) {
        __extends(SmtSkillListComponent_1, _super);
        function SmtSkillListComponent_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hasTarget = (__runInitializers(_this, _instanceExtraInitializers_1), __runInitializers(_this, _hasTarget_initializers, false));
            _this.hasRank = __runInitializers(_this, _hasRank_initializers, true);
            _this.isPersona = __runInitializers(_this, _isPersona_initializers, false);
            _this.lang = __runInitializers(_this, _lang_initializers, 'en');
            _this.transferTitle = __runInitializers(_this, _transferTitle_initializers, '');
            return _this;
        }
        return SmtSkillListComponent_1;
    }(skill_list_component_1.SkillListComponent));
    __setFunctionName(_classThis_1, "SmtSkillListComponent");
    (function () {
        _hasTarget_decorators = [(0, core_1.Input)()];
        _hasRank_decorators = [(0, core_1.Input)()];
        _isPersona_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        _transferTitle_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _hasTarget_decorators, { kind: "field", name: "hasTarget", static: false, private: false, access: { has: function (obj) { return "hasTarget" in obj; }, get: function (obj) { return obj.hasTarget; }, set: function (obj, value) { obj.hasTarget = value; } } }, _hasTarget_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _hasRank_decorators, { kind: "field", name: "hasRank", static: false, private: false, access: { has: function (obj) { return "hasRank" in obj; }, get: function (obj) { return obj.hasRank; }, set: function (obj, value) { obj.hasRank = value; } } }, _hasRank_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _isPersona_decorators, { kind: "field", name: "isPersona", static: false, private: false, access: { has: function (obj) { return "isPersona" in obj; }, get: function (obj) { return obj.isPersona; }, set: function (obj, value) { obj.isPersona = value; } } }, _isPersona_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, null, _transferTitle_decorators, { kind: "field", name: "transferTitle", static: false, private: false, access: { has: function (obj) { return "transferTitle" in obj; }, get: function (obj) { return obj.transferTitle; }, set: function (obj, value) { obj.transferTitle = value; } } }, _transferTitle_initializers, _instanceExtraInitializers_1);
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        SmtSkillListComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return SmtSkillListComponent = _classThis_1;
}();
