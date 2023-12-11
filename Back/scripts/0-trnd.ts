
/* eslint-disable prettier/prettier */
import { BigNumber, Contract, ContractTransaction } from "ethers";
import { ethers, upgrades } from "hardhat";
import DataHelper from "./helpers/DataHelper";
import DeployHelper from "./helpers/DeployHelper";
import {TRND_ABI} from '../abi/exported/Divitrend'
import {Divitrend} from '../typechain-types/contracts/DiviTrend.sol/Divitrend'
async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log(network)
    const chainId = ethers.BigNumber.from(network.chainId).toNumber();
    const deployer = await ethers.getSigner(
        DeployHelper.getDeployerAddress(chainId)
    );
    const trnd = new Contract(DeployHelper.getTokenAddress(chainId), TRND_ABI, deployer) as Divitrend

    const tsupply = await trnd.connect(deployer).totalSupply()
    console.log(tsupply)

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
