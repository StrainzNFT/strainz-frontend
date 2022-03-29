import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { AccessoryTradeModel, StrainzTradeModel, TradeModel, TradeStatus } from '../../../models/trade.model';
import { PageEvent } from '@angular/material/paginator';
import { StrainzService } from '../../../services/strainz.service';
import { WeedService } from '../../../services/weed.service';
import { map, switchMap } from 'rxjs/operators';
import { StrainMetadata } from '../../../models/strain.model';
import * as config from '../../../config.json';
import * as contracts from '../../../contracts.json';

@Component({
  selector: 'app-accessory-marketplace',
  templateUrl: './accessory-marketplace.component.html',
  styleUrls: ['./accessory-marketplace.component.scss']
})
export class AccessoryMarketplaceComponent implements OnInit, OnDestroy {

  openTrades$: Observable<AccessoryTradeModel[]>;
  lastTrades$: Observable<AccessoryTradeModel[]>;
  myTrades$: Observable<AccessoryTradeModel[]>;

  approvingId = null;
  buyingId = null;
  approvedStrainzTokens = 0;
  strainzTokenSubscription: Subscription;
  cancelingId = null;
  pages: Subject<PageEvent> = new Subject<PageEvent>();
  strainAmount = 0;
  amountSubscription: Subscription;
  accountSubscription: Subscription;
  account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));

  constructor(private strainzService: StrainzService, private weedService: WeedService) { }

  ngOnInit(): void {

    this.accountSubscription = this.account$.subscribe(_ => {
      this.strainzTokenSubscription = this.weedService.getAllowedStrainzTokensForMarketplace().subscribe(tokens => {
        this.approvedStrainzTokens = tokens;
      });
      const trades$ = this.strainzService.getAccessoryTrades().pipe(
        switchMap(async trades => {
          return await Promise.all(trades.map(async trade => {
            return {
              ...trade,
              accessory: await this.weedService.fetchAccessory(trade.tokenId)
            };
          }));
        })
      );
      const a$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));


      const paging$: Observable<PageEvent> = this.pages.asObservable();

      const openTrades$ = trades$.pipe(map(trades => {
        return trades.filter(t => t.status === TradeStatus.Open);
      }));

      this.amountSubscription = openTrades$.subscribe(trades => {
        this.strainAmount = trades.length;
        this.pages.next({
          pageSize: 50,
          length: this.strainAmount,
          pageIndex: 0,
          previousPageIndex: 0
        });
      });

      this.openTrades$ = combineLatest(paging$, openTrades$).pipe(
        map(([paging, trades]) => {
          const start = paging.pageSize * paging.pageIndex;
          let end = start + paging.pageSize;
          if (end >= trades.length) {
            end = trades.length;
          }
          return trades.slice(start, end);
        })
      );
      this.lastTrades$ = trades$.pipe(
        map(trades => trades.filter((t) => t.status === TradeStatus.Closed).slice().reverse().slice(0, 9))
      );

      this.myTrades$ = combineLatest([trades$, a$]).pipe(
        map(([trades, account]) => {
          return trades.filter(trade => trade.poster === account && trade.status === TradeStatus.Open);
        })
      );
    });



  }

  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

  async buyTrade(trade: AccessoryTradeModel): Promise<void> {
    if (this.approvedStrainzTokens < trade.strainzTokenPrice) {
      this.approvingId = trade._id;
      await this.weedService.approveStrainzTokens(contracts.strainzMarketplaceAddress, trade.strainzTokenPrice);
      this.approvingId = null;
    }
    this.buyingId = trade._id;
    await this.weedService.buyAccessoryTrade(trade);
    this.buyingId = null;
  }

  ngOnDestroy(): void {
    this.strainzTokenSubscription?.unsubscribe();
    this.amountSubscription?.unsubscribe();
    this.accountSubscription?.unsubscribe();
  }

  async cancelTrade(trade: AccessoryTradeModel): Promise<void> {
    this.cancelingId = trade._id;
    await this.weedService.cancelAccessoryTrade(trade);
    this.cancelingId = null;
  }

  paging(event: PageEvent): void {
    this.pages.next(event);
  }


}
