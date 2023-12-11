export interface IAccount {
    balance?: number;
    ethAmount?: number;
    connected?: boolean;
    addressSigner?: string;
    //whitelisted?: boolean;
    claimed?: boolean;
    otherBalance?: number;
  }