import * as fs from 'fs';
import fusionsData from '../src/app/desu1/data/fusions.json';
import { NormalFusionCalculator } from '../src/app/compendium/models/normal-fusion-calculator';
import { Compendium } from '../src/app/smt4f/models/compendium';
import { FusionChart } from '../src/app/smt4f/models/fusion-chart';

// I will just mock it... wait no, I can't mock compendium easily.
console.log(fusionsData);
