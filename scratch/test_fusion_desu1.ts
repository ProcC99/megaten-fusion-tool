import * as fs from 'fs';
import fusionsData from '../src/app/desu1/data/fusions.json';

// In Devil Survivor, Fairy + Femme = ?
const chart = fusionsData;
console.log("Fairy + Femme =", chart['Fairy']?.['Femme'] || chart['Femme']?.['Fairy']);
