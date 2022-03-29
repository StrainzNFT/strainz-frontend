import {BehaviorSubject} from 'rxjs';

export interface VaultModel {
  id: number | string;
  name: string;
  address: string;
  minSignersNeeded: number | string;
  signers: {
    name: string;
    address: string;
  }[];
}

export interface ExtendedVaultModel extends VaultModel {
    proposals: BehaviorSubject<Proposal[]>;
}

export enum ProposalType {
  WithdrawBudz, WithdrawNFT, Breed
}

export interface Proposal {
  id: number;
  proposalType: ProposalType;
  signers: string[];
  amount: number;
  tokenId: number;
  breedId1: number;
  breedId2: number;
  executed: boolean;
  receiver: string;
  proposer: string;
}
