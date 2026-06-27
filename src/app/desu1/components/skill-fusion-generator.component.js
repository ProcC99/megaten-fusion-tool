"use strict";
/**
 * skill-fusion-generator.component.ts
 * -----------------------------------------------------------------
 * Target-first fusion recipe generator for Devil Survivor Overclocked.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillFusionGeneratorComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var fusion_tree_types_1 = require("../models/fusion-tree-types");
var fusion_tree_search_1 = require("../models/fusion-tree-search");
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
var SkillFusionGeneratorComponent = exports.SkillFusionGeneratorComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-skill-fusion-generator',
            template: "\n<div class=\"skill-fusion-generator\">\n\n  <h2 class=\"section-title\">DSO Skill Fusion Recipe Generator</h2>\n\n  <!-- 1. Target demon -->\n  <section class=\"panel target-panel\">\n    <h3>1. Target Demon</h3>\n    <input type=\"text\" placeholder=\"Search demon\u2026\" [(ngModel)]=\"demonSearchQuery\"\n      (input)=\"onDemonSearch()\" class=\"demon-search-input\" />\n    <ul class=\"demon-suggestions\" *ngIf=\"demonSuggestions.length > 0\">\n      <li *ngFor=\"let d of demonSuggestions\" (click)=\"selectTargetDemon(d)\" class=\"suggestion-item\">{{ d }}</li>\n    </ul>\n    <div class=\"selected-demon\" *ngIf=\"targetDemonName\">\n      <strong>{{ targetDemonName }}</strong>\n      <span class=\"demon-meta\">{{ targetDemonRace }} \u00B7 Lv {{ targetDemonLevel }}</span>\n    </div>\n  </section>\n\n  <!-- 2. Skill selector -->\n  <section class=\"panel skills-panel\" *ngIf=\"targetDemonName\">\n    <h3>2. Desired Skills</h3>\n    <p class=\"hint\">Up to 3 CMD and 3 PAS. <span class=\"badge badge-innate\">INNATE</span> = already on target (no slot cost).</p>\n    <div class=\"skill-columns\">\n\n      <div class=\"skill-column\">\n        <h4>CMD <span class=\"slot-counter\">({{ selectedCmd.length }}/3)</span></h4>\n        <input type=\"text\" placeholder=\"Search CMD\u2026\" [(ngModel)]=\"cmdSearchQuery\"\n          (input)=\"onCmdSkillSearch()\" [disabled]=\"selectedCmd.length >= 3\" class=\"skill-search-input\" />\n        <ul class=\"skill-suggestions\" *ngIf=\"cmdSuggestions.length > 0\">\n          <li *ngFor=\"let s of cmdSuggestions\" (click)=\"addCmdSkill(s)\" class=\"suggestion-item\">\n            {{ s.name }} <span *ngIf=\"s.isInnate\" class=\"badge badge-innate\">INNATE</span>\n          </li>\n        </ul>\n        <ul class=\"selected-skills\">\n          <li *ngFor=\"let s of selectedCmd\" class=\"skill-row\">\n            <span class=\"skill-name\">{{ s.name }}</span>\n            <span *ngIf=\"s.isInnate\" class=\"badge badge-innate\">INNATE</span>\n            <span class=\"carriers\" *ngIf=\"s.carriers.length\">\n              via: {{ s.carriers.slice(0,3).join(', ') }}<span *ngIf=\"s.carriers.length > 3\"> +{{ s.carriers.length - 3 }} more</span>\n            </span>\n            <button class=\"btn-remove\" (click)=\"removeCmdSkill(s.name)\">\u2715</button>\n          </li>\n        </ul>\n      </div>\n\n      <div class=\"skill-column\">\n        <h4>PAS <span class=\"slot-counter\">({{ selectedPas.length }}/3)</span></h4>\n        <input type=\"text\" placeholder=\"Search PAS\u2026\" [(ngModel)]=\"pasSearchQuery\"\n          (input)=\"onPasSkillSearch()\" [disabled]=\"selectedPas.length >= 3\" class=\"skill-search-input\" />\n        <ul class=\"skill-suggestions\" *ngIf=\"pasSuggestions.length > 0\">\n          <li *ngFor=\"let s of pasSuggestions\" (click)=\"addPasSkill(s)\" class=\"suggestion-item\">\n            {{ s.name }} <span *ngIf=\"s.isInnate\" class=\"badge badge-innate\">INNATE</span>\n          </li>\n        </ul>\n        <ul class=\"selected-skills\">\n          <li *ngFor=\"let s of selectedPas\" class=\"skill-row\">\n            <span class=\"skill-name\">{{ s.name }}</span>\n            <span *ngIf=\"s.isInnate\" class=\"badge badge-innate\">INNATE</span>\n            <span class=\"carriers\" *ngIf=\"s.carriers.length\">\n              via: {{ s.carriers.slice(0,3).join(', ') }}<span *ngIf=\"s.carriers.length > 3\"> +{{ s.carriers.length - 3 }} more</span>\n            </span>\n            <button class=\"btn-remove\" (click)=\"removePasSkill(s.name)\">\u2715</button>\n          </li>\n        </ul>\n      </div>\n\n    </div>\n  </section>\n\n  <!-- 3. Player Settings -->\n  <section class=\"panel settings-panel\" *ngIf=\"targetDemonName\">\n    <h3>3. Player Settings</h3>\n    <div class=\"settings-row\">\n      <label class=\"setting-label\">\n        Player Level:\n        <input type=\"number\" [(ngModel)]=\"playerState.maxLevel\" min=\"1\" max=\"99\" class=\"setting-input\" />\n      </label>\n      <label class=\"setting-label\">\n        In-game Day:\n        <input type=\"number\" [(ngModel)]=\"playerState.currentDay\" min=\"1\" max=\"8\" class=\"setting-input\" />\n      </label>\n    </div>\n  </section>\n\n  <!-- 4. Owned demons -->\n  <section class=\"panel owned-panel\" *ngIf=\"targetDemonName\">\n    <h3>4. Owned Demons <span class=\"hint\">(optional \u2014 biases solver toward shorter chains)</span></h3>\n    <div class=\"owned-input-row\">\n      <input type=\"text\" placeholder=\"Demon name\" [(ngModel)]=\"ownedDemonInput\" class=\"owned-demon-input\" />\n      <input type=\"number\" placeholder=\"Lv\" [(ngModel)]=\"ownedLevelInput\" min=\"1\" max=\"99\" class=\"owned-level-input\" />\n      <button class=\"btn-add\" (click)=\"addOwnedDemon()\">Add</button>\n    </div>\n    <ul class=\"owned-list\">\n      <li *ngFor=\"let d of playerState.ownedDemons\" class=\"owned-item\">\n        {{ d.name }} Lv {{ d.currentLevel }}\n        <button class=\"btn-remove\" (click)=\"removeOwnedDemon(d.name)\">\u2715</button>\n      </li>\n    </ul>\n  </section>\n\n  <!-- 5. Controls -->\n  <section class=\"panel controls-panel\" *ngIf=\"targetDemonName\">\n    <h3>5. Generate</h3>\n    <div class=\"controls-row\">\n      <label class=\"toggle-label\">\n        <input type=\"checkbox\" [(ngModel)]=\"strictMode\" />\n        Strict mode <span class=\"hint\">(only show fully-satisfiable chains)</span>\n      </label>\n      <label class=\"rank-label\">\n        Sort by:\n        <select [(ngModel)]=\"rankStrategy\">\n          <option value=\"cheapest\">Cheapest</option>\n          <option value=\"fewest_steps\">Fewest fusions</option>\n          <option value=\"most_owned_used\">Most owned used</option>\n        </select>\n      </label>\n      <button class=\"btn-generate\"\n        (click)=\"generate()\"\n        [disabled]=\"isSearching || (selectedCmd.length + selectedPas.length) === 0\">\n        {{ isSearching ? 'Searching\u2026' : 'Generate Recipe' }}\n      </button>\n    </div>\n  </section>\n\n  <!-- Strict failure panel -->\n  <section class=\"panel failure-panel\" *ngIf=\"strictMode && strictFailures.length > 0\">\n    <h3>\u26A0 No complete chain found</h3>\n    <ul class=\"failure-list\">\n      <li *ngFor=\"let f of strictFailures\" class=\"failure-item\">\n        <strong>{{ f.skill }}</strong>: {{ f.reason }}\n      </li>\n    </ul>\n  </section>\n\n  <!-- Results -->\n  <section class=\"panel results-panel\" *ngIf=\"results.length > 0\">\n    <h3>Results <span class=\"result-count\">({{ results.length }})</span></h3>\n    <div *ngIf=\"!strictMode && hasPartialResults\" class=\"best-effort-banner\">\n      \u26A1 Best Effort \u2014 some skills could not be fully covered. Missing skills are flagged below.\n    </div>\n    <div *ngFor=\"let r of results\" class=\"result-card\"\n      [class.tier-available]=\"r.reachabilityTier === 'available_now'\"\n      [class.tier-soon]=\"r.reachabilityTier === 'soon'\"\n      [class.tier-later]=\"r.reachabilityTier === 'later_game'\">\n      <div class=\"result-header\">\n        <span class=\"result-rank\">#{{ r.rank }}</span>\n        <span class=\"result-cost\">{{ r.totalCost | number }} Macca</span>\n        <span class=\"result-fusions\">{{ r.totalFusions }} fusion{{ r.totalFusions === 1 ? '' : 's' }}</span>\n        <span class=\"result-owned\" *ngIf=\"r.ownedLeafCount > 0\">\uD83D\uDDC2 {{ r.ownedLeafCount }} owned</span>\n        <span class=\"tier-badge tier-{{ r.reachabilityTier }}\">\n          {{ r.reachabilityTier === 'available_now' ? '\u2713 Available' : r.reachabilityTier === 'soon' ? '\u23F3 Soon' : '\uD83D\uDD12 Later' }}\n        </span>\n      </div>\n      <div class=\"ah-warning\" *ngIf=\"r.ahOnlySkills.length > 0\">\n        <strong>AH purchase required:</strong>\n        <span *ngFor=\"let s of r.ahOnlySkills\"> {{ s.skillName }} ({{ s.onDemon }})</span>\n      </div>\n      <ul class=\"blocker-list\" *ngIf=\"r.blockers.length > 0\">\n        <li *ngFor=\"let b of r.blockers\" class=\"blocker-item\">\u26A0 {{ b.detail }}</li>\n      </ul>\n      <div class=\"fusion-chain\">\n        <ng-container *ngTemplateOutlet=\"fusionNode; context: { $implicit: r.root, depth: 0 }\"></ng-container>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"panel empty-state\" *ngIf=\"hasSearched && !isSearching && results.length === 0 && strictFailures.length === 0\">\n    <p>No fusion paths found. Try relaxing skill requirements or switching to Best Effort mode.</p>\n  </section>\n\n</div>\n\n<ng-template #fusionNode let-node let-depth=\"depth\">\n  <div class=\"fusion-node\" [style.marginLeft.px]=\"depth * 16\">\n    <div class=\"node-header\">\n      <span class=\"node-demon\">{{ node.demon }}</span>\n      <span class=\"node-cost\" *ngIf=\"depth > 0\">{{ node.totalCost | number }} \u00A5</span>\n      <span class=\"node-method\" *ngIf=\"!node.left && !node.right\">\n        {{ node.reachability.method.type === 'innate' ? '\uD83D\uDCE6 Owned'\n           : node.reachability.method.type === 'auction' ? '\uD83C\uDFEA AH'\n           : '\uD83D\uDD00 Fuse/Get' }}\n      </span>\n    </div>\n    <div class=\"node-skills\" *ngIf=\"node.skillsContributed.length > 0\">\n      <span *ngFor=\"let s of node.skillsContributed\" class=\"skill-tag\"\n        [class.skill-innate]=\"isInnateOnTarget(s)\">\n        {{ s }}\n        <span class=\"skill-src\">{{ getSkillSrc(s, node) }}</span>\n      </span>\n    </div>\n    <ng-container *ngIf=\"node.left || node.right\">\n      <div class=\"fusion-arrow\">\u25BC fuse</div>\n      <ng-container *ngIf=\"node.left\">\n        <ng-container *ngTemplateOutlet=\"fusionNode; context: { $implicit: node.left, depth: depth + 1 }\"></ng-container>\n      </ng-container>\n      <ng-container *ngIf=\"node.right\">\n        <ng-container *ngTemplateOutlet=\"fusionNode; context: { $implicit: node.right, depth: depth + 1 }\"></ng-container>\n      </ng-container>\n    </ng-container>\n  </div>\n</ng-template>\n  ",
            styles: ["\n    .skill-fusion-generator{max-width:900px;margin:0 auto;padding:16px;font-family:inherit}\n    .section-title{font-size:1.4rem;margin-bottom:16px}\n    .panel{background:#1a1a2e;border:1px solid #444;border-radius:6px;padding:16px;margin-bottom:16px}\n    h3{margin:0 0 12px;font-size:1rem;color:#ccc} h4{margin:0 0 8px;font-size:.9rem;color:#aaa}\n    .hint{font-size:.8rem;color:#888}\n    input[type=text],input[type=number],select{background:#111;color:#eee;border:1px solid #555;border-radius:4px;padding:6px 10px;font-size:.9rem}\n    .demon-search-input,.skill-search-input,.owned-demon-input{width:220px}\n    .owned-level-input{width:70px}\n    .demon-suggestions,.skill-suggestions{list-style:none;margin:0;padding:0;background:#222;border:1px solid #555;border-radius:4px;max-height:180px;overflow-y:auto;position:relative;z-index:10}\n    .suggestion-item{padding:6px 10px;cursor:pointer} .suggestion-item:hover{background:#333}\n    .selected-demon{margin-top:8px} .demon-meta{margin-left:8px;color:#888;font-size:.85rem}\n    .skill-columns{display:flex;gap:24px} .skill-column{flex:1;min-width:0}\n    .slot-counter{font-size:.8rem;color:#888}\n    .selected-skills{list-style:none;margin:8px 0 0;padding:0}\n    .skill-row{display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #2a2a3a;flex-wrap:wrap}\n    .skill-name{font-size:.9rem} .carriers{font-size:.75rem;color:#888;flex:1}\n    .badge{font-size:.7rem;padding:1px 5px;border-radius:3px;font-weight:bold}\n    .badge-innate{background:#1a5c1a;color:#7dff7d}\n    .btn-remove{background:transparent;border:none;color:#c55;cursor:pointer;font-size:.85rem}\n    .btn-add{background:#2255aa;color:#fff;border:none;border-radius:4px;padding:6px 14px;cursor:pointer;margin-left:6px}\n    .btn-generate{background:#3a5c20;color:#fff;border:none;border-radius:4px;padding:8px 24px;font-size:1rem;cursor:pointer;margin-left:12px}\n    .btn-generate:disabled{opacity:.5;cursor:default}\n    .controls-row{display:flex;align-items:center;flex-wrap:wrap;gap:16px}\n    .toggle-label,.rank-label{font-size:.9rem;color:#ccc}\n    .settings-row{display:flex;gap:16px;align-items:center;margin-top:8px}\n    .setting-label{font-size:.9rem;color:#ccc;display:flex;align-items:center;gap:8px}\n    .setting-input{width:60px;text-align:center}\n    .owned-input-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}\n    .owned-list{list-style:none;margin:0;padding:0}\n    .owned-item{display:flex;align-items:center;gap:8px;padding:3px 0;font-size:.88rem}\n    .result-card{border:1px solid #444;border-radius:6px;padding:12px;margin-bottom:12px}\n    .tier-available{border-color:#2a7a2a} .tier-soon{border-color:#7a6a1a} .tier-later{border-color:#7a2a2a}\n    .result-header{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:8px}\n    .result-rank{font-weight:bold;font-size:1.1rem} .result-cost{color:#f4c060}\n    .result-fusions{color:#aaa;font-size:.85rem} .result-owned{color:#88cc88;font-size:.85rem}\n    .tier-badge{font-size:.8rem;padding:2px 8px;border-radius:4px}\n    .tier-available_now{background:#1a5c1a;color:#7dff7d}\n    .tier-soon{background:#5c4e1a;color:#ffe77d}\n    .tier-later_game{background:#5c1a1a;color:#ff9d9d}\n    .ah-warning{background:#3a2800;border:1px solid #7a5a00;border-radius:4px;padding:6px 10px;margin-bottom:8px;font-size:.85rem}\n    .blocker-list{list-style:none;margin:0 0 8px;padding:0}\n    .blocker-item{color:#ffaaaa;font-size:.82rem;padding:2px 0}\n    .failure-panel{border-color:#7a2a2a} .failure-list{list-style:none;margin:0;padding:0}\n    .failure-item{padding:4px 0;font-size:.88rem}\n    .best-effort-banner{background:#2a2000;border:1px solid #665500;border-radius:4px;padding:8px 12px;margin-bottom:12px;font-size:.88rem;color:#ffdd88}\n    .fusion-chain{margin-top:8px} .fusion-node{margin-bottom:4px}\n    .node-header{display:flex;align-items:center;gap:8px}\n    .node-demon{font-weight:bold} .node-cost{color:#f4c060;font-size:.82rem} .node-method{font-size:.78rem;color:#aaa}\n    .node-skills{margin:2px 0 2px 8px;display:flex;flex-wrap:wrap;gap:4px}\n    .skill-tag{font-size:.78rem;padding:1px 6px;border-radius:3px;background:#2a2a3a}\n    .skill-innate{background:#1a5c1a} .skill-src{font-size:.7rem;color:#999;margin-left:3px}\n    .fusion-arrow{color:#666;font-size:.8rem;margin:2px 0}\n    .empty-state{color:#888;text-align:center;padding:32px} .result-count{font-size:.85rem;color:#888}\n  "]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SkillFusionGeneratorComponent = _classThis = /** @class */ (function () {
        function SkillFusionGeneratorComponent_1(fusionDataService, route) {
            this.fusionDataService = fusionDataService;
            this.route = route;
            // compendium
            this.compendium = null;
            this.squareChart = null;
            this.sub = new rxjs_1.Subscription();
            // target demon
            this.demonSearchQuery = '';
            this.demonSuggestions = [];
            this.targetDemonName = '';
            this.targetDemonRace = '';
            this.targetDemonLevel = 0;
            this.allDemonNames = [];
            this.targetInnateSet = new Set();
            // skill selection
            this.cmdSearchQuery = '';
            this.pasSearchQuery = '';
            this.cmdSuggestions = [];
            this.pasSuggestions = [];
            this.selectedCmd = [];
            this.selectedPas = [];
            this.allCmdSkills = [];
            this.allPasSkills = [];
            // owned demons
            this.ownedDemonInput = '';
            this.ownedLevelInput = 1;
            this.playerState = __assign({}, fusion_tree_types_1.DEFAULT_PLAYER_STATE);
            this.STORAGE_KEY = 'dso-owned-demons';
            // controls
            this.strictMode = false;
            this.rankStrategy = 'cheapest';
            this.isSearching = false;
            // results
            this.results = [];
            this.strictFailures = [];
            this.hasSearched = false;
            this.hasPartialResults = false;
            // ---- skill lists ----
            this.PASSIVE_ELEMS = new Set(['aut', 'pas', 'auto']);
        }
        SkillFusionGeneratorComponent_1.prototype.ngOnInit = function () {
            var _this = this;
            var stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                try {
                    this.playerState = __assign(__assign({}, fusion_tree_types_1.DEFAULT_PLAYER_STATE), { ownedDemons: JSON.parse(stored) });
                }
                catch ( /* ignore */_a) { /* ignore */ }
            }
            this.sub.add((0, rxjs_1.combineLatest)([
                this.fusionDataService.compendium,
                this.fusionDataService.fusionChart,
            ]).subscribe(function (_a) {
                var comp = _a[0], chart = _a[1];
                _this.compendium = comp;
                _this.squareChart = { normalChart: chart, tripleChart: chart };
                _this.allDemonNames = comp.allDemons
                    .filter(function (d) { return !d.isEnemy; })
                    .map(function (d) { return d.name; })
                    .sort();
            }));
        };
        SkillFusionGeneratorComponent_1.prototype.ngOnDestroy = function () { this.sub.unsubscribe(); };
        // ---- demon search ----
        SkillFusionGeneratorComponent_1.prototype.onDemonSearch = function () {
            var q = this.demonSearchQuery.toLowerCase().trim();
            this.demonSuggestions = q.length < 1 ? [] :
                this.allDemonNames.filter(function (n) { return n.toLowerCase().includes(q); }).slice(0, 10);
        };
        SkillFusionGeneratorComponent_1.prototype.selectTargetDemon = function (name) {
            this.targetDemonName = name;
            this.demonSearchQuery = '';
            this.demonSuggestions = [];
            this.selectedCmd = [];
            this.selectedPas = [];
            this.results = [];
            this.strictFailures = [];
            this.hasSearched = false;
            if (!this.compendium) {
                return;
            }
            var demon = this.compendium.getDemon(name);
            if (!demon) {
                return;
            }
            this.targetDemonRace = demon.race;
            this.targetDemonLevel = demon.lvl;
            this.targetInnateSet = new Set(Object.keys(demon.skills));
            this.buildSkillLists();
        };
        SkillFusionGeneratorComponent_1.prototype.buildSkillLists = function () {
            if (!this.compendium) {
                return;
            }
            this.allCmdSkills = [];
            this.allPasSkills = [];
            for (var _i = 0, _a = this.compendium.allSkills; _i < _a.length; _i++) {
                var skill = _a[_i];
                var isPas = this.PASSIVE_ELEMS.has((skill.element || '').toLowerCase());
                var isInnate = this.targetInnateSet.has(skill.name);
                var carriers = (skill.learnedBy || []).filter(function (e) { return e.level <= 99; }).map(function (e) { return e.demon; });
                var choice = { name: skill.name, isPas: isPas, isInnate: isInnate, carriers: carriers };
                isPas ? this.allPasSkills.push(choice) : this.allCmdSkills.push(choice);
            }
        };
        SkillFusionGeneratorComponent_1.prototype.onCmdSkillSearch = function () {
            var q = this.cmdSearchQuery.toLowerCase().trim();
            var sel = new Set(this.selectedCmd.map(function (s) { return s.name; }));
            this.cmdSuggestions = q.length < 1 ? [] :
                this.allCmdSkills.filter(function (s) { return !sel.has(s.name) && s.name.toLowerCase().includes(q); }).slice(0, 10);
        };
        SkillFusionGeneratorComponent_1.prototype.onPasSkillSearch = function () {
            var q = this.pasSearchQuery.toLowerCase().trim();
            var sel = new Set(this.selectedPas.map(function (s) { return s.name; }));
            this.pasSuggestions = q.length < 1 ? [] :
                this.allPasSkills.filter(function (s) { return !sel.has(s.name) && s.name.toLowerCase().includes(q); }).slice(0, 10);
        };
        SkillFusionGeneratorComponent_1.prototype.addCmdSkill = function (s) { if (this.selectedCmd.length < 3) {
            this.selectedCmd.push(s);
            this.cmdSearchQuery = '';
            this.cmdSuggestions = [];
        } };
        SkillFusionGeneratorComponent_1.prototype.addPasSkill = function (s) { if (this.selectedPas.length < 3) {
            this.selectedPas.push(s);
            this.pasSearchQuery = '';
            this.pasSuggestions = [];
        } };
        SkillFusionGeneratorComponent_1.prototype.removeCmdSkill = function (n) { this.selectedCmd = this.selectedCmd.filter(function (s) { return s.name !== n; }); };
        SkillFusionGeneratorComponent_1.prototype.removePasSkill = function (n) { this.selectedPas = this.selectedPas.filter(function (s) { return s.name !== n; }); };
        // ---- owned demons ----
        SkillFusionGeneratorComponent_1.prototype.addOwnedDemon = function () {
            var name = this.ownedDemonInput.trim();
            var level = Number(this.ownedLevelInput);
            if (!name || !level) {
                return;
            }
            if (this.playerState.ownedDemons.some(function (d) { return d.name === name; })) {
                return;
            }
            this.playerState = __assign(__assign({}, this.playerState), { ownedDemons: __spreadArray(__spreadArray([], this.playerState.ownedDemons, true), [{ name: name, currentLevel: level, skills: [] }], false) });
            this.ownedDemonInput = '';
            this.ownedLevelInput = 1;
            this.persistOwned();
        };
        SkillFusionGeneratorComponent_1.prototype.removeOwnedDemon = function (name) {
            this.playerState = __assign(__assign({}, this.playerState), { ownedDemons: this.playerState.ownedDemons.filter(function (d) { return d.name !== name; }) });
            this.persistOwned();
        };
        SkillFusionGeneratorComponent_1.prototype.persistOwned = function () {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.playerState.ownedDemons));
        };
        // ---- generator ----
        SkillFusionGeneratorComponent_1.prototype.generate = function () {
            var _this = this;
            if (!this.compendium || !this.squareChart) {
                return;
            }
            this.isSearching = true;
            this.results = [];
            this.strictFailures = [];
            this.hasSearched = true;
            this.hasPartialResults = false;
            setTimeout(function () { return _this.runSearch(); }, 0);
        };
        SkillFusionGeneratorComponent_1.prototype.runSearch = function () {
            var _a, _b, _c;
            if (!this.compendium || !this.squareChart) {
                this.isSearching = false;
                return;
            }
            var requiredSkills = __spreadArray(__spreadArray([], this.selectedCmd.map(function (s) { return s.name; }), true), this.selectedPas.map(function (s) { return s.name; }), true);
            // Build a minimal RecipeGeneratorConfig from the FusionDataService.
            var svc = this.fusionDataService;
            var recipeConfig = {
                fissionCalculator: svc.fissionCalculator,
                fusionCalculator: svc.fusionCalculator,
                triFissionCalculator: svc.triFissionCalculator || svc.fissionCalculator,
                triFusionCalculator: svc.triFusionCalculator || svc.fusionCalculator,
                races: ((_a = svc.compConfig) === null || _a === void 0 ? void 0 : _a.races) || [],
                skillElems: ((_b = svc.compConfig) === null || _b === void 0 ? void 0 : _b.skillElems) || [],
                inheritElems: ((_c = svc.compConfig) === null || _c === void 0 ? void 0 : _c.skillElems) || [],
                displayElems: {},
                restrictInherits: false,
                defaultDemon: this.targetDemonName,
            };
            var target = {
                targetDemon: this.targetDemonName,
                requiredSkills: requiredSkills,
                playerState: this.playerState,
                maxDepth: 3,
                maxResults: 20,
                rankStrategy: this.rankStrategy,
            };
            try {
                var results = (0, fusion_tree_search_1.searchFusionTree)(target, this.compendium, this.squareChart, recipeConfig);
                if (this.strictMode) {
                    // In strict mode: only chains where every skill has no blockers.
                    var strict = results.filter(function (r) {
                        return r.blockers.length === 0 && r.ahOnlySkills.every(function (s) { return s.isReachableNow; });
                    });
                    if (strict.length === 0) {
                        this.strictFailures = this.buildStrictFailures(requiredSkills, results);
                        this.results = [];
                    }
                    else {
                        this.results = strict;
                    }
                }
                else {
                    this.results = results;
                    this.hasPartialResults = results.some(function (r) { return r.blockers.length > 0; });
                }
            }
            catch (e) {
                console.error('Fusion tree search error:', e);
                this.strictFailures = [{ skill: '(search error)', reason: String(e) }];
            }
            finally {
                this.isSearching = false;
            }
        };
        SkillFusionGeneratorComponent_1.prototype.buildStrictFailures = function (requiredSkills, allResults) {
            var _this = this;
            if (!this.compendium) {
                return [];
            }
            return requiredSkills.map(function (skill) {
                // Find what went wrong for each skill across all partial results.
                var blocker = allResults
                    .flatMap(function (r) { return r.blockers; })
                    .find(function (b) { return b.detail.includes(skill); });
                var reason = (blocker === null || blocker === void 0 ? void 0 : blocker.detail) || '';
                if (!reason) {
                    var sk = _this.compendium.getSkill(skill);
                    if (!sk) {
                        reason = 'Skill not found in compendium dataset.';
                    }
                    else if (sk.learnedBy.length === 0) {
                        reason = 'No demon in the dataset can carry this skill.';
                    }
                    else if (sk.learnedBy.every(function (e) { return e.level > 99; })) {
                        reason = 'This skill is AH-exclusive on all carriers — cannot be inherited. Must purchase directly.';
                    }
                    else {
                        reason = 'No fusion path found that routes this skill to the target race. The target may not be reachable from demons that carry it, or slot caps are violated.';
                    }
                }
                return { skill: skill, reason: reason };
            });
        };
        // ---- template helpers ----
        SkillFusionGeneratorComponent_1.prototype.isInnateOnTarget = function (skillName) {
            return this.targetInnateSet.has(skillName);
        };
        SkillFusionGeneratorComponent_1.prototype.getSkillSrc = function (skillName, node) {
            var _a, _b, _c;
            var level = node ? ((_c = (_b = (_a = this.compendium) === null || _a === void 0 ? void 0 : _a.getDemon(node.demon)) === null || _b === void 0 ? void 0 : _b.skills[skillName]) !== null && _c !== void 0 ? _c : null) : null;
            if (level === null || level === undefined) {
                return '';
            }
            if (level <= 0.9) {
                return 'innate';
            }
            if (level > 99) {
                return 'AH';
            }
            return "Lv ".concat(Math.round(level));
        };
        return SkillFusionGeneratorComponent_1;
    }());
    __setFunctionName(_classThis, "SkillFusionGeneratorComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SkillFusionGeneratorComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SkillFusionGeneratorComponent = _classThis;
}();
