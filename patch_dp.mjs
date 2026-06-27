import fs from 'fs';

let content = fs.readFileSync('src/app/desu1/models/fusion-dp-solver.ts', 'utf8');

// 1. Add ownedCount and ownedMask to DPState
content = content.replace(
  '  summonCount: number;\n  isOwned?: boolean;',
  '  summonCount: number;\n  ownedCount: number;\n  ownedMask: number;\n  isOwned?: boolean;'
);

// 2. Change criteria param type
content = content.replace(
  "criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'min_summons' = 'min_level',",
  "criteria: 'min_level' | 'min_fusions' | 'min_ah' | 'max_owned' = 'min_level',"
);

// 3. Update pushState tie-breakers
content = content.replace(
  "        if (criteria === 'min_level' && existing.maxLevel <= state.maxLevel) return;\n        if (criteria === 'min_fusions' && existing.cost <= state.cost) return;\n        if (criteria === 'min_ah' && existing.ahCount <= state.ahCount) return;\n        if (criteria === 'min_summons' && existing.summonCount <= state.summonCount) return;",
  `        if (criteria === 'min_level') {
          if (existing.maxLevel < state.maxLevel) return;
          if (existing.maxLevel === state.maxLevel && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'min_fusions') {
          if (existing.cost < state.cost) return;
          if (existing.cost === state.cost && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'min_ah') {
          if (existing.ahCount < state.ahCount) return;
          if (existing.ahCount === state.ahCount && existing.maccaCost <= state.maccaCost) return;
        } else if (criteria === 'max_owned') {
          if (existing.ownedCount > state.ownedCount) return;
          if (existing.ownedCount === state.ownedCount && existing.maccaCost <= state.maccaCost) return;
        }`
);

// 4. Base state empty demons initialization
content = content.replace(
  "pushState({ demon: dName, skills: [], maxLevel: this.getDemonLevel(dName), cost: 0, ahCount: 0, maccaCost: this.getDemonPrice(dName), summonCount: 1, recipe: null });",
  "pushState({ demon: dName, skills: [], maxLevel: this.getDemonLevel(dName), cost: 0, ahCount: 0, maccaCost: this.getDemonPrice(dName), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });"
);

// 5. Base state holders initialization (single skill)
content = content.replace(
  "pushState({ demon: h.name, skills: [sk], maxLevel: h.reqLevel, cost: 0, ahCount: ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, recipe: null });",
  "pushState({ demon: h.name, skills: [sk], maxLevel: h.reqLevel, cost: 0, ahCount: ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });"
);

// 6. Base state multi-skill initialization
content = content.replace(
  "pushState({ demon: h.name, skills: multiSkills, maxLevel: h.reqLevel, cost: 0, ahCount: m_ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, recipe: null });",
  "pushState({ demon: h.name, skills: multiSkills, maxLevel: h.reqLevel, cost: 0, ahCount: m_ahc, maccaCost: this.getDemonPrice(h.name), summonCount: 1, ownedCount: 0, ownedMask: 0, recipe: null });"
);

// 7. Custom Owned Demons initialization
const ownedOld = `
    // Custom Owned Demons (cost 0, ahCount 0, maccaCost 0, summonCount 0)
    for (const owned of ownedDemons) {
      const relevantSkills = owned.skills.filter(s => skillList.includes(s));
      if (relevantSkills.length > 0) {
        pushState({
          demon: owned.name,
          skills: relevantSkills,
          maxLevel: this.getDemonLevel(owned.name),
          cost: 0,
          ahCount: 0,
          maccaCost: 0,
          summonCount: 0,
          isOwned: true,
          recipe: null
        });
      }
    }
`;
const ownedNew = `
    // Custom Owned Demons
    for (let i = 0; i < ownedDemons.length; i++) {
      const owned = ownedDemons[i];
      const relevantSkills = owned.skills.filter(s => skillList.includes(s));
      pushState({
        demon: owned.name,
        skills: relevantSkills,
        maxLevel: this.getDemonLevel(owned.name),
        cost: 0,
        ahCount: 0,
        maccaCost: 0,
        summonCount: 0,
        ownedCount: 1,
        ownedMask: 1 << i,
        isOwned: true,
        recipe: null
      });
    }
`;
content = content.replace(ownedOld.trim(), ownedNew.trim());

// 8. sortPQ logic
const sortOld = `
    const sortPQ = () => {
      if (criteria === 'min_level') {
        pq.sort((a, b) => (a.maxLevel - b.maxLevel) || (a.cost - b.cost));
      } else if (criteria === 'min_fusions') {
        pq.sort((a, b) => (a.cost - b.cost) || (a.maxLevel - b.maxLevel));
      } else if (criteria === 'min_ah') {
        pq.sort((a, b) => (a.ahCount - b.ahCount) || (a.cost - b.cost) || (a.maxLevel - b.maxLevel));
      } else if (criteria === 'min_summons') {
        pq.sort((a, b) => (a.summonCount - b.summonCount) || (a.maxLevel - b.maxLevel));
      }
    };
`;
const sortNew = `
    const sortPQ = () => {
      if (criteria === 'min_level') {
        pq.sort((a, b) => (a.maxLevel - b.maxLevel) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      } else if (criteria === 'min_fusions') {
        pq.sort((a, b) => (a.cost - b.cost) || (a.maccaCost - b.maccaCost) || (a.maxLevel - b.maxLevel));
      } else if (criteria === 'min_ah') {
        pq.sort((a, b) => (a.ahCount - b.ahCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      } else if (criteria === 'max_owned') {
        pq.sort((a, b) => (b.ownedCount - a.ownedCount) || (a.maccaCost - b.maccaCost) || (a.cost - b.cost));
      }
    };
`;
content = content.replace(sortOld.trim(), sortNew.trim());

// 9. Strict prune condition inside loop
content = content.replace(
  "      if (criteria === 'min_summons' && bestCurrent.summonCount < current.summonCount) continue;",
  "      if (criteria === 'max_owned' && bestCurrent.ownedCount > current.ownedCount) continue;"
);

// 10. Merge loop constraints for overlapping owned demons
content = content.replace(
  "            const mergedSkills = Array.from(new Set([...current.skills, ...bState.skills])).sort();\n            if (mergedSkills.length === 0) continue;",
  "            if (current.ownedMask !== 0 && bState.ownedMask !== 0 && (current.ownedMask & bState.ownedMask) !== 0) continue;\n            const mergedSkills = Array.from(new Set([...current.skills, ...bState.skills])).sort();\n            if (mergedSkills.length === 0) continue;"
);

// 11. New State Creation
const newStateOld = `
            const newState: DPState = {
              demon: resultDemon,
              skills: mergedSkills,
              maxLevel: newMaxLevel,
              cost: newCost,
              ahCount: newAhCount,
              maccaCost: newMaccaCost,
              summonCount: newSummonCount,
              recipe: {
                name1: current.demon, skills1: current.skills,
                name2: bState.demon,  skills2: bState.skills
              }
            };
`;
const newStateNew = `
            const newState: DPState = {
              demon: resultDemon,
              skills: mergedSkills,
              maxLevel: newMaxLevel,
              cost: newCost,
              ahCount: newAhCount,
              maccaCost: newMaccaCost,
              summonCount: newSummonCount,
              ownedCount: current.ownedCount + bState.ownedCount,
              ownedMask: current.ownedMask | bState.ownedMask,
              recipe: {
                name1: current.demon, skills1: current.skills,
                name2: bState.demon,  skills2: bState.skills
              }
            };
`;
content = content.replace(newStateOld.trim(), newStateNew.trim());

fs.writeFileSync('src/app/desu1/models/fusion-dp-solver.ts', content);
