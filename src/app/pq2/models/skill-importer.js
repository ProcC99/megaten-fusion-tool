"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSkillRow = exports.skillRowToEffect = void 0;
var skill_effects_json_1 = __importDefault(require("../../compendium/data/skill-effects.json"));
function skillRowToEffect(nums, descs, sqrtPwr) {
    var rank = nums[0], cost = nums[1], power = nums[2], minHits = nums[3], maxHits = nums[4], acc = nums[5], crit = nums[6], mod = nums[7];
    var effect = descs[0], cond = descs[1], card = descs[2];
    var condStr = cond.startsWith('FMT') ? skill_effects_json_1.default[cond.substring(3)] : cond;
    var baseMod = parseInt(mod.toString());
    var powerStr = power === 0 ? '' : "".concat(sqrtPwr ? '√' : '').concat(power, " pwr");
    var hitStr = minHits !== maxHits ? "".concat(minHits, "-").concat(maxHits, " hits") : maxHits < 2 ? '' : "".concat(maxHits, " hits");
    var critStr = crit <= 5 ? '' : "".concat(crit, "% crit");
    var accStr = acc === 0 || 90 <= acc && acc <= 110 ? '' : "".concat(acc, "% acc");
    var modStr = "".concat(baseMod < 1000 ? mod : (baseMod - 1000) / 100);
    var effectStr = cond === '-' ? '' : condStr.replace('$1', modStr).replace('$2', effect);
    var fullStr = [powerStr, hitStr, accStr, critStr, effectStr].filter(function (s) { return s !== ''; }).join(', ');
    return fullStr.substring(0, 1) === 'x' ? fullStr : fullStr.substring(0, 1).toUpperCase() + fullStr.substring(1);
}
exports.skillRowToEffect = skillRowToEffect;
function importSkillRow(row, costTypes) {
    var _a = row.a, sname = _a[0], elem = _a[1], target = _a[2], nums = row.b, descs = row.c;
    var _b = nums.slice(0, 2), rank = _b[0], cost = _b[1];
    var card = descs[2];
    var entry = {
        elem: elem,
        rank: rank,
        target: target === '-' ? 'Self' : target,
        cost: cost ? cost + (cost > 1000 ? (cost > 2000 ? costTypes[2] : costTypes[1]) : costTypes[0]) : 0,
        effect: skillRowToEffect(nums, descs, costTypes[0] !== 1 << 10),
    };
    if (card !== '-') {
        entry['card'] = card;
    }
    if (89 < rank) {
        entry['unique'] = true;
    }
    return entry;
}
exports.importSkillRow = importSkillRow;
