"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalFusionCalculator = void 0;
var NormalFusionCalculator = /** @class */ (function () {
    function NormalFusionCalculator(fuseNonelem, fuseElement) {
        this.fuseNonelem = fuseNonelem;
        this.fuseElement = fuseElement;
    }
    NormalFusionCalculator.prototype.getFusions = function (name, compendium, fusionChart) {
        var recipes = [];
        var fusions = compendium.isElementDemon(name) ? this.fuseElement : this.fuseNonelem;
        for (var _i = 0, fusions_1 = fusions; _i < fusions_1.length; _i++) {
            var fusion = fusions_1[_i];
            recipes = recipes.concat(fusion(name, compendium, fusionChart));
        }
        return recipes;
    };
    return NormalFusionCalculator;
}());
exports.NormalFusionCalculator = NormalFusionCalculator;
