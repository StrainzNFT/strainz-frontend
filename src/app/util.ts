import { AccessoryType } from './models/accessory.model';

export function setCharAt(str: string, index: number, chr: string): string {
  if (index > str.length - 1){
    return str;
  }
  return str.substring(0, index) + chr + str.substring(index + 1);
}


export function mapDNA(dna: string, accessories: AccessoryType[]): string {
  dna = setCharAt(dna, 6, accessories?.includes(AccessoryType.Earring) ? '1' : '0');
  dna = setCharAt(dna, 5, accessories?.includes(AccessoryType.Sunglasses) ? '1' : '0');
  dna = setCharAt(dna, 4, accessories?.includes(AccessoryType.Joint) ? '1' : '0');
  return dna;
}


export const boostValues = [
  17, 25, 37
];

export function hexToRgb(hex): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}
