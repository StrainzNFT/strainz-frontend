import { Component, OnInit } from '@angular/core';
import { StrainzService } from '../../services/strainz.service';
import { WeedService } from '../../services/weed.service';
import { combineLatest, Observable } from 'rxjs';
import { StrainzOfferModel, TradeStatus } from '../../models/offer.model';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-offers-overview',
  templateUrl: './offers-overview.component.html',
  styleUrls: ['./offers-overview.component.scss']
})
export class OffersOverviewComponent implements OnInit {

  myOffers$: Observable<StrainzOfferModel[]>;
  offersToMe$: Observable<StrainzOfferModel[]>;
  account$ = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null), filter(x => !!x));

  constructor(private strainzService: StrainzService, private weedService: WeedService) {
  }


  ngOnInit(): void {

    const allPlants$ = this.strainzService.getAllStrainz();
    const openOffers$ = this.strainzService.getOffers().pipe(map(offers => {
      return offers.filter(offer => offer.status == TradeStatus.Open);
    }));
    const myPlants$ = this.weedService.getMyPlants();

    const combined$: Observable<{ myOffers: StrainzOfferModel[], offersToMe: StrainzOfferModel[] }> = combineLatest([this.account$, allPlants$, openOffers$, myPlants$]).pipe(
      map(([account, allPlants, allOffers, myPlants]) => {
        const myOffers: StrainzOfferModel[] = [];
        const offersToMe: StrainzOfferModel[] = [];

        allOffers.forEach(offer => {
          let strain;

          if (offer.offerer === account) {
            strain =  allPlants.find(p => p._id === offer.tokenId);
            myOffers.push({...offer, strain});
          }

          strain = strain ?? myPlants.find(p => p._id === offer.tokenId);
          if (strain) {
            offersToMe.push({...offer, strain});
          }
        });

        return {
          myOffers,
          offersToMe
        };
      })
    );

    this.myOffers$ = combined$.pipe(
      map(combined => {
        return combined.myOffers;
      })
    );
    this.offersToMe$ = combined$.pipe(
      map(combined => {
        return combined.offersToMe;
      })
    );


  }

  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
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
