export interface UserNFTResponse {
  code: number;
  data: NFTData;
  msg: string;
}

export interface NFTData {
  nfts1155: NFT[];
  nfts721: NFT[];
}

export interface NFT {
  id?: number;
  contract_addr?: string;
  token_type?: string;
  token_id: string;
  owner_addr: string;
  balance?: string;
  token_uri?: string;
  name?: null;
  description?: null;
  image?: null;
  metadata: NftMetadata | null;
}

export interface NftMetadata {
  image: string;
  name: string;
}


export interface ContractNFTResponse {
  code?: number;
  data: { [tokenId: string]: NFTDatum };
  msg?: string;
}

export interface NFTDatum {
  description: string;
  image: string;
  name: string;
}
