import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata } from '../../models/strain.model';
import { WeedService } from '../../services/weed.service';
import { Observable } from 'rxjs';
import * as config from '../../config.json';
import {AccessoryModel} from '../../models/accessory.model';

@Component({
  selector: 'app-sell-accessory-dialog',
  templateUrl: './sell-accessory-dialog.component.html',
  styleUrls: ['./sell-accessory-dialog.component.scss']
})
export class SellAccessoryDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: AccessoryModel, private weedService: WeedService, private dialogRef: MatDialogRef<SellAccessoryDialogComponent>) { }
  approving = false;

  listing = false;

  ngOnInit(): void {
  }

  async sell(price: number): Promise<void> {
    if (!await this.weedService.isApprovedAccessory(this.data)) {
      this.approving = true;
      await this.weedService.approveAccessory(this.data);
      this.approving = false;
    }

    this.listing = true;
    await this.weedService.sellAccessory(this.data, price);
    this.listing = false;
    this.dialogRef.close();
  }

}
