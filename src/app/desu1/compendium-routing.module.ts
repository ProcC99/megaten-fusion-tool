/**
 * compendium-routing.module.ts  (DSO-scoped)
 * -----------------------------------------------------------------
 * Routes for the Devil Survivor Overclocked compendium module.
 * Mirrors the smt4f routing structure and appends the /skill-recipe
 * route for the new SkillFusionGeneratorComponent.
 *
 * This file replaces the previous import of
 * CompendiumRoutingModule from '../smt4f/compendium-routing.module'
 * inside desu1/compendium.module.ts so the new route is DSO-scoped
 * and does not bleed into ds1 or any other game.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Shared smt4f components reused by DSO.
import { CompendiumComponent }              from '../smt4f/components/compendium.component';
import { DemonListContainerComponent }      from '../smt4f/components/demon-list.component';
import { SkillListContainerComponent }      from '../smt4f/components/skill-list.component';
import { FusionSettingsContainerComponent } from '../smt4f/components/fusion-settings.component';
import { DemonEntryContainerComponent }     from '../smt4f/components/demon-entry.component';
import { FusionChartContainerComponent }    from '../smt4f/components/fusion-chart.component';
import { RecipeGeneratorContainerComponent }  from '../smt4f/components/recipe-generator.component';
import { PasswordGeneratorContainerComponent } from '../smt4f/components/password-generator.component';
import { SmtFissionTableComponent }         from '../compendium/components/smt-fission-table.component';
import { SmtFusionTableComponent }          from '../compendium/components/smt-fusion-table.component';

// New DSO-only component.
import { SkillFusionGeneratorComponent } from './components/skill-fusion-generator.component';

const compendiumRoutes: Routes = [
  { path: '', redirectTo: 'demons', pathMatch: 'full' },
  {
    path: '',
    component: CompendiumComponent,
    data: { fusionTool: 'chart' },
    children: [
      { path: 'chart', component: FusionChartContainerComponent }
    ]
  },
  {
    path: '',
    component: CompendiumComponent,
    children: [
      {
        path: 'demons/:demonName',
        component: DemonEntryContainerComponent,
        children: [
          { path: 'fissions', component: SmtFissionTableComponent },
          { path: 'fusions',  component: SmtFusionTableComponent },
          { path: '**', redirectTo: 'fissions', pathMatch: 'full' }
        ]
      },
      { path: 'demons',       component: DemonListContainerComponent },
      { path: 'skills',       component: SkillListContainerComponent },
      { path: 'recipes',      component: RecipeGeneratorContainerComponent },
      { path: 'passwords',    component: PasswordGeneratorContainerComponent },
      { path: 'settings',     component: FusionSettingsContainerComponent },
      // New: skill-targeted fusion recipe generator.
      { path: 'skill-recipe', component: SkillFusionGeneratorComponent },
    ]
  },
  { path: '**', redirectTo: 'demons', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forChild(compendiumRoutes) ],
  exports: [ RouterModule ]
})
export class DesuCompendiumRoutingModule { }
