import { StrainzModel } from './strain.model';
import { TradeModel } from './trade.model';

export interface OfferModel {
    _id: number;
    offerer: string;
    nftContractAddress: string;
    tokenId: number;
    offerAmount: number;
    status: TradeStatus;
    seller: string;
}

export interface FetchOfferModel {
    id: string;
    offerer: string;
    nftContractAddress: string;
    tokenId: string;
    offerAmount: string;
    status: TradeStatus;
    seller: string;
}
export interface StrainzOfferModel extends OfferModel {
  strain: StrainzModel;
}

export enum TradeStatus {
    Open, Closed, Cancelled
}
