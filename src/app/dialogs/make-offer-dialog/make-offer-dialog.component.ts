import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadataExtended, StrainzModel } from '../../models/strain.model';
import { WeedService } from '../../services/weed.service';
import * as contracts from '../../contracts.json';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-make-offer-dialog',
  templateUrl: './make-offer-dialog.component.html',
  styleUrls: ['./make-offer-dialog.component.scss']
})
export class MakeOfferDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: StrainMetadataExtended, private weedService: WeedService, private dialogRef: MatDialogRef<MakeOfferDialogComponent>) { }
  approving = false;

  offering = false;

  approvedTokens = 0;

  approvedSubscription: Subscription;

  ngOnInit(): void {
    this.approvedSubscription = this.weedService.getAllowedStrainzTokensForMarketplace().subscribe(approved => {
      this.approvedTokens = approved;
    });
  }

  async offer(offerAmount: number): Promise<void> {
    if (this.approvedTokens < offerAmount) {
      this.approving = true;
      await this.weedService.approveStrainzTokens(contracts.strainzMarketplaceAddress, offerAmount * 10000);
      this.approving = false;
    }
    this.offering = true;
    await this.weedService.makeOffer(this.data, offerAmount);
    this.offering = false;
    this.dialogRef.close();
  }

}
