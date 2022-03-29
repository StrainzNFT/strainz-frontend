import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata, StrainzModel } from '../../models/strain.model';
import { ExtendedVaultModel } from '../../models/vault.model';
import { WeedService } from '../../services/weed.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grow-fertilizer-dialog',
  templateUrl: './grow-fertilizer-dialog.component.html',
  styleUrls: ['./grow-fertilizer-dialog.component.scss']
})
export class GrowFertilizerDialogComponent implements OnInit {
  fertilizing = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { plant: StrainzModel, vault?: ExtendedVaultModel },
              private weedService: WeedService, private dialogRef: MatDialogRef<GrowFertilizerDialogComponent>) { }

  ngOnInit(): void {
  }

  async buyFertilizer(): Promise<void> {
    this.fertilizing = true;

    try {
      await this.weedService.buyFertilizer(this.data.plant._id);
      this.data.plant.lastFertilizer = Date.now() / 1000;
      this.dialogRef.close();
    } catch {}


    this.fertilizing = false;
  }

  yieldByGrowRate(rate: number): string {
    return this.yieldByGrowRateNumber(rate).toFixed(2);
  }

  yieldByGrowRateNumber(rate: number): number {
    return (((rate * 127.5) / 24) / 7);
  }

}
