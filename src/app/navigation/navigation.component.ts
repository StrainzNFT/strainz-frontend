import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { WeedService } from '../services/weed.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  myStrainzTokens: Observable<number> = this.weedService.getMyStrainzTokens();
  mySeedzTokens: Observable<number> = this.weedService.getMySeedzTokens();
  allowedBudz$: Observable<number> = this.weedService.getAllowedStrainzTokensForMarketplace();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  accounts$: Observable<string[]> = this.weedService.getAccounts();

  marketPlaceShown$: Observable<boolean>;
  inventoryShown$: Observable<boolean>;
  buyStrainzShown$: Observable<boolean>;


  constructor(private breakpointObserver: BreakpointObserver, private weedService: WeedService,
              private router: Router, private activatedRoute: ActivatedRoute) {
  }

  async connectWallet(): Promise<void> {
    await this.weedService.onboardUser();
  }

  ngOnInit(): void {
    const navEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );
    this.marketPlaceShown$ = navEvents.pipe(
      map(event => {
        return (event as any).url?.startsWith('/marketplace');
      })
    );
    this.inventoryShown$ = navEvents.pipe(
      map(event => {
        return (event as any).url?.startsWith('/inventory') || (event as any).url?.startsWith('/offers');

      })
    );
    this.buyStrainzShown$ = navEvents.pipe(
      map(event => {
        return (event as any).url?.startsWith('/buystrainz');

      })
    );
  }
}
