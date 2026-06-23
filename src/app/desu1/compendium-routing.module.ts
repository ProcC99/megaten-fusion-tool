/**
 * compendium-routing.module.ts  (DSO-scoped)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompendiumComponent }               from '../smt4f/components/compendium.component';
import { DemonListContainerComponent }       from '../smt4f/components/demon-list.component';
import { SkillListContainerComponent }       from '../smt4f/components/skill-list.component';
import { FusionSettingsContainerComponent }  from '../smt4f/components/fusion-settings.component';
import { DemonEntryContainerComponent }      from '../smt4f/components/demon-entry.component';
import { FusionChartContainerComponent }     from '../smt4f/components/fusion-chart.component';
import { RecipeGeneratorContainerComponent }   from '../smt4f/components/recipe-generator.component';
import { PasswordGeneratorContainerComponent } from '../smt4f/components/password-generator.component';
import { SmtFissionTableComponent }          from '../compendium/components/smt-fission-table.component';
import { SmtFusionTableComponent }           from '../compendium/components/smt-fusion-table.component';

import { SkillFusionGeneratorComponent } from './components/skill-fusion-generator.component';

const compendiumRoutes: Routes = [
  // Standalone page — must come BEFORE the catch-all and BEFORE the
  // empty-path CompendiumComponent wrappers so it is matched directly.
  { path: 'skill-recipe', component: SkillFusionGeneratorComponent },

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
      { path: 'demons',    component: DemonListContainerComponent },
      { path: 'skills',    component: SkillListContainerComponent },
      { path: 'recipes',   component: RecipeGeneratorContainerComponent },
      { path: 'passwords', component: PasswordGeneratorContainerComponent },
      { path: 'settings',  component: FusionSettingsContainerComponent },
    ]
  },
  { path: '**', redirectTo: 'demons', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forChild(compendiumRoutes) ],
  exports: [ RouterModule ]
})
export class DesuCompendiumRoutingModule { }
