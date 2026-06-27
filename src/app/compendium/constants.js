"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResistOrder = exports.ResistanceLevels = exports.P3_TRIPLE_FISSION_CALCULATOR = exports.P3_TRIPLE_FUSION_CALCULATOR = exports.P3_NORMAL_FISSION_CALCULATOR = exports.P3_NORMAL_FUSION_CALCULATOR = exports.SMT_NES_NORMAL_FISSION_CALCULATOR = exports.SMT_NORMAL_FISSION_CALCULATOR = exports.SMT_NES_NORMAL_FUSION_CALCULATOR = exports.SMT_NORMAL_FUSION_CALCULATOR = exports.FUSION_TRIO_SERVICE = exports.FUSION_DATA_SERVICE = exports.COMPENDIUM_CONFIG = void 0;
var core_1 = require("@angular/core");
var normal_fusion_calculator_1 = require("./models/normal-fusion-calculator");
var smt_nonelem_fusions_1 = require("./fusions/smt-nonelem-fusions");
var smt_element_fusions_1 = require("./fusions/smt-element-fusions");
var smt_nonelem_fissions_1 = require("./fusions/smt-nonelem-fissions");
var smt_element_fissions_1 = require("./fusions/smt-element-fissions");
var snes_dark_fusions_1 = require("./fusions/snes-dark-fusions");
var per_nonelem_fusions_1 = require("./fusions/per-nonelem-fusions");
var per_nonelem_fissions_1 = require("./fusions/per-nonelem-fissions");
var triple_fusion_calculator_1 = require("./models/triple-fusion-calculator");
var per_triple_fusions_1 = require("./fusions/per-triple-fusions");
var per_triple_fissions_1 = require("./fusions/per-triple-fissions");
exports.COMPENDIUM_CONFIG = new core_1.InjectionToken('compendium.config');
exports.FUSION_DATA_SERVICE = new core_1.InjectionToken('fusion.data.service');
exports.FUSION_TRIO_SERVICE = new core_1.InjectionToken('fusion.trio.service');
exports.SMT_NORMAL_FUSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fusions_1.fuseWithDiffRace, smt_nonelem_fusions_1.fuseWithSameRace, smt_nonelem_fusions_1.fuseWithElement], [smt_element_fusions_1.fuseWithNormResult, smt_element_fusions_1.fuseWithSpecResult, smt_element_fusions_1.fuseTwoElements]);
exports.SMT_NES_NORMAL_FUSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fusions_1.fuseWithDiffRace, smt_nonelem_fusions_1.fuseWithSameRace, smt_nonelem_fusions_1.fuseWithElement, snes_dark_fusions_1.fuseWithDarkRace], [smt_element_fusions_1.fuseWithNormResult, smt_element_fusions_1.fuseWithSpecResult, smt_element_fusions_1.fuseTwoElements]);
exports.SMT_NORMAL_FISSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fissions_1.splitWithDiffRace, smt_nonelem_fissions_1.splitWithSpecies, smt_nonelem_fissions_1.splitWithElement, smt_nonelem_fissions_1.splitWithTotem], [smt_element_fissions_1.splitElement]);
exports.SMT_NES_NORMAL_FISSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fissions_1.splitWithDiffRace, smt_nonelem_fissions_1.splitWithSpecies, smt_nonelem_fissions_1.splitWithElement, snes_dark_fusions_1.splitWithDarkRace], [smt_element_fissions_1.splitElement]);
exports.P3_NORMAL_FUSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fusions_1.fuseWithDiffRace, per_nonelem_fusions_1.fuseWithSameRace], []);
exports.P3_NORMAL_FISSION_CALCULATOR = new normal_fusion_calculator_1.NormalFusionCalculator([smt_nonelem_fissions_1.splitWithDiffRace, per_nonelem_fissions_1.splitWithSameRace], []);
exports.P3_TRIPLE_FUSION_CALCULATOR = new triple_fusion_calculator_1.TripleFusionCalculator([per_triple_fusions_1.fuseT1WithDiffRace, per_triple_fusions_1.fuseN1WithDiffRace, per_triple_fusions_1.fuseWithSameRace], []);
exports.P3_TRIPLE_FISSION_CALCULATOR = new triple_fusion_calculator_1.TripleFusionCalculator([per_triple_fissions_1.splitWithDiffRace, per_triple_fissions_1.splitWithSameRace, per_triple_fissions_1.splitWithPrevLvl], []);
function getEnumOrder(target) {
    var result = {};
    for (var i = 0; i < target.length; i++) {
        result[target[i]] = i;
    }
    return result;
}
exports.ResistanceLevels = [
    'wk', 'no', 'rs', 'st', 'nu', 'rp', 'dr', 'ab'
];
exports.ResistOrder = getEnumOrder(exports.ResistanceLevels);
