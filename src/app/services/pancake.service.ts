import { Injectable } from '@angular/core';
import { ChainId, Fetcher, Fraction, Pair, Route, Token, WETH } from '@pancakeswap-libs/sdk-v2';
import * as contracts from '../contracts.json';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { BaseProvider, JsonRpcProvider } from '@ethersproject/providers';

import { filter, map } from 'rxjs/operators';
import { PoolModel } from '../models/poolModel';

const BLOCKS_PER_DAY = 28800;
const SEEDZ_PER_BLOCK = 0.5;

@Injectable({
  providedIn: 'root'
})
export class PancakeService {
  public static STRAINZ = new Token(ChainId.MAINNET, contracts.strainzTokenAddress, 0, 'STRAINZ', 'Strainz Token');
  public static SEEDZ = new Token(ChainId.MAINNET, contracts.seedzTokenAddress, 18, 'SEEDZ', 'Seedz Token');
  public static BNB = WETH[ChainId.MAINNET];
  public static BUSD = new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance Dollar');
  strainzBnbPair$: BehaviorSubject<Pair> = new BehaviorSubject<Pair>(null);
  strainzSeedzPair$: BehaviorSubject<Pair> = new BehaviorSubject<Pair>(null);
  bnbBusdPair$: BehaviorSubject<Pair> = new BehaviorSubject<Pair>(null);

  provider: BaseProvider;
  constructor() { }

  async init(): Promise<void> {
    this.provider = new JsonRpcProvider('https://bsc-dataseed.binance.org');

    await this.refreshPairs();


  }

  async refreshPairs(): Promise<void> {
    const [strainzBnbPair, strainzSeedzPair, bnbBusdPair] = await Promise.all([
      Fetcher.fetchPairData(PancakeService.STRAINZ, PancakeService.BNB, this.provider),
      Fetcher.fetchPairData(PancakeService.STRAINZ, PancakeService.SEEDZ, this.provider),
      Fetcher.fetchPairData(PancakeService.BNB, PancakeService.BUSD, this.provider)
    ]);

    this.strainzBnbPair$.next(strainzBnbPair);
    this.strainzSeedzPair$.next(strainzSeedzPair);
    this.bnbBusdPair$.next(bnbBusdPair);
  }

  getStrainzBnbPair(): Observable<Pair> {
    return this.strainzBnbPair$.asObservable().pipe(filter(x => !!x));
  }

  getBnbBusdPair(): Observable<Pair> {
    return this.bnbBusdPair$.asObservable().pipe(filter(x => !!x));
  }

  getStrainzSeedzPair(): Observable<Pair> {
    return this.strainzSeedzPair$.asObservable().pipe(filter(x => !!x));
  }

  getStrainzBnbRoute(): Observable<Route> {
    return this.getStrainzBnbPair().pipe(
      map(pair => {
        return new Route([pair], PancakeService.BNB);
      })
    );
  }

  getSeedzStrainzRoute(): Observable<Route> {
    return this.getStrainzSeedzPair().pipe(
      map(pair => {
        return new Route([pair], PancakeService.SEEDZ);
      })
    );
  }

  getBnbBusdRoute(): Observable<Route> {
    return this.getBnbBusdPair().pipe(
      map(pair => {
        return new Route([pair], PancakeService.BUSD);
      })
    );
  }

  getStrainzBusdRoute(): Observable<Route> {
    return combineLatest([this.getStrainzBnbPair(), this.getBnbBusdPair()]).pipe(
      map(([strainzBnb, bnbBusd]) => {
        return new Route([bnbBusd, strainzBnb], PancakeService.BUSD);
      })
    );
  }
  getSeedzBnbRoute(): Observable<Route> {
    return combineLatest([this.getStrainzSeedzPair(), this.getStrainzBnbPair()]).pipe(
      map(([strainzSeedz, strainzBnb]) => {
        return new Route([strainzSeedz, strainzBnb], PancakeService.BNB);
      })
    );
  }


  getSeedzBusdRoute(): Observable<Route> {
    return combineLatest([this.getStrainzSeedzPair(), this.getStrainzBnbPair(), this.getBnbBusdPair()]).pipe(
      map(([seedzStrainz, strainzBnb, bnbBusd]) => {
        return new Route([bnbBusd, strainzBnb, seedzStrainz], PancakeService.BUSD);
      })
    );
  }





  getTVL(pool: PoolModel, ): Observable<number> {
    return combineLatest([this.getSeedzBusdRoute(), this.getStrainzBusdRoute(), this.getBnbBusdRoute(), this.getStrainzBnbPair(), this.getStrainzSeedzPair()]).pipe(
      map(([seedzBusdRoute, strainzBusdRoute, bnbBusdRoute, strainzBnbPair, strainzSeedzPair]) => {
        switch (pool.id) {
          case 0: {
            const strainzReserve = strainzBnbPair.reserveOf(PancakeService.STRAINZ);
            const bnbReserve = strainzBnbPair.reserveOf(PancakeService.BNB);
            const strainzUSD = (strainzBusdRoute.midPrice.invert().adjusted).multiply(strainzReserve);
            const bnbUSD = bnbBusdRoute.midPrice.invert().adjusted.multiply(bnbReserve);
            return strainzUSD.add(bnbUSD);
          }
          case 1: {
            const strainzReserve = strainzSeedzPair.reserveOf(PancakeService.STRAINZ);
            const seedzReserve = strainzSeedzPair.reserveOf(PancakeService.SEEDZ);
            const strainzUSD = strainzBusdRoute.midPrice.invert().adjusted.multiply(strainzReserve);
            const seedzUSD = seedzBusdRoute.midPrice.invert().adjusted.multiply(seedzReserve);
            return strainzUSD.add(seedzUSD);
          }
        }
      }),
      map(totalUSD => {
        return +pool.stakedLP * (+(totalUSD.toSignificant(6)) / +pool.totalLP);
      })
    );

  }

// (derivedETH * blocksPerDay * sushiPerBlock * 365 * (allocPoint / totalAllocPoint)) / (totalValueETH * (slpBalance / totalSupply))
  getAPRofPool(pool: PoolModel): Observable<number> {
    return combineLatest([this.getSeedzBusdRoute(), this.getTVL(pool)]).pipe(
      map(([seedzBusdRoute, tvl]) => {
        const seedzPerBlock = 0.1875;
        const apy = +seedzBusdRoute.midPrice.invert().toSignificant(6) * (seedzPerBlock * (60 / 3) * 60 * 24 * 365) / tvl * 100;
        return apy;
      })
    );



  }
}
