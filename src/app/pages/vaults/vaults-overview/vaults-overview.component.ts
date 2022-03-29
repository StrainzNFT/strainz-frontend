import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {WeedService} from '../../../services/weed.service';
import {MatDialog} from '@angular/material/dialog';
import {StrainzService} from '../../../services/strainz.service';
import {VaultModel} from '../../../models/vault.model';
import { CreateVaultDialogComponent } from '../../../dialogs/create-vault-dialog/create-vault-dialog.component';

@Component({
  selector: 'app-vaults-overview',
  templateUrl: './vaults-overview.component.html',
  styleUrls: ['./vaults-overview.component.scss']
})
export class VaultsOverviewComponent implements OnInit {
  account$: Observable<string> = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));
  vaults$: Observable<VaultModel[]> = this.weedService.getVaults();

  constructor(private weedService: WeedService, private dialog: MatDialog, private strainzService: StrainzService) { }

  ngOnInit(): void {
  }

  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

  createVault(): void {
    this.dialog.open(CreateVaultDialogComponent, {
      panelClass: 'dialog-responsive',
    });

  }

}
