export default class AddressFactory {

  static getDeployerAddress(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0xa804dfE4b06607F379e0a788c856f1eDDA9B65C2"; // Mainnet
      case 5:
      case 11155111:
        return "0x91fFA8d015C7EF56820383699781526D8D5b4AD3"; //Testnet SEPOLIA
      default:
        return "";
    }
  }

  static getTokenAddress(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0xb0CC685B054e21c9ACcD3D551b2f6Cbf5FA17E1e";
      case 5:
      case 11155111: //
        return "0x8Ffe184421FB9855C20c6be9CaF63508FaedF631";
      default:
        return "";
    }
  }

  static getRouterV2(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506";
      case 5:
      case 11155111: //
        return "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
      default:
        return "";
    }
  }

  static getPair(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0xecac8025f0a1cc0f2b762aa1ee578274f6cc03a6";
      case 5:
      case 11155111:
        return "0x77c05C6D0cd4A6aB595a0a9Bc221181f855821f9";
      default:
        return "";
    }
  }

  static getFactory(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0x35029F03602454A6149b353dd8d227c4f2D99B7c";
      case 5:
      case 11155111:
        return "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
      default:
        return "";
    }
  }

  static getWETH(chainId: Number): string {
    switch (chainId) {
      case 42161:
        return "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
      case 5:
      case 11155111: //
        return "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
      default:
        return "";
    }
  }

  static getStaking(chainId: number): string {
    switch (chainId) {
      case 42161:
        return '0xDB811Ea3c0d9c7D0380Ce429d08dCB4877b46e64'; //arb
      case 11155111:
        return '0x7a4Feb59993bf601bE00d3de8C510FfA8bd71300';
      default:
        return '0x7a4Feb59993bf601bE00d3de8C510FfA8bd71300';
    }
  }

  static getFactoriesAddress(chainId: number): string {
    switch (chainId) {
      case 42161:
        return "0x35029F03602454A6149b353dd8d227c4f2D99B7c";
      case 11155111:
        return "0x3aa397a3eFE14506aE615354d17E353F14cc9F3f";
      default:
        return "";
    }
  }

  static getRpcUrl(chainId: Number | undefined): string | undefined {
    switch (chainId) {
      case 42161:
        return 'https://arb1.arbitrum.io/rpc';
      case 11155111:
        return 'https://eth-sepolia.g.alchemy.com/v2/d9hHRJdy6salX7wZ8wyrmrT5aTiYwhwO';
      default:
        return 'https://arb1.arbitrum.io/rpc';
    }
  }

  static formatAddress(address: string): string {
    return address && address.length > 20 ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}` : '';
  }
}
