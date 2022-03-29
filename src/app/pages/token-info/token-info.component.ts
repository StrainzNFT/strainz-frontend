import { Component, OnDestroy, OnInit } from '@angular/core';
import { PancakeService } from '../../services/pancake.service';
import { Observable, Subscription } from 'rxjs';
import { Pair, Route } from '@pancakeswap-libs/sdk-v2';
import { WeedService } from '../../services/weed.service';
import { StrainzService } from '../../services/strainz.service';

@Component({
  selector: 'app-token-info',
  templateUrl: './token-info.component.html',
  styleUrls: ['./token-info.component.scss']
})
export class TokenInfoComponent implements OnInit, OnDestroy {
  BNB = PancakeService.BNB;
  STRAINZ = PancakeService.STRAINZ;
  SEEDZ = PancakeService.SEEDZ;
  strainzBnbRoute$: Observable<Route> = this.pancakeService.getStrainzBnbRoute();
  strainzSeedzRoute$: Observable<Route> = this.pancakeService.getSeedzStrainzRoute();

  strainzBusdRoute$: Observable<Route> = this.pancakeService.getStrainzBusdRoute();
  seedzBusdRoute$: Observable<Route> = this.pancakeService.getSeedzBusdRoute();

  strainzBnbPair$: Observable<Pair> = this.pancakeService.getStrainzBnbPair();
  strainzSeedzPair$: Observable<Pair> = this.pancakeService.getStrainzSeedzPair();

  strainzBnbTVL: number;
  seedzStrainzTVL: number;


  totalStrainzSupply$ = this.strainzService.getStrainzSupply();
  totalSeedzSupply$ = this.strainzService.getSeedzSupply();


  strainzBnbTvlSub: Subscription;
  strainzSeedzTvlSub: Subscription;
  constructor(private pancakeService: PancakeService, private weedService: WeedService, private strainzService: StrainzService) { }

  async ngOnInit(): Promise<void> {
    const pool1 = await this.strainzService.getPublicPool(0);
    this.strainzBnbTvlSub = this.pancakeService.getTVL(pool1).subscribe(tvl => {
      this.strainzBnbTVL = tvl;
    });

    const pool2 = await this.strainzService.getPublicPool(1);
    this.strainzSeedzTvlSub = this.pancakeService.getTVL(pool2).subscribe(tvl => {
      this.seedzStrainzTVL = tvl;
    });


  }

  ngOnDestroy(): void {
    this.strainzBnbTvlSub?.unsubscribe();
    this.strainzSeedzTvlSub?.unsubscribe();
  }

}
