import "@angular/compiler";
import { createCompConfig } from '../src/app/desu1/compendium.module';
import FUSION_CHART_JSON from '../src/app/desu1/data/fusion-chart.json';
import ELEMENT_CHART_JSON from '../src/app/desu1/data/element-chart.json';
import { Compendium } from '../src/app/smt4f/models/compendium';
import { DemonProfileBuilder } from '../src/app/desu1/models/demon-profile-builder';

function runTest() {
  const compConfigSet = createCompConfig();
  const compConfig = compConfigSet.configs['dso']; // Need Overclocked to see AH skills
  compConfig.normalTable = FUSION_CHART_JSON as any;
  compConfig.elementTable = ELEMENT_CHART_JSON as any;

  const compendium = new Compendium(compConfig, {
    classes: {},
    chartNormal: {},
    chartTriple: {},
    races: []
  });

  const builder = new DemonProfileBuilder(compendium);

  // Test against Agares, who has AH exclusive skills (Mazandyne, Force Amp, Fire Amp)
  const profile = builder.buildProfile('Agares');

  console.log('--- TEST: Demon Profile Builder (Agares) ---');
  console.log(JSON.stringify(profile, null, 2));

  // Validation
  const hasAHSkills = profile?.innateCmd.includes('Mazandyne') || 
                      profile?.innatePas.includes('Force Amp') || 
                      profile?.innatePas.includes('Fire Amp');

  if (hasAHSkills) {
    console.error('❌ FAIL: Auction House exclusive skills leaked into the innate profile!');
  } else {
    console.log('✅ PASS: Auction House exclusive skills were successfully excluded from innate slots.');
  }
}

runTest();
