import { BehaviorSubject, Observable } from 'rxjs';
import Timeout = NodeJS.Timeout;
import { AccessoryType } from './accessory.model';

export interface StrainMetadata {
  id: string;
  prefix: string;
  postfix: string;
  dna: string;
  generation: string;
  growRate: string;
  lastHarvest: string;
  breedingCost: number;
  accessories?: AccessoryType[];
  lastFertilizer: number;
}

export interface StrainMetadataExtended extends StrainzModel {
  harvestableAmount: BehaviorSubject<number>;
  wateringCost: BehaviorSubject<number>;
  currentGrowRate: BehaviorSubject<number>;
  interval?: Timeout;
}
export interface StrainzModel {
  _id: number;
  owner: string;
  prefix: string;
  postfix: string;
  dna: string;
  generation: number;
  growRate: number;
  lastHarvest: number;
  breedingCost: number;
  lastFertilizer: number;
  accessories: AccessoryType[];
}
