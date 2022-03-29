import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccessoryType } from '../../models/accessory.model';
import { Subscription } from 'rxjs';
import { StrainzFilterModel } from './strainz-filter.model';
import { MatOptionSelectionChange } from '@angular/material/core/option/option';

@Component({
  selector: 'app-strainz-filter',
  templateUrl: './strainz-filter.component.html',
  styleUrls: ['./strainz-filter.component.scss']
})
export class StrainzFilterComponent implements OnInit, OnDestroy {
  @Input() growRateMin;
  @Input() growRateMax;
  @Input() breedingCostMax;
  @Input() breedingCostMin;
  @Input() priceMin;
  @Input() priceMax;

  @Output() filterChanged: EventEmitter<StrainzFilterModel> = new EventEmitter<StrainzFilterModel>();

  filterForm: FormGroup;

  accessoryList = [AccessoryType.Earring, AccessoryType.Sunglasses, AccessoryType.Joint];



  get accessoriesControl(): FormControl {
    return this.filterForm.get('accessories') as FormControl;
  }

  constructor(private fb: FormBuilder) {

  }


  ngOnInit(): void {
    this.filterForm = this.fb.group({
      accessories: [[null]],
      growRateRange: [[this.growRateMin, this.growRateMax]],
      breedingCostRange: [[this.breedingCostMin, this.breedingCostMax]],
      priceRange: [[this.priceMin, this.priceMax]],
    });

  }

  ngOnDestroy(): void {
  }

  changeToDontCare(event: MatOptionSelectionChange): void {
    if (event.source.selected) {
      this.accessoriesControl.setValue([null]);
    }
  }
  changeAccessory(event: MatOptionSelectionChange): void {
    if (event.source.selected && this.accessoriesControl.value.includes(null)) {
      this.accessoriesControl.setValue(this.accessoriesControl.value.filter(v => !!v));
    }
  }

  submit(): void {
      this.filterChanged.emit(this.filterForm.value);
  }


}
