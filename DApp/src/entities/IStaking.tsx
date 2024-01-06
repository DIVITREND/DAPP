import { BigNumber } from "ethers";

interface Malus {
    vesting?: number;
    malus_perc?: number;
}

export interface NftStake {
    nft_staked?: number,
    nft_staked_ids?: number[];
    nft_staked_time?: number;
    nft_depositNumb?: number;
}

export interface IClaimData {

}

export interface trnd_claim_data {
    user_pending_trnd?: number;
    user_pending_time?: BigNumber;
    user_deposit_numb?: BigNumber;
}

export interface IStaking {
    trnd_claim_data?: trnd_claim_data;
    stakingOption?: number;
    malus?: Malus[];
    nft_staked_data?: NftStake;
    eth_balance?: number;
    tot_trnd_staked?: number;
    nft_staked?: number;
    trnd_staking_limit?: number;
    last_eth_dep?: number;
    last_eth_dep_time?: number;
}