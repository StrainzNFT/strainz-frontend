import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { NFT } from '../../../models/bounce/user-nft.response';
import { WeedService } from '../../../services/weed.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SellNftDialogComponent } from '../../../dialogs/sell-nft-dialog/sell-nft-dialog.component';
import { NFTTradeModel, TradeStatus } from '../../../models/trade.model';
import { StrainzService } from '../../../services/strainz.service';
import * as config from '../../../config.json';
import * as contracts from '../../../contracts.json';

@Component({
  selector: 'app-nft-inventory',
  templateUrl: './nft-inventory.component.html',
  styleUrls: ['./nft-inventory.component.scss']
})
export class NftInventoryComponent implements OnInit, OnDestroy {

  myNfts$: Observable<NFT[]> = this.weedService.getMyNFTs();
  account$: Observable<string>;

  myTrades: NFTTradeModel[] = [];

  tradeSubscription: Subscription;
  cancelingId = null;

  constructor(private weedService: WeedService, private dialog: MatDialog, private strainzService: StrainzService) {
  }

  ngOnInit(): void {
    const t$ =  this.strainzService.getNFTTrades();
    this.account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));
    this.tradeSubscription = combineLatest([t$, this.account$]).pipe(
      map(([trades, account]) => {
        return trades.filter(trade => trade.poster === account && trade.status === TradeStatus.Open
          && trade.nftContractAddress.toLowerCase() !== config.bashmaskAddress.toLowerCase());
      })
    ).subscribe(async (myTrades) => {
      this.myTrades = (await Promise.all(myTrades.map(async (trade) => {
        const nft = await this.weedService.getNFT(trade.nftContractAddress, `${trade.tokenId}`);

        const extended: NFTTradeModel = {
          ...trade,
          nft
        };
        return extended;
      }))).filter(nft => nft.nft.metadata && (nft.nft?.image ?? nft.nft?.metadata?.image)
        && (nft.nftContractAddress !== contracts.strainzNFTAddress));
    });
  }

  async sell(nft: NFT): Promise<void> {
    const dialogRef = this.dialog.open(SellNftDialogComponent, {
      data: {nft, bashmask: false}
    });

  }

  ngOnDestroy(): void {
    this.tradeSubscription?.unsubscribe();
  }

  async cancelTrade(trade: NFTTradeModel): Promise<void> {
    this.cancelingId = trade._id;
    await this.weedService.cancelNFTTrade(trade);
    this.cancelingId = null;
  }


  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

}
