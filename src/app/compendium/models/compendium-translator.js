"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompendiumTranslator = void 0;
var translations_json_1 = __importDefault(require("../data/translations.json"));
var fusion_tools_json_1 = __importDefault(require("../data/fusion-tools.json"));
var demon_names_json_1 = __importDefault(require("../data/demon-names.json"));
var enemy_names_json_1 = __importDefault(require("../data/enemy-names.json"));
var skill_names_json_1 = __importDefault(require("../data/skill-names.json"));
var race_names_json_1 = __importDefault(require("../data/race-names.json"));
var elem_names_json_1 = __importDefault(require("../data/elem-names.json"));
var CompendiumTranslator = /** @class */ (function () {
    function CompendiumTranslator() {
    }
    CompendiumTranslator.prototype.langToCode = function (language) {
        return translations_json_1.default.Languages.Languages.slice(1).indexOf(language);
    };
    CompendiumTranslator.prototype.translate = function (word, langCode, lookup) {
        if (langCode === -1) {
            return word;
        }
        var suffixMatch = word.match(/^(.*) ([A-HJ-Z])$/);
        var fromWord = suffixMatch ? suffixMatch[1] : word;
        var toWord = (lookup[fromWord] || [])[langCode] || fromWord;
        return suffixMatch ? "".concat(toWord, " ").concat(suffixMatch[2]) : toWord;
    };
    CompendiumTranslator.prototype.translateList = function (oldList, language, lookup) {
        var _this = this;
        var langCode = this.langToCode(language);
        return langCode === -1 ? oldList : oldList.map(function (w) { return _this.translate(w, langCode, lookup); });
    };
    Object.defineProperty(CompendiumTranslator.prototype, "supportedLanguages", {
        get: function () { return translations_json_1.default.Languages.Languages.slice(1); },
        enumerable: false,
        configurable: true
    });
    CompendiumTranslator.prototype.translateRaces = function (oldRaces, language) { return this.translateList(oldRaces, language, race_names_json_1.default); };
    CompendiumTranslator.prototype.translateElems = function (oldStats, language) { return this.translateList(oldStats, language, elem_names_json_1.default); };
    CompendiumTranslator.prototype.translateAppTitle = function (oldTitle, language) {
        var langCode = this.langToCode(language);
        var newTitles = Object.values(fusion_tools_json_1.default).find(function (t) { return t[0] === oldTitle; }) || [];
        return langCode === -1 ? oldTitle : newTitles[langCode + 1] || oldTitle;
    };
    CompendiumTranslator.prototype.translateSettingsKey = function (oldKey, language) {
        return this.langToCode(language) === -1 ? oldKey : "".concat(oldKey, "-").concat(language);
    };
    CompendiumTranslator.prototype.translateDemonData = function (oldDemons, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldDemons;
        }
        var newDemons = {};
        for (var _i = 0, _a = Object.entries(oldDemons); _i < _a.length; _i++) {
            var _b = _a[_i], dname = _b[0], entry = _b[1];
            var newEntry = Object.assign({}, entry);
            for (var _c = 0, _d = ['skills', 'skillCards']; _c < _d.length; _c++) {
                var skillSet = _d[_c];
                if (entry[skillSet]) {
                    newEntry[skillSet] = {};
                    for (var _e = 0, _f = Object.entries(entry[skillSet]); _e < _f.length; _e++) {
                        var _g = _f[_e], sname = _g[0], lvl = _g[1];
                        newEntry[skillSet][this.translate(sname, langCode, skill_names_json_1.default)] = lvl;
                    }
                }
            }
            for (var _h = 0, _j = ['innate', 'trait']; _h < _j.length; _h++) {
                var extraSkill = _j[_h];
                if (entry[extraSkill]) {
                    newEntry[extraSkill] = this.translate(entry[extraSkill], langCode, skill_names_json_1.default);
                }
            }
            newEntry['race'] = this.translate(entry['race'], langCode, race_names_json_1.default);
            if (entry['item']) {
                newEntry['item'] = entry['item'].split(', ').map(function (i) { return _this.translate(i, langCode, skill_names_json_1.default); }).join(', ');
            }
            newDemons[this.translate(dname, langCode, demon_names_json_1.default)] = newEntry;
        }
        return newDemons;
    };
    CompendiumTranslator.prototype.translateEnemyData = function (oldEnemies, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldEnemies;
        }
        var newEnemies = {};
        for (var _i = 0, _a = Object.entries(oldEnemies); _i < _a.length; _i++) {
            var _b = _a[_i], dname = _b[0], entry = _b[1];
            var newEntry = Object.assign({}, entry);
            if (entry['skills']) {
                newEntry['skills'] = entry['skills'].map(function (s) { return _this.translate(s, langCode, skill_names_json_1.default); });
            }
            if (entry['persona']) {
                newEntry['persona'] = this.translate(entry['persona'], langCode, demon_names_json_1.default);
            }
            if (entry['drops']) {
                newEntry['drops'] = entry['drops'].map(function (d) { return _this.translate(d, langCode, skill_names_json_1.default); });
            }
            newEntry['race'] = this.translate(entry['race'], langCode, race_names_json_1.default);
            newEnemies[this.translate(dname, langCode, enemy_names_json_1.default)] = newEntry;
        }
        return newEnemies;
    };
    CompendiumTranslator.prototype.translateSkillData = function (oldSkills, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldSkills;
        }
        var newSkills = {};
        for (var _i = 0, _a = Object.entries(oldSkills); _i < _a.length; _i++) {
            var _b = _a[_i], sname = _b[0], entry = _b[1];
            var newEntry = Object.assign({}, entry);
            var target = newEntry['target'] || 'Self';
            newEntry['target'] = this.translate(newEntry['target'] || 'Self', langCode, elem_names_json_1.default);
            if (newEntry['card']) {
                newEntry['card'] = newEntry['card'].split(', ').map(function (d) { return _this.translate(d, langCode, demon_names_json_1.default); }).join(', ');
            }
            newSkills[this.translate(sname, langCode, skill_names_json_1.default)] = newEntry;
        }
        return newSkills;
    };
    CompendiumTranslator.prototype.translateSpecialRecipes = function (oldRecipes, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldRecipes;
        }
        var newRecipes = {};
        for (var _i = 0, _a = Object.entries(oldRecipes); _i < _a.length; _i++) {
            var _b = _a[_i], dname = _b[0], recipe = _b[1];
            newRecipes[this.translate(dname, langCode, demon_names_json_1.default)] = recipe.map(function (r) { return r.split(' x ').map(function (i) { return _this.translate(_this.translate(i, langCode, demon_names_json_1.default), langCode, race_names_json_1.default); }).join(' x '); });
        }
        return newRecipes;
    };
    CompendiumTranslator.prototype.translateFusionSpells = function (oldCards, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldCards;
        }
        var newCards = {};
        for (var _i = 0, _a = Object.entries(oldCards); _i < _a.length; _i++) {
            var _b = _a[_i], dname = _b[0], recipe = _b[1];
            newCards[this.translate(dname, langCode, skill_names_json_1.default)] = recipe.map(function (c) {
                return _this.translate(_this.translate(c, langCode, race_names_json_1.default), langCode, demon_names_json_1.default);
            });
        }
        return newCards;
    };
    CompendiumTranslator.prototype.translateFusionChart = function (oldChart, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldChart;
        }
        var newChart = {
            races: oldChart['races'].map(function (race) { return _this.translate(race, langCode, race_names_json_1.default); }),
            table: oldChart['table']
        };
        if (oldChart['elems']) {
            newChart['elems'] = oldChart['elems'].map(function (race) { return _this.translate(race, langCode, demon_names_json_1.default); });
        }
        else {
            newChart['table'] = oldChart['table'].map(function (row) { return row.map(function (race) {
                return _this.translate(_this.translate(race, langCode, race_names_json_1.default), langCode, demon_names_json_1.default);
            }); });
        }
        if (oldChart['pairs']) {
            newChart['pairs'] = oldChart['pairs'].map(function (row) { return row.map(function (race) {
                return _this.translate(_this.translate(race, langCode, race_names_json_1.default), langCode, demon_names_json_1.default);
            }); });
        }
        return newChart;
    };
    CompendiumTranslator.prototype.translateDemonUnlocks = function (oldUnlocks, language) {
        var _this = this;
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldUnlocks;
        }
        var newUnlocks = [];
        for (var _i = 0, oldUnlocks_1 = oldUnlocks; _i < oldUnlocks_1.length; _i++) {
            var _a = oldUnlocks_1[_i], category = _a.category, unlocked = _a.unlocked, conditions = _a.conditions;
            var newConditions = {};
            for (var _b = 0, _c = Object.entries(conditions); _b < _c.length; _b++) {
                var _d = _c[_b], name_1 = _d[0], cond = _d[1];
                var enName = name_1.split(',').map(function (d) { return _this.translate(d, langCode, demon_names_json_1.default); }).join(',');
                newConditions[enName] = cond;
            }
            newUnlocks.push({
                category: category,
                unlocked: unlocked,
                conditions: newConditions
            });
        }
        return newUnlocks;
    };
    CompendiumTranslator.prototype.translateEvolutions = function (oldEvolves, language) {
        var langCode = this.langToCode(language);
        if (langCode === -1) {
            return oldEvolves;
        }
        var newEvolves = {};
        for (var _i = 0, _a = Object.entries(oldEvolves); _i < _a.length; _i++) {
            var _b = _a[_i], dname = _b[0], recipe = _b[1];
            newEvolves[this.translate(dname, langCode, demon_names_json_1.default)] = {
                lvl: recipe['lvl'],
                result: this.translate(recipe['result'], langCode, demon_names_json_1.default)
            };
        }
        return newEvolves;
    };
    return CompendiumTranslator;
}());
exports.CompendiumTranslator = CompendiumTranslator;
