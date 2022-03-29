import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { StrainzTradeModel, TradeStatus } from '../../../models/trade.model';
import { StrainzService } from '../../../services/strainz.service';
import { WeedService } from '../../../services/weed.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import {
  StrainzFilterModel,
  StrainzSortDirection,
  StrainzSortModel,
  StrainzSortProperty
} from '../../../components/strainz-filter/strainz-filter.model';

@Component({
  selector: 'app-strainz-marketplace',
  templateUrl: './strainz-marketplace.component.html',
  styleUrls: ['./strainz-marketplace.component.scss']
})
export class StrainzMarketplaceComponent implements OnInit, OnDestroy {

  openTrades$: Observable<StrainzTradeModel[]>;
  lastTrades$: Observable<StrainzTradeModel[]>;

  approvingId = null;
  buyingId = null;
  approvedBudz = 0;
  budzSubscription: Subscription;
  cancelingId = null;
  pages: Subject<PageEvent> = new Subject<PageEvent>();
  strainAmount = 0;
  amountSubscription: Subscription;

  sort$: BehaviorSubject<StrainzSortModel> = new BehaviorSubject<StrainzSortModel>({
    sortBy: StrainzSortProperty.GrowRate,
    direction: StrainzSortDirection.Descending
  });


  growRateMin;
  growRateMax;
  breedingCostMax;
  breedingCostMin;
  priceMin;
  priceMax;


  loaded = false;


  filter$: BehaviorSubject<StrainzFilterModel | null> = new BehaviorSubject<StrainzFilterModel | null>(null);

  constructor(private strainzService: StrainzService, private weedService: WeedService) {
  }


  ngOnInit(): void {
    this.budzSubscription = this.weedService.getAllowedStrainzTokensForMarketplace().subscribe(budz => {
      this.approvedBudz = budz;
    });
    const t$ = this.strainzService.getStrainzTrades();
    const p$ = this.strainzService.getAllStrainz();
    const a$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));

    const trades$ = combineLatest([t$, p$, a$]).pipe(
      switchMap(async ([trades, plants, account]) => {
        return await Promise.all(trades.map(async t => {
          const plant = plants.find(p => p._id == t.tokenId);
          if (!plant) {
            return null;
          }
          const extended: StrainzTradeModel = {
            ...t,
            strain: plant
          };
          return extended;
        }));
      }),
      filter(x => !!x)
    );

    const paging$: Observable<PageEvent> = this.pages.asObservable();

    const openTrades$ = trades$.pipe(
      map(trades => {
        return trades.filter(t => t?.status === TradeStatus.Open);
      })
    );


    this.amountSubscription = openTrades$.subscribe(trades => {
      this.strainAmount = trades.length;
      [this.breedingCostMin, this.breedingCostMax] = this.minMaxBreeding(trades);
      [this.growRateMin, this.growRateMax] = this.minMaxGrowRate(trades);
      [this.priceMin, this.priceMax] = this.minMaxPrice(trades);

      this.pages.next({
        pageSize: 50,
        length: this.strainAmount,
        pageIndex: 0,
        previousPageIndex: 0
      });
      this.loaded = true;
    });


    const sortedTrades$ = combineLatest([openTrades$, this.sort$]).pipe(
      map(([trades, sort]) => {
        return trades.sort((a, b) => {
          if (sort.direction === StrainzSortDirection.Ascending) {
            [a, b] = [b, a];
          }
          switch (sort.sortBy) {
            case StrainzSortProperty.BreedingCost:
              return a.strain.breedingCost - b.strain.breedingCost;
            case StrainzSortProperty.GrowRate:
              return a.strain.growRate - b.strain.growRate;
            case StrainzSortProperty.Price:
              return a.strainzTokenPrice - b.strainzTokenPrice;
            case StrainzSortProperty.Roi:
              const roiFn = (trade: StrainzTradeModel) => {
                return trade.strainzTokenPrice / (trade.strain.growRate * 255 / 7 / 24);
              };
              return roiFn(a) - roiFn(b);
          }
        });
      })
    );

    this.openTrades$ = combineLatest(paging$, sortedTrades$, this.filter$.asObservable()).pipe(
      map(([paging, trades, currentFilter]) => {
        if (!currentFilter) {
          return [paging, trades];
        }
        return [paging, trades.filter(trade => {
          const matchesValues = trade.strainzTokenPrice >= currentFilter.priceRange[0]
            && trade.strainzTokenPrice <= currentFilter.priceRange[1]
            && (trade.strain.growRate * 255 / 24 / 7) >= currentFilter.growRateRange[0]
            && (trade.strain.growRate * 255 / 24 / 7) <= currentFilter.growRateRange[1]
            && trade.strain.breedingCost >= currentFilter.breedingCostRange[0]
            && trade.strain.breedingCost <= currentFilter.breedingCostRange[1];
          return currentFilter.accessories.includes(null) ? matchesValues : matchesValues && this.matchesAccessoryFilter(trade, currentFilter);
        })];
      }),
      map(([paging, trades]) => {
        paging = paging as PageEvent;
        trades = trades as StrainzTradeModel[];
        this.strainAmount = trades.length;

        const start = paging.pageSize * paging.pageIndex;
        let end = start + paging.pageSize;
        if (end >= trades.length) {
          end = trades.length;
        }
        return trades.slice(start, end);
      })
    );


    this.lastTrades$ = trades$.pipe(
      map(trades => trades.filter((t) => t?.status === TradeStatus.Closed).slice().reverse().slice(0, 9))
    );
  }

  matchesAccessoryFilter(trade: StrainzTradeModel, strainzFilter: StrainzFilterModel): boolean {
    return strainzFilter.accessories.every(accessoryId => {
      return trade.strain.accessories.includes(accessoryId);
    });
  }

  minMaxBreeding(trades: StrainzTradeModel[]): number[] {
    return trades.reduce((acc, val) => {
      acc[0] = (acc[0] === undefined || val.strain.breedingCost < acc[0]) ? val.strain.breedingCost : acc[0];
      acc[1] = (acc[1] === undefined || val.strain.breedingCost > acc[1]) ? val.strain.breedingCost : acc[1];
      return acc;
    }, []);
  }

  minMaxPrice(trades: StrainzTradeModel[]): number[] {
    return trades.reduce((acc, val) => {
      acc[0] = (acc[0] === undefined || val.strainzTokenPrice < acc[0]) ? val.strainzTokenPrice : acc[0];
      acc[1] = (acc[1] === undefined || val.strainzTokenPrice > acc[1]) ? val.strainzTokenPrice : acc[1];
      return acc;
    }, []);
  }

  minMaxGrowRate(trades: StrainzTradeModel[]): number[] {
    return trades.reduce((acc, val) => {
      acc[0] = (acc[0] === undefined || val.strain.growRate < acc[0]) ? val.strain.growRate : acc[0];
      acc[1] = (acc[1] === undefined || val.strain.growRate > acc[1]) ? val.strain.growRate : acc[1];
      return acc;
    }, []).map(rate => rate * 127.5 / 24 / 7).map((rate, index) => {
      return index === 0 ? Math.floor(rate) : Math.ceil(rate);
    });
  }

  applyFilter(newFilter: StrainzFilterModel): void {
    this.filter$.next(newFilter);
  }

  ngOnDestroy(): void {
    this.budzSubscription?.unsubscribe();
    this.amountSubscription?.unsubscribe();
  }

  paging(event: PageEvent): void {
    this.pages.next(event);
  }

  sortChanged(sort: StrainzSortModel): void {
    this.sort$.next(sort);
  }


}
