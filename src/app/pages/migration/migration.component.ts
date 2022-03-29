import { Component, OnInit } from '@angular/core';
import { WeedService } from '../../services/weed.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/cdk/stepper';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { StrainzService } from '../../services/strainz.service';
import { StrainzTradeModel } from '../../models/trade.model';
import * as contractsV2 from '../../v2/contractsV2.json';
import { PoolModel } from '../../models/poolModel';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss']
})
export class MigrationComponent implements OnInit {

  constructor(private weedService: WeedService, private strainzService: StrainzService) {

  }

  account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null), filter(x => !!x));

  pool1: PoolModel;
  pool2: PoolModel;

  migrating: boolean;



  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

  ngOnInit(): void {



    this.account$.subscribe(async account => {
      this.pool1 = await this.weedService.getV2Pool(0);
      this.pool2 = await this.weedService.getV2Pool(1);
    });


  }



  async migrateNFTs(stepper: MatStepper): Promise<void> {
    this.migrating = true;
    let amount = await this.weedService.getV2PlantAmount();

    while (amount > 0) {
      await this.weedService.migrateV2ToV3Plants();
      amount = await this.weedService.getV2PlantAmount();
    }

    this.migrating = false;

  }

  async migrateAccessories(stepper: MatStepper): Promise<void> {
    this.migrating = true;
    let amount = await this.weedService.getV2AccessoriesAmount();
    while ((amount) > 0) {
      await this.weedService.migrateV2ToV3Accessories();
      amount = await this.weedService.getV2AccessoriesAmount();
    }
    this.migrating = false;

  }

  async migrateTokens(stepper: MatStepper): Promise<void> {
    this.migrating = true;

    await this.weedService.migrateV2ToV3Tokens();
    this.migrating = false;
    stepper.next();

  }
}
