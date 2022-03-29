import { StrainMetadata, StrainMetadataExtended, StrainzModel } from './strain.model';
import { NFT, NftMetadata } from './bounce/user-nft.response';
import { AccessoryModel } from './accessory.model';

export interface TradeModel {
  _id: number;
  poster: string;
  nftContractAddress: string;
  tokenId: number;
  strainzTokenPrice: number;
  status: TradeStatus;
  buyer: string;

}



export interface StrainzTradeModel extends TradeModel {
  strain: StrainzModel;
}

export interface AccessoryTradeModel extends TradeModel {
  accessory: AccessoryModel;
}

export interface NFTTradeModel extends TradeModel {
  nft: NFT;
}
export enum TradeStatus {
  Open = 0, Closed = 1, Cancelled = 2
}
