import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata, StrainzModel } from '../../models/strain.model';
import { WeedService } from '../../services/weed.service';
import { Observable } from 'rxjs';
import * as config from '../../config.json';

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss']
})
export class SellDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: StrainzModel, private weedService: WeedService, private dialogRef: MatDialogRef<SellDialogComponent>) { }
  approving = false;

  listing = false;

  ngOnInit(): void {
  }

  async sell(price: number): Promise<void> {
    if (!await this.weedService.isApprovedStrainzNFT(this.data)) {
      this.approving = true;
      await this.weedService.approveStrainzNFT(this.data._id);
      this.approving = false;
    }



    this.listing = true;
    await this.weedService.sellStrain(this.data, price);
    this.listing = false;
    this.dialogRef.close();
  }

}
