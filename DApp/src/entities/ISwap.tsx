import { IAsset } from "../components/dapp/TokenSelector";

export interface ISwap{
  // signer props
  swapToken?: IAsset;
  swapAmount?: number;
  swapReferral?: number;
  swapDirection?: number;
  swapToChain?: number;
  swapFromChain?: number;
  swapTransactions?: [];

  // provider props
  swapFee?: number;
  threshold?: number;
  thresholdTax?: number;
  thresholdLiq?: number;
  thresholdEnabled?: boolean;
}