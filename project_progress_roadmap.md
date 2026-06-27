# Project Progress & Roadmap

## 1. What We Have Accomplished

### The Core Problem
The web app's generic fusion logic failed to handle the specific complexities of *Shin Megami Tensei: Devil Survivor*. Skill inheritance isn't just about combining two demons; it involves tracking:
- **Natural Holders**: Demons that learn a skill natively.
- **Skill Types**: Command vs Passive vs Racial skills (and avoiding the nonexistent "Auto" slot on demons).
- **Auction House Tiers**: Tracking which skills are locked behind Platinum/Occult auction demons.

### Algorithmic Breakthroughs
To solve this without brute-forcing and freezing the UI, we built specialized offline scripts:
1. **Demon Profiler (`demon_info.ts`)**: Accurately extracts a demon's stats, affinities, open skill slots, and explicitly separates innate vs learned skills.
2. **Suitability Ranking (`suitability.ts`)**: Ranks potential fusion ingredients by prioritizing Natural Holders, then evaluating Player Level and Auction House constraints.
3. **Multi-Skill Dijkstra DP (`test_fusion_multi.ts`)**: Our crowning achievement. Instead of a naive BFS, we built a Dynamic Programming algorithm that:
   - Treats a fusion state as a unique key: `DemonName|SkillSubset`.
   - Merges skill subsets optimally (e.g., combining a demon holding `Skill A` with a demon holding `Skill B` to create a new demon holding `[Skill A, Skill B]`).
   - Discovers the shortest possible path (lowest Maximum Level constraint) to reach a target demon with *all* requested skills.
4. **Mermaid Topology Trees**: Added logic to explicitly trace the DP solution back to its roots, assigning unique Node IDs to prevent instance reuse, and generating a highly readable visual tree.

### Data Validation Discoveries
Through rigorous testing, we discovered a major data contamination issue:
- The `ove-demon-data.json` file (intended for *Devil Survivor Overclocked*) contains demons that strictly belong to *Devil Survivor 2* (e.g., `Ishtar`, `Laksmi`, `Shiva`).

---

## 2. The Plan Moving Forward

We are now transitioning from **Algorithm Design** to **UI Integration & Data Cleanup**.

### Phase 1: Data Integrity Cleanup
- **Audit & Purge**: We will audit `ove-demon-data.json` and remove any erroneous demons that were imported from DeSu 2.
- This ensures that our fusion algorithm never outputs a demon you cannot actually acquire in the game.

### Phase 2: UI Integration
- **Port DP Logic**: We will migrate the `solveMultiSkillFusion` logic directly into the Angular component: `skill-fusion-generator.component.ts`.
- **Dynamic Context (The Toggle)**: By embedding the algorithm within the Angular component, it will query `this.compendium`. The app's router already natively populates this with either Vanilla or Overclocked data based on your URL toggle. This immediately solves the game-separation requirement.

### Phase 3: UI Output Formatting
- **Replace Broken Code**: Rip out the old `this.fusionService.findFusions()` logic that was freezing the browser.
- **Render Results**: Translate our markdown/Mermaid visualizer into clean HTML/CSS outputs within the web app so the user can visually track the ingredient flow, step-by-step.
