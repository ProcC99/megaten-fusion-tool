/**
 * skill-fusion-generator.component.ts
 * -----------------------------------------------------------------
 * Target-first fusion recipe generator with DP algorithm and Visual Profile
 */

import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { FusionDataService } from '../../smt4f/fusion-data.service';
import { Compendium } from '../../smt4f/models/compendium';
import { CurrentDemonService } from '../../compendium/current-demon.service';

import { FusionDPSolver, DPFusionResult, FusionGraphNode, OwnedDemon } from '../models/fusion-dp-solver';
import { DemonProfileBuilder, DemonProfile } from '../models/demon-profile-builder';
import { decodeAHSkillTier } from '../models/fusion-tree-types';
import COMP_CONFIG_JSON from '../data/comp-config.json';

export interface OwnedDemonUI {
  profile: DemonProfile;
  cmdSlots: (string | null)[];
  freePasSlots: (string | null)[];
  isStatsTransfer: boolean;
  isCollapsed?: boolean;
}

@Component({
  selector: 'app-skill-fusion-generator',
  template: `
<div class="skill-fusion-generator">

  <h2 class="section-title">Devil Survivor Skill Recipe</h2>

  <!-- 1. Target demon selection -->
  <section class="panel target-panel" *ngIf="!targetDemonObj && breadcrumbs.length === 0">
    <h3>Select Target Demon</h3>
    <input type="text" placeholder="Search demon…" [(ngModel)]="demonSearchQuery"
      (input)="onDemonSearch()" class="demon-search-input" />
    <ul class="demon-suggestions" *ngIf="demonSuggestions.length > 0">
      <li *ngFor="let d of demonSuggestions" (click)="selectTargetDemon(d)" class="suggestion-item">{{ d }}</li>
    </ul>
  </section>

  <!-- Demon Profile View -->
  <section class="panel profile-panel" *ngIf="targetDemonObj">
    <div class="profile-header">
      <div class="profile-title">
        <h3>{{ targetDemonObj.name }}</h3>
        <span class="demon-meta">{{ targetDemonObj.race }} · Lv {{ targetDemonObj.lvl }}</span>
      </div>
      <button class="btn-change" (click)="clearTargetDemon()">Change</button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box"><span>HP</span><strong>{{ targetDemonObj.stats[1] }}</strong></div>
      <div class="stat-box"><span>MP</span><strong>{{ targetDemonObj.stats[2] }}</strong></div>
      <div class="stat-box"><span>St</span><strong>{{ targetDemonObj.stats[3] }}</strong></div>
      <div class="stat-box"><span>Ma</span><strong>{{ targetDemonObj.stats[4] }}</strong></div>
      <div class="stat-box"><span>Vi</span><strong>{{ targetDemonObj.stats[5] }}</strong></div>
      <div class="stat-box"><span>Ag</span><strong>{{ targetDemonObj.stats[6] }}</strong></div>
    </div>

    <div style="margin-bottom: 24px;">
      <app-demon-resists
        [resistHeaders]="resistHeaders"
        [resists]="targetDemonObj.resists">
      </app-demon-resists>
    </div>

    <div class="slots-container">
      <!-- Command Skills -->
      <div class="slot-column">
        <h4>Command Skills ({{ getFilledSlotCount(freeCmdSlots) + innateCmd.length }}/3)</h4>
        
        <!-- Innate Command Skills -->
        <div class="slot innate-slot" *ngFor="let sk of innateCmd">
          <span class="slot-icon">🗡</span> {{ sk.name }} <span *ngIf="sk.lvl >= 1" style="color: #888; font-size: 0.8em; margin-left: 4px;">(Lv {{ sk.lvl }})</span> <span class="badge badge-innate">INNATE</span>
        </div>

        <!-- Free Command Slots -->
        <div class="slot free-slot" *ngFor="let sk of freeCmdSlots; let i = index" 
             (click)="openSkillPicker('cmd', i)"
             [class.is-filled]="sk !== null"
             [class.is-active]="activePickerType === 'cmd' && activePickerIndex === i">
          <span class="slot-icon">🗡</span>
          <span class="slot-text">{{ sk ? sk : '[ Click to set Command Skill ]' }}</span>
          <button class="btn-clear-slot" *ngIf="sk" (click)="clearSlot('cmd', i, $event)">✕</button>
        </div>
      </div>

      <!-- Passive Skills -->
      <div class="slot-column">
        <h4>Passive Skills ({{ getFilledSlotCount(freePasSlots) + innatePas.length }}/3)</h4>
        
        <!-- Innate Passive Skills -->
        <div class="slot innate-slot" *ngFor="let sk of innatePas">
          <span class="slot-icon">🛡</span> {{ sk.name }} <span *ngIf="sk.lvl >= 1" style="color: #888; font-size: 0.8em; margin-left: 4px;">(Lv {{ sk.lvl }})</span> <span class="badge badge-innate">INNATE</span>
        </div>

        <!-- Free Passive Slots -->
        <div class="slot free-slot" *ngFor="let sk of freePasSlots; let i = index" 
             (click)="openSkillPicker('pas', i)"
             [class.is-filled]="sk !== null"
             [class.is-active]="activePickerType === 'pas' && activePickerIndex === i">
          <span class="slot-icon">🛡</span>
          <span class="slot-text">{{ sk ? sk : '[ Click to set Passive Skill ]' }}</span>
          <button class="btn-clear-slot" *ngIf="sk" (click)="clearSlot('pas', i, $event)">✕</button>
        </div>
      </div>

      <!-- Racial Skill -->
      <div class="slot-column racial-column">
        <h4>Racial Skill</h4>
        <div class="slot innate-slot">
          <span class="slot-icon">★</span> {{ innateRac || 'None' }}
        </div>
      </div>
    </div>

    <!-- Contextual Skill Picker Modal -->
    <div class="modal-backdrop" *ngIf="activePickerType" (click)="closeSkillPicker()">
      <div class="skill-picker" (click)="$event.stopPropagation()">
        <div class="picker-header">
          <h5>Select {{ activePickerType === 'cmd' ? 'Command' : 'Passive' }} Skill</h5>
          <button class="btn-close-picker" (click)="closeSkillPicker()">✕</button>
        </div>
        <input #skillInput type="text" placeholder="Search skill..." [(ngModel)]="skillSearchQuery" (input)="onSkillSearch()" class="skill-picker-input" autofocus />
        <ul class="picker-suggestions">
          <li *ngFor="let s of skillSuggestions" (click)="selectSkill(s)" class="picker-item">{{ s }}</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Player Level Settings -->
  <section class="panel settings-panel" *ngIf="targetDemonObj">
    <h3>Owned Demons</h3>
    <p style="font-size: 0.9rem; color: #aaa; margin-bottom: 12px;">Add demons you already own to use them as free base ingredients in the fusion tree.</p>
    
    <div class="owned-demon-list">
       <div class="owned-demon-item-profile" *ngFor="let od of ownedDemonUIs; let odIdx = index">
         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #2a2a2a; padding: 8px 12px; border-radius: 4px; cursor: pointer;" (click)="od.isCollapsed = !od.isCollapsed">
           <span style="font-size: 1.1rem; font-weight: bold; color: #a1d99b; display: flex; align-items: center;">
             <span style="display: inline-block; width: 20px; font-size: 0.9rem;">{{ od.isCollapsed ? '▶' : '▼' }}</span>
             {{ od.profile.name }} 
             <span style="font-size: 0.8rem; color: #aaa; margin-left: 6px;">(Lv {{ od.profile.lvl }} {{ od.profile.race }})</span>
             <span *ngIf="od.isStatsTransfer" style="font-size: 0.7rem; color: #fff; background: #e67e22; padding: 2px 6px; border-radius: 12px; margin-left: 8px; font-weight: normal;">Stats Transfer</span>
             <span *ngIf="od.isCollapsed" style="font-size: 0.8rem; color: #aaa; margin-left: 10px;">
               [{{ getFilledSlotCount(od.cmdSlots) }} Cmd, {{ getFilledSlotCount(od.freePasSlots) + od.profile.innatePas.length }} Pas]
             </span>
           </span>
           <div style="display: flex; align-items: center; gap: 12px;">
             <label style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #ccc; cursor: pointer;" (click)="$event.stopPropagation()">
               <input type="checkbox" [checked]="od.isStatsTransfer" (change)="toggleStatsTransfer(odIdx)" style="cursor: pointer;">
               Mark for Stats Transfer
             </label>
             <button class="btn-remove-demon" (click)="removeOwnedDemon(odIdx); $event.stopPropagation()">✕ Remove</button>
           </div>
         </div>

         <div class="slots-container" style="margin-top: 0;" *ngIf="!od.isCollapsed">
            <!-- Command Skills -->
            <div class="slot-column">
              <h4>Command Skills ({{ getFilledSlotCount(od.cmdSlots) }}/3)</h4>
              <div class="slot free-slot" *ngFor="let sk of od.cmdSlots; let i = index" 
                   (click)="openSkillPicker('cmd', i, odIdx)"
                   [class.is-filled]="sk !== null"
                   [class.is-active]="activePickerType === 'cmd' && activePickerIndex === i && activeOwnedDemonIndex === odIdx">
                <span class="slot-icon">🗡</span>
                <span class="slot-text">
                  {{ sk ? sk : '[ Click to set Command Skill ]' }}
                  <span *ngIf="isSkillInnate(od.profile, sk, 'cmd')" class="badge badge-innate" style="margin-left: 4px;">INNATE</span>
                </span>
                <button class="btn-clear-slot" *ngIf="sk && !isSkillInnate(od.profile, sk, 'cmd')" (click)="clearSlot('cmd', i, $event, odIdx)">✕</button>
                <button class="btn-clear-slot" *ngIf="sk && isSkillInnate(od.profile, sk, 'cmd')" title="Remove Innate Skill" (click)="clearSlot('cmd', i, $event, odIdx)">✕</button>
              </div>
            </div>
      
            <!-- Passive Skills -->
            <div class="slot-column">
              <h4>Passive Skills ({{ getFilledSlotCount(od.freePasSlots) + od.profile.innatePas.length }}/3)</h4>
              
              <!-- Innate Passive Skills -->
              <div class="slot innate-slot" *ngFor="let sk of od.profile.innatePas">
                <span class="slot-icon">🛡</span> {{ sk.name }} <span *ngIf="sk.lvl >= 1" style="color: #888; font-size: 0.8em; margin-left: 4px;">(Lv {{ sk.lvl }})</span> <span class="badge badge-innate">INNATE</span>
              </div>

              <!-- Free Passive Slots -->
              <div class="slot free-slot" *ngFor="let sk of od.freePasSlots; let i = index" 
                   (click)="openSkillPicker('pas', i, odIdx)"
                   [class.is-filled]="sk !== null"
                   [class.is-active]="activePickerType === 'pas' && activePickerIndex === i && activeOwnedDemonIndex === odIdx">
                <span class="slot-icon">🛡</span>
                <span class="slot-text">{{ sk ? sk : '[ Click to set Passive Skill ]' }}</span>
                <button class="btn-clear-slot" *ngIf="sk" (click)="clearSlot('pas', i, $event, odIdx)">✕</button>
              </div>
            </div>
      
            <!-- Racial Skill -->
            <div class="slot-column racial-column">
              <h4>Racial Skill</h4>
              <div class="slot innate-slot">
                <span class="slot-icon">★</span> {{ od.profile.innateRac || 'None' }}
              </div>
            </div>
         </div>
       </div>
    </div>
  
    <div class="add-owned-demon-container" style="position: relative; margin-top: 12px;">
      <input type="text" placeholder="Add owned demon..." [(ngModel)]="ownedDemonSearchQuery" (input)="onOwnedDemonSearch()" class="search-input" />
      <ul class="suggestions-list" *ngIf="ownedDemonSuggestions.length > 0">
        <li *ngFor="let s of ownedDemonSuggestions" (click)="addOwnedDemon(s)" class="suggestion-item">{{ s }}</li>
      </ul>
    </div>

    <hr style="border: 0; border-top: 1px dashed #333; margin: 20px 0;" />

    <h3>Player Level</h3>
    <div class="settings-row">
      <input type="number" [(ngModel)]="playerMaxLevel" min="1" max="99" class="setting-input" />
      <button class="btn-generate" (click)="generate()" [disabled]="!targetDemonObj || isSearching">
        {{ isSearching ? 'Computing...' + (searchProgress ? ' ' + searchProgress : '') : 'Generate DP Recipe' }}
      </button>
    </div>
  </section>

  <div class="breadcrumbs-container" *ngIf="breadcrumbs.length > 0" style="margin-bottom: 16px; padding: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 6px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
    <button class="breadcrumb-btn" style="background: none; border: none; color: #4aa1f3; cursor: pointer; padding: 0; font-size: 0.95rem; font-weight: bold; text-decoration: underline;" (click)="restoreBreadcrumb(0)">Main Target</button>
    <ng-container *ngFor="let crumb of breadcrumbs.slice(1); let i = index">
      <span style="color: #666; font-size: 0.9rem;">&gt;</span>
      <button class="breadcrumb-btn" style="background: none; border: none; color: #4aa1f3; cursor: pointer; padding: 0; font-size: 0.95rem; font-weight: bold; text-decoration: underline;" (click)="restoreBreadcrumb(i + 1)">{{ crumb.targetDemonName }}</button>
    </ng-container>
    <span style="color: #666; font-size: 0.9rem;">&gt;</span>
    <span style="color: #ccc; font-size: 0.95rem; font-weight: bold;">{{ targetDemonObj?.name }}</span>
  </div>

  <!-- Results -->
  <section class="panel results-panel" *ngIf="dpResults.length > 0">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h3 style="margin: 0;">
        <ng-container *ngIf="!isTierZeroMode">Optimal Fusion Recipes</ng-container>
        <ng-container *ngIf="isTierZeroMode">Immediate Parent Fusions ({{ dpResults.length }} total)</ng-container>
      </h3>
      
      <div *ngIf="isTierZeroMode" class="tier-zero-controls" style="display: flex; align-items: center; gap: 12px;">
        <label style="color: #ccc; font-size: 0.9rem;">
          Sort By:
          <select [(ngModel)]="tierZeroSort" (change)="onTierZeroSortChange()" style="background: #222; color: #eee; border: 1px solid #555; padding: 4px; border-radius: 4px; margin-left: 4px;">
            <option value="level">Lowest Level</option>
            <option value="macca">Lowest Macca</option>
          </select>
        </label>
        
        <div class="pagination-controls" style="display: flex; align-items: center; gap: 8px;">
          <button (click)="prevFissionPage()" [disabled]="fissionPage === 0" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; padding: 4px 8px;">◀</button>
          <span style="color: #ccc; font-size: 0.9rem;">Page {{ fissionPage + 1 }} of {{ totalFissionPages }}</span>
          <button (click)="nextFissionPage()" [disabled]="fissionPage >= totalFissionPages - 1" style="background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; padding: 4px 8px;">▶</button>
        </div>
      </div>
    </div>
    
    <div class="path-tabs" [class.paginated-tabs]="isTierZeroMode" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
      <button class="path-tab" 
              *ngFor="let res of getPaginatedResults(); let i = index" 
              [class.active]="selectedResultIndex === i"
              (click)="selectedResultIndex = i"
              [style.flex]="isTierZeroMode ? '1 1 calc(20% - 6px)' : '1 1 auto'"
              [style.min-width]="isTierZeroMode ? '140px' : 'auto'">
        <div class="tab-title">{{ res.label }}</div>
        <div class="tab-stats" *ngIf="!isTierZeroMode">Lv {{ res.maxLevel }} | {{ res.totalFusions }} Steps | {{ res.ahCount }} AH</div>
        <div class="tab-stats" *ngIf="isTierZeroMode">Lv {{ res.maxLevel }} | {{ res.maccaCost | number }} Macca</div>
        <div class="tab-stats" style="margin-top: 2px;" *ngIf="!isTierZeroMode">{{ res.summonCount }} Summons | {{ res.maccaCost | number }} Macca</div>
      </button>
    </div>

    <div class="dp-tree-view">
      <ng-template #fusionNode let-node="node">
        <div class="tree-node" [class.is-natural]="node.isNatural">
          <div class="node-info">
            <span class="step-badge" *ngIf="node.stepNumber">{{ node === getPaginatedResults()[selectedResultIndex].graph[0] ? 'Final Result' : 'Step ' + node.stepNumber }}</span>
            <span class="node-demon">{{ node.demon }}</span>
            <button class="btn-generate-tree" *ngIf="node !== getPaginatedResults()[selectedResultIndex].graph[0]" (click)="generateForDemon(node.demon)" title="Generate Fusion Tree for {{ node.demon }}" style="background: none; border: none; cursor: pointer; font-size: 1.1rem; margin-left: 4px;">🌳</button>
            <span class="node-skills" *ngIf="getDisplaySkills(node).length">
              [<ng-container *ngFor="let sk of getDisplaySkills(node); let last = last">
                {{ sk }}<span *ngIf="getSkillLevelReq(node.demon, sk) as reqLv" class="skill-req" style="color: #888; font-size: 0.9em; margin-left: 2px;">(Lv {{reqLv}})</span><span *ngIf="!last">, </span>
              </ng-container>]
            </span>
            <span class="node-label" *ngIf="node.isNatural && !node.isOwned" style="color: #777; font-size: 0.8rem; margin-left: 8px;">(Summon)</span>
            <span class="node-label" *ngIf="node.isOwned" style="color: #6bb36b; font-size: 0.8rem; margin-left: 8px;">(Owned)</span>
          </div>
          <div class="node-children" *ngIf="node.recipe">
            <ng-container *ngTemplateOutlet="fusionNode; context: { node: getNode(node.recipe.ingredient1Id) }"></ng-container>
            <ng-container *ngTemplateOutlet="fusionNode; context: { node: getNode(node.recipe.ingredient2Id) }"></ng-container>
          </div>
        </div>
      </ng-template>

      <!-- Start rendering from root node -->
      <div class="tree-root" *ngIf="getPaginatedResults().length > 0">
        <ng-container *ngTemplateOutlet="fusionNode; context: { node: getPaginatedResults()[selectedResultIndex].graph[0] }"></ng-container>
      </div>
    </div>
  </section>
  
  <section class="panel failure-panel" *ngIf="searchFailed">
    <h3>⚠ No path found</h3>
    <p>The DP algorithm could not find a path under Level {{ playerMaxLevel }} with these specific skills. This usually means the skills are locked to unique demons that cannot interact, or the fusion tree is impossible without exceeding the level cap.</p>
  </section>

</div>
  `,
  styles: [`
    .skill-fusion-generator { max-width: 900px; margin: 0 auto; padding: 16px; font-family: inherit; }
    .section-title { font-size: 1.4rem; margin-bottom: 16px; }
    .panel { background: #1a1a2e; border: 1px solid #444; border-radius: 6px; padding: 16px; margin-bottom: 16px; position: relative; }
    h3 { margin: 0 0 12px; font-size: 1.1rem; color: #eee; }
    h4 { margin: 0 0 8px; font-size: 0.95rem; color: #aaa; border-bottom: 1px solid #333; padding-bottom: 4px; }
    
    input[type=text], input[type=number] { background: #111; color: #eee; border: 1px solid #555; border-radius: 4px; padding: 8px 10px; font-size: 0.9rem; box-sizing: border-box; }
    .demon-search-input { width: 100%; max-width: 300px; }
    .setting-input { width: 80px; text-align: center; }
    
    .demon-suggestions { list-style: none; margin: 4px 0 0; padding: 0; background: #222; border: 1px solid #555; border-radius: 4px; max-height: 200px; overflow-y: auto; position: absolute; z-index: 10; width: 100%; max-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .suggestion-item, .picker-item { padding: 8px 10px; cursor: pointer; border-bottom: 1px solid #333; }
    .suggestion-item:hover, .picker-item:hover { background: #3a5c20; }
    
    .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
    .profile-title h3 { margin: 0; font-size: 1.4rem; color: #fff; }
    .demon-meta { color: #88cc88; font-size: 0.9rem; }
    .btn-change { background: #444; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; background: #111; padding: 12px; border-radius: 6px; flex-wrap: wrap; justify-content: space-around; }
    .stat-box { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 40px; }
    .stat-box span { font-size: 0.75rem; color: #888; text-transform: uppercase; }
    .stat-box strong { font-size: 1.1rem; color: #eee; }
    
    .slots-container { display: flex; gap: 24px; flex-wrap: wrap; }
    .slot-column { flex: 1; min-width: 250px; }
    .racial-column { flex: 0.5; min-width: 150px; }
    
    .slot { display: flex; align-items: center; padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; font-size: 0.9rem; }
    .slot-icon { margin-right: 8px; opacity: 0.6; flex-shrink: 0; }
    .slot-text { flex: 1; word-break: break-word; }
    .innate-slot { background: #111; border: 1px solid #333; color: #ccc; }
    .free-slot { background: #222; border: 1px dashed #555; color: #888; cursor: pointer; transition: all 0.2s; position: relative; }
    .free-slot:hover { border-color: #88cc88; background: #2a3a2a; color: #eee; }
    .free-slot.is-filled { border-style: solid; color: #eee; border-color: #444; }
    .free-slot.is-active { border-color: #7dff7d; background: #1a3c1a; }
    
    .badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: auto; flex-shrink: 0; }
    .badge-innate { background: #1a5c1a; color: #7dff7d; }
    
    .btn-clear-slot { position: absolute; right: 8px; background: transparent; border: none; color: #c55; cursor: pointer; font-size: 1rem; padding: 4px; }
    .btn-clear-slot:hover { color: #f55; }
    
    /* Modal Backdrop */
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    
    .skill-picker { background: #1a1a2e; border: 1px solid #7dff7d; border-radius: 6px; padding: 16px; margin-top: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.8); width: 100%; max-width: 400px; max-height: 90vh; display: flex; flex-direction: column; }
    .picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
    .picker-header h5 { margin: 0; color: #7dff7d; font-size: 1rem; }
    .btn-close-picker { background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 1.2rem; }
    .skill-picker-input { width: 100%; margin-bottom: 12px; flex-shrink: 0; }
    .picker-suggestions { width: 100%; overflow-y: auto; flex-grow: 1; list-style: none; margin: 0; padding: 0; background: #222; border-radius: 4px; border: 1px solid #555; }
    
    .settings-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .btn-generate { padding: 8px 16px; background: #c34242; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; flex: 1; min-width: 180px; }
    .btn-generate:hover { background: #d65151; }
    .btn-generate:disabled { opacity: 0.5; cursor: default; }
    
    .path-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .path-tab { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 10px 16px; cursor: pointer; text-align: left; transition: all 0.2s; flex: 1; min-width: 240px; }
    .path-tab:hover { background: #222; border-color: #555; }
    .path-tab.active { background: #2d5a2d; border-color: #a1d99b; }
    .tab-title { font-weight: bold; color: #fff; margin-bottom: 4px; }
    .tab-stats { font-size: 0.85rem; color: #aaa; }
    .path-tab.active .tab-stats { color: #d4f0ce; }

    /* Tree View */
    .dp-tree-view { padding: 16px; background: #111; border-radius: 6px; border: 1px solid #333; overflow-x: auto; }
    .tree-root > .tree-node { margin-left: 0; border-left: none; padding-left: 0; }
    .tree-root > .tree-node::before { display: none; }
    .tree-node { margin: 8px 0 8px 24px; border-left: 2px solid #444; padding-left: 16px; position: relative; }
    .tree-node::before { content: ''; position: absolute; left: 0; top: 16px; width: 16px; height: 2px; background: #444; }
    .node-info { background: #222; padding: 6px 12px; border-radius: 4px; display: inline-block; border: 1px solid #333; white-space: nowrap; }
    .step-badge { background: #444; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; margin-right: 8px; font-weight: bold; }
    .tree-root    .tree-node.is-natural .node-info { border-style: dashed; border-color: #555; background: #1a1a1a; }
    .tree-node.is-natural:has(.node-label:contains("(Owned)")) .node-info { border-style: solid; border-color: #2d5a2d; background: #162416; }
    .node-demon { font-weight: bold; color: #a1d99b; margin-right: 8px; }
    
    /* Owned Demons */
    .owned-demon-item-profile { background: #1a1a1a; border: 1px solid #333; border-radius: 4px; padding: 12px; margin-bottom: 12px; }
    .btn-remove-demon { background: none; border: none; color: #c34242; cursor: pointer; font-size: 0.9rem; padding: 4px 8px; border-radius: 4px; background: rgba(195, 66, 66, 0.1); }
    .btn-remove-demon:hover { background: rgba(195, 66, 66, 0.2); }
    
    .node-skills { color: #f1c40f; font-size: 0.9em; margin-left: 8px; }
    .skill-req { color: #aaa; font-size: 0.85em; font-style: italic; }
    .is-natural > .node-info { background: #1a1a1a; border-style: dashed; }
    .is-natural > .node-info > .node-demon { color: #888; }
    
    .failure-panel { border-color: #7a2a2a; }
    .failure-panel p { color: #ffaaaa; line-height: 1.5; font-size: 0.95rem; margin: 0; }
  `]
})
export class SkillFusionGeneratorComponent implements OnInit, OnDestroy {
  @ViewChild('skillInput') skillInput?: ElementRef<HTMLInputElement>;
  compendium: Compendium;
  sub: Subscription;
  resistHeaders: string[] = COMP_CONFIG_JSON.resistElems;

  // Search State
  demonSearchQuery = '';
  demonSuggestions: string[] = [];
  
  // Target Demon Profile State
  targetDemonObj: any | null = null;
  innateCmd: { name: string, lvl: number }[] = [];
  innatePas: { name: string, lvl: number }[] = [];
  innateRac: string = '';
  freeCmdSlots: (string | null)[] = [];
  freePasSlots: (string | null)[] = [];
  
  // Skill Picker State
  activePickerType: 'cmd' | 'pas' | null = null;
  activePickerIndex: number = -1;
  skillSearchQuery = '';
  skillSuggestions: string[] = [];

  // Solver State
  playerMaxLevel: number = 99;
  
  dpResults: DPFusionResult[] = [];
  selectedResultIndex: number = 0;
  
  fissionPage: number = 0;
  fissionPageSize: number = 10;
  isTierZeroMode: boolean = false;
  tierZeroSort: 'level' | 'macca' = 'level';
  
  isSearching: boolean = false;
  searchFailed: boolean = false;

  fusionChart: any;

  // Owned Demons State
  ownedDemonUIs: OwnedDemonUI[] = [];
  ownedDemonSearchQuery: string = '';
  ownedDemonSuggestions: string[] = [];
  activeOwnedDemonIndex: number | null = null;
  
  // Breadcrumb State
  breadcrumbs: { targetDemonName: string, freeCmdSlots: (string | null)[], freePasSlots: (string | null)[] }[] = [];

  constructor(
    private route: ActivatedRoute,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService,
    private currentDemonService: CurrentDemonService,
    private cdr: ChangeDetectorRef
  ) {
    this.compendium = this.fusionDataService.compConfig as any;
    this.sub = combineLatest([
      this.fusionDataService.compendium,
      this.fusionDataService.fusionChart
    ]).subscribe(([comp, chart]) => {
      this.compendium = comp;
      this.fusionChart = chart;
      this.clearTargetDemon();
    });
  }

  ngOnInit() {}
  ngOnDestroy() { this.sub.unsubscribe(); }

  // -------------------------------------
  // Demon Selection
  // -------------------------------------
  onDemonSearch() {
    const q = this.demonSearchQuery.toLowerCase();
    if (!q) {
      this.demonSuggestions = [];
      return;
    }
    this.demonSuggestions = this.compendium.allDemons.map(d => d.name)
      .filter(n => n.toLowerCase().includes(q))
      .sort((a, b) => a.length - b.length || a.localeCompare(b));
  }

  selectTargetDemon(name: string) {
    this.targetDemonObj = this.compendium.getDemon(name);
    this.demonSearchQuery = '';
    this.demonSuggestions = [];
    this.buildProfile();
  }

  clearTargetDemon() {
    this.breadcrumbs = [];
    this.targetDemonObj = null;
    this.dpResults = [];
    this.selectedResultIndex = 0;
    this.searchFailed = false;
    this.closeSkillPicker();
  }

  buildProfile() {
    this.innateCmd = [];
    this.innatePas = [];
    this.innateRac = '';

    if (!this.targetDemonObj) return;

    const builder = new DemonProfileBuilder(this.compendium);
    const profile = builder.buildProfile(this.targetDemonObj.name);
    if (!profile) return;

    this.innateCmd = profile.innateCmd;
    this.innatePas = profile.innatePas;
    this.innateRac = profile.innateRac;

    this.freeCmdSlots = Array(profile.freeCmdCount).fill(null);
    this.freePasSlots = Array(profile.freePasCount).fill(null);
  }

  getFilledSlotCount(slots: (string | null)[]): number {
    return slots.filter(s => s !== null).length;
  }

  // -------------------------------------
  // Skill Picker
  // -------------------------------------
  openSkillPicker(type: 'cmd' | 'pas', index: number, ownedDemonIdx?: number) {
    this.activePickerType = type;
    this.activePickerIndex = index;
    this.activeOwnedDemonIndex = ownedDemonIdx ?? null;
    this.skillSearchQuery = '';
    this.updateSkillSuggestions();
    
    setTimeout(() => {
      if (this.skillInput) {
        this.skillInput.nativeElement.focus();
      }
    });
  }

  closeSkillPicker() {
    this.activePickerType = null;
    this.activePickerIndex = -1;
    this.activeOwnedDemonIndex = null;
  }

  clearSlot(type: 'cmd' | 'pas', index: number, event: Event, ownedDemonIdx?: number) {
    event.stopPropagation();
    if (ownedDemonIdx !== undefined) {
      if (type === 'cmd') {
        this.ownedDemonUIs[ownedDemonIdx].cmdSlots[index] = null;
      } else {
        this.ownedDemonUIs[ownedDemonIdx].freePasSlots[index] = null;
      }
    } else {
      if (type === 'cmd') {
        this.freeCmdSlots[index] = null;
      } else {
        this.freePasSlots[index] = null;
      }
    }
  }

  onSkillSearch() {
    this.updateSkillSuggestions();
  }

  updateSkillSuggestions() {
    const q = this.skillSearchQuery.toLowerCase();
    
    // Get all skills matching the required type
    const allSkills = this.compendium.allSkills.map(sk => sk.name).filter(skName => {
      const skObj = this.compendium.getSkill(skName);
      if (!skObj) return false;
      
      // Filter out auto skills and Auction House exclusives
      if (skObj.element === 'aut' || skObj.element === 'auto' || skObj.element === 'rac') return false;
      if (!this.isSkillAvailableNaturally(skName)) return false;
      
      // Match active type
      const isPas = skObj.element === 'pas';
      if (this.activePickerType === 'pas' && !isPas) return false;
      if (this.activePickerType === 'cmd' && isPas) return false;

      // Determine which arrays to check against
      let checkInnateCmd = this.innateCmd;
      let checkInnatePas = this.innatePas;
      let checkFreeCmd = this.freeCmdSlots;
      let checkFreePas = this.freePasSlots;

      if (this.activeOwnedDemonIndex !== null) {
        const odUI = this.ownedDemonUIs[this.activeOwnedDemonIndex];
        checkInnateCmd = []; // We allow overwriting innate skills, so we don't prevent picking them if they were cleared
        checkInnatePas = odUI.profile.innatePas; 
        checkFreeCmd = odUI.cmdSlots;
        checkFreePas = odUI.freePasSlots;
      }

      // Ensure it's not already innate (only for target demon)
      if (this.activePickerType === 'cmd' && checkInnateCmd.some(sk => sk.name === skName)) return false;
      if (this.activePickerType === 'pas' && checkInnatePas.some(sk => sk.name === skName)) return false;

      // Ensure it's not already in another free slot (or set slot for owned demons)
      if (this.activePickerType === 'cmd' && checkFreeCmd.includes(skName)) return false;
      if (this.activePickerType === 'pas' && checkFreePas.includes(skName)) return false;

      return !q || skName.toLowerCase().includes(q);
    });

    this.skillSuggestions = allSkills
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .slice(0, 20); // show top 20
  }

  selectSkill(skillName: string) {
    if (this.activeOwnedDemonIndex !== null) {
      if (this.activePickerType === 'cmd') {
        this.ownedDemonUIs[this.activeOwnedDemonIndex].cmdSlots[this.activePickerIndex] = skillName;
      } else if (this.activePickerType === 'pas') {
        this.ownedDemonUIs[this.activeOwnedDemonIndex].freePasSlots[this.activePickerIndex] = skillName;
      }
    } else {
      if (this.activePickerType === 'cmd') {
        this.freeCmdSlots[this.activePickerIndex] = skillName;
      } else if (this.activePickerType === 'pas') {
        this.freePasSlots[this.activePickerIndex] = skillName;
      }
    }
    this.closeSkillPicker();
  }

  // --- Owned Demons Methods ---
  onOwnedDemonSearch() {
    const q = this.ownedDemonSearchQuery.toLowerCase();
    if (!q) {
      this.ownedDemonSuggestions = [];
      return;
    }
    this.ownedDemonSuggestions = this.compendium.allDemons.map(d => d.name)
      .filter(n => n.toLowerCase().includes(q))
      .sort((a, b) => a.length - b.length || a.localeCompare(b));
  }

  addOwnedDemon(name: string) {
    const builder = new DemonProfileBuilder(this.compendium);
    const profile = builder.buildProfile(name);
    if (profile) {
      const cmdSlots: (string | null)[] = [null, null, null];
      for (let i = 0; i < profile.innateCmd.length && i < 3; i++) cmdSlots[i] = profile.innateCmd[i].name;

      const freePasSlots: (string | null)[] = Array(profile.freePasCount).fill(null);

      this.ownedDemonUIs.push({
        profile: profile,
        cmdSlots: cmdSlots,
        freePasSlots: freePasSlots,
        isStatsTransfer: false
      });
    }
    this.ownedDemonSearchQuery = '';
    this.ownedDemonSuggestions = [];
  }

  removeOwnedDemon(index: number) {
    this.ownedDemonUIs.splice(index, 1);
  }

  toggleStatsTransfer(index: number) {
    this.ownedDemonUIs[index].isStatsTransfer = !this.ownedDemonUIs[index].isStatsTransfer;
  }

  // -------------------------------------
  // DP Generator
  // -------------------------------------
  isSkillInnate(profile: DemonProfile, skillName: string | null, type: 'cmd' | 'pas'): boolean {
    if (!skillName) return false;
    if (type === 'cmd') return profile.innateCmd.some(sk => sk.name === skillName);
    if (type === 'pas') return profile.innatePas.some(sk => sk.name === skillName);
    return false;
  }

  isSkillAvailableNaturally(skName: string): boolean {
    for (const d of this.compendium.allDemons) {
      for (const [s, lvl] of Object.entries(d.skills)) {
        if (s === skName && lvl <= 99) return true;
      }
    }
    return false;
  }

  // --- Pagination Helpers ---
  getPaginatedResults(): DPFusionResult[] {
    if (!this.isTierZeroMode) return this.dpResults;
    const start = this.fissionPage * this.fissionPageSize;
    return this.dpResults.slice(start, start + this.fissionPageSize);
  }
  
  get totalFissionPages(): number {
    return Math.ceil(this.dpResults.length / this.fissionPageSize);
  }
  
  nextFissionPage() {
    if (this.fissionPage < this.totalFissionPages - 1) {
      this.fissionPage++;
      this.selectedResultIndex = 0;
    }
  }
  
  prevFissionPage() {
    if (this.fissionPage > 0) {
      this.fissionPage--;
      this.selectedResultIndex = 0;
    }
  }
  
  onTierZeroSortChange() {
    if (!this.isTierZeroMode) return;
    this.dpResults.sort((a: any, b: any) => {
      if (this.tierZeroSort === 'level') {
        return a._avgLevel - b._avgLevel || a.maccaCost - b.maccaCost;
      } else {
        return a.maccaCost - b.maccaCost || a._avgLevel - b._avgLevel;
      }
    });
    this.fissionPage = 0;
    this.selectedResultIndex = 0;
  }

  getRequiredSkills(): string[] {
    const skills: string[] = [];
    this.freeCmdSlots.forEach(s => { if (s) skills.push(s); });
    this.freePasSlots.forEach(s => { if (s) skills.push(s); });
    return skills;
  }

  searchProgress: string = '';

  generateForDemon(demon: string) {
    this.breadcrumbs.push({
      targetDemonName: this.targetDemonObj!.name,
      freeCmdSlots: [...this.freeCmdSlots],
      freePasSlots: [...this.freePasSlots]
    });
    this.selectTargetDemon(demon);
    this.freeCmdSlots = this.freeCmdSlots.map(() => null);
    this.freePasSlots = this.freePasSlots.map(() => null);
    // Let change detection run so the UI updates and then trigger generate
    setTimeout(() => this.generate(), 50);
  }

  restoreBreadcrumb(index: number) {
    const crumb = this.breadcrumbs[index];
    if (!crumb) return;
    
    this.breadcrumbs = this.breadcrumbs.slice(0, index);
    this.selectTargetDemon(crumb.targetDemonName);
    this.freeCmdSlots = [...crumb.freeCmdSlots];
    this.freePasSlots = [...crumb.freePasSlots];
    
    setTimeout(() => this.generate(), 50);
  }

  async generate() {
    const reqSkills = this.getRequiredSkills();
    if (!this.targetDemonObj) return;

    this.isSearching = true;
    this.searchProgress = '';
    this.dpResults = [];
    this.selectedResultIndex = 0;
    this.searchFailed = false;
    this.isTierZeroMode = false;

    if (reqSkills.length === 0) {
      this.isSearching = false;
      this.isTierZeroMode = true;
      this.fissionPage = 0;
      
      const fusions = this.fusionDataService.fissionCalculator.getFusions(this.targetDemonObj.name, this.compendium, this.fusionChart);
      
      const pseudoResults: DPFusionResult[] = fusions.map((pair, index) => {
        const d1 = this.compendium.getDemon(pair.name1);
        const d2 = this.compendium.getDemon(pair.name2);
        
        let maccaCost = 0;
        let d1Owned = false;
        let d2Owned = false;
        
        if (this.ownedDemonUIs.find(u => u.profile.name === pair.name1)) {
          d1Owned = true;
        } else {
          maccaCost += d1.price;
        }
        
        if (this.ownedDemonUIs.find(u => u.profile.name === pair.name2)) {
          d2Owned = true;
        } else {
          maccaCost += d2.price;
        }
        
        const graph: FusionGraphNode[] = [
          {
            id: '0',
            demon: this.targetDemonObj!.name,
            recipe: { ingredient1Id: '1', ingredient2Id: '2' },
            stepNumber: 0,
            isNatural: true,
            isOwned: false,
            level: this.targetDemonObj!.lvl,
            skills: []
          },
          {
            id: '1',
            demon: pair.name1,
            recipe: null,
            isNatural: true,
            isOwned: d1Owned,
            level: d1.lvl,
            skills: []
          },
          {
            id: '2',
            demon: pair.name2,
            recipe: null,
            isNatural: true,
            isOwned: d2Owned,
            level: d2.lvl,
            skills: []
          }
        ];
        
        const avgLevel = (d1.lvl + d2.lvl) / 2;
        
        return {
          label: `${pair.name1} x ${pair.name2}`,
          graph,
          maxLevel: Math.max(d1.lvl, d2.lvl),
          maccaCost,
          totalFusions: 1,
          ahCount: 0,
          summonCount: (d1Owned ? 0 : 1) + (d2Owned ? 0 : 1),
          _avgLevel: avgLevel // internal use for sorting
        } as any;
      });
      
      pseudoResults.sort((a: any, b: any) => {
        if (this.tierZeroSort === 'level') {
          return a._avgLevel - b._avgLevel || a.maccaCost - b.maccaCost;
        } else {
          return a.maccaCost - b.maccaCost || a._avgLevel - b._avgLevel;
        }
      });
      
      this.dpResults = pseudoResults;
      this.cdr.markForCheck();
      return;
    }

    try {
      console.log("Starting solveMultiSkillFusion for:", this.targetDemonObj.name, "with skills:", reqSkills, "maxLevel:", this.playerMaxLevel);
      const startTime = performance.now();

      const results: DPFusionResult[] = [];

      const ownedDemons: OwnedDemon[] = this.ownedDemonUIs.map(ui => {
        const skills = [
          ui.profile.innateRac,
          ...ui.profile.innatePas.map(s => s.name),
          ...ui.cmdSlots.filter(s => s !== null) as string[],
          ...ui.freePasSlots.filter(s => s !== null) as string[]
        ];
        return {
          name: ui.profile.name,
          lvl: ui.profile.lvl,
          skills: skills,
          isStatsTransfer: ui.isStatsTransfer
        };
      });

      const runSolver = async (criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'max_owned' | 'stats_transfer', labelName: string, ignoreOwned: boolean = false) => {
        const solver = new FusionDPSolver(this.compendium, this.fusionChart);
        const activeOwnedDemons = ignoreOwned ? [] : ownedDemons;
        const res = await solver.solveMultiSkillFusion(
          this.targetDemonObj.name, 
          reqSkills, 
          this.playerMaxLevel, 
          criteria, 
          activeOwnedDemons, 
          ignoreOwned,
          (iter, qLen) => {
            this.searchProgress = `(${iter} iters, ${qLen} paths)`;
            if (this.cdr) this.cdr.detectChanges();
          }
        );
        if (res) {
          res.label = labelName;
          results.push(res);
        }
      };

      await runSolver('min_level', 'Lowest Level');
      await runSolver('min_fusions', 'Fewest Steps');
      if (ownedDemons.length > 0) {
        await runSolver('max_owned', 'Most Owned Used');
        await runSolver('min_fusions', 'Fewest Steps (No Owned)', true);
        await runSolver('stats_transfer', 'Stats Transfer');
      }

      this.dpResults = results;
      if (this.dpResults.length === 0) {
        this.searchFailed = true;
      }
      console.log(`Fusion search completed in ${(performance.now() - startTime).toFixed(2)}ms`);

    } catch (e) {
      console.error("Fusion Solver Error:", e);
      this.searchFailed = true;
    } finally {
      this.isSearching = false;
      this.searchProgress = '';
      if (this.cdr) this.cdr.detectChanges();
    }
  }

  getNode(id: string | number): FusionGraphNode | undefined {
    return this.getPaginatedResults()[this.selectedResultIndex]?.graph.find(n => n.demon === id || (n as any).id === id) || 
           this.getPaginatedResults()[this.selectedResultIndex]?.graph[id as number];
  }

  getSkillAcquisition(demonName: string, skillName: string): string {
    const demonObj = this.compendium.getDemon(demonName);
    if (!demonObj) return '';
    const slvl = demonObj.skills[skillName];
    if (slvl === undefined) return ''; // Should not happen for base ingredients
    
    if (slvl < 1) return 'Innate';
    if (slvl <= 99) return `Lv ${slvl}`;
    
    const tier = decodeAHSkillTier(slvl);
    if (tier) {
      return `${tier.charAt(0).toUpperCase() + tier.slice(1)} AH`;
    }
    return '';
  }

  getSkillLevelReq(demonName: string, skillName: string): number | null {
    const demonObj = this.compendium.getDemon(demonName);
    if (!demonObj) return null;
    const slvl = demonObj.skills[skillName];
    if (slvl !== undefined && slvl >= 1 && slvl <= 99) {
      return slvl;
    }
    return null;
  }

  getDisplaySkills(node: any): string[] {
    if (this.getRequiredSkills().length > 0) {
      return node.skills;
    }
    const dObj = this.compendium.getDemon(node.demon);
    if (!dObj) return [];
    return Object.keys(dObj.skills).filter(k => dObj.skills[k] === 0);
  }
}
