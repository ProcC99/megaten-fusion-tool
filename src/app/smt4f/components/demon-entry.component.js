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
exports.DemonEntryContainerComponent = exports.DemonEntryComponent = void 0;
var core_1 = require("@angular/core");
var translations_json_1 = __importDefault(require("../../compendium/data/translations.json"));
var DemonEntryComponent = exports.DemonEntryComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-demon-entry',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <ng-container *ngIf=\"demon\">\n      <app-demon-stats\n        [lang]=\"compConfig.lang\"\n        [title]=\"'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name\"\n        [price]=\"compConfig.appCssClasses.includes('ds1') ? 0 : demon.price\"\n        [statHeaders]=\"compConfig.baseStats\"\n        [stats]=\"demon.stats\"\n        [growths]=\"demon.growths\">\n      </app-demon-stats>\n      <app-demon-resists\n        [lang]=\"compConfig.lang\"\n        [resistHeaders]=\"compConfig.resistElems\"\n        [resists]=\"demon.resists\"\n        [ailmentHeaders]=\"compConfig.ailmentElems\"\n        [ailments]=\"demon.ailments\">\n      </app-demon-resists>\n      <app-demon-inherits *ngIf=\"demon.affinities && demon.affinities.length\"\n        [lang]=\"compConfig.lang\"\n        [hasLvls]=\"true\"\n        [inheritHeaders]=\"compConfig.affinityElems\"\n        [inherits]=\"demon.affinities\">\n      </app-demon-inherits>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th colSpan=\"7\" class=\"title\">{{ skillMsgs.LearnedSkills | translateComp:lang }}</th></tr>\n          <tr>\n            <th>{{ skillMsgs.Elem | translateComp:lang }}</th>\n            <th>{{ skillMsgs.Name | translateComp:lang }}</th>\n            <th>{{ skillMsgs.Cost | translateComp:lang }}</th>\n            <th>{{ skillMsgs.Effect | translateComp:lang }}</th>\n            <th>{{ skillMsgs.Target| translateComp:lang }}</th>\n            <th *ngIf=\"compConfig.hasSkillRanks\">{{ skillMsgs.Rank | translateComp:lang }}</th>\n            <th>Lvl</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let data of skillLvls\" [ngClass]=\"{ unique: data.skill.rank > 90 }\">\n            <td><div class=\"element-icon {{ data.skill.element }}\">{{ data.skill.element }}</div></td>\n            <td>{{ data.skill.name }} {{ data.lvl > 0 ? '+' + data.lvl : data.lvl || '' }}</td>\n            <td [style.color]=\"data.cost ? null: 'transparent'\">{{ data.cost | skillCostToString }}</td>\n            <td>{{ data.skill.effect }} {{ data.upgrade === 0 ? '' : '(' + (data.upgrade > 0 ? '+' : '') + data.upgrade + '%)' }}</td>\n            <td>{{ data.skill.target || 'Self' }}</td>\n            <td *ngIf=\"compConfig.hasSkillRanks\" [style.color]=\"data.skill.rank !== 99 ? null: 'transparent'\">{{ data.skill.rank }}</td>\n            <td>{{ data.skill.level | skillLevelToString }}</td>\n          </tr>\n          <tr *ngIf=\"!skillLvls.length\">\n            <td colSpan=\"7\">{{ skillMsgs.NoLearnedSkills | translateComp:lang }}</td>\n          <tr>\n        </tbody>\n      </table>\n      <app-demon-skills *ngIf=\"compConfig.appCssClasses.includes('smtsj')\"\n        [title]=\"'D-Source Skills'\"\n        [hasRank]=\"true\"\n        [hasTarget]=\"true\"\n        [hasLvl]=\"false\"\n        [elemOrder]=\"compConfig.elemOrder\"\n        [compendium]=\"compendium\"\n        [skillLevels]=\"demon.skillCards\">\n      </app-demon-skills>\n      <app-fusion-entry-table *ngIf=\"demon.evolvesFrom\"\n        [title]=\"statMsgs.EvolvesFrom | translateComp:lang\"\n        [lang]=\"compConfig.lang\"\n        [baseUrl]=\"'..'\"\n        [rowData]=\"[demon.evolvesFrom]\">\n      </app-fusion-entry-table>\n      <app-fusion-entry-table *ngIf=\"demon.evolvesTo\"\n        [title]=\"statMsgs.EvolvesTo | translateComp:lang\"\n        [lang]=\"compConfig.lang\"\n        [baseUrl]=\"'..'\"\n        [rowData]=\"[demon.evolvesTo]\">\n      </app-fusion-entry-table>\n      <app-smt-fusions [lang]=\"compConfig.lang\" [excludedDlc]=\"demon.fusion === 'excluded'\">\n      </app-smt-fusions>\n    </ng-container>\n    <app-demon-missing *ngIf=\"!demon\" [name]=\"name\">\n    </app-demon-missing>\n  "
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _demon_decorators;
    var _demon_initializers = [];
    var _compConfig_decorators;
    var _compConfig_initializers = [];
    var _compendium_decorators;
    var _compendium_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var DemonEntryComponent = _classThis = /** @class */ (function () {
        function DemonEntryComponent_1() {
            this.name = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.demon = __runInitializers(this, _demon_initializers, void 0);
            this.compConfig = __runInitializers(this, _compConfig_initializers, void 0);
            this.compendium = __runInitializers(this, _compendium_initializers, void 0);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.statMsgs = translations_json_1.default.DemonStatsComponent;
            this.skillMsgs = translations_json_1.default.SkillListComponent;
            this.skillLvls = [];
        }
        DemonEntryComponent_1.prototype.ngOnChanges = function () {
            var _this = this;
            if (!this.demon) {
                return;
            }
            this.skillLvls = [];
            for (var _i = 0, _a = Object.keys(this.demon.skills); _i < _a.length; _i++) {
                var sname = _a[_i];
                var COST_MP = 3 << 10;
                var skill = this.compendium.getSkill(sname);
                var elemIndex = this.compConfig.affinityElems.indexOf(skill.element);
                var bonuses = this.compConfig.affinityBonuses;
                var lvl = (this.demon.affinities || [])[elemIndex];
                if (lvl && bonuses.costs[elemIndex] && (skill.cost & 0xFC00) <= COST_MP) {
                    this.skillLvls.push({
                        skill: skill,
                        cost: (skill.cost & 0xFC00) + Math.floor((100 - bonuses.costs[elemIndex][lvl + 10]) / 100 * (skill.cost & 0x3FF)),
                        lvl: lvl,
                        upgrade: bonuses.upgrades[elemIndex][lvl + 10],
                    });
                }
                else {
                    this.skillLvls.push({ skill: skill, cost: skill.cost, lvl: 0, upgrade: 0 });
                }
            }
            for (var _b = 0, _c = this.skillLvls; _b < _c.length; _b++) {
                var skill = _c[_b];
                skill.skill.level = this.demon.skills[skill.skill.name];
            }
            this.skillLvls.sort(function (a, b) {
                return (a.skill.level - b.skill.level) * 200 +
                    _this.compConfig.elemOrder[a.skill.element] - _this.compConfig.elemOrder[b.skill.element];
            });
        };
        return DemonEntryComponent_1;
    }());
    __setFunctionName(_classThis, "DemonEntryComponent");
    (function () {
        _name_decorators = [(0, core_1.Input)()];
        _demon_decorators = [(0, core_1.Input)()];
        _compConfig_decorators = [(0, core_1.Input)()];
        _compendium_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _demon_decorators, { kind: "field", name: "demon", static: false, private: false, access: { has: function (obj) { return "demon" in obj; }, get: function (obj) { return obj.demon; }, set: function (obj, value) { obj.demon = value; } } }, _demon_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compConfig_decorators, { kind: "field", name: "compConfig", static: false, private: false, access: { has: function (obj) { return "compConfig" in obj; }, get: function (obj) { return obj.compConfig; }, set: function (obj, value) { obj.compConfig = value; } } }, _compConfig_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compendium_decorators, { kind: "field", name: "compendium", static: false, private: false, access: { has: function (obj) { return "compendium" in obj; }, get: function (obj) { return obj.compendium; }, set: function (obj, value) { obj.compendium = value; } } }, _compendium_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        DemonEntryComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DemonEntryComponent = _classThis;
}();
var DemonEntryContainerComponent = exports.DemonEntryContainerComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-demon-entry-container',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-demon-entry\n      [lang]=\"compConfig.lang\"\n      [name]=\"name\"\n      [demon]=\"demon\"\n      [compConfig]=\"compConfig\"\n      [compendium]=\"compendium\">\n    </app-demon-entry>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var DemonEntryContainerComponent = _classThis_1 = /** @class */ (function () {
        function DemonEntryContainerComponent_1(route, title, currentDemonService, fusionDataService) {
            this.route = route;
            this.title = title;
            this.currentDemonService = currentDemonService;
            this.fusionDataService = fusionDataService;
            this.subscriptions = [];
            this.appName = fusionDataService.appName;
            this.compConfig = fusionDataService.compConfig;
        }
        DemonEntryContainerComponent_1.prototype.ngOnInit = function () {
            this.subscribeAll();
        };
        DemonEntryContainerComponent_1.prototype.ngOnDestroy = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        DemonEntryContainerComponent_1.prototype.subscribeAll = function () {
            var _this = this;
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (comp) {
                _this.compendium = comp;
                _this.getDemonEntry();
            }));
            this.subscriptions.push(this.currentDemonService.currentDemon.subscribe(function (name) {
                _this.name = name;
                _this.getDemonEntry();
            }));
            this.route.params.subscribe(function (params) {
                _this.currentDemonService.nextCurrentDemon(params['demonName']);
            });
        };
        DemonEntryContainerComponent_1.prototype.getDemonEntry = function () {
            if (this.compendium && this.name) {
                this.title.setTitle("".concat(this.name, " - ").concat(this.appName));
                this.demon = this.compendium.getDemon(this.name);
            }
        };
        return DemonEntryContainerComponent_1;
    }());
    __setFunctionName(_classThis_1, "DemonEntryContainerComponent");
    (function () {
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        DemonEntryContainerComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return DemonEntryContainerComponent = _classThis_1;
}();
