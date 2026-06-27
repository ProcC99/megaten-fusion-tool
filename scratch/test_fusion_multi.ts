import "@angular/compiler";
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';
import { createCompConfig } from '../src/app/desu1/compendium.module';
import { decodeAHSkillTier, isAHExclusiveSkill } from '../src/app/desu1/models/fusion-tree-types';
import { SMT_NORMAL_FISSION_CALCULATOR, SMT_NORMAL_FUSION_CALCULATOR } from '../src/app/compendium/constants';

import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import * as fs from 'fs';

const compConfigSet = createCompConfig();
const compConfig = compConfigSet.configs['dso'];
compConfig.normalTable = FUSION_CHART_JSON as any;
compConfig.elementTable = ELEMENT_CHART_JSON as any;
compConfig.appCssClasses = ['ds1'];

const comp = new Compendium(compConfig as any, {});
const chart = new FusionChart(compConfig as any);

// Dijkstra-like DP to find the optimal fusion tree for (TargetDemon, RequiredSkills)

interface DPNode {
  demon: string;
  skills: string[]; // Sorted string of skills this tree provides
  maxLevel: number;
  recipe?: { name1: string; skills1: string[]; name2: string; skills2: string[] };
}

interface SuitabilityResult {
  isSuitable: boolean;
  status: 'Natural Holder' | 'Can Inherit' | 'Not Suitable';
  freeSlots: number;
}

function evaluateDemonSuitability(demonName: string, targetSkillName: string): SuitabilityResult {
  const demon = comp.getDemon(demonName);
  const targetSkill = comp.getSkill(targetSkillName);

  if (!demon || !targetSkill) return { isSuitable: false, status: 'Not Suitable', freeSlots: 0 };

  let skillType = 'Command';
  if (targetSkill.element === 'pas') skillType = 'Passive';
  else if (targetSkill.element === 'aut' || targetSkill.element === 'auto') skillType = 'Auto';
  else if (targetSkill.element === 'rac') skillType = 'Racial';

  let hasSkill = false;
  let occupiedNormal = 0;

  for (const [sname, slvl] of Object.entries(demon.skills)) {
    const sObj = comp.getSkill(sname);
    if (!sObj) continue;
    const isAH = isAHExclusiveSkill(slvl);

    if (sname === targetSkill.name && !isAH) hasSkill = true;

    let thisType = 'Command';
    if (sObj.element === 'pas') thisType = 'Passive';
    else if (sObj.element === 'aut' || sObj.element === 'auto') thisType = 'Auto';
    else if (sObj.element === 'rac') thisType = 'Racial';

    if (thisType === skillType && !isAH) occupiedNormal++;
  }

  let maxSlots = 0;
  if (skillType === 'Command') maxSlots = 3;
  if (skillType === 'Passive') maxSlots = 3;
  if (skillType === 'Auto') maxSlots = 1;

  const freeSlots = Math.max(0, maxSlots - occupiedNormal);

  if (hasSkill) return { isSuitable: true, status: 'Natural Holder', freeSlots };
  if (freeSlots > 0) return { isSuitable: true, status: 'Can Inherit', freeSlots };
  return { isSuitable: false, status: 'Not Suitable', freeSlots: 0 };
}

function solveMultiSkillFusion(targetDemonName: string, requiredSkills: string[]) {
  // Sort required skills to use as keys
  const reqSkills = [...requiredSkills].sort();
  const reqSkillsKey = reqSkills.join(',');

  // Check if target requires valid slot counts
  let reqCmd = 0;
  let reqPas = 0;
  for (const s of reqSkills) {
    const sObj = comp.getSkill(s);
    if (!sObj) return `Error: Skill ${s} not found.`;
    if (sObj.element === 'pas') reqPas++;
    else if (sObj.element === 'aut' || sObj.element === 'rac') return `Error: Cannot inherit Auto/Racial skill ${s}`;
    else reqCmd++;
  }
  if (reqCmd > 3 || reqPas > 3) return `Error: Too many skills requested (Max 3 Command, 3 Passive).`;

  // Map from `demonName|skillKey` -> DPNode
  const bestMap = new Map<string, DPNode>();
  const pq: DPNode[] = []; // We will just use an array and sort it as a PQ for simplicity

  function getKey(demon: string, skills: string[]) {
    return `${demon}|${skills.join(',')}`;
  }

  function addState(node: DPNode) {
    const key = getKey(node.demon, node.skills);
    const existing = bestMap.get(key);
    if (!existing || node.maxLevel < existing.maxLevel) {
      bestMap.set(key, node);
      pq.push(node);
      return true;
    }
    return false;
  }

  // 1. Initialize Base Cases
  for (const demon of Object.values(comp.demons)) {
    const dName = demon.name;
    const dLevel = demon.lvl;
    
    // Get all native skills (that are part of our requiredSkills)
    const nativeMatchingSkills = [];
    for (const [sname, slvl] of Object.entries(demon.skills)) {
      if (!isAHExclusiveSkill(slvl) && reqSkills.includes(sname)) {
        nativeMatchingSkills.push(sname);
      }
    }

    // Add empty skill set base case
    addState({ demon: dName, skills: [], maxLevel: dLevel });

    // Generate all subsets of nativeMatchingSkills (since a demon can provide any subset of its native skills)
    const numSubsets = 1 << nativeMatchingSkills.length;
    for (let i = 1; i < numSubsets; i++) {
      const subset = [];
      for (let j = 0; j < nativeMatchingSkills.length; j++) {
        if ((i & (1 << j)) !== 0) subset.push(nativeMatchingSkills[j]);
      }
      subset.sort();
      addState({ demon: dName, skills: subset, maxLevel: dLevel });
    }
  }

  console.log(`Initialized ${pq.length} base states.`);

  // 2. Dijkstra processing
  let iterations = 0;
  while (pq.length > 0) {
    // Pop minimum maxLevel node
    pq.sort((a, b) => a.maxLevel - b.maxLevel);
    const current = pq.shift()!;
    iterations++;

    // If we found our target, we can stop early!
    if (current.demon === targetDemonName && current.skills.length === reqSkills.length) {
      let match = true;
      for (let i = 0; i < reqSkills.length; i++) {
        if (current.skills[i] !== reqSkills[i]) match = false;
      }
      if (match) {
        console.log(`Target found in ${iterations} iterations!`);
        break; // Found optimal path!
      }
    }

    // For the current node (demon A providing skills S_A), it can fuse with any known node (demon B providing skills S_B)
    // To optimize, we use getFusions(A) and look up if B has states.
    // Actually, SMT_NORMAL_FUSION_CALCULATOR.getFusions is forward fusion: A -> what can it fuse into?
    // Wait, the chart gives us C = A x B. We can iterate over all demons B in the compendium.
    const forwardFusions = SMT_NORMAL_FUSION_CALCULATOR.getFusions(current.demon, comp as any, chart as any);
    
    for (const f of forwardFusions) {
      const resultDemon = f.name2; // f.name1 is the second ingredient, f.name2 is the result! Wait, getFusions returns { name1: ingredient2, name2: result }
      const ingredientB = f.name1; 

      // Look up all known states for ingredientB
      // Since we only care about subsets of reqSkills, there are at most 2^|reqSkills| states for B.
      const subsets = getAllSubsets(reqSkills);
      for (const subB of subsets) {
        const bKey = getKey(ingredientB, subB);
        const bState = bestMap.get(bKey);
        if (bState) {
          // We can fuse current (A) and bState (B) to get resultDemon (C)
          const mergedSkills = Array.from(new Set([...current.skills, ...bState.skills])).sort();
          const targetLvl = comp.getDemon(resultDemon).lvl;
          const newMaxLevel = Math.max(current.maxLevel, bState.maxLevel, targetLvl);

          addState({
            demon: resultDemon,
            skills: mergedSkills,
            maxLevel: newMaxLevel,
            recipe: {
              name1: current.demon, skills1: current.skills,
              name2: bState.demon, skills2: bState.skills
            }
          });
        }
      }
    }
  }

  // Generate output
  const finalKey = getKey(targetDemonName, reqSkills);
  const finalState = bestMap.get(finalKey);

  let md = `# Multi-Skill Fusion Search\n\n`;
  md += `**Target:** ${targetDemonName}\n`;
  md += `**Required Skills:** ${reqSkills.join(', ')}\n\n`;

  if (!finalState) {
    md += `❌ Could not find any valid fusion path to create ${targetDemonName} with the required skills.\n`;
    return md;
  }

  md += `✅ **SUCCESS! Optimal path found with Max Level: ${finalState.maxLevel}**\n\n`;

  // Generate Mermaid Diagram
  md += `### Visual Fusion Tree\n`;
  md += `*Each node is a distinct instance. Natural Holders are highlighted in blue. Fodder demons have no skills listed.*\n\n`;
  md += "```mermaid\n";
  md += "graph BT\n"; // Bottom-to-top or Top-to-down

  let nodeIdCount = 0;
  function traverseMermaid(stateKey: string): string {
    const state = bestMap.get(stateKey);
    if (!state) return '';

    const nodeId = `N${nodeIdCount++}`;
    let label = `${state.demon} (Lv ${comp.getDemon(state.demon).lvl})`;
    if (state.skills.length > 0) {
      label += `\\n[${state.skills.join(', ')}]`;
    }

    md += `  ${nodeId}["${label}"]\n`;

    if (state.recipe) {
      const id1 = traverseMermaid(getKey(state.recipe.name1, state.recipe.skills1));
      const id2 = traverseMermaid(getKey(state.recipe.name2, state.recipe.skills2));
      
      md += `  ${id1} --> ${nodeId}\n`;
      md += `  ${id2} --> ${nodeId}\n`;
    } else {
      if (state.skills.length > 0) {
        md += `  style ${nodeId} fill:#bbf,stroke:#333,stroke-width:2px\n`;
      }
    }

    return nodeId;
  }

  traverseMermaid(finalKey);
  md += "```\n\n";

  md += `### Detailed Fusion Sequence & Skill Transitions:\n\n`;

  // Trace back the recipe
  const steps: string[] = [];
  const visitedNodes = new Set<string>();

  function formatDemonDetail(dName: string, heldSkills: string[]) {
    const d = comp.getDemon(dName);
    if (heldSkills.length === 0) return `${dName} (Lv ${d.lvl})`;
    
    // Evaluate how it holds these skills
    const statuses = heldSkills.map(s => {
      const suit = evaluateDemonSuitability(dName, s);
      return `${s} (${suit.status})`;
    });
    
    return `${dName} (Lv ${d.lvl}) [Holds: ${statuses.join(', ')}]`;
  }

  function trace(stateKey: string) {
    if (visitedNodes.has(stateKey)) return;
    visitedNodes.add(stateKey);

    const state = bestMap.get(stateKey);
    if (!state || !state.recipe) return; // Base case (Natural Holder)

    trace(getKey(state.recipe.name1, state.recipe.skills1));
    trace(getKey(state.recipe.name2, state.recipe.skills2));

    const d1Str = formatDemonDetail(state.recipe.name1, state.recipe.skills1);
    const d2Str = formatDemonDetail(state.recipe.name2, state.recipe.skills2);
    const resultStr = formatDemonDetail(state.demon, state.skills);

    const stepDetail = `**Fuse:** ${d1Str}\n**With:** ${d2Str}\n**Result:** ${resultStr}\n`;
    steps.push(stepDetail);
  }

  trace(finalKey);

  for (let i = 0; i < steps.length; i++) {
    md += `#### Step ${i + 1}\n${steps[i]}\n`;
  }

  md += `\n### Base Ingredients (Natural Holders):\n`;
  for (const stateKey of visitedNodes) {
    const state = bestMap.get(stateKey);
    if (state && !state.recipe && state.skills.length > 0) {
      md += `- **${state.demon} (Lv ${comp.getDemon(state.demon).lvl})** naturally learns: ${state.skills.join(', ')}\n`;
    }
  }

  return md;
}

function getAllSubsets(arr: string[]): string[][] {
  const result: string[][] = [];
  const numSubsets = 1 << arr.length;
  for (let i = 0; i < numSubsets; i++) {
    const subset: string[] = [];
    for (let j = 0; j < arr.length; j++) {
      if ((i & (1 << j)) !== 0) subset.push(arr[j]);
    }
    result.push(subset);
  }
  return result;
}

const targetDemon = 'Gagyson';
const reqSkills = ['Taunt', '+Stone'];
const maxPlayerLevel = 99;
const mdLines = solveMultiSkillFusion(targetDemon, reqSkills);

const outPath = '/home/jpurple/.gemini/antigravity/brain/5ebcca8c-1d83-492d-b946-91abd0511933/scratch/fusion_multi.md';
fs.writeFileSync(outPath, mdLines);
console.log(`Multi-skill fusion written to ${outPath}`);
