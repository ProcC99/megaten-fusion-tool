import { Compendium } from '../../smt4f/models/compendium';
import { isAHExclusiveSkill } from './fusion-tree-types';

export interface DemonProfile {
  name: string;
  race: string;
  lvl: number;
  stats: number[];
  innateCmd: { name: string, lvl: number }[];
  innatePas: { name: string, lvl: number }[];
  innateRac: string;
  freeCmdCount: number;
  freePasCount: number;
}

export class DemonProfileBuilder {
  constructor(private compendium: Compendium) {}

  public buildProfile(demonName: string): DemonProfile | null {
    const demonObj = this.compendium.getDemon(demonName);
    if (!demonObj) return null;

    const innateCmd: { name: string, lvl: number }[] = [];
    const innatePas: { name: string, lvl: number }[] = [];
    let innateRac = '';

    const skills = demonObj.skills;
    for (const skName of Object.keys(skills)) {
      const skLevel = skills[skName];
      
      // Filter out Auction House exclusive skills
      if (isAHExclusiveSkill(skLevel)) {
        continue;
      }

      const skObj = this.compendium.getSkill(skName);
      if (!skObj) continue;

      // Filter out auto skills
      if (skObj.element === 'aut' || skObj.element === 'auto') continue;

      if (skObj.element === 'rac') {
        innateRac = skName;
      } else if (skObj.element === 'pas') {
        innatePas.push({ name: skName, lvl: skLevel });
      } else {
        innateCmd.push({ name: skName, lvl: skLevel });
      }
    }

    const freeCmdCount = Math.max(0, 3 - innateCmd.length);
    const freePasCount = Math.max(0, 3 - innatePas.length);

    return {
      name: demonObj.name,
      race: demonObj.race,
      lvl: demonObj.lvl,
      stats: demonObj.stats,
      innateCmd,
      innatePas,
      innateRac,
      freeCmdCount,
      freePasCount
    };
  }
}
