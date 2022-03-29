import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { NFTTradeModel, TradeStatus } from '../../../models/trade.model';
import { StrainzService } from '../../../services/strainz.service';
import { WeedService } from '../../../services/weed.service';
import { map } from 'rxjs/operators';
import * as config from '../../../config.json';
import * as contracts from '../../../contracts.json';

@Component({
  selector: 'app-nft-marketplace',
  templateUrl: './nft-marketplace.component.html',
  styleUrls: ['./nft-marketplace.component.scss']
})
export class NftMarketplaceComponent implements OnInit, OnDestroy {

  openTrades: NFTTradeModel[] = [];
  lastTrades: NFTTradeModel[] = [];
  myTrades: NFTTradeModel[] = [];

  approvingId = null;
  buyingId = null;
  approvedBudz = 0;
  budzSubscription: Subscription;
  cancelingId = null;


  tradeSubscription: Subscription;

  constructor(private strainzService: StrainzService, private weedService: WeedService) {
  }

  ngOnInit(): void {
    this.budzSubscription = this.weedService.getAllowedStrainzTokensForMarketplace().subscribe(budz => {
      this.approvedBudz = budz;
    });

    const t$ = this.strainzService.getNFTTrades();
    const a$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));

    this.tradeSubscription = combineLatest([t$, a$]).subscribe(
      async ([trades, account]) => {
        const extendedTrades = (await Promise.all(
          trades.filter(t => t.nftContractAddress.toLowerCase() !== config.bashmaskAddress.toLowerCase())
            .map(async (trade) => {
              try {
                const nft = await this.weedService.getNFT(trade.nftContractAddress, `${trade.tokenId}`);

                const extended: NFTTradeModel = {
                  ...trade,
                  nft
                };
                return extended;
              } catch {
                console.log('error loading:', trade);
                return null;
              }

            }))
        ).filter(nft => nft?.nft?.metadata && (nft.nft?.image ?? nft.nft?.metadata?.image)
          && (nft.nftContractAddress !== contracts.strainzNFTAddress));

        this.openTrades = extendedTrades.filter(t => t.status === TradeStatus.Open);
        this.lastTrades = extendedTrades.filter(t => t.status === TradeStatus.Closed);
        this.myTrades = extendedTrades.filter(t => t.poster === account && t.status === TradeStatus.Open);
      }
    );


  }

  async cancelTrade(trade: NFTTradeModel): Promise<void> {
    this.cancelingId = trade._id;
    await this.weedService.cancelNFTTrade(trade);
    this.cancelingId = null;
  }

  async buyTrade(trade: NFTTradeModel): Promise<void> {
    if (this.approvedBudz < trade.strainzTokenPrice) {
      this.approvingId = trade._id;
      await this.weedService.approveStrainzTokens(contracts.strainzMarketplaceAddress, trade.strainzTokenPrice);
      this.approvingId = null;
    }
    this.buyingId = trade._id;
    await this.weedService.buyNFT(trade);
    this.buyingId = null;
  }

  ngOnDestroy(): void {
    this.budzSubscription?.unsubscribe();
    this.tradeSubscription?.unsubscribe();
  }

}
