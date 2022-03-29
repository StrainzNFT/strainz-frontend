import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatMenuModule} from '@angular/material/menu';

import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TransferDialogComponent } from './dialogs/transfer-dialog/transfer-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { BreedDialogComponent } from './dialogs/breed-dialog/breed-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AboutComponent } from './pages/about/about.component';
import { StrainDetailComponent } from './pages/strain-detail/strain-detail.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SellDialogComponent } from './dialogs/sell-dialog/sell-dialog.component';
import { BlockieComponent } from './blockie/blockie.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ConnectDialogComponent } from './dialogs/connect-dialog/connect-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NftMarketplaceComponent } from './pages/marketplace/nft-marketplace/nft-marketplace.component';
import { StrainzMarketplaceComponent } from './pages/marketplace/strainz-marketplace/strainz-marketplace.component';
import {MatTabsModule} from '@angular/material/tabs';
import { StrainzInventoryComponent } from './pages/inventory/strainz-inventory/strainz-inventory.component';
import { NftInventoryComponent } from './pages/inventory/nft-inventory/nft-inventory.component';
import { SellNftDialogComponent } from './dialogs/sell-nft-dialog/sell-nft-dialog.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { VaultsOverviewComponent } from './pages/vaults/vaults-overview/vaults-overview.component';
import { CreateVaultDialogComponent } from './dialogs/create-vault-dialog/create-vault-dialog.component';
import {MatSliderModule} from '@angular/material/slider';
import { VaultDetailComponent } from './pages/vaults/vault-detail/vault-detail.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { WithdrawBudzDialogComponent } from './dialogs/withdraw-budz-dialog/withdraw-budz-dialog.component';
import {MatBadgeModule} from '@angular/material/badge';
import { AccessoryTypePipe } from './pipes/accessory-type.pipe';
import { AccessoryImagePipe } from './pipes/accessory-image.pipe';
import { AttachAccessoryDialogComponent } from './dialogs/attach-accessory-dialog/attach-accessory-dialog.component';
import {SellAccessoryDialogComponent} from './dialogs/sell-accessory-dialog/sell-accessory-dialog.component';
import { TransferAccessoryDialogComponent } from './dialogs/transfer-accessory-dialog/transfer-accessory-dialog.component';
import { AccessoryMarketplaceComponent } from './pages/marketplace/accessory-marketplace/accessory-marketplace.component';
import { CompostDialogComponent } from './dialogs/compost-dialog/compost-dialog.component';
import { StakeOverviewComponent } from './pages/stake-overview/stake-overview.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { PoolComponent } from './pages/stake-overview/pool/pool.component';
import { StrainCardComponent } from './components/strain-card/strain-card.component';
import { GrowFertilizerDialogComponent } from './dialogs/grow-fertilizer-dialog/grow-fertilizer-dialog.component';
import { TimeUntilPipe } from './pipes/time-until.pipe';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { TokenInfoComponent } from './pages/token-info/token-info.component';
import { CommunityComponent } from './pages/community/community.component';
import { FaqComponent } from './pages/faq/faq.component';
import { StrainzFilterComponent } from './components/strainz-filter/strainz-filter.component';
import {SliderModule} from 'primeng/slider';
import { StrainzSortHeaderComponent } from './components/strainz-sort-header/strainz-sort-header.component';
import { StrainImageComponent } from './components/strain-image/strain-image.component';
import { ChangeStrainColorDialogComponent } from './dialogs/change-strain-color-dialog/change-strain-color-dialog.component';
import { ChangeStrainNameDialogComponent } from './dialogs/change-strain-name-dialog/change-strain-name-dialog.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { MakeOfferDialogComponent } from './dialogs/make-offer-dialog/make-offer-dialog.component';
import { OffersOverviewComponent } from './pages/offers-overview/offers-overview.component';
import { MigrationComponent } from './pages/migration/migration.component';
import {MatStepperModule} from '@angular/material/stepper';
import { BuystrainzComponent } from './pages/buystrainz/buystrainz.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    TransferDialogComponent,
    BreedDialogComponent,
    AboutComponent,
    StrainDetailComponent,
    SellDialogComponent,
    BlockieComponent,
    ConnectDialogComponent,
    NftMarketplaceComponent,
    StrainzMarketplaceComponent,
    StrainzInventoryComponent,
    NftInventoryComponent,
    SellNftDialogComponent,
    VaultsOverviewComponent,
    CreateVaultDialogComponent,
    VaultDetailComponent,
    WithdrawBudzDialogComponent,
    AccessoryTypePipe,
    AccessoryImagePipe,
    AttachAccessoryDialogComponent,
    SellAccessoryDialogComponent,
    TransferAccessoryDialogComponent,
    AccessoryMarketplaceComponent,
    CompostDialogComponent,
    StakeOverviewComponent,
    PoolComponent,
    StrainCardComponent,
    GrowFertilizerDialogComponent,
    TimeUntilPipe,
    RoadmapComponent,
    TokenInfoComponent,
    CommunityComponent,
    FaqComponent,
    StrainzFilterComponent,
    StrainzSortHeaderComponent,
    StrainImageComponent,
    ChangeStrainColorDialogComponent,
    ChangeStrainNameDialogComponent,
    MakeOfferDialogComponent,
    OffersOverviewComponent,
    MigrationComponent,
    BuystrainzComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatStepperModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSliderModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSlideToggleModule,
    SliderModule,
    ColorPickerModule,
    MatMenuModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
