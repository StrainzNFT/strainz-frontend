import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StrainzModel } from '../models/strain.model';
import * as config from '../config.json';
import * as contracts from '../contracts.json';
import { map } from 'rxjs/operators';
import { TradeModel, TradeStatus } from '../models/trade.model';
import { NFT, UserNFTResponse } from '../models/bounce/user-nft.response';
import { ERC721Metadata } from '../models/ERC721Metadata';
import { mapDNA } from '../util';
import { PoolModel } from '../models/poolModel';
import { OfferModel } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class StrainzService {

  constructor(private httpClient: HttpClient) {
  }

  trades$: BehaviorSubject<TradeModel[]>;
  offers$: BehaviorSubject<OfferModel[]>;

  getAllStrainz(): Observable<StrainzModel[]> {
    return this.httpClient.get<StrainzModel[]>(`${config.host}/strainz`).pipe(
      map(strainz => {
        return strainz.map(strain => {
          strain.dna = mapDNA(strain.dna, strain.accessories);

          return strain;
        });
      })
    );
  }


  private getTrades(): Observable<TradeModel[]> {
    if (!this.trades$) {
      this.trades$ = new BehaviorSubject<TradeModel[]>([]);
      this.fetchTrades().then();
    }
    return this.trades$.asObservable();
  }

  public getStrainzTrades(): Observable<TradeModel[]> {
    return this.getTrades().pipe(
      map(trades => {
        return trades.filter(trade => {
          return trade.nftContractAddress === contracts.strainzNFTAddress;
        });
      })
    );
  }

  public getStrainzTradeForPlantId(id: number): Observable<TradeModel | null> {
    return this.getStrainzTrades().pipe(
      map(trades => {
        return trades.filter(trade => trade.status == TradeStatus.Open).find(t => t.tokenId == id);
      })
    );
  }

  public getOffers(): Observable<OfferModel[]> {
    if (!this.offers$) {
      this.offers$ = new BehaviorSubject<OfferModel[]>([]);
      this.fetchOffers().then();
    }
    return this.offers$.asObservable().pipe(
      map(offers => {
        return offers.filter(offer => {
          return offer.nftContractAddress === contracts.strainzNFTAddress;
        });
      })
    );
  }


  public getAccessoryTrades(): Observable<TradeModel[]> {
    return this.getTrades().pipe(
      map(trades => {
        return trades.filter(trade => {
          return trade.nftContractAddress === contracts.strainzAccessoryAddress;
        });
      })
    );
  }

  public getNFTTrades(): Observable<TradeModel[]> {
    return this.getTrades().pipe(
      map(trades => {
        return trades.filter(trade => {
          return trade.nftContractAddress !== contracts.strainzNFTAddress;
        });
      })
    );
  }


  closeTrade(trade: TradeModel, buyer: string): void {
    const existing = this.trades$.value.find(t => t._id === trade._id);
    existing.status = TradeStatus.Closed;
    existing.buyer = buyer;

    this.trades$.next([...this.trades$.value]);
  }

  openTrade(trade: TradeModel): void {
    const newTrades: TradeModel[] = [...this.trades$.value, trade];
    this.trades$.next(newTrades);
  }

  cancelTrade(trade: TradeModel): void {
    const existing = this.trades$.value.find(t => t._id === trade._id);
    existing.status = TradeStatus.Cancelled;
    this.trades$.next([...this.trades$.value]);

  }

  createOffer(offer: OfferModel): void {
    if (this.offers$) {
      const newOffers: OfferModel[] = [...this.offers$.value, offer];
      this.offers$.next(newOffers);
    } else {
      this.offers$ = new BehaviorSubject<OfferModel[]>([]);
      this.fetchOffers().then(() => {
        const offers = [...this.offers$.value.filter(o => o._id !== offer._id), offer];
        this.offers$.next(offers);
      });
    }

  }


  cancelOffer(offer: OfferModel): void {
    const existing = this.offers$.value.find(t => t._id === offer._id);
    existing.status = TradeStatus.Cancelled;
    this.offers$.next([...this.offers$.value]);

  }


  executeOffer(offer: OfferModel, seller: string): void {
    const existing = this.offers$.value.find(t => t._id === offer._id);
    existing.status = TradeStatus.Closed;
    existing.seller = seller;
    this.offers$.next([...this.offers$.value]);
  }

  public async fetchTrades(): Promise<void> {
    this.trades$.next(await this.httpClient.get<TradeModel[]>(`${config.host}/trades`).toPromise());
  }
  public async fetchOffers(): Promise<void> {
    this.offers$.next(await this.httpClient.get<OfferModel[]>(`${config.host}/offers`).toPromise());
  }

  public getPlantOffers(plantId: number): Observable<OfferModel[]> {
    return this.httpClient.get<OfferModel[]>(`${config.host}/strainz/${plantId}/offers`);
  }

  public async getNFTsForUser(address: string): Promise<NFT[]> {
    return new Promise(async resolve => {

      const assets = await this.httpClient.get<UserNFTResponse>
      (`https://nftview.bounce.finance/v2/bsc/nft?user_address=${address}`).toPromise();
      console.dir(assets);
      const filtered = assets.data.nfts721.filter(nft => nft?.metadata
        && (nft?.image ?? nft?.metadata?.image) && (nft?.contract_addr?.toLowerCase() !== contracts.strainzNFTAddress.toLowerCase()));
      resolve(filtered);
    });
  }

  public async resolveNFT(uri: string, tokenId: string, contractAddress: string, owner: string): Promise<NFT | null> {
    if (!uri || uri.length === 0) {
      return null;
    }
    try {
      if (uri.startsWith('ipfs://')) {
        uri = 'https://ipfs.io/ipfs/' + uri.split('//')[1];
      }
      const metadata: ERC721Metadata = await this.httpClient.get<ERC721Metadata>(uri).toPromise();
      if (metadata.image?.startsWith('ipfs://')) {
        metadata.image = 'https://ipfs.io/ipfs/' + metadata.image.split('//')[1];
      }

      const nft: NFT = {
        token_id: tokenId,
        contract_addr: contractAddress,
        owner_addr: owner,
        metadata
      };
      return nft;
    } catch {
      return null;
    }
  }

  public async getPublicPool(poolId: number): Promise<PoolModel> {
    return await this.httpClient.get<PoolModel>(`${config.host}/pool/${poolId}`).toPromise();
  }

  public async getStrainzSupply(): Promise<number> {
    return (await this.httpClient.get<{ supply: number }>(`${config.host}/supply/strainz`).toPromise()).supply;
  }

  public async getSeedzSupply(): Promise<number> {
    return (await this.httpClient.get<{ supply: number }>(`${config.host}/supply/seedz`).toPromise()).supply;
  }

}
