export default class AddressFactory {

  static getDeployerAddress(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "0xC1ec8665C40B8cAB988C3E126d96d28Bbcdd550a"; // Mainnet
      case 5:
      case 11155111:
        return "0x91fFA8d015C7EF56820383699781526D8D5b4AD3"; //Testnet SEPOLIA
      default:
        return "";
    }
  }

  static getTokenAddress(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "0x8Ffe184421FB9855C20c6be9CaF63508FaedF631";
      case 5:
      case 11155111: //
        return "0x8Ffe184421FB9855C20c6be9CaF63508FaedF631";
      default:
        return "";
    }
  }

  static getRouterV2(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "";
      case 5:
      case 11155111: //
        return "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
      default:
        return "";
    }
  }

  static getPair(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "";
      case 5:
      case 11155111:
        return "0x77c05C6D0cd4A6aB595a0a9Bc221181f855821f9";
      default:
        return "";
    }
  }

  static getFactory(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "";
      case 5:
      case 11155111:
        return "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
      default:
        return "";
    }
  }

  static getWETH(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "";
      case 5:
      case 11155111: //
        return "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
      default:
        return "";
    }
  }

  static getStaking(chainId: number): string {
    switch (chainId) {
      case 1:
        return '';
      case 11155111:
        return '0x7a4Feb59993bf601bE00d3de8C510FfA8bd71300';
      default:
        return '0x7a4Feb59993bf601bE00d3de8C510FfA8bd71300';
    }
  }

  static getFactoriesAddress(chainId: number): string {
    switch (chainId) {
      case 1:
        return "0x6De751fc359a32eDd3cd4164f8750f303f4BCE03";
      case 11155111:
        return "0x3aa397a3eFE14506aE615354d17E353F14cc9F3f";
      default:
        return "";
    }
  }

  static getRpcUrl(chainId: Number | undefined): string | undefined {
    switch (chainId) {
      case 1:
        return 'https://ethereum.publicnode.com';
      case 11155111:
        return 'https://eth-sepolia.g.alchemy.com/v2/d9hHRJdy6salX7wZ8wyrmrT5aTiYwhwO';
      default:
        return 'https://eth-sepolia.g.alchemy.com/v2/d9hHRJdy6salX7wZ8wyrmrT5aTiYwhwO';
    }
  }

  static formatAddress(address: string): string {
    return address && address.length > 20 ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}` : '';
  }
}
