import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata, StrainMetadataExtended, StrainzModel } from '../../models/strain.model';
import { WeedService } from '../../services/weed.service';
import {combineLatest, from, Observable} from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {ExtendedVaultModel, VaultModel} from '../../models/vault.model';
import * as config from '../../config.json';
import * as contracts from '../../contracts.json';

@Component({
  selector: 'app-breed-dialog',
  templateUrl: './breed-dialog.component.html',
  styleUrls: ['./breed-dialog.component.scss']
})
export class BreedDialogComponent implements OnInit {
  strain2: StrainzModel = null;

  myPlants$: Observable<StrainMetadataExtended[]>;
  allowedStrainzTokens$: Observable<number> = this.weedService.getAllowedStrainzTokensForBreed();

  partnerCtrl = new FormControl();
  filteredPlants: Observable<StrainMetadataExtended[]>;

  breedFertilizer = false;

  approving = false;
  breeding = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {strain1: StrainzModel, vault?: ExtendedVaultModel},
              private weedService: WeedService, private dialogRef: MatDialogRef<BreedDialogComponent>) {
  }

  ngOnInit(): void {
    this.myPlants$ = this.data.vault ? from(this.weedService.getVaultPlants(this.data.vault)) : this.weedService.getMyPlants();
    this.filteredPlants = combineLatest(this.myPlants$, this.partnerCtrl.valueChanges.pipe(startWith(''))).pipe(
      map(merged => {
        const plants: StrainMetadataExtended[] = merged[0];
        const value: string = merged[1];
        if (typeof value !== 'string') {
          return [value];
        }
        return plants.filter(plant => (plant.prefix + plant.postfix).toLowerCase().includes(value.toLowerCase()))
          .filter(plant => plant._id !== this.data.strain1._id);
      })
    );
  }

  async breed(): Promise<void> {
    this.breeding = true;
    try {
      if (this.data.vault) {
        await this.weedService.proposeBreed(this.data.strain1, this.strain2, this.data.vault);
      } else {
        await this.weedService.breedPlants(this.data.strain1, this.strain2, this.breedFertilizer && this.averageGrowRate > 128);
      }
      this.breeding = false;
      this.dialogRef.close();

    } catch (e) {
      console.error(e);
      this.breeding = false;
    }
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

  async approve(): Promise<void> {
    this.approving = true;
    try {
      await this.weedService.approveStrainzTokens(contracts.strainzNFTAddress, this.breedingCost);
    } catch (e) {
      console.error(e);
    }
    this.approving = false;
  }

  get breedingCost(): number {
    return (+this.data.strain1.breedingCost + +this.strain2.breedingCost) / 2;
  }

  get averageGrowRate(): number {
    return (+this.data.strain1.growRate + +this.strain2?.growRate ?? 0) / 2;
  }

  get partnerSelected(): boolean {
    return this.strain2 &&  typeof this.strain2 !== 'string';
  }


}
