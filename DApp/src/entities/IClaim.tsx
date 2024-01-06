import { IClaimETH } from "./IClaimETH";
import { IClaimTRND } from "./IClaimTRND";

export interface IClaim {
    trnd_claim_history?: IClaimTRND;
    eth_claim_history?: IClaimETH;
    trnd_to_claim?: number;
}