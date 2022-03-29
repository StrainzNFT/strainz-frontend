import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StrainMetadata } from '../../models/strain.model';
import { WeedService } from '../../services/weed.service';
import { NFT } from '../../models/bounce/user-nft.response';
import { SellDialogComponent } from '../sell-dialog/sell-dialog.component';

@Component({
  selector: 'app-sell-nft-dialog',
  templateUrl: './sell-nft-dialog.component.html',
  styleUrls: ['./sell-nft-dialog.component.scss']
})
export class SellNftDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { nft: NFT }, private weedService: WeedService, private dialogRef: MatDialogRef<SellDialogComponent>) { }

  listing = false;
  approving = false;

  ngOnInit(): void {
  }

  async sell(price: number): Promise<void> {
    if (!await this.weedService.isApprovedNFT(this.data.nft)) {
      this.approving = true;
      await this.weedService.approveNFT(this.data.nft);
      this.approving = false;
    }



    this.listing = true;
    await this.weedService.sellNFT(this.data.nft, price);
    this.listing = false;
    this.dialogRef.close();
  }

}
