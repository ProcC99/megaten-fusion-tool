import { createCompConfig } from './compendium.module';
import { Compendium } from '../smt4f/models/compendium';
import { FusionChart } from '../smt4f/models/fusion-chart';
import { FusionDPSolver } from './models/fusion-dp-solver';

import { SMT_NORMAL_FUSION_CALCULATOR } from '../compendium/constants';

describe('FusionDPSolver', () => {
  it('should find stats transfer path for Flaemis using Aquans', async () => {
    // Need to initialize the global functions that normal-fusion-calculator needs
    (window as any).isAHExclusiveSkill = (slvl: number) => false;
    (window as any).SMT_NORMAL_FUSION_CALCULATOR = SMT_NORMAL_FUSION_CALCULATOR;

    const compConfigSet = createCompConfig();
    const compConfig = compConfigSet.configs['ds1'];
    compConfig.ailmentElems = compConfig.ailmentElems || [];
    compConfig.fusionSpells = compConfig.fusionSpells || {};
    compConfig.demonUnlocks = compConfig.demonUnlocks || [];
    compConfig.evolveData = compConfig.evolveData || {};
    
    const comp = new Compendium(compConfig as any, {});
    const chart = new FusionChart(compConfig as any);
    const solver = new FusionDPSolver(comp, chart);

    const targetDemon = 'Flaemis';
    const reqSkills: string[] = [];
    
    const owned: any[] = [
        { name: 'Aquans', skills: [], isStatsTransfer: true, isOwned: true }
    ];

    const results = await solver.solveMultiSkillFusion(targetDemon, reqSkills, 99, 'stats_transfer', owned, false);
    
    expect(results).toBeTruthy();
    if (results) {
        const hasAquans = results.steps.some(s => s.fuse1.includes('Aquans') || s.fuse2.includes('Aquans') || s.result.includes('Aquans'));
        console.log(`\n================================`);
        console.log(`Fusion Recipe for ${targetDemon}`);
        console.log(`================================`);
        results.steps.forEach((step, index) => {
            console.log(`Step ${index + 1}: ${step.fuse1} + ${step.fuse2} = ${step.result}`);
        });
        console.log(`================================\n`);
        expect(hasAquans).toBe(true);
    }
  });
});
