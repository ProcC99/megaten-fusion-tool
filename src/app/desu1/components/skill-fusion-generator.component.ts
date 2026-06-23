/**
 * skill-fusion-generator.component.ts
 * -----------------------------------------------------------------
 * Target-first fusion recipe generator for Devil Survivor Overclocked.
 *
 * Flow
 * ----
 * 1. User selects a target demon from a searchable dropdown.
 * 2. User picks up to 3 CMD skills and up to 3 PAS skills.
 *    Skills already innate to the target are labelled INNATE.
 *    Each skill row shows which other demons carry it.
 * 3. User marks owned demons (persisted to localStorage).
 * 4. User clicks Generate — the backwards solver runs and outputs
 *    a ranked list of fusion chains.
 * 5. Strict / Best-Effort toggle controls failure behaviour:
 *    Strict     → only show chains that can satisfy every requested skill;
 *                 if none exist, show per-skill failure reasons.
 *    Best Effort → show the closest partial solution; flag missing skills.
 */

import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';

import { Compendium, FusionDataService as IFusionDataService } from '../../compendium/models';
import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { SquareChart } from '../../compendium/models';

import {
  PlayerState,
  DEFAULT_PLAYER_STATE,
  OwnedDemon,
  SkillTarget,
  RankedFusionResult,
  FusionNode,
  AHTier,
} from '../models/fusion-tree-types';
import { searchFusionTree } from '../models/fusion-tree-search';
import { FusionDataService } from '../../smt4f/fusion-data.service';

// ---------------------------------------------------------------------------
// Types used only by this component
// ---------------------------------------------------------------------------

interface SkillChoice {
  name: string;
  isPas: boolean;
  isInnate: boolean;
  carriers: string[]; // demon names that carry this skill (non-AH)
}

interface StrictFailureReason {
  skill: string;
  reason: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-skill-fusion-generator',
  template: `
<div class="skill-fusion-generator">

  <!-- ===== Header ===== -->
  <h2 class="section-title">DSO Skill Fusion Recipe Generator</h2>

  <!-- ===== Target demon selector ===== -->
  <section class="panel target-panel">
    <h3>1. Target Demon</h3>
    <input
      type="text"
      placeholder="Search demon…"
      [(ngModel)]="demonSearchQuery"
      (input)="onDemonSearch()"
      class="demon-search-input" />
    <ul class="demon-suggestions" *ngIf="demonSuggestions.length > 0">
      <li
        *ngFor="let d of demonSuggestions"
        (click)="selectTargetDemon(d)"
        class="suggestion-item">{{ d }}</li>
    </ul>
    <div class="selected-demon" *ngIf="targetDemonName">
      <strong>{{ targetDemonName }}</strong>
      <span class="demon-race">{{ targetDemonRace }}</span>
      <span class="demon-level">Lv {{ targetDemonLevel }}</span>
    </div>
  </section>

  <!-- ===== Skill selector ===== -->
  <section class="panel skills-panel" *ngIf="targetDemonName">
    <h3>2. Desired Skills</h3>
    <p class="hint">
      Select up to 3 CMD and 3 PAS skills to carry into
      <strong>{{ targetDemonName }}</strong>.
      <span class="badge badge-innate">INNATE</span> = already on target (free).
    </p>
    <div class="skill-columns">

      <!-- CMD column -->
      <div class="skill-column">
        <h4>CMD <span class="slot-counter">({{ selectedCmd.length }}/3)</span></h4>
        <input
          type="text"
          placeholder="Search CMD skill…"
          [(ngModel)]="cmdSearchQuery"
          (input)="onCmdSkillSearch()"
          [disabled]="selectedCmd.length >= 3"
          class="skill-search-input" />
        <ul class="skill-suggestions" *ngIf="cmdSuggestions.length > 0">
          <li
            *ngFor="let s of cmdSuggestions"
            (click)="addCmdSkill(s)"
            class="suggestion-item">
            {{ s.name }}
            <span *ngIf="s.isInnate" class="badge badge-innate">INNATE</span>
          </li>
        </ul>
        <ul class="selected-skills">
          <li *ngFor="let s of selectedCmd" class="skill-row">
            <span class="skill-name">{{ s.name }}</span>
            <span *ngIf="s.isInnate" class="badge badge-innate">INNATE</span>
            <span class="carriers" *ngIf="s.carriers.length > 0">
              via: {{ s.carriers.slice(0, 3).join(', ') }}<span *ngIf="s.carriers.length > 3"> +{{ s.carriers.length - 3 }} more</span>
            </span>
            <button class="btn-remove" (click)="removeCmdSkill(s.name)">✕</button>
          </li>
        </ul>
      </div>

      <!-- PAS column -->
      <div class="skill-column">
        <h4>PAS <span class="slot-counter">({{ selectedPas.length }}/3)</span></h4>
        <input
          type="text"
          placeholder="Search PAS skill…"
          [(ngModel)]="pasSearchQuery"
          (input)="onPasSkillSearch()"
          [disabled]="selectedPas.length >= 3"
          class="skill-search-input" />
        <ul class="skill-suggestions" *ngIf="pasSuggestions.length > 0">
          <li
            *ngFor="let s of pasSuggestions"
            (click)="addPasSkill(s)"
            class="suggestion-item">
            {{ s.name }}
            <span *ngIf="s.isInnate" class="badge badge-innate">INNATE</span>
          </li>
        </ul>
        <ul class="selected-skills">
          <li *ngFor="let s of selectedPas" class="skill-row">
            <span class="skill-name">{{ s.name }}</span>
            <span *ngIf="s.isInnate" class="badge badge-innate">INNATE</span>
            <span class="carriers" *ngIf="s.carriers.length > 0">
              via: {{ s.carriers.slice(0, 3).join(', ') }}<span *ngIf="s.carriers.length > 3"> +{{ s.carriers.length - 3 }} more</span>
            </span>
            <button class="btn-remove" (click)="removePasSkill(s.name)">✕</button>
          </li>
        </ul>
      </div>

    </div>
  </section>

  <!-- ===== Owned demons ===== -->
  <section class="panel owned-panel" *ngIf="targetDemonName">
    <h3>3. Owned Demons <span class="hint">(optional — prioritises shorter chains)</span></h3>
    <div class="owned-input-row">
      <input
        type="text"
        placeholder="Demon name"
        [(ngModel)]="ownedDemonInput"
        class="owned-demon-input" />
      <input
        type="number"
        placeholder="Level"
        [(ngModel)]="ownedLevelInput"
        min="1" max="99"
        class="owned-level-input" />
      <button class="btn-add" (click)="addOwnedDemon()">Add</button>
    </div>
    <ul class="owned-list">
      <li *ngFor="let d of playerState.ownedDemons" class="owned-item">
        {{ d.name }} Lv {{ d.currentLevel }}
        <button class="btn-remove" (click)="removeOwnedDemon(d.name)">✕</button>
      </li>
    </ul>
  </section>

  <!-- ===== Solver controls ===== -->
  <section class="panel controls-panel" *ngIf="targetDemonName">
    <h3>4. Generate</h3>
    <div class="controls-row">
      <label class="toggle-label">
        <input type="checkbox" [(ngModel)]="strictMode" />
        Strict mode
        <span class="hint">(only show fully-solvable chains)</span>
      </label>
      <label class="rank-label">
        Sort by:
        <select [(ngModel)]="rankStrategy">
          <option value="cheapest">Cheapest</option>
          <option value="fewest_steps">Fewest fusions</option>
          <option value="most_owned_used">Most owned used</option>
        </select>
      </label>
      <button
        class="btn-generate"
        (click)="generate()"
        [disabled]="isSearching || (selectedCmd.length + selectedPas.length) === 0">
        {{ isSearching ? 'Searching…' : 'Generate Recipe' }}
      </button>
    </div>
  </section>

  <!-- ===== Strict failure panel ===== -->
  <section class="panel failure-panel" *ngIf="strictMode && strictFailures.length > 0">
    <h3>⚠ No complete chain found</h3>
    <ul class="failure-list">
      <li *ngFor="let f of strictFailures" class="failure-item">
        <strong>{{ f.skill }}</strong>: {{ f.reason }}
      </li>
    </ul>
  </section>

  <!-- ===== Results ===== -->
  <section class="panel results-panel" *ngIf="results.length > 0">
    <h3>Results <span class="result-count">({{ results.length }})</span></h3>

    <div *ngIf="!strictMode && hasPartialResults" class="best-effort-banner">
      ⚡ Best Effort — some skills could not be fully covered. Missing skills are flagged below.
    </div>

    <div
      *ngFor="let r of results"
      class="result-card"
      [class.tier-available]="r.reachabilityTier === 'available_now'"
      [class.tier-soon]="r.reachabilityTier === 'soon'"
      [class.tier-later]="r.reachabilityTier === 'later_game'">

      <div class="result-header">
        <span class="result-rank">#{{ r.rank }}</span>
        <span class="result-cost">{{ r.totalCost | number }} Macca</span>
        <span class="result-fusions">{{ r.totalFusions }} fusion{{ r.totalFusions === 1 ? '' : 's' }}</span>
        <span class="result-owned" *ngIf="r.ownedLeafCount > 0">🗂 {{ r.ownedLeafCount }} owned</span>
        <span class="tier-badge" [ngClass]="'tier-' + r.reachabilityTier">
          {{ r.reachabilityTier === 'available_now' ? '✓ Available' : r.reachabilityTier === 'soon' ? '⏳ Soon' : '🔒 Later' }}
        </span>
      </div>

      <!-- AH-only skill warnings -->
      <div class="ah-warning" *ngIf="r.ahOnlySkills.length > 0">
        <strong>AH purchase required:</strong>
        <span *ngFor="let s of r.ahOnlySkills">{{ s.skillName }} ({{ s.onDemon }}, {{ s.method.type === 'auction' ? s.method.tier : '' }} tier)</span>
      </div>

      <!-- Blocker list -->
      <ul class="blocker-list" *ngIf="r.blockers.length > 0">
        <li *ngFor="let b of r.blockers" class="blocker-item">⚠ {{ b.detail }}</li>
      </ul>

      <!-- Fusion chain tree -->
      <div class="fusion-chain">
        <ng-container *ngTemplateOutlet="fusionNode; context: { $implicit: r.root, depth: 0 }"></ng-container>
      </div>

    </div>
  </section>

  <!-- empty state -->
  <section class="panel empty-state" *ngIf="hasSearched && results.length === 0 && strictFailures.length === 0">
    <p>No fusion paths found for the current selection. Try relaxing the skill requirements or switching to Best Effort mode.</p>
  </section>

</div>

<!-- ===== Recursive fusion node template ===== -->
<ng-template #fusionNode let-node let-depth="depth">
  <div class="fusion-node" [style.marginLeft.px]="depth * 16">
    <div class="node-header">
      <span class="node-demon">{{ node.demon }}</span>
      <span class="node-cost" *ngIf="depth > 0">{{ node.totalCost | number }} ¥</span>
      <span class="node-leaf" *ngIf="!node.left && !node.right">
        {{ node.reachability.method.type === 'innate' ? '📦 Owned' : node.reachability.method.type === 'auction' ? '🏪 AH' : '🔀 Fuse' }}
      </span>
    </div>
    <div class="node-skills" *ngIf="node.skillsContributed.length > 0">
      <span
        *ngFor="let s of node.skillsContributed"
        class="skill-tag"
        [class.skill-innate]="isInnateOnTarget(s)"
        [class.skill-wanted]="!isInnateOnTarget(s)">
        {{ s }}
        <span class="skill-source">
          {{ getSkillSourceLabel(s, node) }}
        </span>
      </span>
    </div>
    <div class="node-children" *ngIf="node.left || node.right">
      <div class="fusion-arrow">▼ fuse</div>
      <ng-container *ngIf="node.left">
        <ng-container *ngTemplateOutlet="fusionNode; context: { $implicit: node.left, depth: depth + 1 }"></ng-container>
      </ng-container>
      <ng-container *ngIf="node.right">
        <ng-container *ngTemplateOutlet="fusionNode; context: { $implicit: node.right, depth: depth + 1 }"></ng-container>
      </ng-container>
    </div>
  </div>
</ng-template>
  `,
  styles: [`
    .skill-fusion-generator { max-width: 900px; margin: 0 auto; padding: 16px; font-family: inherit; }
    .section-title { font-size: 1.4rem; margin-bottom: 16px; }
    .panel { background: #1a1a2e; border: 1px solid #444; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
    h3 { margin: 0 0 12px; font-size: 1rem; color: #ccc; }
    h4 { margin: 0 0 8px; font-size: 0.9rem; color: #aaa; }
    .hint { font-size: 0.8rem; color: #888; }
    input[type=text], input[type=number], select {
      background: #111; color: #eee; border: 1px solid #555;
      border-radius: 4px; padding: 6px 10px; font-size: 0.9rem;
    }
    .demon-search-input, .skill-search-input, .owned-demon-input { width: 220px; }
    .owned-level-input { width: 70px; }
    .demon-suggestions, .skill-suggestions {
      list-style: none; margin: 0; padding: 0;
      background: #222; border: 1px solid #555; border-radius: 4px;
      max-height: 180px; overflow-y: auto; position: relative; z-index: 10;
    }
    .suggestion-item { padding: 6px 10px; cursor: pointer; }
    .suggestion-item:hover { background: #333; }
    .selected-demon { margin-top: 8px; }
    .demon-race, .demon-level { margin-left: 8px; color: #888; font-size: 0.85rem; }
    .skill-columns { display: flex; gap: 24px; }
    .skill-column { flex: 1; min-width: 0; }
    .slot-counter { font-size: 0.8rem; color: #888; }
    .selected-skills { list-style: none; margin: 8px 0 0; padding: 0; }
    .skill-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; border-bottom: 1px solid #2a2a3a; flex-wrap: wrap; }
    .skill-name { font-size: 0.9rem; }
    .carriers { font-size: 0.75rem; color: #888; flex: 1; }
    .badge { font-size: 0.7rem; padding: 1px 5px; border-radius: 3px; font-weight: bold; }
    .badge-innate { background: #1a5c1a; color: #7dff7d; }
    .btn-remove { background: transparent; border: none; color: #c55; cursor: pointer; font-size: 0.85rem; }
    .btn-add { background: #2255aa; color: #fff; border: none; border-radius: 4px; padding: 6px 14px; cursor: pointer; margin-left: 6px; }
    .btn-generate { background: #3a5c20; color: #fff; border: none; border-radius: 4px; padding: 8px 24px; font-size: 1rem; cursor: pointer; margin-left: 12px; }
    .btn-generate:disabled { opacity: 0.5; cursor: default; }
    .controls-row { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; }
    .toggle-label, .rank-label { font-size: 0.9rem; color: #ccc; }
    .owned-input-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .owned-list { list-style: none; margin: 0; padding: 0; }
    .owned-item { display: flex; align-items: center; gap: 8px; padding: 3px 0; font-size: 0.88rem; }
    .result-card { border: 1px solid #444; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
    .tier-available { border-color: #2a7a2a; }
    .tier-soon      { border-color: #7a6a1a; }
    .tier-later     { border-color: #7a2a2a; }
    .result-header  { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
    .result-rank    { font-weight: bold; font-size: 1.1rem; }
    .result-cost    { color: #f4c060; }
    .result-fusions { color: #aaa; font-size: 0.85rem; }
    .result-owned   { color: #88cc88; font-size: 0.85rem; }
    .tier-badge     { font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; }
    .tier-available_now { background: #1a5c1a; color: #7dff7d; }
    .tier-soon          { background: #5c4e1a; color: #ffe77d; }
    .tier-later_game    { background: #5c1a1a; color: #ff9d9d; }
    .ah-warning  { background: #3a2800; border: 1px solid #7a5a00; border-radius: 4px; padding: 6px 10px; margin-bottom: 8px; font-size: 0.85rem; }
    .blocker-list { list-style: none; margin: 0 0 8px; padding: 0; }
    .blocker-item { color: #ffaaaa; font-size: 0.82rem; padding: 2px 0; }
    .failure-panel { border-color: #7a2a2a; }
    .failure-list  { list-style: none; margin: 0; padding: 0; }
    .failure-item  { padding: 4px 0; font-size: 0.88rem; }
    .best-effort-banner { background: #2a2000; border: 1px solid #665500; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; font-size: 0.88rem; color: #ffdd88; }
    .fusion-chain { margin-top: 8px; }
    .fusion-node  { margin-bottom: 4px; }
    .node-header  { display: flex; align-items: center; gap: 8px; }
    .node-demon   { font-weight: bold; }
    .node-cost    { color: #f4c060; font-size: 0.82rem; }
    .node-leaf    { font-size: 0.78rem; color: #aaa; }
    .node-skills  { margin: 2px 0 2px 8px; display: flex; flex-wrap: wrap; gap: 4px; }
    .skill-tag    { font-size: 0.78rem; padding: 1px 6px; border-radius: 3px; background: #2a2a3a; }
    .skill-innate { background: #1a5c1a; }
    .skill-wanted { background: #1a3a5c; }
    .skill-source { font-size: 0.7rem; color: #999; margin-left: 3px; }
    .fusion-arrow { color: #666; font-size: 0.8rem; margin: 2px 0; }
    .empty-state  { color: #888; text-align: center; padding: 32px; }
    .result-count { font-size: 0.85rem; color: #888; }
  `]
})
export class SkillFusionGeneratorComponent implements OnInit, OnDestroy {

  // ── compendium state ────────────────────────────────────────────────────────
  private compendium: Compendium | null = null;
  private squareChart: SquareChart | null = null;
  private sub: Subscription = new Subscription();

  // ── target demon ───────────────────────────────────────────────────────────
  demonSearchQuery  = '';
  demonSuggestions: string[] = [];
  targetDemonName   = '';
  targetDemonRace   = '';
  targetDemonLevel  = 0;
  private allDemonNames: string[] = [];

  // ── skill selection ─────────────────────────────────────────────────────────
  cmdSearchQuery  = '';
  pasSearchQuery  = '';
  cmdSuggestions: SkillChoice[] = [];
  pasSuggestions: SkillChoice[] = [];
  selectedCmd: SkillChoice[] = [];
  selectedPas: SkillChoice[] = [];
  private allCmdSkills: SkillChoice[] = [];
  private allPasSkills: SkillChoice[] = [];

  // ── owned demons ───────────────────────────────────────────────────────────
  ownedDemonInput = '';
  ownedLevelInput = 1;
  playerState: PlayerState = { ...DEFAULT_PLAYER_STATE };
  private readonly STORAGE_KEY = 'dso-owned-demons';

  // ── solver controls ─────────────────────────────────────────────────────────
  strictMode    = false;
  rankStrategy: 'cheapest' | 'fewest_steps' | 'most_owned_used' = 'cheapest';
  isSearching   = false;

  // ── results ─────────────────────────────────────────────────────────────────
  results: RankedFusionResult[] = [];
  strictFailures: StrictFailureReason[] = [];
  hasSearched = false;
  hasPartialResults = false;

  constructor(
    @Inject(FUSION_DATA_SERVICE) private fusionDataService: FusionDataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Restore owned demons from localStorage.
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.playerState = { ...DEFAULT_PLAYER_STATE, ownedDemons: JSON.parse(stored) };
      } catch { /* ignore corrupt data */ }
    }

    // Subscribe to compendium + fusionChart observables together.
    this.sub.add(
      combineLatest([
        this.fusionDataService.compendium,
        this.fusionDataService.fusionChart,
      ]).subscribe(([comp, chart]) => {
        this.compendium = comp;
        // Wrap into SquareChart shape expected by searchFusionTree.
        this.squareChart = { normalChart: chart, tripleChart: chart } as SquareChart;
        this.allDemonNames = comp.allDemons
          .filter(d => !d.isEnemy)
          .map(d => d.name)
          .sort();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // ── Demon search ────────────────────────────────────────────────────────────

  onDemonSearch(): void {
    const q = this.demonSearchQuery.toLowerCase().trim();
    this.demonSuggestions = q.length < 1 ? [] :
      this.allDemonNames.filter(n => n.toLowerCase().includes(q)).slice(0, 10);
  }

  selectTargetDemon(name: string): void {
    this.targetDemonName  = name;
    this.demonSearchQuery = '';
    this.demonSuggestions = [];
    this.selectedCmd = [];
    this.selectedPas = [];
    this.results = [];
    this.strictFailures = [];
    this.hasSearched = false;

    if (!this.compendium) { return; }
    const demon = this.compendium.getDemon(name);
    if (!demon) { return; }
    this.targetDemonRace  = demon.race;
    this.targetDemonLevel = demon.lvl;
    this.buildSkillLists(demon);
  }

  // ── Skill lists ─────────────────────────────────────────────────────────────

  private buildSkillLists(targetDemon: any): void {
    if (!this.compendium) { return; }
    const innateSet = new Set(Object.keys(targetDemon.skills));
    const PASSIVE_ELEMS = new Set(['aut', 'pas', 'auto']);

    this.allCmdSkills = [];
    this.allPasSkills = [];

    for (const skill of this.compendium.allSkills) {
      const isPas = PASSIVE_ELEMS.has((skill.element || '').toLowerCase());
      const isInnate = innateSet.has(skill.name);
      const carriers = (skill.learnedBy || [])
        .filter(e => e.level <= 99)
        .map(e => e.demon);

      const choice: SkillChoice = { name: skill.name, isPas, isInnate, carriers };
      if (isPas) {
        this.allPasSkills.push(choice);
      } else {
        this.allCmdSkills.push(choice);
      }
    }
  }

  onCmdSkillSearch(): void {
    const q = this.cmdSearchQuery.toLowerCase().trim();
    const selected = new Set(this.selectedCmd.map(s => s.name));
    this.cmdSuggestions = q.length < 1 ? [] :
      this.allCmdSkills
        .filter(s => !selected.has(s.name) && s.name.toLowerCase().includes(q))
        .slice(0, 10);
  }

  onPasSkillSearch(): void {
    const q = this.pasSearchQuery.toLowerCase().trim();
    const selected = new Set(this.selectedPas.map(s => s.name));
    this.pasSuggestions = q.length < 1 ? [] :
      this.allPasSkills
        .filter(s => !selected.has(s.name) && s.name.toLowerCase().includes(q))
        .slice(0, 10);
  }

  addCmdSkill(s: SkillChoice): void {
    if (this.selectedCmd.length >= 3) { return; }
    this.selectedCmd.push(s);
    this.cmdSearchQuery = '';
    this.cmdSuggestions = [];
  }

  addPasSkill(s: SkillChoice): void {
    if (this.selectedPas.length >= 3) { return; }
    this.selectedPas.push(s);
    this.pasSearchQuery = '';
    this.pasSuggestions = [];
  }

  removeCmdSkill(name: string): void {
    this.selectedCmd = this.selectedCmd.filter(s => s.name !== name);
  }

  removePasSkill(name: string): void {
    this.selectedPas = this.selectedPas.filter(s => s.name !== name);
  }

  // ── Owned demons ────────────────────────────────────────────────────────────

  addOwnedDemon(): void {
    const name  = this.ownedDemonInput.trim();
    const level = Number(this.ownedLevelInput);
    if (!name || !level) { return; }
    if (this.playerState.ownedDemons.find(d => d.name === name)) { return; }
    this.playerState = {
      ...this.playerState,
      ownedDemons: [...this.playerState.ownedDemons, { name, currentLevel: level, skills: [] }],
    };
    this.ownedDemonInput = '';
    this.ownedLevelInput = 1;
    this.persistOwned();
  }

  removeOwnedDemon(name: string): void {
    this.playerState = {
      ...this.playerState,
      ownedDemons: this.playerState.ownedDemons.filter(d => d.name !== name),
    };
    this.persistOwned();
  }

  private persistOwned(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.playerState.ownedDemons));
  }

  // ── Generator ───────────────────────────────────────────────────────────────

  generate(): void {
    if (!this.compendium || !this.squareChart) { return; }
    this.isSearching    = true;
    this.results        = [];
    this.strictFailures = [];
    this.hasSearched    = true;
    this.hasPartialResults = false;

    // Kick off in a micro-task so the button state renders first.
    setTimeout(() => this.runSearch(), 0);
  }

  private runSearch(): void {
    if (!this.compendium || !this.squareChart) {
      this.isSearching = false;
      return;
    }

    const requiredSkills = [
      ...this.selectedCmd.map(s => s.name),
      ...this.selectedPas.map(s => s.name),
    ];

    const recipeConfig = (this.fusionDataService as any).recipeConfig ||
      this.buildRecipeConfig();

    const target: SkillTarget = {
      targetDemon: this.targetDemonN