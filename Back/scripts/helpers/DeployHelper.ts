import { ethers, upgrades } from "hardhat";
import { BaseContract, BigNumber, ContractTransaction } from "ethers";
import { Signer } from "ethers";

export default class DeployHelper {
  static wait(ms: number) {
    //function wait(ms){
      var start = new Date().getTime();
      var end = start;
      while(end < start + ms) {
        end = new Date().getTime();
     }
  //  }
  }

  static getDeployerAddress(chainId: Number): string {
    switch (chainId) {
      case 1:
        return ""; // ETH Mainnet
      case 5:
      case 11155111:
        return "0x91fFA8d015C7EF56820383699781526D8D5b4AD3"; //Testnet
      default:
        return "";
    }
  }

  static getTokenAddress(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "0x8Ffe184421FB9855C20c6be9CaF63508FaedF631";
      case 5:
      case 11155111: // SEPOLIA
        return "0x8Ffe184421FB9855C20c6be9CaF63508FaedF631";
      default:
        return "";
    }
  }

  static getStaking(chainId: Number): string {
    switch (chainId) {
      case 1:
        return "";
      case 5:
      case 11155111: // SEPOLIA
        return "0x7a4Feb59993bf601bE00d3de8C510FfA8bd71300";
      default:
        return "";
    }
  }

  static getEther(value: number|string): BigNumber {
    return ethers.utils.parseEther(value.toString());
  }

  static getAmount(value: BigNumber): string {
    return ethers.utils.formatEther(value);
  }

  public static async executeTx(tx: Promise<ContractTransaction>):Promise<string>{
    const receipt = (await tx).wait();
    return (await receipt).transactionHash;
  }


  public static async deploy(
    deployer: Signer,
    name: string,
    chainId: number,
    upgradeAddress?: string
  ): Promise<BaseContract>  {
    const deploymentType = upgradeAddress ? 'upgrading' : 'deploying';
    console.log('Start %s %s on chainId:', deploymentType, name, chainId);

    const contract = await this.deploySilent(deployer, name, upgradeAddress);

    console.log("%s address:", name, contract.address)
    console.log('Finished %s %s on chainId:', deploymentType, name, chainId);
    console.log(
      "=================================================================="
    );

    return contract;
  }

  public static async deployWithLib(
    deployer: Signer,
    name: string,
    chainId: number,
    hyenaLibAddress: string
  ): Promise<BaseContract> {
    // console.log('Start deploying %s on chainId:', name, chainId);

    const Factory = await ethers.getContractFactory(name, {
      signer: deployer,
      libraries: {
        DiviTrendLib: hyenaLibAddress,
      },
    });
    const Proxy = await upgrades.deployProxy(Factory, {
      unsafeAllow: ["external-library-linking"],
    });

    await Proxy.deployed();
    const contract = Proxy as BaseContract;

    // console.log("%s address:", name, contract.address)
    // console.log('Finished deploying %s on chainId:', name, chainId);
    // console.log(
    //   "=================================================================="
    // );

    return contract;
  }

  /*
  public static async deployLib(
    deployer: Signer,
    chainId: number
  ): Promise<string> {
    // console.log("Start deploying DiviTrend LIBRARY on chainId:", chainId);

    const DiviTrendLib = await ethers.getContractFactory("DiviTrendLib", deployer);
    const DiviTrendLib = await DiviTrendLib.deploy();

    // console.log("DiviTrendLib deployed to:", DiviTrendLib.address);

    // console.log("Finished deploying DiviTrend LIB on chainId:", chainId);
    // console.log(
    //   "=================================================================="
    // );

    return DiviTrendLib.address;
  }
  */
  /*
  public static async upgradeToken(
    deployer: Signer,
    chainId: number,
    DiviTrendLibAddress: string
  ): Promise<DiviTrend> {
    console.log("Start upgrading DiviTrend on chainId:", chainId);

    const DiviTrendFactory = await ethers.getContractFactory("DiviTrend", {
      signer: deployer,
      libraries: {
        DiviTrendLib: DiviTrendLibAddress,
      },
    });

    const tokenProxy = await upgrades.upgradeProxy(
      DeployHelper.getTokenAddress(chainId),
      DiviTrendFactory,
      { unsafeAllow: ["external-library-linking"] }
    );

    const token = (await tokenProxy.deployed()) as DiviTrend;

    console.log("DiviTrend owner:      ", await token.owner());
    console.log("DiviTrend deployed to:", token.address);

    console.log("Finished upgrading DiviTrend on chainId:", chainId);
    console.log(
      "=================================================================="
    );

    return token;
  }
*/

  public static async deploySilent(
    deployer: Signer,
    name: string,
    upgradeAddress?: string
  ): Promise<BaseContract>  {
    const Factory = await ethers.getContractFactory(name, deployer);
    const proxy = upgradeAddress ? await upgrades.upgradeProxy(upgradeAddress,Factory) : await upgrades.deployProxy(Factory);
    const contract = await proxy.deployed() as BaseContract;
    return contract;
  }
}
