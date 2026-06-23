"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateCompSet = exports.translateComp = void 0;
var translations_json_1 = __importDefault(require("../data/translations.json"));
function translateComp(dict, lang) {
    var i = translations_json_1.default.Languages.Languages.indexOf(lang);
    return dict[-1 < i && i < dict.length ? i : 0];
}
exports.translateComp = translateComp;
function translateCompSet(dict, lang) {
    return Object.entries(dict).reduce(function (acc, _a) {
        var k = _a[0], v = _a[1];
        acc[k] = translateComp(v, lang) || k;
        return acc;
    }, {});
}
exports.translateCompSet = translateCompSet;
