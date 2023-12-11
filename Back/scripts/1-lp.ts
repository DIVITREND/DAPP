import { BigNumber, Contract, ContractTransaction } from "ethers";
import { ethers, upgrades } from "hardhat";
import DataHelper from "./helpers/DataHelper";
import DeployHelper from "./helpers/DeployHelper";
import { TRND_ABI } from '../abi/exported/Divitrend';
import { Divitrend } from '../typechain-types/contracts/DiviTrend.sol/Divitrend';
import { RouterV2 } from "./abi/RouterV2"
import { factoryV2ABI } from "./abi/FactoryV2"


async function main() {
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    const chainId = ethers.BigNumber.from(network.chainId).toNumber();
    const deployer = await ethers.getSigner(
        DeployHelper.getDeployerAddress(chainId)
    );
    const WETH = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"
    const routerV2Add = '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008' // [SEPOLIA] — only solution to avoid the router deployment
    const trnd = new Contract(DeployHelper.getTokenAddress(chainId), TRND_ABI, deployer) as Divitrend
    const weth = new Contract(WETH, TRND_ABI, deployer) as Divitrend
    const routerV2 = new Contract(routerV2Add, RouterV2, deployer) 
    const factoryV2Add= '0x7E0987E5b3a30e3f2828572Bb659A548460a3003'
    const factoryV2 = new Contract(factoryV2Add, factoryV2ABI, deployer )

    /* DATA */
    const tokenA = WETH
    const tokenB = DeployHelper.getTokenAddress(chainId)
    const amountA = ethers.utils.parseEther('0.3')
    const amountB = ethers.utils.parseEther('10000')
    const minA = ethers.utils.parseEther('9000')
    const minB = ethers.utils.parseEther('0.3')
    const timestamp = 1703630951
    const dep_add = deployer.address

    /* TRND */
    //const approveTRND = await trnd.approve(routerV2Add, ethers.utils.parseEther('10000000'))
    //console.log("Approved TRND: ", approveTRND) // APPROVED

    //const sendTRNDtoDep = await trnd.transfer(deployer.address, ethers.utils.parseEther('1000'))
    //console.log("TX TRND TO DEPLOYER: ", sendTRNDtoDep.hash) // 1000 TRND — 0x636f9f284fb67ca34eee636f8db6d9bb7487a955430625f8599473d3028e269a

    //const balanceDeployer = await trnd.balanceOf(deployer.address).then((n) => ethers.utils.formatEther(n))
    //console.log("Balance: ", balanceDeployer) // 1M  —  $TRND

    /* ————FACTORY————— */

    //const createPair = await factoryV2.createPair(tokenA, tokenB)
    //const getPair = await factoryV2.getPair(tokenA,tokenB)

    /* PAIR — 0x77c05C6D0cd4A6aB595a0a9Bc221181f855821f9 */

    /* ———— ROUTER ———— */

    //const approveWETH = await weth.approve(routerV2Add, ethers.utils.parseEther('1000000'))
    //console.log("approved WETH: ", approveWETH) // APPROVED
    /*
    const createLiquidityPool = await routerV2.addLiquidity(
        tokenA,
        tokenB,
        amountA,
        amountB,
        minA,
        minB,
        dep_add,
        timestamp,  //1h
    );
    console.log("Liquidity: ", createLiquidityPool, createLiquidityPool.hash);
    */

    // WETH/DIVITREND LP 0x6ed0b705e9ac97b86bc23df75f4ffea94129fe041f386f755d0bc3966df691d0

    /* TEST SWAP FUNC */

    /*
    const amountOut = await routerV2.getAmountOut(ethers.utils.parseEther('1'), tokenA, tokenB);
    console.log("Amount of WETH (after swap):", ethers.utils.formatEther(amountOut));

    const amountIn = ethers.utils.parseEther('0.1')

    const transaction = await routerV2.swapExactTokensForTokens(
        amountIn,
        amountOut,
        [tokenA, tokenB],
        dep_add,
        timestamp
    );

    console.log("Swapped WETH => TRND: ", transaction, transaction.hash) // hash: 0xfeab966e695dfadfef0988acfc3d69a9756cf26879f865d1c094092a6bdac501
    //0.1 WETH for 2,494.37 TRND — BUY
    */

    const amountOutC = await routerV2.getAmountOut(ethers.utils.parseEther('1000'), tokenB, tokenA);
    console.log("Amount in of TRND (after swap):", ethers.utils.formatEther(amountOutC));

    const amountInC = await routerV2.getAmountIn(ethers.utils.parseEther('1000'), tokenB, tokenA);
    console.log("Amount out of TRND (after swap):", ethers.utils.formatEther(amountInC));

    const amountIn = ethers.utils.parseEther('1000')

    const transaction = await routerV2.swapExactTokensForETH(
        amountIn,
        amountOutC,
        [tokenB, tokenA],
        dep_add,
        timestamp
    );

    console.log("Swapped WETH => TRND: ", transaction, transaction.hash) // hash: 0xfeab966e695dfadfef0988acfc3d69a9756cf26879f865d1c094092a6bdac501
    //0.1 WETH for 2,494.37 TRND


    /* ———— —— —— ————— */








}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
