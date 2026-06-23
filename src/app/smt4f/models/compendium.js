"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compendium = void 0;
var conversions_1 = require("../../compendium/models/conversions");
var Compendium = /** @class */ (function () {
    function Compendium(compConfig, demonToggles) {
        this.compConfig = compConfig;
        this.initImportedData();
        this.updateDerivedData(demonToggles);
    }
    Compendium.prototype.initImportedData = function () {
        var demons = {};
        var skills = {};
        var fusionSpells = {};
        var specialRecipes = {};
        var specialPairRecipes = {};
        var inversions = {};
        var resistCodes = {};
        var resistLvls = {};
        var blankAilments = '-'.repeat(this.compConfig.ailmentElems.length);
        for (var _i = 0, _a = Object.entries(this.compConfig.fusionSpells); _i < _a.length; _i++) {
            var _b = _a[_i], sname = _b[0], dnames = _b[1];
            for (var _c = 0, dnames_1 = dnames; _c < dnames_1.length; _c++) {
                var dname = dnames_1[_c];
                fusionSpells[dname] = sname;
            }
        }
        for (var _d = 0, _e = Object.entries(this.compConfig.resistCodes); _d < _e.length; _d++) {
            var _f = _e[_d], res = _f[0], code = _f[1];
            resistCodes[res] = (code / 1000 | 0) << 10;
            resistLvls[res] = code % 1000 / 2.5 | 0;
        }
        var codifyResists = function (resCode, blankCode, resLvls) {
            return (resCode || blankCode).split('').map(function (x, i) {
                return resistCodes[x] + ((resLvls === null || resLvls === void 0 ? void 0 : resLvls[i]) / 2.5 | 0 || resistLvls[x]);
            });
        };
        var langEn = this.compConfig.lang === 'en';
        var ailEffect = langEn ? 'Innate resistance' : '';
        var ailTarget = langEn ? 'Self' : '自身';
        var ailPrefixes = langEn ? ['Weak ', 'Resist ', 'Null '] : ['弱', '耐', '無'];
        var ailmentResists = {};
        var ailLvls = {};
        var hasInnate = this.compConfig.appCssClasses.includes('smt5v');
        var aligns = this.compConfig.alignments;
        for (var _g = 0, _h = 'wsn'.split('').entries(); _g < _h.length; _g++) {
            var _j = _h[_g], i = _j[0], res = _j[1];
            ailmentResists[resistCodes[res] >> 10] = [];
            ailLvls[resistCodes[res] >> 10] = ailPrefixes[i];
        }
        for (var _k = 0, _l = Object.entries(ailLvls); _k < _l.length; _k++) {
            var _m = _l[_k], lvl = _m[0], prefix = _m[1];
            for (var _o = 0, _p = this.compConfig.ailmentElems; _o < _p.length; _o++) {
                var ail = _p[_o];
                ailmentResists[lvl].push({
                    name: prefix + ail,
                    code: 0,
                    element: 'pas',
                    inherit: 'non',
                    effect: ailEffect,
                    target: ailTarget,
                    cost: 0,
                    rank: 99,
                    learnedBy: [],
                    level: 0
                });
            }
        }
        for (var _q = 0, _r = this.compConfig.demonData; _q < _r.length; _q++) {
            var demonJson = _r[_q];
            for (var _s = 0, _t = Object.entries(demonJson); _s < _t.length; _s++) {
                var _u = _t[_s], name_1 = _u[0], json = _u[1];
                var race = json['race'];
                var align = aligns[name_1] || aligns[race] || 'Neutral-Neutral';
                var _v = align.split('-'), lidark = _v[0], lawchaos = _v[1];
                demons[name_1] = {
                    name: name_1,
                    race: race,
                    align: "align-".concat(lidark[0].toLocaleLowerCase()).concat(lawchaos[0].toLocaleLowerCase()),
                    code: json['code'] || 0,
                    lvl: json['lvl'],
                    currLvl: json['currLvl'] || json['lvl'],
                    skills: json['skills'],
                    skillCards: json['skillCards'] || {},
                    price: json['price'] * 2,
                    stats: json['stats'],
                    growths: json['steps'] || [],
                    resists: codifyResists(json['resists'], json['resists'], json['resmods']),
                    ailments: codifyResists(json['ailments'], blankAilments, json['ailmods']),
                    inherits: parseInt(((json['affinities'] || [-10]).map(function (a) { return a > -10 ? '1' : '0'; })).join(''), 2),
                    affinities: json['affinities'],
                    fusion: json['fusion'] || 'normal',
                    prereq: json['prereq'] || '',
                    auctions: json['auctions'],
                    searchTags: [name_1, race].join(',').toLocaleLowerCase()
                };
                if (fusionSpells[race]) {
                    demons[name_1].skills[fusionSpells[race]] = 5278;
                }
                if (hasInnate && json['innate'] !== '-') {
                    demons[name_1].price = json['innatePrice'] * 2,
                        demons[name_1].skills = Object.assign({}, json['skills']);
                    demons[name_1].skills[json['innate']] = 0;
                    if (fusionSpells[align]) {
                        demons[name_1].skills[fusionSpells[align]] = 4884;
                    }
                    if (fusionSpells[name_1]) {
                        demons[name_1].skills[fusionSpells[name_1]] = 4884;
                    }
                }
            }
        }
        for (var _w = 0, _x = this.compConfig.demonUnlocks; _w < _x.length; _w++) {
            var unlockSet = _x[_w];
            for (var _y = 0, _z = Object.entries(unlockSet.conditions); _y < _z.length; _y++) {
                var _0 = _z[_y], dnames = _0[0], unlockCond = _0[1];
                for (var _1 = 0, _2 = dnames.split(','); _1 < _2.length; _1++) {
                    var dname = _2[_1];
                    demons[dname].prereq = unlockCond;
                }
            }
        }
        for (var _3 = 0, _4 = this.compConfig.skillData; _3 < _4.length; _3++) {
            var skillJson = _4[_3];
            for (var _5 = 0, _6 = Object.entries(skillJson); _5 < _6.length; _5++) {
                var _7 = _6[_5], name_2 = _7[0], json = _7[1];
                skills[name_2] = {
                    name: name_2,
                    code: json['code'] || 0,
                    element: json['element'],
                    inherit: json['inherit'] || json['element'],
                    rank: json['rank'],
                    effect: json['effect'],
                    damage: json['damage'] || '',
                    target: json['target'] || 'Self',
                    hits: json['hits'] || '',
                    cost: json['cost'] || 0,
                    learnedBy: [],
                    transfer: [],
                    level: 0
                };
                if (!skills[name_2].rank) {
                    skills[name_2].rank = 99;
                }
                if (json['card']) {
                    skills[name_2].transfer = json['card'].split(', ').map(function (d) { return ({ demon: d, level: demons[d] ? 0 : -100 }); });
                }
            }
        }
        for (var _8 = 0, _9 = Object.values(ailmentResists); _8 < _9.length; _8++) {
            var sentries = _9[_8];
            for (var _10 = 0, sentries_1 = sentries; _10 < sentries_1.length; _10++) {
                var sentry = sentries_1[_10];
                skills[sentry.name] = sentry;
            }
        }
        var elemChart = this.compConfig.elementTable;
        for (var _11 = 0, _12 = Object.entries((0, conversions_1.toMitamaNamePairs)(elemChart.elems, elemChart.pairs)); _11 < _12.length; _11++) {
            var _13 = _12[_11], mitama = _13[0], namePairs = _13[1];
            specialPairRecipes[mitama] = namePairs;
            demons[mitama].fusion = 'special';
        }
        for (var _14 = 0, _15 = Object.entries(this.compConfig.specialRecipes); _14 < _15.length; _14++) {
            var _16 = _15[_14], name_3 = _16[0], ingreds = _16[1];
            demons[name_3].fusion = ingreds.length > 0 ? 'special' : 'accident';
            specialRecipes[name_3] = ingreds.filter(function (i) { return !i.includes(' x '); });
            if (ingreds.length > 0 && this.compConfig.appCssClasses.includes('smt3')) {
                specialPairRecipes[name_3] = ingreds.map(function (p) { return ({ name1: p.split(' x ')[0], name2: p.split(' x ')[1] }); });
            }
        }
        for (var _17 = 0, _18 = Object.entries(this.compConfig.evolveData); _17 < _18.length; _17++) {
            var _19 = _18[_17], name_4 = _19[0], json = _19[1];
            var result = json['result'];
            demons[name_4].evolvesTo = {
                price: demons[result].price,
                race1: demons[result].race,
                lvl1: json['lvl'],
                name1: result
            };
            demons[result].evolvesFrom = {
                price: demons[name_4].price,
                race1: demons[name_4].race,
                lvl1: json['lvl'],
                name1: name_4
            };
        }
        for (var _20 = 0, _21 = this.compConfig.races; _20 < _21.length; _20++) {
            var race = _21[_20];
            inversions[race] = {};
        }
        for (var _22 = 0, _23 = Object.entries(demons); _22 < _23.length; _22++) {
            var _24 = _23[_22], name_5 = _24[0], demon = _24[1];
            inversions[demon.race][demon.lvl] = name_5;
        }
        for (var _25 = 0, _26 = Object.values(demons).sort(function (a, b) { return a.currLvl - b.currLvl; }); _25 < _26.length; _25++) {
            var demon = _26[_25];
            if (demon.fusion !== 'enemy') {
                for (var _27 = 0, _28 = Object.entries(demon.skills); _27 < _28.length; _27++) {
                    var _29 = _28[_27], name_6 = _29[0], level = _29[1];
                    skills[name_6].learnedBy.push({ demon: demon.name, level: level });
                }
                for (var _30 = 0, _31 = Object.entries(demon.skillCards); _30 < _31.length; _30++) {
                    var _32 = _31[_30], name_7 = _32[0], level = _32[1];
                    skills[name_7].transfer.push({ demon: demon.name, level: level });
                }
                for (var i = 0; i < demon.ailments.length; i++) {
                    if (ailmentResists[demon.ailments[i] >> 10]) {
                        ailmentResists[demon.ailments[i] >> 10][i].learnedBy.push({ demon: demon.name, level: 0 });
                    }
                }
            }
        }
        this.demons = demons;
        this.skills = skills;
        this.specialRecipes = specialRecipes;
        this.specialPairRecipes = specialPairRecipes;
        this.invertedDemons = inversions;
    };
    Compendium.prototype.updateDerivedData = function (demonToggles) {
        var _this = this;
        var demonEntries = Object.assign({}, this.demons);
        var skills = Object.keys(this.skills).map(function (name) { return _this.skills[name]; });
        var ingredients = {};
        var results = {};
        var hasElemOverflow = this.compConfig.appCssClasses.includes('smt4f');
        for (var _i = 0, _a = this.compConfig.races; _i < _a.length; _i++) {
            var race = _a[_i];
            ingredients[race] = [];
            results[race] = [];
        }
        for (var _b = 0, _c = Object.entries(this.demons); _b < _c.length; _b++) {
            var _d = _c[_b], name_8 = _d[0], demon = _d[1];
            if (!this.isElementDemon(name_8) && !this.isOverlappingResult(name_8)) {
                ingredients[demon.race].push(demon.lvl);
            }
            if (!this.specialRecipes.hasOwnProperty(name_8)) {
                results[demon.race].push(demon.lvl);
            }
        }
        for (var _e = 0, _f = this.compConfig.races; _e < _f.length; _e++) {
            var race = _f[_e];
            ingredients[race].sort(function (a, b) { return a - b; });
            results[race].sort(function (a, b) { return a - b; });
        }
        for (var _g = 0, _h = this.compConfig.races; _g < _h.length; _g++) {
            var race = _h[_g];
            var currIngreds = ingredients[race];
            var currResults = results[race];
            var ingredsLen = currIngreds.length;
            var resultsLen = currResults.length;
            if (hasElemOverflow && ingredsLen && resultsLen && currIngreds[ingredsLen - 1] !== currResults[resultsLen - 1]) {
                currResults.push(100);
            }
        }
        var _loop_1 = function (name_9, included) {
            if (!included) {
                var _m = this_1.demons[name_9], race = _m.race, lvl_1 = _m.lvl;
                delete demonEntries[name_9];
                ingredients[race] = ingredients[race].filter(function (l) { return l !== lvl_1; });
                results[race] = results[race].filter(function (l) { return l !== lvl_1; });
            }
        };
        var this_1 = this;
        for (var _j = 0, _k = Object.entries(demonToggles); _j < _k.length; _j++) {
            var _l = _k[_j], name_9 = _l[0], included = _l[1];
            _loop_1(name_9, included);
        }
        this._allDemons = Object.keys(demonEntries).map(function (name) { return demonEntries[name]; });
        this._allSkills = skills.filter(function (skill) { return skill.rank < 99 || skill.learnedBy.length > 0; });
        this.allIngredients = ingredients;
        this.allResults = results;
    };
    Object.defineProperty(Compendium.prototype, "allDemons", {
        get: function () {
            return this._allDemons;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Compendium.prototype, "allSkills", {
        get: function () {
            return this._allSkills;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Compendium.prototype, "specialDemons", {
        get: function () {
            var _this = this;
            return Object.keys(this.specialRecipes).map(function (name) { return _this.demons[name]; });
        },
        enumerable: false,
        configurable: true
    });
    Compendium.prototype.getDemon = function (name) {
        return this.demons[name];
    };
    Compendium.prototype.getSkill = function (name) {
        return this.skills[name];
    };
    Compendium.prototype.getSkills = function (names) {
        var _this = this;
        var elemOrder = this.compConfig.elemOrder;
        var skills = names.map(function (name) { return _this.skills[name]; });
        skills.sort(function (d1, d2) { return (elemOrder[d1.element] - elemOrder[d2.element]) * 10000 + d1.rank - d2.rank; });
        return skills;
    };
    Compendium.prototype.getIngredientDemonLvls = function (race) {
        return this.allIngredients[race] || [];
    };
    Compendium.prototype.getResultDemonLvls = function (race) {
        return this.allResults[race] || [];
    };
    Compendium.prototype.getSpecialNameEntries = function (name) {
        return this.specialRecipes[name] || [];
    };
    Compendium.prototype.getSpecialNamePairs = function (name) {
        return this.specialPairRecipes[name] || [];
    };
    Compendium.prototype.reverseLookupDemon = function (race, lvl) {
        return this.invertedDemons[race][lvl];
    };
    Compendium.prototype.reverseLookupSpecial = function (ingredient) {
        return [];
    };
    Compendium.prototype.isElementDemon = function (name) {
        return this.demons[name] && this.demons[name].race === this.compConfig.elementRace;
    };
    Compendium.prototype.isOverlappingResult = function (name) {
        return false;
    };
    Compendium.prototype.updateFusionSettings = function (demonToggles) {
        this.updateDerivedData(demonToggles);
    };
    return Compendium;
}());
exports.Compendium = Compendium;
