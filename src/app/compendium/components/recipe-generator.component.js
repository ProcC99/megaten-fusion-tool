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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeGeneratorComponent = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var pipes_1 = require("../pipes");
var recipe_generator_1 = require("../models/recipe-generator");
var translations_json_1 = __importDefault(require("../data/translations.json"));
var RecipeGeneratorComponent = exports.RecipeGeneratorComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-recipe-generator',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <form [formGroup]=\"form\">\n      <ng-template #inheritElems let-skillLookup=\"skillLookup\">\n        <td colspan=\"3\" style=\"text-align: center;\">\n          <ng-container *ngFor=\"let elem of recipeConfig.inheritElems; let i = index\">\n            <div *ngIf=\"skillLookup[elem]\" [ngClass]=\"['element-icon', elem]\">{{ elem }}</div>\n          </ng-container>\n        </td>\n      </ng-template>\n\n      <ng-template #skillPickerHeader>\n        <th style=\"width: 10%;\">{{ msgs.Elem | translateComp:lang }}</th>\n        <th style=\"width: 15%;\">{{ msgs.Skill | translateComp:lang }}</th>\n        <th style=\"width: 20%;\">{{ msgs.Ingredient | translateComp:lang }}</th>\n      </ng-template>\n\n      <ng-template #skillPicker let-ingred=\"ingredControl\" let-skillLookup=\"skillLookup\">\n        <td>\n          <select [formControl]=\"ingred.controls.elem\">\n            <option value=\"-\">-</option>\n            <ng-container *ngFor=\"let elem of recipeConfig.skillElems\">\n              <option *ngIf=\"skillLookup[elem]\" [value]=\"elem\">{{ recipeConfig.displayElems[elem] || elem }}</option>\n            </ng-container>\n          </select>\n        </td>\n        <td>\n          <select [formControl]=\"ingred.controls.skill\">\n            <option *ngFor=\"let skill of skillLookup[ingred.controls.elem.value]\" [ngValue]=\"skill\">{{ skill.name }}</option>\n          </select>\n        </td>\n        <td>\n          <select [formControl]=\"ingred.controls.demon\">\n            <option *ngFor=\"let demon of learnedBy[ingred.controls.skill.value.name]\" [ngValue]=\"demon\">{{ demon.name }}</option>\n          </select>\n        </td>\n      </ng-template>\n\n      <h2>{{ msgs.RecipeGenerator | translateComp:lang }}</h2>\n      <table class=\"entry-table\" style=\"width: 40%;\">\n        <tr><th colspan=\"3\" class=\"title\">{{ msgs.Target | translateComp:lang }}</th></tr>\n        <tr><th colspan=\"3\">{{ msgs.Target | translateComp:lang }}</th></tr>\n        <tr>\n          <td colspan=\"3\">\n            <select formControlName=\"demonT\">\n              <option *ngFor=\"let demon of demonTs\" [ngValue]=\"demon\">{{ demon.name }}</option>\n            </select>\n          </td>\n        </tr>\n        <tr>\n          <ng-container *ngTemplateOutlet=\"inheritElems; context: { skillLookup: skillTs }\"></ng-container>\n        </tr>\n      </table>\n      <table class=\"entry-table\" style=\"width: 70%;\">\n        <tr><th colspan=\"7\" class=\"title\">{{ msgs.IncludeIngredients | translateComp:lang }}</th></tr>\n        <tr>\n          <th colspan=\"3\">{{ msgs.LeftChain | translateComp:lang }}</th>\n          <th></th>\n          <th colspan=\"3\">{{ msgs.RightChain | translateComp:lang }}</th>\n        </tr>\n        <tr>\n          <td colspan=\"3\">\n            <select formControlName=\"demonL\">\n              <option *ngFor=\"let demon of demonLs\" [ngValue]=\"demon\">{{ demon.name }} ({{ demonRs[demon.name].length }})</option>\n            </select>\n          </td>\n          <td></td>\n          <td colspan=\"3\">\n            <select formControlName=\"demonR\">\n              <option *ngFor=\"let demon of demonRs[form.controls.demonL.value.name]\" [ngValue]=\"demon\">{{ demon.name }}</option>\n            </select>\n          </td>\n        <tr>\n        <tr>\n          <ng-container *ngTemplateOutlet=\"inheritElems; context: { skillLookup: skillLs }\"></ng-container>\n          <td style=></td>\n          <ng-container *ngTemplateOutlet=\"inheritElems; context: { skillLookup: skillRs }\"></ng-container>\n        </tr>\n        <tr>\n          <ng-container *ngTemplateOutlet=\"skillPickerHeader\"></ng-container>\n          <th style=\"width: 5%;\"></th>\n          <ng-container *ngTemplateOutlet=\"skillPickerHeader\"></ng-container>\n        </tr>\n        <ng-container formArrayName=\"ingreds\">\n          <ng-container *ngFor=\"let ingred of form.controls.ingreds['controls']; let i = index\">\n            <tr *ngIf=\"i < maxSkills && i % 2 === 0\">\n              <ng-container [formGroupName]=\"i\" *ngTemplateOutlet=\"skillPicker; context: {\n                ingredControl: form.controls.ingreds['controls'][i],\n                skillLookup: skillLs\n              }\"></ng-container>\n              <td></td>\n              <ng-container [formGroupName]=\"i + 1\" *ngTemplateOutlet=\"skillPicker; context: {\n                ingredControl: form.controls.ingreds['controls'][i + 1],\n                skillLookup: skillRs\n              }\"></ng-container>\n            </tr>\n          </ng-container>\n        </ng-container>\n      </table>\n      <table *ngIf=\"recipe\" class=\"entry-table\">\n        <tr><th colspan=\"2\" class=\"title\">{{ msgs.FusionRecipe | translateComp:lang }}</th></tr>\n        <tr>\n          <th>{{ msgs.LeftChain | translateComp:lang }}</th>\n          <th>{{ msgs.RightChain | translateComp:lang }}</th>\n        </tr>\n        <tr>\n          <td style=\"width: 50%\" *ngIf=\"recipeLeft.length\"><ul><li *ngFor=\"let step of recipeLeft\">{{ step }}</li></ul></td>\n          <td style=\"width: 50%\" *ngIf=\"!recipeLeft.length\" style=\"padding: 1em; text-align: center;\">{{ msgs.NoRecipesFound | translateComp:lang }}</td>\n          <td style=\"width: 50%\" *ngIf=\"recipeRight.length\"><ul><li *ngFor=\"let step of recipeRight\">{{ step }}</li></ul></td>\n          <td style=\"width: 50%\" *ngIf=\"!recipeRight.length\" style=\"padding: 1em; text-align: center;\">{{ msgs.NoRecipesFound | translateComp:lang }}</td>\n        </tr>\n        <tr *ngIf=\"fusionPrereq\"><td colspan=\"2\" style=\"padding: 1em; text-align: center;\">\n          {{ msgs.SpecialFusionCondition | translateComp:lang }}: {{ fusionPrereq }}\n        </td></tr>\n        <tr><td colspan=\"2\" style=\"padding: 1em; text-align: center;\">\n          <ng-container *ngIf=\"recipe.stepR.length\">\n            {{ recipeResult.join(' x ') }} = {{ recipe.result }}<br>\n            [{{ resultSkills.join(', ') }}]\n          </ng-container>\n          <ng-container *ngIf=\"!recipe.stepR.length\">{{ msgs.NoRecipesFound | translateComp:lang }}</ng-container>\n        </td></tr>\n      </table>\n    </form>\n  ",
            styles: ["\n    ul { padding: 0 1em; list-style: none; }\n    td select { min-height: 25px; width: 100%; }\n    div.element-icon { display: inline-block; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _maxSkills_decorators;
    var _maxSkills_initializers = [];
    var _compendium_decorators;
    var _compendium_initializers = [];
    var _squareChart_decorators;
    var _squareChart_initializers = [];
    var _recipeConfig_decorators;
    var _recipeConfig_initializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var RecipeGeneratorComponent = _classThis = /** @class */ (function () {
        function RecipeGeneratorComponent_1(fb, cdr) {
            this.fb = (__runInitializers(this, _instanceExtraInitializers), fb);
            this.cdr = cdr;
            this.maxSkills = __runInitializers(this, _maxSkills_initializers, 8);
            this.compendium = __runInitializers(this, _compendium_initializers, void 0);
            this.squareChart = __runInitializers(this, _squareChart_initializers, void 0);
            this.recipeConfig = __runInitializers(this, _recipeConfig_initializers, void 0);
            this.lang = __runInitializers(this, _lang_initializers, 'en');
            this.fusionPrereq = '';
            this.skillLevelPipe = new pipes_1.SkillLevelToShortStringPipeLocale();
            this.subscriptions = [];
            this.msgs = translations_json_1.default.RecipeGeneratorComponent;
            this.internalMaxSkills = 10;
            this.blankDemon = {
                name: '-', race: '-', lvl: 0, currLvl: 0, price: 0, inherits: 0,
                skills: {}, stats: [], resists: [], affinities: [],
                fusion: 'normal', prereq: '', searchTags: '-'
            };
            this.blankSkill = {
                name: '-', element: '-', inherit: '-', rank: 99, cost: 0,
                effect: '', target: '', level: 0, learnedBy: [{ demon: '-', level: 0 }]
            };
            this.createForm();
            this.initFormSubscribes();
        }
        RecipeGeneratorComponent_1.prototype.ngOnChanges = function () { this.initDropdowns(); };
        RecipeGeneratorComponent_1.prototype.ngOnDestroy = function () { for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
            var s = _a[_i];
            s.unsubscribe();
        } };
        RecipeGeneratorComponent_1.prototype.createForm = function () {
            var ingreds = [];
            for (var i = 0; i < this.internalMaxSkills; i++) {
                ingreds.push(this.fb.group({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }));
            }
            this.form = this.fb.group({
                demonT: this.blankDemon,
                demonL: this.blankDemon,
                demonR: this.blankDemon,
                ingreds: this.fb.array(ingreds),
            });
        };
        RecipeGeneratorComponent_1.prototype.createSkillLookup = function (demon, demonT) {
            var _this = this;
            var excludeElems = [];
            var inheritElems = this.recipeConfig.inheritElems;
            for (var i = 0; i < inheritElems.length; i++) {
                if (!(demon.inherits & demonT.inherits & (1 << i))) {
                    excludeElems.push(inheritElems[inheritElems.length - i - 1]);
                }
            }
            var elems = this.recipeConfig.skillElems.filter(function (e) { return !excludeElems.includes(e); });
            var learnedSkills = Object.keys(demon.skills)
                .filter(function (s) { return demon.skills[s] < 99; })
                .map(function (s) { return _this.compendium.getSkill(s); })
                .filter(function (s) { return elems.includes(s.element) && s.rank < 50; });
            return elems.reduce(function (acc, e) { acc[e] = _this.elemTyped[e]; return acc; }, { '-': [this.blankSkill].concat(learnedSkills) });
        };
        RecipeGeneratorComponent_1.prototype.updateRecipe = function (recipe) {
            var skillRef = {};
            for (var _i = 0, _a = Object.entries(recipe.skills); _i < _a.length; _i++) {
                var _b = _a[_i], skill = _b[0], demon = _b[1];
                if (!skillRef[demon]) {
                    skillRef[demon] = [];
                }
                var slvl = this.compendium.getDemon(demon).skills[skill];
                skillRef[demon].push("".concat(skill, " ").concat(this.skillLevelPipe.transform(slvl, this.lang)).trim());
            }
            this.recipe = recipe;
            this.recipeLeft = this.decodeRecipechain(recipe.chain1, skillRef);
            this.recipeRight = this.decodeRecipechain(recipe.chain2, skillRef);
            this.resultSkills = [];
            this.recipeResult = [];
            this.fusionPrereq = this.compendium.getDemon(recipe.result).prereq || '';
            for (var _c = 0, _d = recipe.stepR; _c < _d.length; _c++) {
                var result = _d[_c];
                this.recipeResult.push(skillRef[result] ? "".concat(result, " [").concat(skillRef[result].join(', '), "]") : result);
            }
            for (var _e = 0, _f = Object.entries(this.compendium.getDemon(recipe.result).skills)
                .filter(function (s) { return s[1] < 2000; })
                .sort(function (a, b) { return a[1] - b[1]; }); _e < _f.length; _e++) {
                var _g = _f[_e], skill = _g[0], slvl = _g[1];
                this.resultSkills.push("".concat(skill, " ").concat(this.skillLevelPipe.transform(slvl, this.lang)).trim());
            }
            this.cdr.markForCheck();
        };
        RecipeGeneratorComponent_1.prototype.decodeRecipechain = function (chain, skillRef) {
            var steps = [];
            for (var i = 0; i < chain.length - 2; i += 2) {
                var skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
                var skills2 = skillRef[chain[i + 1]] ? '[' + skillRef[chain[i + 1]].join(', ') + '] ' : '';
                steps.push("".concat(chain[i], " ").concat(skills1, "x ").concat(chain[i + 1], " ").concat(skills2, "= ").concat(chain[i + 2]));
            }
            return steps;
        };
        RecipeGeneratorComponent_1.prototype.initDropdowns = function () {
            var _this = this;
            if (!this.recipeConfig || !this.compendium || !this.squareChart) {
                return;
            }
            this.demonTs = this.compendium.allDemons.filter(function (d) { return !d.isEnemy && d.fusion !== 'party' && d.fusion !== 'enemy'; });
            this.demonTs.sort(function (a, b) { return a.name.localeCompare(b.name); });
            this.elemTyped = { '-': [this.blankSkill] };
            this.learnedBy = { '-': [this.blankDemon] };
            for (var _i = 0, _a = this.demonTs; _i < _a.length; _i++) {
                var demon = _a[_i];
                for (var _b = 0, _c = Object.keys(demon.skills); _b < _c.length; _b++) {
                    var sname = _c[_b];
                    if (!this.learnedBy[sname]) {
                        this.learnedBy[sname] = [];
                    }
                    this.learnedBy[sname].push(demon);
                }
            }
            for (var _d = 0, _e = this.compendium.allSkills.filter(function (s) { return s.rank < 50 && _this.learnedBy[s.name]; }); _d < _e.length; _d++) {
                var skill = _e[_d];
                if (!this.elemTyped[skill.inherit]) {
                    this.elemTyped[skill.inherit] = [];
                }
                this.elemTyped[skill.inherit].push(skill);
            }
            for (var _f = 0, _g = Object.values(this.learnedBy); _f < _g.length; _f++) {
                var dl = _g[_f];
                dl.sort(function (a, b) { return a.lvl - b.lvl; });
            }
            for (var _h = 0, _j = Object.values(this.elemTyped); _h < _j.length; _h++) {
                var sl = _j[_h];
                sl.sort(function (a, b) { return a.rank - b.rank; });
            }
            this.form.controls.demonT.setValue(this.demonTs[0]);
        };
        RecipeGeneratorComponent_1.prototype.initFormSubscribes = function () {
            var _this = this;
            var subs = this.subscriptions;
            var controls = this.form.controls;
            subs.push(this.form.valueChanges.pipe((0, operators_1.auditTime)(0)).subscribe(function (f) { return _this.onFormChange(f); }));
            subs.push(controls.demonT.valueChanges.subscribe(function (d) { return _this.splitDemonT(d); }));
            subs.push(controls.demonL.valueChanges.subscribe(function (d) { return _this.splitDemonL(d); }));
            subs.push(controls.demonR.valueChanges.subscribe(function (d) { return _this.splitDemonR(d); }));
            var _loop_1 = function (i, ingred) {
                subs.push(ingred.controls.elem.valueChanges.subscribe(function (e) {
                    return ingred.controls.skill.setValue((i % 2 === 0 ? _this.skillLs : _this.skillRs)[e][0]);
                }));
                subs.push(ingred.controls.skill.valueChanges.subscribe(function (s) { return ingred.controls.demon.setValue(_this.learnedBy[s.name][0]); }));
            };
            for (var _i = 0, _a = controls.ingreds['controls'].entries(); _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], ingred = _b[1];
                _loop_1(i, ingred);
            }
        };
        RecipeGeneratorComponent_1.prototype.onFormChange = function (form) {
            if (!this.form.valid) {
                return;
            }
            var ingredLs = {};
            var ingredRs = {};
            var disabledCount = this.internalMaxSkills - form.ingreds.length;
            for (var i = disabledCount; i < this.internalMaxSkills; i++) {
                var ingred = form.ingreds[i - disabledCount];
                var ingreds = i % 2 === 0 ? ingredLs : ingredRs;
                if (ingred.skill.name !== '-') {
                    ingreds[ingred.skill.name] = ingred.demon.name;
                }
            }
            var lrConfig = {
                result: form.demonT.name,
                targetL: form.demonL.name,
                targetR: form.demonR.name,
                ingredLs: ingredLs,
                ingredRs: ingredRs
            };
            this.updateRecipe((0, recipe_generator_1.createLeftRightRecipe)(lrConfig, this.compendium, this.squareChart, this.recipeConfig));
        };
        RecipeGeneratorComponent_1.prototype.splitDemonT = function (demon) {
            var _this = this;
            var combos = (0, recipe_generator_1.createLeftRightCombos)(demon.name, this.compendium, this.squareChart, this.recipeConfig);
            this.demonRs = {};
            for (var _i = 0, _a = Object.entries(combos); _i < _a.length; _i++) {
                var _b = _a[_i], nameL = _b[0], nameRs = _b[1];
                this.demonRs[nameL] = nameRs.map(function (nameR) { return _this.compendium.getDemon(nameR); });
                this.demonRs[nameL].sort(function (a, b) { return a.name.localeCompare(b.name); });
            }
            this.demonLs = Object.keys(combos).map(function (nameL) { return _this.compendium.getDemon(nameL); });
            this.demonLs.sort(function (a, b) { return _this.demonRs[b.name].length - _this.demonRs[a.name].length; });
            if (this.demonLs.length === 0) {
                this.demonLs = [this.blankDemon];
                this.demonRs = { '-': [this.blankDemon] };
            }
            this.skillTs = this.createSkillLookup(demon, demon);
            this.form.controls.demonL.setValue(this.demonLs[0]);
            var innateCount = Object.values(demon.skills).reduce(function (acc, l) { return acc + (l < 2 ? 1 : 0); }, 0);
            var emitSilent = { emitEvent: false };
            for (var _c = 0, _d = this.form.controls.ingreds['controls'].entries(); _c < _d.length; _c++) {
                var _e = _d[_c], i = _e[0], ingred = _e[1];
                ingred.patchValue({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }, emitSilent);
                if (this.recipeConfig.restrictInherits && i < innateCount) {
                    ingred.disable(emitSilent);
                }
                else {
                    ingred.enable(emitSilent);
                }
            }
        };
        RecipeGeneratorComponent_1.prototype.splitDemonL = function (demon) {
            this.skillLs = this.createSkillLookup(demon, this.form.controls.demonT.value);
            this.form.controls.demonR.setValue(this.demonRs[demon.name][0]);
        };
        RecipeGeneratorComponent_1.prototype.splitDemonR = function (demon) {
            this.skillRs = this.createSkillLookup(demon, this.form.controls.demonT.value);
            for (var _i = 0, _a = this.form.controls.ingreds['controls'].entries(); _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], ingred = _b[1];
                var elem = ingred.controls.elem.value;
                if (elem === '-' || !(i % 2 === 0 ? this.skillLs[elem] : this.skillRs[elem])) {
                    ingred.patchValue({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }, { emitEvent: false });
                }
            }
        };
        return RecipeGeneratorComponent_1;
    }());
    __setFunctionName(_classThis, "RecipeGeneratorComponent");
    (function () {
        _maxSkills_decorators = [(0, core_1.Input)()];
        _compendium_decorators = [(0, core_1.Input)()];
        _squareChart_decorators = [(0, core_1.Input)()];
        _recipeConfig_decorators = [(0, core_1.Input)()];
        _lang_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _maxSkills_decorators, { kind: "field", name: "maxSkills", static: false, private: false, access: { has: function (obj) { return "maxSkills" in obj; }, get: function (obj) { return obj.maxSkills; }, set: function (obj, value) { obj.maxSkills = value; } } }, _maxSkills_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compendium_decorators, { kind: "field", name: "compendium", static: false, private: false, access: { has: function (obj) { return "compendium" in obj; }, get: function (obj) { return obj.compendium; }, set: function (obj, value) { obj.compendium = value; } } }, _compendium_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _squareChart_decorators, { kind: "field", name: "squareChart", static: false, private: false, access: { has: function (obj) { return "squareChart" in obj; }, get: function (obj) { return obj.squareChart; }, set: function (obj, value) { obj.squareChart = value; } } }, _squareChart_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _recipeConfig_decorators, { kind: "field", name: "recipeConfig", static: false, private: false, access: { has: function (obj) { return "recipeConfig" in obj; }, get: function (obj) { return obj.recipeConfig; }, set: function (obj, value) { obj.recipeConfig = value; } } }, _recipeConfig_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        RecipeGeneratorComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecipeGeneratorComponent = _classThis;
}();
