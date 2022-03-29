import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeedService } from '../../services/weed.service';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { StrainzModel } from '../../models/strain.model';
import { map } from 'rxjs/operators';
import { StrainzTradeModel, TradeModel, TradeStatus } from '../../models/trade.model';
import { StrainzService } from '../../services/strainz.service';
import { PageEvent } from '@angular/material/paginator';
import * as contracts from '../../contracts.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  approvingId = null;
  buyingId = null;


  approvedBudz = 0;
  budzSubscription: Subscription;

  tradeSubscription: Subscription;
  trades: StrainzTradeModel[];

  pagedPlants$: Observable<StrainzModel[]>;
  pages: Subject<PageEvent> = new Subject<PageEvent>();
  strainAmount = 0;

  amountSubscription: Subscription;

  growRate(strain: StrainzModel): number {
    return (+strain.growRate / 255) * 100;
  }

  getTradeForPlant(strain: StrainzModel): StrainzTradeModel | null {
    return this.trades?.filter(trade => trade.status == TradeStatus.Open).find(t => t.tokenId == strain._id);
  }

  constructor(private weedService: WeedService, private strainzService: StrainzService) {
  }

  ngOnInit(): void {

    const allPlants$: Observable<StrainzModel[]> = this.weedService.getAllPlants();
    const paging$: Observable<PageEvent> = this.pages.asObservable();
    this.amountSubscription = allPlants$.subscribe(plants => {
      this.strainAmount = plants.length;
      setTimeout(() => {
        this.pages.next({
          pageSize: 50,
          length: this.strainAmount,
          pageIndex: 0,
          previousPageIndex: 0
        });
      }, 0);

    });


    this.pagedPlants$ = combineLatest([allPlants$, paging$]).pipe(
      map(([allPlants, paging]) => {
        const start = paging.pageSize * paging.pageIndex;
        let end = start + paging.pageSize;
        if (end >= allPlants.length) {
          end = allPlants.length;
        }
        return allPlants.slice(start, end);
      })
    );

    this.budzSubscription = this.weedService.getAllowedStrainzTokensForMarketplace().subscribe(budz => {
      this.approvedBudz = budz;
    });
    const t$ = this.strainzService.getStrainzTrades();
    this.tradeSubscription = combineLatest([this.pagedPlants$, t$]).pipe().subscribe(async ([plants, trades]) => {
      this.trades = trades.map(trade => {
        const extended: StrainzTradeModel = {
          ...trade,
          strain: plants.find(p => p._id == trade.tokenId)
        };
        return extended;
      });
    });

  }

  ngOnDestroy(): void {
    this.budzSubscription?.unsubscribe();
    this.amountSubscription?.unsubscribe();
    this.tradeSubscription?.unsubscribe();
  }

  getTradeForStrainId(id: number): TradeModel | null {
    return this.trades.find(trade => trade.tokenId == id && trade.status === TradeStatus.Open);
  }

  async buyTrade(trade: TradeModel): Promise<void> {
    if (this.approvedBudz < trade.strainzTokenPrice) {
      this.approvingId = trade._id;
      await this.weedService.approveStrainzTokens(contracts.strainzMarketplaceAddress, trade.strainzTokenPrice);
      this.approvingId = null;
    }
    this.buyingId = trade._id;
    await this.weedService.buyStrainzTrade(trade);
    this.buyingId = null;
  }

  paging(event: PageEvent): void {
    this.pages.next(event);
  }

}
