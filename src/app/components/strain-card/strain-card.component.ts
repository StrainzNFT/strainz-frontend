import { Component, Input, OnInit } from '@angular/core';
import { StrainMetadata, StrainMetadataExtended, StrainzModel } from '../../models/strain.model';
import { StrainzTradeModel, TradeModel } from '../../models/trade.model';
import { TransferDialogComponent } from '../../dialogs/transfer-dialog/transfer-dialog.component';
import { BreedDialogComponent } from '../../dialogs/breed-dialog/breed-dialog.component';
import { SellDialogComponent } from '../../dialogs/sell-dialog/sell-dialog.component';
import { CompostDialogComponent } from '../../dialogs/compost-dialog/compost-dialog.component';
import { WeedService } from '../../services/weed.service';
import { MatDialog } from '@angular/material/dialog';
import * as contracts from '../../contracts.json';
import { GrowFertilizerDialogComponent } from '../../dialogs/grow-fertilizer-dialog/grow-fertilizer-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessoryType } from '../../models/accessory.model';
import { boostValues } from '../../util';
import {ChangeStrainNameDialogComponent} from '../../dialogs/change-strain-name-dialog/change-strain-name-dialog.component';
import {ChangeStrainColorDialogComponent} from '../../dialogs/change-strain-color-dialog/change-strain-color-dialog.component';
import { rgbaToHex, rgbToHex } from '@angular-material-components/color-picker';
import { MakeOfferDialogComponent } from '../../dialogs/make-offer-dialog/make-offer-dialog.component';

@Component({
  selector: 'app-strain-card',
  templateUrl: './strain-card.component.html',
  styleUrls: ['./strain-card.component.scss']
})
export class StrainCardComponent implements OnInit {

  @Input() strain: StrainMetadataExtended;
  @Input() trade: StrainzTradeModel;
  @Input() isPublic: boolean;
  @Input() approvedStrainzTokens = 0;
  @Input() hideSharingButton = false;

  @Input() isMine = false;

  canceling = false;
  approving = false;
  buying = false;

  constructor(private weedService: WeedService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  currentGrowRateBarStyle(currentGrowRate: number): string {
    return `${+this.yieldByGrowRateNumber(currentGrowRate) / this.yieldByGrowRateNumber(255) * 100}%`;
  }

  maxGrowRateBarStyle(maxGrowRate: number, currentGrowRate?: number): string {
    if (currentGrowRate) {
      return `${(+this.yieldByGrowRateNumber(maxGrowRate) / this.yieldByGrowRateNumber(255) * 100) -
      +this.yieldByGrowRateNumber(currentGrowRate) / this.yieldByGrowRateNumber(255) * 100}%`;
    }

    return `${(+this.yieldByGrowRateNumber(maxGrowRate) / this.yieldByGrowRateNumber(255) * 100)}%`;
  }

  yieldByGrowRate(rate: number): string {
    return this.yieldByGrowRateNumber(rate).toFixed(2);
  }

  yieldByGrowRateNumber(rate: number): number {
    return (((rate * 127.5) / 24) / 7);
  }

  strainBorder(strain: StrainMetadataExtended): any {
    const red = strain.dna.substr(7, 3);
    const green = strain.dna.substr(10, 3);
    const blue = strain.dna.substr(13, 3);
    return {
      border: '0px solid #' + rgbaToHex(+red, +green, +blue, 1)
    };
  }

  strainColor(strain: StrainMetadataExtended): any {
    const red = strain.dna.substr(7, 3);
    const green = strain.dna.substr(10, 3);
    const blue = strain.dna.substr(13, 3);
    return {
      'background-color': '#' + rgbaToHex(+red, +green, +blue, 0.1)
    };
  }

  cardStyle(strain: StrainMetadataExtended): any {
    return {
      ...this.strainBorder(strain),
      ...this.strainColor(strain)
    };
  }


  growRate(strain: StrainMetadata): number {
    return (+strain.growRate / 255) * 100;
  }

  async cancelTrade(trade: StrainzTradeModel): Promise<void> {
    this.canceling = true;
    await this.weedService.cancelStrainzTrade(trade);
    this.canceling = false;
  }

  transfer(plant: StrainzModel): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      data: {plant},
      width: '500px'
    });
  }

  async breed(plant: StrainMetadata): Promise<void> {
    const dialogRef = this.dialog.open(BreedDialogComponent, {
      data: {strain1: plant},
      width: '1000px'
    });

  }

  async sell(plant: StrainMetadata): Promise<void> {
    const dialogRef = this.dialog.open(SellDialogComponent, {
      data: plant
    });

  }

  async copyURL(): Promise<void> {
    await navigator.clipboard.writeText(`https://strainz.tech/strain/${this.strain._id}`);
    this.snackBar.open('Copied URL!', 'OK', {
      duration: 1000
    });
  }

  async compost(strain: StrainMetadata): Promise<void> {
    this.dialog.open(CompostDialogComponent, {
      data: {strain}
    });
  }

  async changeName(strain: StrainMetadata): Promise<void> {
    this.dialog.open(ChangeStrainNameDialogComponent, {
      data: strain
    });
  }

  async changeColor(strain: StrainMetadata): Promise<void> {
    this.dialog.open(ChangeStrainColorDialogComponent, {
      data: strain
    });
  }

  async makeOffer(strain: StrainMetadataExtended): Promise<void> {
    this.dialog.open(MakeOfferDialogComponent, {
      data: strain
    });
  }

  async buyTrade(trade: TradeModel): Promise<void> {
    if (this.approvedStrainzTokens < trade.strainzTokenPrice) {
      this.approving = true;
      await this.weedService.approveStrainzTokens(contracts.strainzMarketplaceAddress, trade.strainzTokenPrice);
      this.approving = false;
    }
    this.buying = true;
    await this.weedService.buyStrainzTrade(trade);
    this.buying = false;
  }

  fertilizerActive(timeOfLastFertilizer: number): boolean {
    if (timeOfLastFertilizer === 0) {
      return false;
    }
    const currentTime =  Math.round(Date.now() / 1000);
    const week = 60 * 60 * 24 * 7;
    return currentTime - timeOfLastFertilizer < week;
  }

  fertilizerDuration(timeOfLastFertilizer: number): Date {
    const days9 = 60 * 60 * 24 * 9 * 1000;

    return new Date(timeOfLastFertilizer * 1000 + days9);
  }

  fertilize(): void {
    this.dialog.open(GrowFertilizerDialogComponent, {
      data: {
        plant: this.strain
      }
    });
  }

  hasAccessory(): boolean {
    return this.strain?.accessories?.length > 0;
  }
  hasJoint(): boolean {
    return this.strain?.accessories?.includes(AccessoryType.Joint);
  }
  hasSunglasses(): boolean {
    return this.strain?.accessories?.includes(AccessoryType.Sunglasses);

  }
  hasEarring(): boolean {
    return this.strain?.accessories?.includes(AccessoryType.Earring);

  }

  getAccessoryBoost(): number {
    return this.strain.accessories.map(accessoryType => boostValues[accessoryType - 1]).reduce((acc, curr) => acc + curr, 0);
  }
}
