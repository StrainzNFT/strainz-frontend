import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { StrainMetadataExtended } from '../../../models/strain.model';
import { map, tap } from 'rxjs/operators';
import { StrainzTradeModel, TradeStatus } from '../../../models/trade.model';
import { WeedService } from '../../../services/weed.service';
import { MatDialog } from '@angular/material/dialog';
import { StrainzService } from '../../../services/strainz.service';
import { AccessoryModel, AccessoryType } from '../../../models/accessory.model';
import { AttachAccessoryDialogComponent } from '../../../dialogs/attach-accessory-dialog/attach-accessory-dialog.component';
import { SellAccessoryDialogComponent } from '../../../dialogs/sell-accessory-dialog/sell-accessory-dialog.component';
import { TransferAccessoryDialogComponent } from '../../../dialogs/transfer-accessory-dialog/transfer-accessory-dialog.component';

@Component({
  selector: 'app-strainz-inventory',
  templateUrl: './strainz-inventory.component.html',
  styleUrls: ['./strainz-inventory.component.scss']
})
export class StrainzInventoryComponent implements OnInit, OnDestroy {

  account: string;

  strains$: Observable<StrainMetadataExtended[]> = this.weedService.getMyPlants().pipe(
    tap(strains => {
      this.amountSubscription?.unsubscribe();
      this.amountSubscription = combineLatest(...(strains.map(s => s.harvestableAmount))).subscribe(amounts => {
        this.totalHarvestAmount = amounts.reduce((acc, curr) => {
          return +acc + +curr;
        });
      });
      this.costSubscription?.unsubscribe();
      this.costSubscription = combineLatest(...(strains.map(s => s.wateringCost))).subscribe(amounts => {
        this.totalWaterCost = amounts.reduce((acc, curr) => {
          return +acc + +curr;
        });
      });
    })
  );

  myTrades: StrainzTradeModel[] = [];
  myStrainzTokens$: Observable<number> = this.weedService.getMyStrainzTokens();
  mySeedzTokens$: Observable<number> = this.weedService.getMySeedzTokens();

  myAccessories$: Observable<AccessoryModel[]> = this.weedService.getMyAccessories();

  myJoints$: Observable<number> = this.reduceToAmountByType(this.myAccessories$, AccessoryType.Joint);
  mySunglasses$: Observable<number> = this.reduceToAmountByType(this.myAccessories$, AccessoryType.Sunglasses);
  myEarrings: Observable<number> = this.reduceToAmountByType(this.myAccessories$, AccessoryType.Earring);

  totalHarvestAmount = 0;
  totalWaterCost = 0;
  amountSubscription: Subscription;
  costSubscription: Subscription;
  tradeSubscription: Subscription;

  accountSubscription: Subscription;
  cancelingId = null;

  constructor(private weedService: WeedService, private dialog: MatDialog, private strainzService: StrainzService) {

  }

  reduceToAmountByType(accessoires$: Observable<AccessoryModel[]>, type: AccessoryType): Observable<number> {
    return accessoires$.pipe(
      map(accessoires => {
        return accessoires.length ?
          accessoires.map(a => a.type === type ? 1 as number : 0 as number).reduce((acc, curr) => acc + curr)
          : 0;
      })
    );
  }

  ngOnDestroy(): void {
    this.amountSubscription?.unsubscribe();
    this.accountSubscription?.unsubscribe();
    this.tradeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const p$ = this.strainzService.getAllStrainz();
    const t$ = this.strainzService.getStrainzTrades();
    const a$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));
    this.tradeSubscription = combineLatest([p$, t$, a$]).pipe().subscribe(async ([plants, trades, account]) => {
      this.account = account;
      this.myTrades = await Promise.all(trades.filter(trade => {
        return trade.status === TradeStatus.Open && trade.poster === this.account;
      }).map(async trade => {
        const plant = plants.find(p => p._id == trade.tokenId);
        const extended: StrainzTradeModel = {
          ...trade,
          strain: plant
        };
        return extended;
      }));
    });
    this.accountSubscription = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null)).subscribe(account => {

    });

  }

  async harvestAndWaterAll(): Promise<void> {
    await this.weedService.harvestAndWaterAll();
  }


  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }


  async attachAccessory(accessory: AccessoryModel): Promise<void> {
    this.dialog.open(AttachAccessoryDialogComponent, {
      data: accessory
    });
  }

  async sellAccessory(accessory: AccessoryModel): Promise<void> {
    this.dialog.open(SellAccessoryDialogComponent, {
      data: accessory
    });
  }

  async transferAccessory(accessory: AccessoryModel): Promise<void> {
    this.dialog.open(TransferAccessoryDialogComponent, {
      data: {accessory}
    });
  }


}
