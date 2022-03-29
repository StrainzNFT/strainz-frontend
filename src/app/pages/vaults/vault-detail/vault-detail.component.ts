import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {ExtendedVaultModel, Proposal, ProposalType, VaultModel} from '../../../models/vault.model';
import {WeedService} from '../../../services/weed.service';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import { StrainMetadata, StrainMetadataExtended, StrainzModel } from '../../../models/strain.model';
import {TransferDialogComponent} from '../../../dialogs/transfer-dialog/transfer-dialog.component';
import {BreedDialogComponent} from '../../../dialogs/breed-dialog/breed-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
import { WithdrawBudzDialogComponent } from '../../../dialogs/withdraw-budz-dialog/withdraw-budz-dialog.component';

@Component({
  selector: 'app-vault-detail',
  templateUrl: './vault-detail.component.html',
  styleUrls: ['./vault-detail.component.scss']
})
export class VaultDetailComponent implements OnInit, OnDestroy {
  ProposalType = ProposalType;

  constructor(private activatedRoute: ActivatedRoute, private weedService: WeedService, public dialog: MatDialog) {
  }

  vault$: Observable<ExtendedVaultModel>;
  account$: Observable<string> = this.weedService.getAccounts().pipe(map(accounts => accounts?.[0] ?? null));
  subscription: Subscription;
  plantsSubscription: Subscription;
  budzBalance = 0;
  plants: StrainMetadataExtended[] = [];
  allPlants: StrainzModel[] = [];
  totalHarvestAmount$: Observable<number>;

  ngOnInit(): void {
    this.vault$ = combineLatest([this.account$, this.activatedRoute.paramMap]).pipe(
      filter(([account, params]) => {
        return !!account;
      }),
      map(([account, params]) => {
        return params;
      }),
      map(params => params.get('id')),
      switchMap(address => {
        return this.weedService.getVault(address);
      }),
      filter(vault => !!vault),
      switchMap(async vault => {
        return await this.weedService.getExtendedVault(vault);
      })
    );

    this.subscription = this.vault$.subscribe(async value => {
      this.budzBalance = (await this.weedService.getVaultBalance(value)) ?? 0;
      this.plants = await this.weedService.getVaultPlants(value);
      this.totalHarvestAmount$ = combineLatest(...(this.plants.map(s => s.harvestableAmount))).pipe(map(amounts => {
        return amounts.reduce((acc, curr) => {
          return +acc + +curr;
        });
      }));

    });
    this.plantsSubscription  = this.weedService.getAllPlants().subscribe(plants => {
      this.allPlants = plants;
    });
  }

  async harvestAll(vault: VaultModel): Promise<void> {
    await this.weedService.harvestVault(vault);
    this.budzBalance = (await this.weedService.getVaultBalance(vault)) ?? 0;
  }

  getPlant(plantId: number | string): StrainzModel {
    return this.allPlants.find(p => p._id == plantId);
  }

  async onboard(): Promise<void> {
    await this.weedService.onboardUser();
  }

  getNameBySigner(vault: VaultModel, address: string): string | null {
    return vault.signers.find(s => s.address === address)?.name;
  }

  yieldByGrowRate(rate: number): string {
    return (((rate * 127.5) / 24) / 7).toFixed(2);
  }

  growRate(strain: StrainMetadata): number {
    return (+strain.growRate / 255) * 100;
  }

  transfer(plant: StrainMetadata, vault: ExtendedVaultModel): void {
    const dialogRef = this.dialog.open(TransferDialogComponent, {
      data: {plant, vault}
    });
  }

  getSignedColor(proposal: Proposal, address: string): ThemePalette {
    return proposal.signers.includes(address) ? 'primary' : 'warn';
  }

  getSignedIcon(proposal: Proposal, address: string): string {
    return proposal.signers.includes(address) ? 'done' : 'hourglass_empty';
  }

  getBreedCost(plant1: StrainMetadata, plant2: StrainMetadata): number {
    return Math.max(plant1.breedingCost, plant2.breedingCost);
  }

  async signProposal(prososal: Proposal, vault: VaultModel): Promise<void> {
    await this.weedService.signProposal(prososal, vault);
  }

  async breed(plant: StrainMetadata, vault: VaultModel): Promise<void> {
    const dialogRef = this.dialog.open(BreedDialogComponent, {
      data: {strain1: plant, vault}
    });
  }

  withdrawBudz(vault: ExtendedVaultModel): void {
    const dialogRef = this.dialog.open(WithdrawBudzDialogComponent, {
      data: {
        balance: this.budzBalance,
        vault
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.plantsSubscription?.unsubscribe();
  }
}
