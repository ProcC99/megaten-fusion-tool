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
exports.DemonSkillsComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var DemonSkillsComponent = exports.DemonSkillsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-skills',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <table class=\"entry-table\">\n      <thead>\n        <tr>\n          <th [attr.colSpan]=\"skillHeaderLen\" class=\"title\">{{ title }}</th>\n        </tr>\n        <tr>\n          <th>{{ msgs.Elem | translateComp:lang }}</th>\n          <th>{{ msgs.Name | translateComp:lang }}</th>\n          <th>{{ msgs.Cost | translateComp:lang }}</th>\n          <th>{{ msgs.Effect | translateComp:lang }}</th>\n          <th *ngIf=\"hasTarget\">{{ msgs.Target| translateComp:lang }}</th>\n          <th *ngIf=\"hasRank\">{{ msgs.Rank | translateComp:lang }}</th>\n          <th *ngIf=\"hasInherit\">Inherit</th>\n          <th *ngIf=\"hasLvl\">Lvl</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let data of skills\"\n          class=\"app-smt-skill-list-row\"\n          [hasTarget]=\"hasTarget\"\n          [hasRank]=\"hasRank\"\n          [hasInherit]=\"hasInherit\"\n          [hasLearned]=\"false\"\n          [hasLvl]=\"hasLvl\"\n          [skillLvl]=\"data.level\"\n          [data]=\"data\"\n          [ngClass]=\"{\n            extra: data.rank > 70 && data.rank < 90,\n            unique: data.rank > 90\n          }\">\n        </tr>\n        <tr *ngIf=\"!skills.length\">\n          <td [attr.colspan]=\"skillHeaderLen\">No {{ title }} Found</td>\n        <tr>\n      </tbody>\n    </table>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _hasInherit_decorators;
    var _hasInherit_initializers = [];
    var _hasTarget_decorators;
    var _hasTarget_initializers = [];
    var _hasRank_decorators;
    var _hasRank_initializers = [];
    var _hasLvl_decorators;
    var _hasLvl_initializers = [];
    var _compendium_decorators;
    var _compendium_initializers = [];
    var _elemOrder_decorators;
    var _elemOrder_initializers = [];
    var _skillLevels_decorators;
    var _skillLevels_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var DemonSkillsComponent = _classThis = /** @class */ (function () {
        function DemonSkillsComponent_1() {
            this.title = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _title_initializers, 'Learned Skills'));
            this.hasInherit = __runInitializers(this, _hasInherit_initializers, false);
            this.hasTarget = __runInitializers(this, _hasTarget_initializers, false);
            this.hasRank = __runInitializers(this, _hasRank_initializers, false);
            this.hasLvl = __runInitializers(this, _hasLvl_initializers, true);
            this.compendium = __runInitializers(this, _compendium_initializers, void 0);
            this.elemOrder = __runInitializers(this, _elemOrder_initializers, void 0);
            this.skillLevels = __runInitializers(this, _skillLevels_initializers, void 0);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.skillHeaderLen = 5;
            this.msgs = translations_json_1.default.SkillListComponent;
        }
        DemonSkillsComponent_1.prototype.ngOnInit = function () {
            this.nextColIndices();
        };
        DemonSkillsComponent_1.prototype.ngOnChanges = function () {
            this.nextSkills();
        };
        DemonSkillsComponent_1.prototype.nextColIndices = function () {
            if (this.hasInherit) {
                this.skillHeaderLen += 1;
            }
            if (this.hasTarget) {
                this.skillHeaderLen += 1;
            }
            if (this.hasRank) {
                this.skillHeaderLen += 1;
            }
        };
        DemonSkillsComponent_1.prototype.nextSkills = function () {
            var _this = this;
            this.skills = Object.keys(this.skillLevels).map(function (name) { return _this.compendium.getSkill(name); });
            for (var _i = 0, _a = this.skills; _i < _a.length; _i++) {
                var skill = _a[_i];
                skill.level = this.skillLevels[skill.name];
            }
            if (this.elemOrder) {
                this.skills.sort(function (a, b) {
                    return (a.level - b.level) * 200 +
                        _this.elemOrder[a.element] - _this.elemOrder[b.element];
                });
            }
        };
        return DemonSkillsComponent_1;
    }());
    __setFunctionName(_classThis, "DemonSkillsComponent");
    (function () {
        _title_decorators = [(0, core_1.Input)()];
        _hasInherit_decorators = [(0, core_1.Input)()];
        _hasTarget_decorators = [(0, core_1.Input)()];
        _hasRank_decorators = [(0, core_1.Input)()];
        _hasLvl_decorators = [(0, core_1.Input)()];
        _compendium_decorators = [(0, core_1.Input)()];
        _elemOrder_decorators = [(0, core_1.Input)()];
        _skillLevels_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } } }, _title_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasInherit_decorators, { kind: "field", name: "hasInherit", static: false, private: false, access: { has: function (obj) { return "hasInherit" in obj; }, get: function (obj) { return obj.hasInherit; }, set: function (obj, value) { obj.hasInherit = value; } } }, _hasInherit_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasTarget_decorators, { kind: "field", name: "hasTarget", static: false, private: false, access: { has: function (obj) { return "hasTarget" in obj; }, get: function (obj) { return obj.hasTarget; }, set: function (obj, value) { obj.hasTarget = value; } } }, _hasTarget_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasRank_decorators, { kind: "field", name: "hasRank", static: false, private: false, access: { has: function (obj) { return "hasRank" in obj; }, get: function (obj) { return obj.hasRank; }, set: function (obj, value) { obj.hasRank = value; } } }, _hasRank_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _hasLvl_decorators, { kind: "field", name: "hasLvl", static: false, private: false, access: { has: function (obj) { return "hasLvl" in obj; }, get: function (obj) { return obj.hasLvl; }, set: function (obj, value) { obj.hasLvl = value; } } }, _hasLvl_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compendium_decorators, { kind: "field", name: "compendium", static: false, private: false, access: { has: function (obj) { return "compendium" in obj; }, get: function (obj) { return obj.compendium; }, set: function (obj, value) { obj.compendium = value; } } }, _compendium_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _elemOrder_decorators, { kind: "field", name: "elemOrder", static: false, private: false, access: { has: function (obj) { return "elemOrder" in obj; }, get: function (obj) { return obj.elemOrder; }, set: function (obj, value) { obj.elemOrder = value; } } }, _elemOrder_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _skillLevels_decorators, { kind: "field", name: "skillLevels", static: false, private: false, access: { has: function (obj) { return "skillLevels" in obj; }, get: function (obj) { return obj.skillLevels; }, set: function (obj, value) { obj.skillLevels = value; } } }, _skillLevels_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonSkillsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonSkillsComponent = _classThis;
}();
