import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutComponent } from './pages/about/about.component';
import { StrainDetailComponent } from './pages/strain-detail/strain-detail.component';
import { StrainzMarketplaceComponent } from './pages/marketplace/strainz-marketplace/strainz-marketplace.component';
import { NftMarketplaceComponent } from './pages/marketplace/nft-marketplace/nft-marketplace.component';
import { StrainzInventoryComponent } from './pages/inventory/strainz-inventory/strainz-inventory.component';
import { NftInventoryComponent } from './pages/inventory/nft-inventory/nft-inventory.component';
import {VaultsOverviewComponent} from './pages/vaults/vaults-overview/vaults-overview.component';
import { VaultDetailComponent } from './pages/vaults/vault-detail/vault-detail.component';
import { AccessoryMarketplaceComponent } from './pages/marketplace/accessory-marketplace/accessory-marketplace.component';
import { StakeOverviewComponent } from './pages/stake-overview/stake-overview.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { TokenInfoComponent } from './pages/token-info/token-info.component';
import { CommunityComponent } from './pages/community/community.component';
import { FaqComponent } from './pages/faq/faq.component';
import { OffersOverviewComponent } from './pages/offers-overview/offers-overview.component';
import { MigrationComponent } from './pages/migration/migration.component';
import {BuystrainzComponent} from "./pages/buystrainz/buystrainz.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'about'
  },
  {
    path: 'overview',
    component: DashboardComponent,

  },
  {
    path: 'strain/:id',
    component: StrainDetailComponent,

  },
  {
    path: 'about',
    component: AboutComponent,

  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'community',
    component: CommunityComponent,

  },
  {
    path: 'buystrainz',
    component: BuystrainzComponent,

  },
  {
    path: 'info',
    component: TokenInfoComponent,

  },
  {
    path: 'inventory',
    children: [
      {
        path: 'strainz',
        component: StrainzInventoryComponent
      },
      {
        path: 'other',
        component: NftInventoryComponent
      }
    ]
  },
  {
    path: 'vaults',
    children: [
      {path: '', pathMatch: 'full', component: VaultsOverviewComponent},
      {path: ':id', component: VaultDetailComponent}
    ]
  },
  {
    path: 'stake',
    component: StakeOverviewComponent
  },
  {
    path: 'roadmap',
    component: RoadmapComponent
  },
  {
    path: 'migrate',
    component: MigrationComponent
  },
  {
    path: 'marketplace',
    children: [
      {
        path: 'strainz',
        component: StrainzMarketplaceComponent
      },
      {
        path: 'accessories',
        component: AccessoryMarketplaceComponent
      },
      {
        path: 'other',
        component: NftMarketplaceComponent
      }
    ]
  },
  {
    path: 'offers',
    component: OffersOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
