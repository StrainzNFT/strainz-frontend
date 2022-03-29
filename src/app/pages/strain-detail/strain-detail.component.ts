import { Component, OnInit } from '@angular/core';
import { WeedService } from '../../services/weed.service';
import { ActivatedRoute } from '@angular/router';
import { StrainzService } from '../../services/strainz.service';
import { combineLatest, Observable } from 'rxjs';
import { StrainzModel } from '../../models/strain.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { TradeModel } from '../../models/trade.model';
import { StrainzOfferModel, TradeStatus } from '../../models/offer.model';

@Component({
  selector: 'app-strain-detail',
  templateUrl: './strain-detail.component.html',
  styleUrls: ['./strain-detail.component.scss']
})
export class StrainDetailComponent implements OnInit {

  plant$: Observable<StrainzModel | null>;
  trade$: Observable<TradeModel | null>;
  account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));

  offers$: Observable<StrainzOfferModel[]>;
  isMine$: Observable<boolean>;

  missing = false;

  constructor(private weedService: WeedService, private activatedRoute: ActivatedRoute, private strainzService: StrainzService) {
  }

  ngOnInit(): void {
    const id$ = this.activatedRoute.paramMap.pipe(
      map(params => +params.get('id')),
    );
    this.plant$ = id$.pipe(
      switchMap(id => {
        return this.weedService.getPlant(id);
      }),
      tap(plant => {
        this.missing = !!!plant;
      })
    );
    this.trade$ = id$.pipe(
      switchMap(id => {
        return this.strainzService.getStrainzTradeForPlantId(id);
      })
    );

    this.isMine$ = combineLatest([this.account$, this.plant$]).pipe(
      map(([account, plant]) => {
        return plant.owner === account;
      })
    );

    this.offers$ = this.plant$.pipe(
      switchMap(plant => {
        const allPlantOffers$ = this.strainzService.getPlantOffers(plant._id);
        return allPlantOffers$.pipe(
          map(offers => {
            return offers.filter(offer => offer.status == TradeStatus.Open).map(offer => {
              return {
                ...offer,
                strain: plant
              };
            });
          })
        );
      })
    );

  }
  async cancelOffer($event: MouseEvent, offer: StrainzOfferModel): Promise<void> {
    event.stopPropagation();
    await this.weedService.cancelOffer(offer);
  }

  async acceptOffer($event: MouseEvent, offer: StrainzOfferModel): Promise<void> {
    event.stopPropagation();
    await this.weedService.approveStrainzNFT(offer.tokenId);
    await this.weedService.acceptOffer(offer);
  }
}
