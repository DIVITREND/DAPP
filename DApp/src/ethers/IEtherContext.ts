import { IAccount } from "../entities/IAccount";
import { IChain } from "../entities/IChain";
import { IFactories } from "../entities/IFactories";
import { ILink } from "../entities/ILink";
import { IToast } from "../entities/IToast";
import { ISwap } from "../entities/ISwap";
import { IPair } from "../entities/IPair";

export interface IEtherContext extends IAccount, IChain, ILink, IToast, IFactories, ISwap, IPair {
    loaded: boolean;
    reload: boolean;
}
