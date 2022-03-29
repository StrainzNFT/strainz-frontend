import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { StrainMetadata, StrainMetadataExtended, StrainzModel } from '../models/strain.model';
import { map, switchMap, tap } from 'rxjs/operators';
import * as contracts from '../contracts.json';
import * as contractsV2 from '../v2/contractsV2.json';
import { StrainzService } from './strainz.service';
import * as strainzNFTArtifacts from '../contracts/StrainzNFT/StrainzNFT.sol/StrainzNFT.json';
import * as strainzAccessoryArtifacts from '../contracts/StrainzAccessory.sol/StrainzAccessory.json';
import * as seedzTokenArtifacts from '../contracts/StrainzTokens/SeedzToken.sol/SeedzToken.json';
import * as marketplaceArtifacts from '../contracts/StrainzMarketplace.sol/StrainzMarketplace.json';
import * as ierc721Artifacts from '../IERC721.json';
import * as ierc20Artifacts from '../IERC20.json';
import * as migratorArtifacts from '../contracts/StrainzMigration.sol/StrainzMigration.json';

import * as strainzTokenArtifacts from '../contracts/StrainzTokens/StrainzToken.sol/StrainzToken.json';
import * as strainzMultisigFactoryArtifacts
  from '../contracts/Vaults/StrainzMultisigFactory.sol/StrainzMultisigFactory.json';
import * as strainzMultisigVaultArtifacts from '../contracts/Vaults/StrainzMultisigVault.sol/StrainzMultisigVault.json';
import { AccessoryTradeModel, StrainzTradeModel, TradeModel } from '../models/trade.model';
import { MatDialog } from '@angular/material/dialog';
import { ConnectDialogComponent } from '../dialogs/connect-dialog/connect-dialog.component';
import { NFT } from '../models/bounce/user-nft.response';
import { HttpClient } from '@angular/common/http';
import { ExtendedVaultModel, Proposal, VaultModel } from '../models/vault.model';
import { boostValues, mapDNA } from '../util';
import { AccessoryModel } from '../models/accessory.model';
import { PoolModel } from '../models/poolModel';
import { FetchOfferModel, OfferModel, StrainzOfferModel } from '../models/offer.model';
import * as strainzNFTArtifactsV2 from '../v2/IStrainzV2.sol/IStrainzNFTV2.json';
import * as strainzTokenArtifactsV2 from '../v2/IStrainzV2.sol/IStrainzTokenV2.json';
import * as seedzTokenArtifactsV2 from '../v2/IStrainzV2.sol/ISeedzTokenV2.json';
import * as accessoryArtifactsV2 from '../v2/IStrainzV2.sol/IAccessoryV2.json';
import * as marketplaceArtifactsV2 from '../v2/IStrainzV2.sol/IStrainzMarketplaceV2.json';
import * as routerABI from '../v2/router.abi.json';


const WALLET_KEY = 'WALLET_INSTALLED';


@Injectable({
  providedIn: 'root'
})
export class WeedService {

  web3: Web3;
  strainzNFTContract;
  strainzTokenContract;
  seedzTokenContract;


  strainzAccessoryContract;
  marketplaceContract;
  migrationContract;

  routerContract;

  v2Contracts = {
    strainzNFT: null,
    strainzToken: null,
    seedzToken: null,
    strainzAccessory: null,
    marketplace: null
  };

  v2Data = {
    myPlants$: new BehaviorSubject<StrainzModel[]>([]),
    myTrades$: new BehaviorSubject<TradeModel[]>([]),
    myAccessories$: new BehaviorSubject<AccessoryModel[]>([]),
    myStrainzTokens$: new BehaviorSubject<number>(0),
    mySeedzTokens$: new BehaviorSubject<number>(0)
  };

  vaultFactoryContract;

  accounts$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  myPlants$: BehaviorSubject<StrainMetadataExtended[]> = new BehaviorSubject<StrainMetadataExtended[]>([]);
  allPlants$: BehaviorSubject<StrainzModel[]> = new BehaviorSubject<StrainzModel[]>([]);
  myStrainzTokens$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  mySeedzTokens$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  myAccessories$: BehaviorSubject<AccessoryModel[]> = new BehaviorSubject<AccessoryModel[]>([]);
  approvedStrainzTokensForMarketplace$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  approvedStrainzTokensForBreed$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  approvedSeedzTokensForStrainz$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  myNfts$: BehaviorSubject<NFT[]> = new BehaviorSubject<NFT[]>([]);
  myVaults$: BehaviorSubject<VaultModel[]> = new BehaviorSubject<VaultModel[]>([]);


  constructor(private strainzService: StrainzService, private dialog: MatDialog, private httpClient: HttpClient) {
  }

  public getMyStrainzTokens(): Observable<number> {
    return this.myStrainzTokens$.asObservable();
  }

  public getMySeedzTokens(): Observable<number> {
    return this.mySeedzTokens$.asObservable();
  }

  public getAllowedStrainzTokensForMarketplace(): Observable<number> {
    return this.approvedStrainzTokensForMarketplace$.asObservable().pipe(map(amount => amount * 10000));
  }

  public getAllowedStrainzTokensForBreed(): Observable<number> {
    return this.approvedStrainzTokensForBreed$.asObservable().pipe(map(amount => amount * 10000));
  }

  public getAllowedSeedzTokensForStrainz(): Observable<number> {
    return this.approvedSeedzTokensForStrainz$.asObservable();
  }


  public getVaults(): Observable<VaultModel[]> {
    return this.myVaults$.asObservable();
  }

  public getVault(address: string): Observable<VaultModel | null> {
    return this.getVaults().pipe(map(vaults => {
      return vaults.find(vault => vault.address === address);
    }));
  }

  public async getExtendedVault(vault: VaultModel): Promise<ExtendedVaultModel> {
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address);
    const numberOfProposals = await vaultContract.methods.numberOfProposals().call();
    const promises = [];
    for (let i = 0; i < numberOfProposals; i++) {
      promises.push(vaultContract.methods.proposals(i).call());
    }
    const proposals = await Promise.all((await Promise.all(promises)).map(async p => {
      p.proposalType = +p.proposalType;
      p.signers = await vaultContract.methods.getSignersForProposal(+p.id).call();
      return p;
    }));
    return {...vault, proposals: new BehaviorSubject<Proposal[]>(proposals)};
  }

  public mapPlantsToExtended(plants: StrainzModel[]): StrainMetadataExtended[] {
    return plants.map(plant => {
      const extended: StrainMetadataExtended = {
        ...plant,
        harvestableAmount: new BehaviorSubject<number>(0),
        wateringCost: new BehaviorSubject<number>(0),
        currentGrowRate: new BehaviorSubject<number>(0)
      }; // init plant
      this.harvestableAmount(extended._id).then(amount => extended.harvestableAmount.next(+amount));
      this.wateringCost(extended._id).then(cost => {
        extended.wateringCost.next(+cost);
      });
      this.getGrowPerDayForPlant(extended._id).then(rate => {
        extended.currentGrowRate.next(rate);
      });
      this.getLastFertilizerForPlant(extended._id).then(time => {
        extended.lastFertilizer = time;
      });
      extended.dna = mapDNA(extended.dna, extended.accessories);

      extended.interval = setInterval(async () => {
        extended.harvestableAmount.next(await this.harvestableAmount(extended._id));
        extended.wateringCost.next(await this.wateringCost(extended._id));
        extended.currentGrowRate.next(await this.getGrowPerDayForPlant(extended._id));
      }, 10000);
      return extended;
    });
  }

  public async init(): Promise<void> {

    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {
          return from(this.fetchPlants());
        } else {
          return of([]);
        }
      }), map(plants => {
        return this.mapPlantsToExtended(plants);
      })
    ).subscribe(this.myPlants$);

    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {
          return from(this.fetchMyAccessories());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.myAccessories$);

    this.accounts$.pipe(
      tap(async (accounts) => {
        if (accounts?.length) {
          await this.refreshStrainzTokens();
        }
      }),
      switchMap(accounts => {
        if (accounts?.length) {

          return from(this.fetchApprovedStrainzTokensForMarketplace());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.approvedStrainzTokensForMarketplace$);

    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {

          return from(this.fetchApprovedStrainzTokensForBreed());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.approvedStrainzTokensForBreed$);

    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {

          return from(this.fetchApprovedSeedzTokensForStrainz());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.approvedSeedzTokensForStrainz$);

    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {
          return from([]); // from(this.fetchMyNFTs());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.myNfts$);


    this.accounts$.pipe(
      switchMap(accounts => {
        if (accounts?.length) {
          return from(this.fetchMyVaults());
        } else {
          return of([]);
        }
      })
    ).subscribe(this.myVaults$);

    this.allPlants$.next((await this.strainzService.getAllStrainz().toPromise()));

  }

  public async createVault(vault: VaultModel): Promise<string | null> {
    const sender = this.accounts$.value[0];

    const signs = vault.signers.map(signer => signer.address);
    const names = vault.signers.map(signer => signer.name);

    const result = await this.vaultFactoryContract.methods.createVault(vault.name, vault.minSignersNeeded, signs, names).send({
      from: sender
    });
    if (result.status) {
      const newAddress = result.events.VaultCreated.returnValues.vaultAddress;
      return newAddress;
    }
    return null;
  }

  public onboardUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const dialogRef = this.dialog.open(ConnectDialogComponent, {
          data: async (web3Provider) => {
            if (web3Provider) {
              this.web3 = new Web3(web3Provider);
              await web3Provider.request({method: 'eth_requestAccounts'});
              this.strainzNFTContract = new this.web3.eth.Contract(strainzNFTArtifacts.abi as any, contracts.strainzNFTAddress);
              this.strainzTokenContract = new this.web3.eth.Contract(strainzTokenArtifacts.abi as any, contracts.strainzTokenAddress);
              this.strainzAccessoryContract = new this.web3.eth.Contract(strainzAccessoryArtifacts.abi as any, contracts.strainzAccessoryAddress);
              this.marketplaceContract = new this.web3.eth.Contract(marketplaceArtifacts.abi as any, contracts.strainzMarketplaceAddress);
              this.seedzTokenContract = new this.web3.eth.Contract(seedzTokenArtifacts.abi as any, contracts.seedzTokenAddress);
              this.vaultFactoryContract = new this.web3.eth.Contract(strainzMultisigFactoryArtifacts.abi as any,
                contracts.strainzMultisigVaultFactoryAddress);

              this.migrationContract = new this.web3.eth.Contract(migratorArtifacts.abi as any, contracts.migration);
              this.v2Contracts.strainzNFT = new this.web3.eth.Contract(strainzNFTArtifactsV2.abi as any, contractsV2.strainzNFTAddress);
              this.v2Contracts.strainzToken = new this.web3.eth.Contract(strainzTokenArtifactsV2.abi as any, contractsV2.strainzTokenAddress);
              this.v2Contracts.seedzToken = new this.web3.eth.Contract(seedzTokenArtifactsV2.abi as any, contractsV2.seedzTokenAddress);
              this.v2Contracts.strainzAccessory = new this.web3.eth.Contract(accessoryArtifactsV2.abi as any, contractsV2.strainzAccessoryAddress);
              this.v2Contracts.marketplace = new this.web3.eth.Contract(marketplaceArtifactsV2.abi as any, contractsV2.strainzMarketplaceAddress);

              this.routerContract = new this.web3.eth.Contract(routerABI.abi as any, contractsV2.router);

              this.accounts$.next(await this.web3.eth.getAccounts());

              dialogRef.close();
              resolve();
            }
          }
        });
      } catch {
        reject();
      }
    });
  }

  public async getVaultBalance(vault: VaultModel): Promise<number> {
    return await this.strainzTokenContract.methods.balanceOf(vault.address).call();
  }

  public async getVaultPlants(vault: VaultModel): Promise<StrainMetadataExtended[]> {
    // TODO: return this.mapPlantsToExtended(await this.fetchPlants(vault.address));
    return [];
  }

  public getAccounts(): Observable<string[]> {
    return this.accounts$.asObservable();
  }

  public getMyPlants(): Observable<StrainMetadataExtended[]> {
    return this.myPlants$.asObservable();
  }

  public getMyAccessories(): Observable<AccessoryModel[]> {
    return this.myAccessories$.asObservable();
  }

  public getMyNFTs(): Observable<NFT[]> {
    return this.myNfts$.asObservable();
  }

  public getAllPlants(): Observable<StrainzModel[]> {
    return this.allPlants$.asObservable();
  }

  public getPlant(id: number): Observable<StrainzModel | null> {
    return this.getAllPlants().pipe(map(strainz => {
      return strainz.find(s => s._id == id);
    }));
  }


  private async fetchMyStrainzTokens(): Promise<number> {
    return +await this.strainzTokenContract.methods.balanceOf(this.accounts$.value[0]).call();
  }

  private async fetchMySeedzTokens(): Promise<number> {
    return +await this.seedzTokenContract.methods.balanceOf(this.accounts$.value[0]).call();
  }

  private async fetchApprovedStrainzTokensForMarketplace(): Promise<number> {
    return +await this.strainzTokenContract.methods.allowance(this.accounts$.value[0], contracts.strainzMarketplaceAddress).call();
  }

  private async fetchApprovedStrainzTokensForBreed(): Promise<number> {
    return +await this.strainzTokenContract.methods.allowance(this.accounts$.value[0], contracts.strainzNFTAddress).call();
  }

  private async fetchApprovedSeedzTokensForStrainz(): Promise<number> {
    return +await this.seedzTokenContract.methods.allowance(this.accounts$.value[0], contracts.strainzNFTAddress).call();
  }

  private async fetchStrainWithAccessories(id: number): Promise<StrainzModel> {
    const metadata: StrainMetadata = await this.strainzNFTContract.methods.strainData(id).call();
    const owner: string = await this.strainzNFTContract.methods.ownerOf(id).call();

    const accessoryIds: number[] = await this.strainzAccessoryContract.methods.getAccessoriesByStrainId(id).call();
    metadata.accessories = await Promise.all(accessoryIds.map(async id2 => {
      return +await this.strainzAccessoryContract.methods.accessoryTypeByTokenId(+id2).call();
    }));
    metadata.lastFertilizer = +await this.seedzTokenContract.methods.lastTimeGrowFertilizerUsedOnPlant(id).call();
    return {
      ...metadata,
      _id: id,
      owner,
      generation: +metadata.generation,
      growRate: +metadata.growRate,
      lastHarvest: +metadata.lastHarvest,
      lastFertilizer: +metadata.lastFertilizer,
      accessories: metadata.accessories
    };
  }

  private async fetchPlants(address: string = this.accounts$.value[0]): Promise<StrainzModel[]> {
    const numberOfPlants = await this.strainzNFTContract.methods.balanceOf(address).call();

    const promises: Promise<string>[] = [];
    for (let i = 0; i < numberOfPlants; i++) {
      promises.push(this.strainzNFTContract.methods.tokenOfOwnerByIndex(address, i).call());
    }
    const tokenIds = await Promise.all(promises);
    return await Promise.all(tokenIds.map(async id => {
      return this.fetchStrainWithAccessories(+id);
    }));


  }

  private async fetchMyAccessories(): Promise<AccessoryModel[]> {
    const me = this.accounts$.value[0];
    const numberOfAccessories = await this.strainzAccessoryContract.methods.balanceOf(me).call();

    return await Promise.all(new Array(+numberOfAccessories).fill(null).map(async (_, index) => {
      const tokenId = await this.strainzAccessoryContract.methods.tokenOfOwnerByIndex(me, index).call();
      return await this.fetchAccessory(tokenId);
    }));
  }

  async fetchAccessory(id: number): Promise<AccessoryModel> {
    const type = await this.strainzAccessoryContract.methods.accessoryTypeByTokenId(id).call();
    const boost = boostValues[(+type) - 1];
    return {
      type: +type,
      accessoryId: +id,
      boost
    };
  }


  private async fetchMyNFTs(): Promise<NFT[]> {
    return await this.strainzService.getNFTsForUser(this.accounts$.value[0]);
  }

  private async fetchMyVaults(): Promise<VaultModel[]> {
    const myAccount = this.accounts$.value[0];
    const numberOfVaults = await this.vaultFactoryContract.methods.numberOfVaults().call();

    const addressPromises: Promise<string>[] = [];
    for (let i = 0; i < numberOfVaults; i++) {
      addressPromises.push(this.vaultFactoryContract.methods.vaults(i).call());
    }
    const allVaults = await Promise.all((await Promise.all(addressPromises)).map(async address => {
      const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, address);
      const name = await vaultContract.methods.name().call();
      const id = await vaultContract.methods.vaultId().call();
      const minSignersNeeded = await vaultContract.methods.minSignersNeeded().call();
      const signers = await vaultContract.methods.getSigners().call();
      const names = await Promise.all(signers.map(async signerAddress => {
        return await vaultContract.methods.signerNames(signerAddress).call();
      }));

      const combinedSigners = signers.map((a, index) => {
        return {
          address: a,
          name: names[index]
        };
      });

      return {
        id, name, minSignersNeeded, signers: combinedSigners, address
      };
    }));

    return allVaults.filter(vault => {
      return vault.signers.some(signer => {
        return signer.address === myAccount;
      });
    });
  }

  public async transferPlant(plant: StrainzModel, receiver: string): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzNFTContract.methods.transferFrom(sender, receiver, plant._id).send({
      from: sender
    });
    if (result.status) {
      const id = result.events.Transfer.returnValues.tokenId;
      this.myPlants$.next(this.myPlants$.value.filter(data => data._id != id));
    }
  }

  public async transferAccessory(accessory: AccessoryModel, receiver: string): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzAccessoryContract.methods.transferFrom(sender, receiver, accessory.accessoryId).send({
      from: sender
    });
    if (result.status) {
      const id = result.events.Transfer.returnValues.tokenId;
      this.myAccessories$.next(this.myAccessories$.value.filter(data => data.accessoryId != id));
    }
  }

  public async proposeStrainzTokensTransfer(vault: ExtendedVaultModel, receiver: string, amount: number): Promise<void> {
    const sender = this.accounts$.value[0];
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address, {from: sender});

    const result = await vaultContract.methods.proposeWithdrawal(receiver, amount, false).send({
      from: sender
    });
    if (result.status) {
      const id = result.events.ProposalCreated.returnValues.proposalId;
      const proposal: Proposal = await vaultContract.methods.proposals(id).call();
      proposal.proposalType = +proposal.proposalType;
      proposal.signers = [sender];
      vault.proposals.next([...vault.proposals.value, proposal]);
    }

  }

  public async proposeAccessoryTransfer(accessory: AccessoryModel, receiver: string, vault: ExtendedVaultModel): Promise<void> {
    // TODO implement
    return;
  }

  public async proposePlantTransfer(plant: StrainzModel, receiver: string, vault: ExtendedVaultModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address, {from: sender});

    const result = await vaultContract.methods.proposeWithdrawal(receiver, plant._id, true).send({
      from: sender
    });

    if (result.status) {
      const id = result.events.ProposalCreated.returnValues.proposalId;
      const proposal: Proposal = await vaultContract.methods.proposals(id).call();
      proposal.proposalType = +proposal.proposalType;
      proposal.signers = [sender];
      vault.proposals.next([...vault.proposals.value, proposal]);
    }
  }

  public async changeStrainName(strain: StrainzModel, prefix: string, postfix): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzNFTContract.methods.changeName(strain._id, prefix, postfix).send({
      from: sender
    });
    if (result.status) {
      strain.prefix = prefix;
      strain.postfix = postfix;
    }
    await this.refreshStrainzTokens();
  }

  public async changeStrainColor(strain: StrainzModel, colors: number[]): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzNFTContract.methods.changeColor(strain._id, ...colors).send({
      from: sender
    });

    const padded = colors.map(color => `${color}`.padStart(3, '0'));

    if (result.status) {
      const newDNA = strain.dna.substring(0, 7) + `${padded[0]}${padded[1]}${padded[2]}`;
      console.log(strain.dna);

      strain.dna = mapDNA(newDNA, strain.accessories);
      console.log(strain.dna);
    }
    this.myPlants$.next([...this.myPlants$.value]);
    await this.refreshStrainzTokens();

  }

  public async proposeBreed(plant1: StrainzModel, plant2: StrainzModel, vault: ExtendedVaultModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address, {from: sender});

    const result = await vaultContract.methods.proposeBreed(plant1._id, plant2._id).send({
      from: sender
    });

    if (result.status) {
      const id = result.events.ProposalCreated.returnValues.proposalId;
      const proposal: Proposal = await vaultContract.methods.proposals(id).call();
      proposal.proposalType = +proposal.proposalType;
      proposal.signers = [sender];
      vault.proposals.next([...vault.proposals.value, proposal]);
    }
  }

  public async breedPlants(plant1: StrainzModel, plant2: StrainzModel, fertilizer = false): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzNFTContract.methods.breed(plant1._id, plant2._id, fertilizer).send({
      from: sender
    });
    const newId = result?.events?.Minted?.returnValues?.tokenId;
    if (newId) {
      const newStrain: StrainzModel = await this.fetchStrainWithAccessories(newId);

      const extended: StrainMetadataExtended = {
        ...newStrain,
        harvestableAmount: new BehaviorSubject<number>(0),
        wateringCost: new BehaviorSubject<number>(0),
        currentGrowRate: new BehaviorSubject<number>(0)
      };
      extended.harvestableAmount.next(await this.harvestableAmount(extended._id));
      extended.wateringCost.next(await this.wateringCost(extended._id));
      extended.currentGrowRate.next(await this.getGrowPerDayForPlant(extended._id));
      extended.lastFertilizer = await this.getLastFertilizerForPlant(extended._id);
      extended.dna = mapDNA(extended.dna, extended.accessories);

      this.myPlants$.next([...this.myPlants$.value, extended]);
      await this.refreshStrainzTokens();
      plant1.breedingCost = +plant1.breedingCost + +plant1.growRate * 20;
      plant2.breedingCost = +plant2.breedingCost + +plant2.growRate * 20;
    }
  }

  public async harvestAndWaterAll(): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.strainzNFTContract.methods.harvestAndWaterAll().send({
      from: sender
    });

    await this.refreshStrainzTokens();
  }

  public async harvestVault(vault: VaultModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address, {from: sender});
    await vaultContract.methods.harvest().send({
      from: sender
    });
  }

  public async refreshStrainzTokens(): Promise<void> {
    const [myStrainzTokens, approvedStrainzTokensForMarketplace, approvedStrainzTokensForBreed, mySeedzTokens] = await Promise.all([
      this.fetchMyStrainzTokens(),
      this.fetchApprovedStrainzTokensForMarketplace(),
      this.fetchApprovedStrainzTokensForBreed(),
      this.fetchMySeedzTokens()
    ]);
    this.myStrainzTokens$.next(myStrainzTokens);
    this.mySeedzTokens$.next(mySeedzTokens);
    this.approvedStrainzTokensForMarketplace$.next(approvedStrainzTokensForMarketplace);
    this.approvedStrainzTokensForBreed$.next(approvedStrainzTokensForBreed);
  }

  public async harvestableAmount(tokenId: number): Promise<number> {
    return await this.strainzNFTContract.methods.harvestableAmount(tokenId).call();
  }

  public async wateringCost(tokenId: number): Promise<number> {
    return await this.strainzNFTContract.methods.getWateringCost(tokenId).call();
  }

  public async approveStrainzTokens(operator: string, amount: number): Promise<boolean> {
    if (!this.web3) {
      await this.onboardUser();
    }
    const sender = this.accounts$.value[0];

    amount = Math.ceil(amount);

    const result = await this.strainzTokenContract.methods.approve(operator, `${amount}`).send({
      from: sender
    });
    await this.refreshStrainzTokens();
    return result;
  }


  public async buyStrainzTrade(trade: TradeModel): Promise<void> {
    if (!this.web3) {
      await this.onboardUser();
    }
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.executeERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.closeTrade(trade, sender);
      const id = result.events.Transfer.returnValues.tokenId;
      const newStrain: StrainzModel = await this.fetchStrainWithAccessories(id);
      const extended: StrainMetadataExtended = {
        ...newStrain,
        harvestableAmount: new BehaviorSubject<number>(0),
        wateringCost: new BehaviorSubject<number>(0),
        currentGrowRate: new BehaviorSubject<number>(0)
      };
      extended.harvestableAmount.next(await this.harvestableAmount(extended._id));
      extended.wateringCost.next(await this.wateringCost(extended._id));
      extended.currentGrowRate.next(await this.getGrowPerDayForPlant(extended._id));
      extended.lastFertilizer = await this.getLastFertilizerForPlant(extended._id);
      extended.dna = mapDNA(extended.dna, extended.accessories);
      this.myPlants$.next([...this.myPlants$.value, extended]);
    }
    await this.refreshStrainzTokens();
  }

  public async buyAccessoryTrade(trade: AccessoryTradeModel): Promise<void> {
    if (!this.web3) {
      await this.onboardUser();
    }
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.executeERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.closeTrade(trade, sender);
      this.myAccessories$.next([...this.myAccessories$.value, trade.accessory]);
    }
    await this.refreshStrainzTokens();
  }

  public async sellStrain(strain: StrainzModel, price: number): Promise<void> {
    price *= 10000;

    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.openERC721Trade(contracts.strainzNFTAddress, strain._id, price).send({
      from: sender
    });

    if (result.status) {
      const id = strain._id;
      this.myPlants$.next(this.myPlants$.value.filter(data => data._id != id));
      const tradeId = result.events.ERC721TradeStatusChange.returnValues.tradeId;
      const newTrade: TradeModel = await this.marketplaceContract.methods.erc721Trades(tradeId).call();

      this.strainzService.openTrade(newTrade);
    }
  }

  public async sellAccessory(accessory: AccessoryModel, price: number): Promise<void> {
    price *= 10000;
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.openERC721Trade(contracts.strainzAccessoryAddress, accessory.accessoryId, price)
      .send({
        from: sender
      });

    if (result.status) {
      const id = accessory.accessoryId;
      this.myAccessories$.next(this.myAccessories$.value.filter(data => data.accessoryId != id));
      const tradeId = result.events.ERC721TradeStatusChange.returnValues.tradeId;
      const newTrade: TradeModel = await this.marketplaceContract.methods.erc721Trades(tradeId).call();

      this.strainzService.openTrade(newTrade);
    }
  }

  public async cancelStrainzTrade(trade: StrainzTradeModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.cancelERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.cancelTrade(trade);
      this.myPlants$.next([...this.myPlants$.value, trade.strain as StrainMetadataExtended]);
    }
  }

  public async cancelOffer(offer: OfferModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.cancelERC721Offer(offer._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.cancelOffer(offer);
      await this.refreshStrainzTokens();
    }
  }

  public async cancelAccessoryTrade(trade: AccessoryTradeModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.cancelERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.cancelTrade(trade);
      this.myAccessories$.next([...this.myAccessories$.value, trade.accessory]);
    }

  }

  public async sellNFT(nft: NFT, price: number): Promise<void> {
    price *= 10000;

    const sender = this.accounts$.value[0];
    if (!(nft.contract_addr && nft.token_id)) {
      throw new Error('no nft contract found');
    }
    const result = await this.marketplaceContract.methods.openERC721Trade(nft.contract_addr, nft.token_id, price).send({
      from: sender
    });

    if (result.status) {
      const id = result.events.Transfer.returnValues.tokenId;

      this.myNfts$.next(this.myNfts$.value
        .filter(data => !(data.token_id == id && data.contract_addr.toLowerCase() === nft.contract_addr.toLowerCase())));

      const tradeId = result.events.ERC721TradeStatusChange.returnValues.tradeId;
      const newTrade: TradeModel = await this.marketplaceContract.methods.erc721Trades(tradeId).call();
      this.strainzService.openTrade(newTrade);
    }
  }

  public async buyNFT(trade: TradeModel): Promise<void> {
    if (!this.web3) {
      await this.onboardUser();
    }
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.executeERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.closeTrade(trade, sender);
      const id = result.events.Transfer.returnValues.tokenId;
      const newNFT = await this.getNFT(trade.nftContractAddress, id);

      this.myNfts$.next([...this.myNfts$.value, newNFT]);
    }
    await this.refreshStrainzTokens();
  }

  public async cancelNFTTrade(trade: TradeModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.cancelERC721Trade(trade._id).send({
      from: sender
    });
    if (result.status) {
      this.strainzService.cancelTrade(trade);
      const id = result.events.Transfer.returnValues.tokenId;
      const newNFT = await this.getNFT(trade.nftContractAddress, id);

      this.myNfts$.next([...this.myNfts$.value, newNFT]);


    }

  }


  public async approveNFT(nft: NFT): Promise<void> {
    const sender = this.accounts$.value[0];
    const nftContract = new this.web3.eth.Contract(ierc721Artifacts.abi as any, nft.contract_addr);
    await nftContract.methods.approve(contracts.strainzMarketplaceAddress, nft.token_id).send({
      from: sender
    });
  }

  public async approveStrainzNFT(strainId: number): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.strainzNFTContract.methods.approve(contracts.strainzMarketplaceAddress, strainId).send({
      from: sender
    });
  }

  public async approveAccessory(accessory: AccessoryModel): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.strainzAccessoryContract.methods.approve(contracts.strainzMarketplaceAddress, accessory.accessoryId).send({
      from: sender
    });
  }

  public async isApprovedNFT(nft: NFT): Promise<boolean> {
    const nftContract = new this.web3.eth.Contract(ierc721Artifacts.abi as any, nft.contract_addr);
    const result = await nftContract.methods.getApproved(nft.token_id).call();
    return result === contracts.strainzMarketplaceAddress;
  }

  public async isApprovedStrainzNFT(strain: StrainzModel): Promise<boolean> {
    const result = await this.strainzNFTContract.methods.getApproved(strain._id).call();
    return result === contracts.strainzMarketplaceAddress;
  }

  public async isApprovedAccessory(accessory: AccessoryModel): Promise<boolean> {
    const result = await this.strainzAccessoryContract.methods.getApproved(accessory.accessoryId).call();
    return result === contracts.strainzMarketplaceAddress;
  }

  public async getNFT(contractAddress: string, tokenId: string): Promise<NFT | null> {
    /*const nftContract = new this.bscWeb3.eth.Contract(ierc721Artifacts.abi as any, contractAddress);
    const uri = await nftContract.methods.tokenURI(tokenId).call();
    const owner = await nftContract.methods.ownerOf(tokenId).call();
    return await this.strainzService.resolveNFT(uri, tokenId, contractAddress, owner);*/
    return null;
  }


  async signProposal(proposal: Proposal, vault: VaultModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const vaultContract = new this.web3.eth.Contract(strainzMultisigVaultArtifacts.abi as any, vault.address, {from: sender});
    const result = await vaultContract.methods.signProposal(proposal.id).send({
      from: sender
    });

    if (result.status) {
      const id = result.events.ProposalSigned.returnValues.proposalId;
      const executed = result.events.ProposalExecuted.returnValues.proposalId;

      if (id) {
        proposal.signers.push(sender);
      }

      if (executed) {
        proposal.executed = true;
      }
    }
  }

  async compost(strain: StrainMetadataExtended): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzNFTContract.methods.compost(strain._id).send({
      from: sender
    });
    if (result.status) {
      const id = result.events.Composted.returnValues.tokenId;
      clearInterval(strain.interval);
      this.myAccessories$.next(await this.fetchMyAccessories());
      this.myPlants$.next(this.myPlants$.value.filter(data => data._id != id));
      await this.refreshStrainzTokens();
    }
  }

  async attachAccessory(accessory: AccessoryModel, strain: StrainzModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.strainzAccessoryContract.methods.attachAccessory(accessory.accessoryId, strain._id).send({
      from: sender
    });
    if (result.status) {
      this.myAccessories$.next(this.myAccessories$.value.filter(acc => acc.accessoryId != accessory.accessoryId));
      strain.accessories.push(accessory.type);
      strain.dna = mapDNA(strain.dna, strain.accessories);
      this.myPlants$.next([...this.myPlants$.value]);
    }
  }

  async getPool(id: number): Promise<PoolModel> {
    const sender = this.accounts$.value[0];
    const lpTokenContract = new this.web3.eth.Contract(ierc20Artifacts.abi as any, id == 0 ? contracts.pool1 : contracts.pool2);

    const balance = await lpTokenContract.methods.balanceOf(sender).call();
    const userInfo = await this.seedzTokenContract.methods.userInfo(id, sender).call();
    let claimable = 0;
    try {
      claimable = await this.seedzTokenContract.methods.pendingSeedz(id, sender).call();

    } catch {

    }
    const stakedLP = await lpTokenContract.methods.balanceOf(contracts.seedzTokenAddress).call();
    const totalLP = await lpTokenContract.methods.totalSupply().call();
    return {
      id,
      balance: +balance,
      staked: +userInfo?.amount ?? 0,
      claimable: +claimable,
      stakedLP,
      totalLP
    };
  }


  async approveLPTokensForPool(poolId: number, amount: number): Promise<void> {
    const sender = this.accounts$.value[0];
    const lpTokenContract = new this.web3.eth.Contract(ierc20Artifacts.abi as any, poolId == 0 ? contracts.pool1 : contracts.pool2);
    await lpTokenContract.methods.approve(contracts.seedzTokenAddress, amount).send({
      from: sender
    });
  }

  async despositPool(poolId: number, amount: number): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.seedzTokenContract.methods.deposit(poolId, amount).send({
      from: sender
    });

  }

  async withdrawPool(poolId: number, amount: number): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.seedzTokenContract.methods.withdraw(poolId, amount).send({
      from: sender
    });

  }

  async withdrawV2Pool(poolId: number, amount: number): Promise<void> {
    const sender = this.accounts$.value[0];
    await this.v2Contracts.seedzToken.methods.withdraw(poolId, amount).send({
      from: sender
    });

  }

  async getGrowPerDayForPlant(plantId: number): Promise<number> {
    return await this.strainzNFTContract.methods.getCurrentGrowRateForPlant(plantId).call();
  }

  async getLastFertilizerForPlant(plantId: number): Promise<number> {
    return await this.seedzTokenContract.methods.lastTimeGrowFertilizerUsedOnPlant(plantId).call();
  }

  async buyFertilizer(plantId: number): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.seedzTokenContract.methods.buyGrowFertilizer(plantId).send({
      from: sender
    });
  }

  async makeOffer(data: StrainMetadataExtended, offerAmount: number): Promise<void> {
    offerAmount *= 10000;
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.openERC721Offer(contracts.strainzNFTAddress, data._id, offerAmount).send({
      from: sender
    });

    if (result.status) {
      await this.refreshStrainzTokens();
      const offerId = result.events.ERC721OfferStatusChange.returnValues.offerId;
      const newOffer: FetchOfferModel = await this.marketplaceContract.methods.erc721Offers(offerId).call();
      await this.strainzService.createOffer({
        _id: +newOffer.id,
        status: +newOffer.status,
        tokenId: +newOffer.tokenId,
        offerAmount: +newOffer.offerAmount,
        offerer: newOffer.offerer,
        seller: newOffer.seller,
        nftContractAddress: newOffer.nftContractAddress
      });
    }

  }

  async acceptOffer(offer: StrainzOfferModel): Promise<void> {
    const sender = this.accounts$.value[0];
    const result = await this.marketplaceContract.methods.executeERC721Offer(offer._id).send({
      from: sender
    });

    if (result.status) {
      await this.refreshStrainzTokens();
      const id = offer.tokenId;
      this.myPlants$.next(this.myPlants$.value.filter(data => data._id != id));
      await this.strainzService.executeOffer(offer, sender);
    }
  }

  async migrateV2ToV3Plants(): Promise<void> {
    const sender = this.accounts$.value[0];

    await this.v2Contracts.strainzNFT.methods.setApprovalForAll(contracts.strainzNFTAddress, true).send({
      from: sender
    });

    await this.migrationContract.methods.migrateNFTs().send({
      from: sender
    });

  }

  async migrateV2ToV3Accessories(): Promise<void> {
    const sender = this.accounts$.value[0];

    await this.v2Contracts.strainzAccessory.methods.setApprovalForAll(contracts.strainzAccessoryAddress, true).send({
      from: sender
    });

    await this.migrationContract.methods.migrateAccessories().send({
      from: sender
    });

  }


  async migrateV2ToV3Tokens(): Promise<void> {
    const sender = this.accounts$.value[0];

    const strainzBalance = await this.v2Contracts.strainzToken.methods.balanceOf(sender).call();
    const seedzBalance = await this.v2Contracts.seedzToken.methods.balanceOf(sender).call();


    await this.v2Contracts.strainzToken.methods.approve(contracts.migration, strainzBalance).send({
      from: sender
    });

    await this.v2Contracts.seedzToken.methods.approve(contracts.migration, seedzBalance).send({
      from: sender
    });

    await this.migrationContract.methods.migrateTokens().send({
      from: sender
    });

  }

  async getV2Pool(id: number): Promise<PoolModel> {
    const sender = this.accounts$.value[0];
    const lpTokenContract = new this.web3.eth.Contract(ierc20Artifacts.abi as any, id == 0 ? contractsV2.pool1LP : contractsV2.pool2LP);

    const balance = await lpTokenContract.methods.balanceOf(sender).call();
    const userInfo = await this.v2Contracts.seedzToken.methods.userInfo(id, sender).call();
    let claimable = 0;
    try {
      claimable = await this.v2Contracts.seedzToken.methods.pendingSeedz(id, sender).call();

    } catch {

    }
    const stakedLP = await lpTokenContract.methods.balanceOf(contractsV2.seedzTokenAddress).call();
    const totalLP = await lpTokenContract.methods.totalSupply().call();
    return {
      id,
      balance: +balance,
      staked: +userInfo?.amount ?? 0,
      claimable: +claimable,
      stakedLP,
      totalLP
    };
  }

  async getV2PlantAmount(): Promise<number> {
    const sender = this.accounts$.value[0];

    return await this.v2Contracts.strainzNFT.methods.balanceOf(sender).call();
  }

  async getV2AccessoriesAmount(): Promise<number> {
    const sender = this.accounts$.value[0];

    return await this.v2Contracts.strainzAccessory.methods.balanceOf(sender).call();

  }
}
