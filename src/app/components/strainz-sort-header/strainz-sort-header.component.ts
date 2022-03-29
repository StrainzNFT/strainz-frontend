import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StrainzSortDirection, StrainzSortModel, StrainzSortProperty } from '../strainz-filter/strainz-filter.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-strainz-sort-header',
  templateUrl: './strainz-sort-header.component.html',
  styleUrls: ['./strainz-sort-header.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('descending', style({ transform: 'rotate(0)'})),
      state('ascending', style({ transform: 'rotate(-180deg)'})),
      transition('descending => ascending', animate('200ms ease-out')),
      transition('ascending => descending', animate('200ms ease-in'))
    ])
  ]
})
export class StrainzSortHeaderComponent implements OnInit {
  StrainzSortProperty = StrainzSortProperty;
  StrainzSortDirection = StrainzSortDirection;

  sort: StrainzSortModel =  {
    sortBy: StrainzSortProperty.GrowRate,
    direction: StrainzSortDirection.Descending
  };

  @Output() sortChanged: EventEmitter<StrainzSortModel> = new EventEmitter<StrainzSortModel>();

  constructor() { }

  ngOnInit(): void {

  }

  changeDirection(): void {
    this.sort.direction = this.sort.direction === StrainzSortDirection.Ascending ? StrainzSortDirection.Descending : StrainzSortDirection.Ascending;
    this.sortChanged.emit(this.sort);
  }

  changeSortProperty(property: StrainzSortProperty): void {
    this.sort.sortBy = property;
    this.sortChanged.emit(this.sort);
  }



}
