export interface StrainzFilterModel {
  accessories?: number[];
  growRateRange: number[];
  breedingCostRange: number[];
  priceRange: number[];
}

export enum StrainzSortProperty {
  BreedingCost, GrowRate, Price, Roi
}

export enum StrainzSortDirection {
  Ascending = 'ascending', Descending = 'descending'
}

export interface StrainzSortModel {
  sortBy: StrainzSortProperty;
  direction: StrainzSortDirection;
}

