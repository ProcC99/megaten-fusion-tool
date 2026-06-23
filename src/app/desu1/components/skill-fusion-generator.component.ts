/**
 * skill-fusion-generator.component.ts
 * -----------------------------------------------------------------
 * Target-first fusion recipe generator with DP algorithm and Visual Profile
 */

import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { FusionDataService } from '../../smt4f/fusion-data.service';
import { Compendium } from '../../smt4f/models/compendium';

import { FusionDPSolver, DPFusionResult, FusionGraphNode, OwnedDemon } from '../models/fusion-dp-solver';
import { DemonProfileBuilder, DemonProfile } from '../models/demon-profile-builder';
import { decodeAHSkillTier } from '../models/fusion-tree-types';

export interface OwnedDemonUI {
  profile: DemonProfile;
  freeCmdSlots: (string | null)[];
  freePasSlots: (string | null)[];
  isCollapsed?: boolean;
}

@Component({
  selector: 'app-skill-fusion-generator',
  template: `
<div class="skill-fusion-generator">

  <h2 class="section-title">Devil Survivor Skill Recipe</h2>

  <!-- 1. Target demon selection -->
  <section class="panel target-panel" *ngIf="!targetDemonObj">
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

    <div class="slots-container">
      <!-- Command Skills -->
      <div class="slot-column">
        <h4>Command Skills ({{ getFilledSlotCount(freeCmdSlots) + innateCmd.length }}/3)</h4>
        
        <!-- Innate Command Skills -->
        <div class="slot innate-slot" *ngFor="let sk of innateCmd">
          <span class="slot-icon">🗡</span> {{ sk }} <span class="badge badge-innate">INNATE</span>
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
          <span class="slot-icon">🛡</span> {{ sk }} <span class="badge badge-innate">INNATE</span>
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

    <!-- Contextual Skill Picker -->
    <div class="skill-picker" *ngIf="activePickerType">
      <div class="picker-header">
        <h5>Select {{ activePickerType === 'cmd' ? 'Command' : 'Passive' }} Skill</h5>
        <button class="btn-close-picker" (click)="closeSkillPicker()">✕</button>
      </div>
      <input type="text" placeholder="Search skill..." [(ngModel)]="skillSearchQuery" (input)="onSkillSearch()" class="skill-picker-input" autofocus />
      <ul class="picker-suggestions">
        <li *ngFor="let s of skillSuggestions" (click)="selectSkill(s)" class="picker-item">{{ s }}</li>
      </ul>
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
             <span *ngIf="od.isCollapsed" style="font-size: 0.8rem; color: #aaa; margin-left: 10px;">
               [{{ getFilledSlotCount(od.freeCmdSlots) + od.profile.innateCmd.length }} Cmd, {{ getFilledSlotCount(od.freePasSlots) + od.profile.innatePas.length }} Pas]
             </span>
           </span>
           <button class="btn-remove-demon" (click)="removeOwnedDemon(odIdx); $event.stopPropagation()">✕ Remove</button>
         </div>

         <div class="slots-container" style="margin-top: 0;" *ngIf="!od.isCollapsed">
            <!-- Command Skills -->
            <div class="slot-column">
              <h4>Command Skills ({{ getFilledSlotCount(od.freeCmdSlots) + od.profile.innateCmd.length }}/3)</h4>
              <div class="slot innate-slot" *ngFor="let sk of od.profile.innateCmd">
                <span class="slot-icon">🗡</span> {{ sk }} <span class="badge badge-innate">INNATE</span>
              </div>
              <div class="slot free-slot" *ngFor="let sk of od.freeCmdSlots; let i = index" 
                   (click)="openSkillPicker('cmd', i, odIdx)"
                   [class.is-filled]="sk !== null"
                   [class.is-active]="activePickerType === 'cmd' && activePickerIndex === i && activeOwnedDemonIndex === odIdx">
                <span class="slot-icon">🗡</span>
                <span class="slot-text">{{ sk ? sk : '[ Click to set Command Skill ]' }}</span>
                <button class="btn-clear-slot" *ngIf="sk" (click)="clearSlot('cmd', i, $event, odIdx)">✕</button>
              </div>
            </div>
      
            <!-- Passive Skills -->
            <div class="slot-column">
              <h4>Passive Skills ({{ getFilledSlotCount(od.freePasSlots) + od.profile.innatePas.length }}/3)</h4>
              <div class="slot innate-slot" *ngFor="let sk of od.profile.innatePas">
                <span class="slot-icon">🛡</span> {{ sk }} <span class="badge badge-innate">INNATE</span>
              </div>
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
        {{ isSearching ? 'Computing...' : 'Generate DP Recipe' }}
      </button>
    </div>
  </section>

  <!-- Results -->
  <section class="panel results-panel" *ngIf="dpResults.length > 0">
    <h3>Optimal Fusion Recipes</h3>
    
    <div class="path-tabs">
      <button class="path-tab" 
              *ngFor="let res of dpResults; let i = index" 
              [class.active]="selectedResultIndex === i"
              (click)="selectedResultIndex = i">
        <div class="tab-title">{{ res.label }}</div>
        <div class="tab-stats">Lv {{ res.maxLevel }} | {{ res.totalFusions }} Steps | {{ res.ahCount }} AH</div>
        <div class="tab-stats" style="margin-top: 2px;">{{ res.summonCount }} Summons | {{ res.maccaCost | number }} Macca</div>
      </button>
    </div>

    <div class="dp-tree-view">
      <ng-template #fusionNode let-node="node">
        <div class="tree-node" [class.is-natural]="node.isNatural">
          <div class="node-info">
            <span class="step-badge" *ngIf="node.stepNumber">{{ node === dpResults[selectedResultIndex].graph[0] ? 'Final Result' : 'Step ' + node.stepNumber }}</span>
            <span class="node-demon">{{ node.demon }}</span>
            <span class="node-skills" *ngIf="node.skills.length">
              [<ng-container *ngFor="let sk of node.skills; let last = last">
                {{ sk }}<span *ngIf="node.isNatural && !node.isOwned" class="skill-req"> ({{ getSkillAcquisition(node.demon, sk) }})</span><span *ngIf="!last">, </span>
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
      <div class="tree-root">
        <ng-container *ngTemplateOutlet="fusionNode; context: { node: dpResults[selectedResultIndex].graph[0] }"></ng-container>
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
    
    input[type=text], input[type=number] { background: #111; color: #eee; border: 1px solid #555; border-radius: 4px; padding: 8px 10px; font-size: 0.9rem; }
    .demon-search-input { width: 300px; }
    .setting-input { width: 80px; text-align: center; }
    
    .demon-suggestions, .picker-suggestions { list-style: none; margin: 4px 0 0; padding: 0; background: #222; border: 1px solid #555; border-radius: 4px; max-height: 200px; overflow-y: auto; position: absolute; z-index: 10; width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .suggestion-item, .picker-item { padding: 8px 10px; cursor: pointer; border-bottom: 1px solid #333; }
    .suggestion-item:hover, .picker-item:hover { background: #3a5c20; }
    
    .profile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .profile-title h3 { margin: 0; font-size: 1.4rem; color: #fff; }
    .demon-meta { color: #88cc88; font-size: 0.9rem; }
    .btn-change { background: #444; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    
    .stats-row { display: flex; gap: 12px; margin-bottom: 24px; background: #111; padding: 12px; border-radius: 6px; }
    .stat-box { display: flex; flex-direction: column; align-items: center; flex: 1; }
    .stat-box span { font-size: 0.75rem; color: #888; text-transform: uppercase; }
    .stat-box strong { font-size: 1.1rem; color: #eee; }
    
    .slots-container { display: flex; gap: 24px; flex-wrap: wrap; }
    .slot-column { flex: 1; min-width: 250px; }
    .racial-column { flex: 0.5; min-width: 150px; }
    
    .slot { display: flex; align-items: center; padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; font-size: 0.9rem; }
    .slot-icon { margin-right: 8px; opacity: 0.6; }
    .innate-slot { background: #111; border: 1px solid #333; color: #ccc; }
    .free-slot { background: #222; border: 1px dashed #555; color: #888; cursor: pointer; transition: all 0.2s; position: relative; }
    .free-slot:hover { border-color: #88cc88; background: #2a3a2a; color: #eee; }
    .free-slot.is-filled { border-style: solid; color: #eee; border-color: #444; }
    .free-slot.is-active { border-color: #7dff7d; background: #1a3c1a; }
    
    .badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 3px; font-weight: bold; margin-left: auto; }
    .badge-innate { background: #1a5c1a; color: #7dff7d; }
    
    .btn-clear-slot { position: absolute; right: 8px; background: transparent; border: none; color: #c55; cursor: pointer; font-size: 1rem; padding: 4px; }
    .btn-clear-slot:hover { color: #f55; }
    
    .skill-picker { background: #1a1a2e; border: 1px solid #7dff7d; border-radius: 6px; padding: 16px; margin-top: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.8); }
    .picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .picker-header h5 { margin: 0; color: #7dff7d; font-size: 1rem; }
    .btn-close-picker { background: transparent; border: none; color: #aaa; cursor: pointer; font-size: 1.2rem; }
    .skill-picker-input { width: 100%; margin-bottom: 12px; }
    .picker-suggestions { position: static; width: 100%; max-height: 250px; }
    
    .settings-row { display: flex; gap: 16px; align-items: center; }
    .btn-generate { padding: 8px 16px; background: #c34242; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
    .btn-generate:hover { background: #d65151; }
    .btn-generate:disabled { opacity: 0.5; cursor: default; }
    
    .path-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .path-tab { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 10px 16px; cursor: pointer; text-align: left; transition: all 0.2s; }
    .path-tab:hover { background: #222; border-color: #555; }
    .path-tab.active { background: #2d5a2d; border-color: #a1d99b; }
    .tab-title { font-weight: bold; color: #fff; margin-bottom: 4px; }
    .tab-stats { font-size: 0.85rem; color: #aaa; }
    .path-tab.active .tab-stats { color: #d4f0ce; }

    /* Tree View */
    .dp-tree-view { padding: 16px; background: #111; border-radius: 6px; border: 1px solid #333; }
    .tree-root > .tree-node { margin-left: 0; border-left: none; padding-left: 0; }
    .tree-root > .tree-node::before { display: none; }
    .tree-node { margin: 8px 0 8px 24px; border-left: 2px solid #444; padding-left: 16px; position: relative; }
    .tree-node::before { content: ''; position: absolute; left: 0; top: 16px; width: 16px; height: 2px; background: #444; }
    .node-info { background: #222; padding: 6px 12px; border-radius: 4px; display: inline-block; border: 1px solid #333; }
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
  compendium: Compendium;
  sub: Subscription;

  // Search State
  demonSearchQuery = '';
  demonSuggestions: string[] = [];
  
  // Profile State
  targetDemonObj: any = null;
  innateCmd: string[] = [];
  innatePas: string[] = [];
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
  
  isSearching: boolean = false;
  searchFailed: boolean = false;

  fusionChart: any;

  // Owned Demons State
  ownedDemonUIs: OwnedDemonUI[] = [];
  ownedDemonSearchQuery: string = '';
  ownedDemonSuggestions: string[] = [];
  activeOwnedDemonIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService,
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
        this.ownedDemonUIs[ownedDemonIdx].freeCmdSlots[index] = null;
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

      // Ensure it's not already innate
      if (this.activePickerType === 'cmd' && this.innateCmd.includes(skName)) return false;
      if (this.activePickerType === 'pas' && this.innatePas.includes(skName)) return false;

      // Ensure it's not already in another free slot
      if (this.activePickerType === 'cmd' && this.freeCmdSlots.includes(skName)) return false;
      if (this.activePickerType === 'pas' && this.freePasSlots.includes(skName)) return false;

      return !q || skName.toLowerCase().includes(q);
    });

    this.skillSuggestions = allSkills
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .slice(0, 20); // show top 20
  }

  selectSkill(skillName: string) {
    if (this.activeOwnedDemonIndex !== null) {
      if (this.activePickerType === 'cmd') {
        this.ownedDemonUIs[this.activeOwnedDemonIndex].freeCmdSlots[this.activePickerIndex] = skillName;
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
      this.ownedDemonUIs.push({
        profile,
        freeCmdSlots: Array(profile.freeCmdCount).fill(null),
        freePasSlots: Array(profile.freePasCount).fill(null)
      });
    }
    this.ownedDemonSearchQuery = '';
    this.ownedDemonSuggestions = [];
  }

  removeOwnedDemon(index: number) {
    this.ownedDemonUIs.splice(index, 1);
  }

  // -------------------------------------
  // DP Generator
  // -------------------------------------
  isSkillAvailableNaturally(skName: string): boolean {
    for (const d of this.compendium.allDemons) {
      for (const [s, lvl] of Object.entries(d.skills)) {
        if (s === skName && lvl <= 99) return true;
      }
    }
    return false;
  }

  getRequiredSkills(): string[] {
    const skills: string[] = [];
    this.freeCmdSlots.forEach(s => { if (s) skills.push(s); });
    this.freePasSlots.forEach(s => { if (s) skills.push(s); });
    return skills;
  }

  generate() {
    const reqSkills = this.getRequiredSkills();
    if (!this.targetDemonObj) return;

    this.isSearching = true;
    this.dpResults = [];
    this.selectedResultIndex = 0;
    this.searchFailed = false;

    // Use setTimeout to allow UI to render the "Computing..." state
    setTimeout(() => {
      try {
        console.log("Starting solveMultiSkillFusion for:", this.targetDemonObj.name, "with skills:", reqSkills, "maxLevel:", this.playerMaxLevel);
        const startTime = performance.now();
        
        const results: DPFusionResult[] = [];
        
        const ownedDemons: OwnedDemon[] = this.ownedDemonUIs.map(ui => {
          const skills = [
            ...ui.profile.innateCmd,
            ...ui.profile.innatePas,
            ...(ui.freeCmdSlots.filter(s => s !== null) as string[]),
            ...(ui.freePasSlots.filter(s => s !== null) as string[])
          ];
          return { name: ui.profile.name, skills };
        });

        const runSolver = (criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'max_owned', labelName: string, ignoreOwned: boolean = false) => {
          const solver = new FusionDPSolver(this.compendium, this.fusionChart);
          const activeOwnedDemons = ignoreOwned ? [] : ownedDemons;
          const res = solver.solveMultiSkillFusion(this.targetDemonObj.name, reqSkills, this.playerMaxLevel, criteria, activeOwnedDemons);
          if (res) {
            res.label = labelName;
            results.push(res);
          }
        };

        runSolver('min_level', 'Lowest Level');
        runSolver('min_level', 'Lowest Level (No Owned)', true);
        runSolver('min_fusions', 'Fewest Fusions');
        runSolver('min_ah', 'Fewest AH');
        runSolver('max_owned', 'Max Owned');
        
        const endTime = performance.now();
        console.log(`solveMultiSkillFusion (all passes) completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        if (results.length > 0) {
          this.dpResults = results;
        } else {
          console.warn("solveMultiSkillFusion returned null for all passes");
          this.searchFailed = true;
        }
      } catch (e) {
        console.error("solveMultiSkillFusion threw an error:", e);
        this.searchFailed = true;
      } finally {
        this.isSearching = false;
        this.cdr.markForCheck();
      }
    }, 50);
  }

  getNode(id: string): FusionGraphNode | undefined {
    return this.dpResults[this.selectedResultIndex]?.graph.find(n => n.id === id);
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
}
