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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedCompendiumModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var shared_module_1 = require("../shared/shared.module");
var fusion_entry_table_component_1 = require("./components/fusion-entry-table.component");
var fusion_chart_component_1 = require("./components/fusion-chart.component");
var recipe_generator_component_1 = require("./components/recipe-generator.component");
var demon_list_header_component_1 = require("./components/demon-list-header.component");
var skill_list_header_component_1 = require("./components/skill-list-header.component");
var demon_missing_component_1 = require("./components/demon-missing.component");
var demon_stats_component_1 = require("./components/demon-stats.component");
var demon_resists_component_1 = require("./components/demon-resists.component");
var demon_skills_component_1 = require("./components/demon-skills.component");
var demon_inherits_component_1 = require("./components/demon-inherits.component");
var fusion_settings_component_1 = require("./components/fusion-settings.component");
var smt_demon_list_component_1 = require("./components/smt-demon-list.component");
var smt_skill_list_component_1 = require("./components/smt-skill-list.component");
var compendium_component_1 = require("./components/compendium.component");
var smt_fusions_component_1 = require("./components/smt-fusions.component");
var current_demon_service_1 = require("./current-demon.service");
var compendium_translator_1 = require("./models/compendium-translator");
var fission_preview_table_component_1 = require("./components/fission-preview-table.component");
var smt_fission_table_component_1 = require("./components/smt-fission-table.component");
var smt_fusion_table_component_1 = require("./components/smt-fusion-table.component");
var fusion_multi_pair_table_component_1 = require("./components/fusion-multi-pair-table.component");
var fusion_pair_table_component_1 = require("./components/fusion-pair-table.component");
var tri_fission_table_component_1 = require("./components/tri-fission-table.component");
var tri_fusion_table_component_1 = require("./components/tri-fusion-table.component");
var tri_fusion_chart_component_1 = require("./components/tri-fusion-chart.component");
var fusion_trio_table_component_1 = require("./components/fusion-trio-table.component");
var pipes_1 = require("./pipes");
var SharedCompendiumModule = exports.SharedCompendiumModule = function () {
    var _classDecorators = [(0, core_1.NgModule)({
            imports: [
                common_1.CommonModule,
                router_1.RouterModule,
                forms_1.ReactiveFormsModule,
                shared_module_1.SharedModule
            ],
            declarations: [
                demon_missing_component_1.DemonMissingComponent,
                demon_stats_component_1.DemonStatsComponent,
                demon_resists_component_1.DemonResistsComponent,
                demon_skills_component_1.DemonSkillsComponent,
                demon_inherits_component_1.DemonInheritsComponent,
                fusion_settings_component_1.FusionSettingsComponent,
                demon_list_header_component_1.DemonListHeaderComponent,
                skill_list_header_component_1.SkillListHeaderComponent,
                smt_demon_list_component_1.SmtDemonListComponent,
                smt_demon_list_component_1.SmtDemonListRowComponent,
                smt_skill_list_component_1.SmtSkillListComponent,
                smt_skill_list_component_1.SmtSkillListRowComponent,
                fusion_entry_table_component_1.FusionEntryTableComponent,
                fusion_chart_component_1.FusionChartComponent,
                recipe_generator_component_1.RecipeGeneratorComponent,
                compendium_component_1.CompendiumComponent,
                compendium_component_1.CompendiumHeaderComponent,
                smt_fusions_component_1.SmtFusionsComponent,
                fusion_pair_table_component_1.FusionPairTableHeaderComponent,
                fusion_pair_table_component_1.FusionPairTableRowComponent,
                fusion_pair_table_component_1.FusionPairTableComponent,
                fusion_multi_pair_table_component_1.FusionMultiPairTableComponent,
                fission_preview_table_component_1.FissionPreviewTableComponent,
                fission_preview_table_component_1.SmtFissionPreviewComponent,
                fission_preview_table_component_1.TrioFissionPreviewComponent,
                smt_fission_table_component_1.SmtFissionTableComponent,
                smt_fusion_table_component_1.SmtFusionTableComponent,
                fusion_trio_table_component_1.FusionTrioTableHeaderComponent,
                fusion_trio_table_component_1.FusionTrioTableRowComponent,
                fusion_trio_table_component_1.FusionTrioTableComponent,
                tri_fission_table_component_1.TripleFissionTableComponent,
                tri_fusion_table_component_1.TripleFusionTableComponent,
                tri_fusion_chart_component_1.TripleFusionChartComponent,
                pipes_1.TranslateCompPipe,
                pipes_1.SkillCostToStringPipe,
                pipes_1.SkillLevelToStringPipe,
                pipes_1.SkillLevelToShortStringPipeLocale,
                pipes_1.ElementAffinityToStringPipe,
                pipes_1.LvlToNumberPipe,
                pipes_1.ReslvlToStringPipe,
                pipes_1.ReslvlToStringLocalePipe,
                pipes_1.ReslvlToColorPipe,
                pipes_1.ResmodToStringPipe,
                pipes_1.RoundInheritPercentPipe
            ],
            exports: [
                demon_missing_component_1.DemonMissingComponent,
                demon_stats_component_1.DemonStatsComponent,
                demon_resists_component_1.DemonResistsComponent,
                demon_skills_component_1.DemonSkillsComponent,
                demon_inherits_component_1.DemonInheritsComponent,
                fusion_settings_component_1.FusionSettingsComponent,
                demon_list_header_component_1.DemonListHeaderComponent,
                skill_list_header_component_1.SkillListHeaderComponent,
                smt_demon_list_component_1.SmtDemonListComponent,
                smt_demon_list_component_1.SmtDemonListRowComponent,
                smt_skill_list_component_1.SmtSkillListComponent,
                smt_skill_list_component_1.SmtSkillListRowComponent,
                fusion_entry_table_component_1.FusionEntryTableComponent,
                fusion_chart_component_1.FusionChartComponent,
                recipe_generator_component_1.RecipeGeneratorComponent,
                compendium_component_1.CompendiumComponent,
                compendium_component_1.CompendiumHeaderComponent,
                smt_fusions_component_1.SmtFusionsComponent,
                fusion_pair_table_component_1.FusionPairTableComponent,
                fusion_multi_pair_table_component_1.FusionMultiPairTableComponent,
                fission_preview_table_component_1.FissionPreviewTableComponent,
                fission_preview_table_component_1.SmtFissionPreviewComponent,
                fission_preview_table_component_1.TrioFissionPreviewComponent,
                smt_fission_table_component_1.SmtFissionTableComponent,
                smt_fusion_table_component_1.SmtFusionTableComponent,
                fusion_trio_table_component_1.FusionTrioTableComponent,
                tri_fission_table_component_1.TripleFissionTableComponent,
                tri_fusion_table_component_1.TripleFusionTableComponent,
                tri_fusion_chart_component_1.TripleFusionChartComponent,
                pipes_1.TranslateCompPipe,
                pipes_1.SkillCostToStringPipe,
                pipes_1.SkillLevelToStringPipe,
                pipes_1.SkillLevelToShortStringPipeLocale,
                pipes_1.ElementAffinityToStringPipe,
                pipes_1.LvlToNumberPipe,
                pipes_1.ReslvlToStringPipe,
                pipes_1.ReslvlToStringLocalePipe,
                pipes_1.ReslvlToColorPipe,
                pipes_1.ResmodToStringPipe,
                pipes_1.RoundInheritPercentPipe
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SharedCompendiumModule = _classThis = /** @class */ (function () {
        function SharedCompendiumModule_1() {
        }
        SharedCompendiumModule_1.forRoot = function () {
            return {
                ngModule: SharedCompendiumModule,
                providers: [current_demon_service_1.CurrentDemonService, compendium_translator_1.CompendiumTranslator]
            };
        };
        return SharedCompendiumModule_1;
    }());
    __setFunctionName(_classThis, "SharedCompendiumModule");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SharedCompendiumModule = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SharedCompendiumModule = _classThis;
}();
