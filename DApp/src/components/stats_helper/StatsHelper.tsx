import AddressFactory from "../../common/AddressFactory";
import { Pair } from "../../entities/stats/Pair";
import { PairStat } from "../../entities/stats/PairStat";
import { PairStatType } from "../../entities/stats/PairStatType";
import EtherHelper from "../../ethers/EtherHelper";

export class StatsHelper {
  public static async getPriceOfToken(address: string): Promise<number | undefined> {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const result = await response.json() as { pairs: Pair[] };

      // Assuming the API response provides the latest price information
      const tokenPair = result.pairs?.[0];
      const tokenPrice = tokenPair?.priceNative;

      return Number(tokenPrice);
    } catch (error) {
      console.error(`Error fetching price for token ${address}:`, error);
      return undefined;
    }
  }

  public static async enrich(farms: PairStat[]): Promise<PairStat[]> {
    const result: PairStat[] = [];

    const wethPrice = await this.getPriceOfToken('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'); // WETH
    const usdtPrice = await this.getPriceOfToken('0xdAC17F958D2ee523a2206206994597C13D831ec7'); // USDT

    const natives = [
      await this.getStatPair('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'), // WETH
      await this.getStatPair('0xdAC17F958D2ee523a2206206994597C13D831ec7'), // USDT
    ];

    const stats = await StatsHelper.getStatPairs(farms.map(s => s.address));

    for (let index = 0; index < farms.length; index++) {
      const stat = farms[index];
      stat.pair = stats.find(p => p.pairAddress === stat.address);

      if (stat.type === PairStatType.hodl && stat.pair?.baseToken?.address) {
        //stat.amount = await EtherHelper.getBalance(stat.pair?.baseToken?.address, AddressFactory.getFarmAddress());
      } else {
        stat.lpTotalSupply = await EtherHelper.totalSupply(stat.address);
        stat.quoteToken = natives.find(p => p.baseToken.symbol === stat.pair?.quoteToken.symbol);

        // Assign the prices of WETH and USDT
        stat.wethPrice = wethPrice;
        stat.usdtPrice = usdtPrice;
      }

      result.push(stat);
    }

    return result;
  }

  public static async getStat(address: string): Promise<Pair | undefined> {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${address}`);
      const result = await response.json() as { pairs: Pair[] };
      return result.pairs?.[0];
    } catch (error) {
      console.error(`Error fetching stat for address ${address}:`, error);
      return undefined;
    }
  }

  public static async getStats(addresses: string[]): Promise<Pair[]> {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses.join(',')}`);
      const result = await response.json() as { pairs: Pair[] };
      return result.pairs;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  }

  public static async getStatPair(address: string): Promise<Pair> {
    try {
      const chain = 'eth';
      const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${address}`);
      const result = await response.json() as { pairs: Pair[] };
      return result.pairs[0];
    } catch (error) {
      console.error(`Error fetching stat pair for address ${address}:`, error);
      throw new Error(`Error fetching stat pair for address ${address}`);
    }
  }

  public static async getStatPairs(addresses: string[]): Promise<Pair[]> {
    try {
      const chain = 'eth';
      const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${addresses.join(',')}`);
      const result = await response.json() as { pairs: Pair[] };
      return result.pairs;
    } catch (error) {
      console.error('Error fetching stat pairs:', error);
      return [];
    }
  }
}
