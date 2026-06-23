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
exports.PasswordGeneratorContainerComponent = exports.PasswordGeneratorComponent = void 0;
var core_1 = require("@angular/core");
var password_generator_1 = require("../models/password-generator");
var translator_1 = require("../../compendium/models/translator");
var translations_json_1 = __importDefault(require("../../compendium/data/translations.json"));
var PasswordGeneratorComponent = exports.PasswordGeneratorComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-password-generator',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <form [formGroup]=\"form\">\n      <app-demon-password\n        [encoding]=\"encoding\"\n        [inverseEncoding]=\"inverseEncoding\"\n        [encodeBytes]=\"encodeBytes\"\n        (decodedBytes)=\"setPasswordValues($event)\">\n      </app-demon-password>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th colspan=\"4\" class=\"title\">{{ demonMsgs.Demon | translateComp:lang }}</th></tr>\n          <tr>\n            <th>Mask Byte</th>\n            <th>Lvl</th>\n            <th>{{ demonMsgs.Race | translateComp:lang }}</th>\n            <th>{{ demonMsgs.Name | translateComp:lang }}</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>\n              <select formControlName=\"maskByte\">\n                <option *ngFor=\"let _ of range256; let i = index\" [value]=\"i\">{{ i }}</option>\n              </select>\n            </td>\n            <td>\n              <select formControlName=\"lvl\">\n                <option *ngFor=\"let _ of range99; let i = index\" [value]=\"i + 1\">{{ i + 1 }}</option>\n              </select>\n            </td>\n            <td>\n              <select formControlName=\"race\" (change)=\"changeRace(form.controls.race.value)\">\n                <option *ngFor=\"let race of allRaces\" [value]=\"race\">{{ race }}</option>\n              </select>\n            </td>\n            <td>\n              <select formControlName=\"demon\" (change)=\"setDefaultValues(form.controls.demon.value)\">\n                <option *ngFor=\"let demon of demons[form.controls.race.value]\" [value]=\"demon.name\">{{ demon.name }}</option>\n              </select>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th [attr.colspan]=\"stats.length\" class=\"title\">{{ demonMsgs.Stats | translateComp:lang }}</th></tr>\n          <tr>\n            <th *ngFor=\"let stat of stats\">{{ stat }}</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr formArrayName=\"stats\">\n            <td *ngFor=\"let stat of form.controls.stats['controls']; let i = index\">\n              <select [formControlName]=\"i\">\n                <option *ngFor=\"let _ of range99; let i = index\" [value]=\"i + 1\">{{ i + 1 }}</option>\n              </select>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n      <table class=\"entry-table\">\n        <thead>\n          <tr><th colspan=\"2\" class=\"title\">{{ skillMsgs.LearnedSkills | translateComp:lang }}</th></tr>\n          <tr>\n            <th style=\"width: 25%\">{{ skillMsgs.Elem | translateComp:lang }}</th>\n            <th style=\"width: 75%\">{{ skillMsgs.Name | translateComp:lang }}</th>\n          </tr>\n        </thead>\n        <tbody formArrayName=\"skills\">\n          <ng-container *ngFor=\"let skill of form.controls.skills['controls']; let i = index\" [formGroupName]=\"i\">\n            <tr>\n              <td>\n                <select formControlName=\"elem\" (change)=\"skill.controls.name.setValue(skills[skill.controls.elem.value][0].name)\">\n                  <option *ngFor=\"let elem of allElems\" [value]=\"elem\">{{ displayElems[elem] || elem }}</option>\n                </select>\n              </td>\n              <td>\n                <select formControlName=\"name\">\n                  <option *ngFor=\"let entry of skills[skill.controls.elem.value]\" [value]=\"entry.name\">{{ entry.name }}</option>\n                </select>\n              </td>\n            </tr>\n          </ng-container>\n        </tbody>\n      </table>\n    </form>\n  ",
            styles: ["\n    td select { width: 100%; }\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _lang_decorators;
    var _lang_initializers = [];
    var _defaultDemon_decorators;
    var _defaultDemon_initializers = [];
    var _encoding_decorators;
    var _encoding_initializers = [];
    var _inverseEncoding_decorators;
    var _inverseEncoding_initializers = [];
    var _compendium_decorators;
    var _compendium_initializers = [];
    var _races_decorators;
    var _races_initializers = [];
    var _elems_decorators;
    var _elems_initializers = [];
    var PasswordGeneratorComponent = _classThis = /** @class */ (function () {
        function PasswordGeneratorComponent_1(fb) {
            this.fb = (__runInitializers(this, _instanceExtraInitializers), fb);
            this.lang = __runInitializers(this, _lang_initializers, void 0);
            this.defaultDemon = __runInitializers(this, _defaultDemon_initializers, void 0);
            this.encoding = __runInitializers(this, _encoding_initializers, void 0);
            this.inverseEncoding = __runInitializers(this, _inverseEncoding_initializers, void 0);
            this.compendium = __runInitializers(this, _compendium_initializers, void 0);
            this.races = __runInitializers(this, _races_initializers, void 0);
            this.elems = __runInitializers(this, _elems_initializers, void 0);
            this.stats = ['St', 'Ma', 'Vi', 'Ag', 'Lu'];
            this.internalMaxSkills = 6;
            this.demonMsgs = translations_json_1.default.DemonListComponent;
            this.skillMsgs = translations_json_1.default.SkillListComponent;
            this.range99 = Array(99);
            this.range256 = Array(256);
            this.currHP = 0;
            this.currMP = 0;
            this.price = 0;
            this.unknownDemon = {
                name: '???', race: '-', align: '', code: 0,
                lvl: 0, currLvl: 0, skills: {}, skillCards: {},
                price: 0, stats: [0, 0, 0, 0, 0], growths: [], resists: [], ailments: [],
                inherits: 0, affinities: [], fusion: 'normal', prereq: '', searchTags: '-'
            };
            this.blankSkill = {
                name: '-', code: 0, element: '-', rank: 0,
                effect: '-', target: '-', cost: 0, learnedBy: [], transfer: [], level: 0
            };
            this.unknownSkill = {
                name: '???', code: 0, element: '-', rank: 0,
                effect: '-', target: '-', cost: 0, learnedBy: [], transfer: [], level: 0
            };
            this.createForm();
        }
        PasswordGeneratorComponent_1.prototype.ngOnChanges = function () { this.initDropdowns(); };
        PasswordGeneratorComponent_1.prototype.createForm = function () {
            var _this = this;
            var skills = [];
            for (var i = 0; i < 6; i++) {
                skills.push(this.fb.group({ elem: '-', name: '-' }));
            }
            this.form = this.fb.group({
                maskByte: 0,
                lvl: 1,
                race: '-',
                demon: '???',
                stats: this.fb.array(Array(5).fill(1)),
                skills: this.fb.array(skills)
            });
            this.form.valueChanges.subscribe(function (form) {
                var demon = _this.compendium.getDemon(form.demon) || _this.unknownDemon;
                var dskills = form.skills.map(function (s) { return _this.compendium.getSkill(s.name) || _this.blankSkill; });
                var decoded = {
                    demonCode: demon.code,
                    lvl: parseInt(form.lvl, 10),
                    exp: 0,
                    stats: form.stats.map(function (s) { return parseInt(s, 10); }),
                    baseStats: form.stats.map(function (s) { return parseInt(s, 10); }),
                    skillCodes: dskills.map(function (s) { return s.code; }),
                    maskByte: parseInt(form.maskByte, 10),
                };
                var maxRank = 0;
                for (var _i = 0, dskills_1 = dskills; _i < dskills_1.length; _i++) {
                    var skill = dskills_1[_i];
                    if (!demon.skills.hasOwnProperty(skill.name) && maxRank < skill.rank && skill.rank < 15) {
                        maxRank = skill.rank;
                    }
                }
                // const statsPrice = demon.pcoeff * Math.pow(decoded.stats.reduce((acc, s) => acc + s, 0), 3);
                // const overflowPrice = this.isRedux ? statsPrice : statsPrice % Math.pow(2, 32);
                // this.price = Math.floor((Math.floor(overflowPrice / 1000) + SkillCosts[maxRank] + 1300) * 0.75);
                _this.encodeBytes = (0, password_generator_1.encodeDemon)(decoded);
                // this.currHP = decoded.lvl * 6 + Math.floor(decoded.stats[2] * 3 * demon.hpmod) + (demon.name === 'Knocker' ? 30 : 25);
                // this.currMP = decoded.lvl * 3 + Math.floor(decoded.stats[1] * 2 * demon.hpmod) + (demon.name === 'Knocker' ? 14 : 13);
            });
        };
        PasswordGeneratorComponent_1.prototype.initDropdowns = function () {
            var _this = this;
            this.demons = { '-': [this.unknownDemon] };
            this.skills = { '-': [this.blankSkill], '???': [this.unknownSkill] };
            this.dcodes = {};
            this.scodes = { 0: this.blankSkill };
            this.displayElems = (0, translator_1.translateCompSet)(translations_json_1.default.ElementIcon, this.lang);
            if (this.compendium) {
                for (var _i = 0, _a = this.compendium.allDemons; _i < _a.length; _i++) {
                    var demon = _a[_i];
                    if (!this.demons[demon.race]) {
                        this.demons[demon.race] = [];
                    }
                    this.demons[demon.race].push(demon);
                    this.dcodes[demon.code] = demon;
                }
                for (var _b = 0, _c = this.compendium.allSkills; _b < _c.length; _b++) {
                    var skill = _c[_b];
                    if (!this.skills[skill.element]) {
                        this.skills[skill.element] = [];
                    }
                    if (skill.code > 0) {
                        this.skills[skill.rank < 90 ? skill.element : '???'].push(skill);
                        this.scodes[skill.code] = skill;
                    }
                }
                for (var _d = 0, _e = Object.values(this.demons); _d < _e.length; _d++) {
                    var demonList = _e[_d];
                    if (demonList.length === 0) {
                        demonList.push();
                    }
                    demonList.sort(function (a, b) { return b.lvl - a.lvl; });
                }
                for (var _f = 0, _g = Object.values(this.skills); _f < _g.length; _f++) {
                    var skillList = _g[_f];
                    skillList.sort(function (a, b) { return a.rank - b.rank; });
                }
                this.allRaces = ['-'].concat(this.races.filter(function (r) { return _this.demons[r]; }));
                this.allElems = ['-'].concat(this.elems.filter(function (e) { return _this.skills[e]; }), ['???']);
                this.setDefaultValues(this.defaultDemon);
            }
        };
        PasswordGeneratorComponent_1.prototype.changeRace = function (race) {
            var demon = this.demons[race][0];
            this.form.controls.demon.setValue(demon.name);
            this.setDefaultValues(demon.name);
        };
        PasswordGeneratorComponent_1.prototype.setPasswordValues = function (passwordBytes) {
            var _this = this;
            var demon = (0, password_generator_1.decodeDemon)(passwordBytes);
            var sentries = demon.skillCodes.map(function (c) { return _this.scodes[c] || _this.unknownSkill; });
            var dentry = Object.assign({}, this.dcodes[demon.demonCode] || this.unknownDemon, {
                lvl: demon.lvl,
                stats: [0, 0].concat(demon.stats.map(function (s) { return Math.min(Math.max(s, 1), 99); })),
            });
            this.form.setValue({
                maskByte: demon.maskByte,
                lvl: dentry.lvl,
                race: dentry.race,
                demon: dentry.name,
                stats: dentry.stats.slice(2),
                skills: sentries.map(function (s) { return ({ elem: s.element, name: s.name }); })
            });
        };
        PasswordGeneratorComponent_1.prototype.setDefaultValues = function (name) {
            var _this = this;
            if (name !== this.unknownDemon.name) {
                var demon = this.compendium.getDemon(name);
                var innateSkills = Object.entries(demon.skills)
                    .slice(0, this.internalMaxSkills)
                    .filter(function (s) { return s[1] < 2; })
                    .map(function (s) { return _this.compendium.getSkill(s[0]); });
                var learnedSkills = Object.entries(demon.skills)
                    .filter(function (s) { return s[1] < 100; })
                    .map(function (s) { return _this.compendium.getSkill(s[0]); });
                this.skills[this.blankSkill.element] = [this.blankSkill].concat(learnedSkills);
                this.form.setValue({
                    maskByte: 0,
                    lvl: Math.floor(demon.lvl),
                    race: demon.race,
                    demon: demon.name,
                    stats: demon.stats.slice(2),
                    skills: innateSkills
                        .concat(Array(this.internalMaxSkills - innateSkills.length).fill(this.blankSkill))
                        .map(function (s) { return ({ elem: '-', name: s.name }); })
                });
            }
        };
        return PasswordGeneratorComponent_1;
    }());
    __setFunctionName(_classThis, "PasswordGeneratorComponent");
    (function () {
        _lang_decorators = [(0, core_1.Input)()];
        _defaultDemon_decorators = [(0, core_1.Input)()];
        _encoding_decorators = [(0, core_1.Input)()];
        _inverseEncoding_decorators = [(0, core_1.Input)()];
        _compendium_decorators = [(0, core_1.Input)()];
        _races_decorators = [(0, core_1.Input)()];
        _elems_decorators = [(0, core_1.Input)()];
        __esDecorate(null, null, _lang_decorators, { kind: "field", name: "lang", static: false, private: false, access: { has: function (obj) { return "lang" in obj; }, get: function (obj) { return obj.lang; }, set: function (obj, value) { obj.lang = value; } } }, _lang_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _defaultDemon_decorators, { kind: "field", name: "defaultDemon", static: false, private: false, access: { has: function (obj) { return "defaultDemon" in obj; }, get: function (obj) { return obj.defaultDemon; }, set: function (obj, value) { obj.defaultDemon = value; } } }, _defaultDemon_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _encoding_decorators, { kind: "field", name: "encoding", static: false, private: false, access: { has: function (obj) { return "encoding" in obj; }, get: function (obj) { return obj.encoding; }, set: function (obj, value) { obj.encoding = value; } } }, _encoding_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _inverseEncoding_decorators, { kind: "field", name: "inverseEncoding", static: false, private: false, access: { has: function (obj) { return "inverseEncoding" in obj; }, get: function (obj) { return obj.inverseEncoding; }, set: function (obj, value) { obj.inverseEncoding = value; } } }, _inverseEncoding_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _compendium_decorators, { kind: "field", name: "compendium", static: false, private: false, access: { has: function (obj) { return "compendium" in obj; }, get: function (obj) { return obj.compendium; }, set: function (obj, value) { obj.compendium = value; } } }, _compendium_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _races_decorators, { kind: "field", name: "races", static: false, private: false, access: { has: function (obj) { return "races" in obj; }, get: function (obj) { return obj.races; }, set: function (obj, value) { obj.races = value; } } }, _races_initializers, _instanceExtraInitializers);
        __esDecorate(null, null, _elems_decorators, { kind: "field", name: "elems", static: false, private: false, access: { has: function (obj) { return "elems" in obj; }, get: function (obj) { return obj.elems; }, set: function (obj, value) { obj.elems = value; } } }, _elems_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        PasswordGeneratorComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PasswordGeneratorComponent = _classThis;
}();
var PasswordGeneratorContainerComponent = exports.PasswordGeneratorContainerComponent = function () {
    var _classDecorators_1 = [(0, core_1.Component)({
            selector: 'app-password-generator-container',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <app-password-generator\n      [lang]=\"compConfig.lang\"\n      [races]=\"compConfig.races\"\n      [elems]=\"compConfig.skillElems\"\n      [defaultDemon]=\"compConfig.defaultRecipeDemon\"\n      [encoding]=\"encoding\"\n      [inverseEncoding]=\"inverseEncoding\"\n      [compendium]=\"compendium\">\n    </app-password-generator>\n  "
        })];
    var _classDescriptor_1;
    var _classExtraInitializers_1 = [];
    var _classThis_1;
    var PasswordGeneratorContainerComponent = _classThis_1 = /** @class */ (function () {
        function PasswordGeneratorContainerComponent_1(fusionDataService, title) {
            this.fusionDataService = fusionDataService;
            this.title = title;
            this.subscriptions = [];
        }
        PasswordGeneratorContainerComponent_1.prototype.ngOnInit = function () { this.setTitle(); this.subscribeAll(); };
        PasswordGeneratorContainerComponent_1.prototype.ngOnDestroy = function () { this.unsubscribeAll(); };
        PasswordGeneratorContainerComponent_1.prototype.setTitle = function () {
            this.title.setTitle("Password Generator - ".concat(this.fusionDataService.appName));
        };
        PasswordGeneratorContainerComponent_1.prototype.subscribeAll = function () {
            var _this = this;
            var encodings = [
                "$234567890ABCDEFGH%JKLMNOPQRSTUVWXYZabcdefghijk#mnopqrstuvwxyz-+",
                "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?&",
                "しんいくみBやるYけひKFとHむAちにZきWよLをのたれNえSふわJそりすCめPへQGRDこMTまつせかはEUてさなあもゆおうろ",
                "しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ"
            ];
            this.compConfig = this.fusionDataService.compConfig;
            var encodingIndex = this.compConfig.lang !== 'en' ? 3 :
                this.compConfig.appCssClasses.includes('smtdsj') ? 1 : 0;
            this.encoding = encodings[encodingIndex];
            this.inverseEncoding = {};
            for (var _i = 0, _a = encodings.concat([encodings[encodingIndex]]); _i < _a.length; _i++) {
                var encoding = _a[_i];
                this.inverseEncoding = encoding.split('').reduce(function (acc, c, i) { acc[c] = i; return acc; }, this.inverseEncoding);
            }
            this.subscriptions.push(this.fusionDataService.compendium.subscribe(function (comp) {
                _this.compendium = comp;
            }));
        };
        PasswordGeneratorContainerComponent_1.prototype.unsubscribeAll = function () {
            for (var _i = 0, _a = this.subscriptions; _i < _a.length; _i++) {
                var subscription = _a[_i];
                subscription.unsubscribe();
            }
        };
        return PasswordGeneratorContainerComponent_1;
    }());
    __setFunctionName(_classThis_1, "PasswordGeneratorContainerComponent");
    (function () {
        __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
        PasswordGeneratorContainerComponent = _classThis_1 = _classDescriptor_1.value;
        __runInitializers(_classThis_1, _classExtraInitializers_1);
    })();
    return PasswordGeneratorContainerComponent = _classThis_1;
}();
