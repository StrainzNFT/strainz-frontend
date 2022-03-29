import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata, StrainzModel } from '../../models/strain.model';
import { ExtendedVaultModel } from '../../models/vault.model';
import { WeedService } from '../../services/weed.service';
import { AccessoryModel } from '../../models/accessory.model';
import { combineLatest, from, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-attach-accessory-dialog',
  templateUrl: './attach-accessory-dialog.component.html',
  styleUrls: ['./attach-accessory-dialog.component.scss']
})
export class AttachAccessoryDialogComponent implements OnInit {
  myPlants$: Observable<StrainzModel[]>;
  partner: StrainzModel = null;
  attaching = false;

  partnerCtrl = new FormControl();
  filteredPlants: Observable<StrainzModel[]>;
  constructor(@Inject(MAT_DIALOG_DATA) public accessory: AccessoryModel,
              private weedService: WeedService, private dialogRef: MatDialogRef<AttachAccessoryDialogComponent>) { }

  ngOnInit(): void {
    this.myPlants$ = this.weedService.getMyPlants();
    this.filteredPlants = combineLatest(this.myPlants$, this.partnerCtrl.valueChanges.pipe(startWith(''))).pipe(
      map(merged => {
        const plants: StrainzModel[] = merged[0];
        const value: string = merged[1];
        if (typeof value !== 'string') {
          return [value];
        }
        return plants.filter(plant => (plant.prefix + plant.postfix).toLowerCase().includes(value.toLowerCase()))
          .filter(plant => !plant.accessories.includes(this.accessory.type));
      })
    );
  }

  displayFn(strain: StrainMetadata | string): string {
    if (!strain) {
      return '';
    }
    if (typeof  strain === 'string') {
      return strain;
    }

    return `${strain.prefix} ${strain.postfix}`;
  }

  get partnerSelected(): boolean {
    return this.partner &&  typeof this.partner !== 'string';
  }

  async attach(): Promise<void> {
    this.attaching = true;
    try {
      await this.weedService.attachAccessory(this.accessory, this.partner);
      this.dialogRef.close();

    } catch {

    }

    this.attaching = false;
  }

}
