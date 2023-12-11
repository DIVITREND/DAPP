import { Pair } from "./Pair";
import { PairStatType } from "./PairStatType";

export  interface PairStat{
  title: string;
  type: PairStatType;
  address: string;
  amount?: number
  lpTokens?: number;
  lpTotalSupply?: number;
  pair?: Pair;
  quoteToken?: Pair;
  wethPrice?: number;
  usdtPrice?: number;
}