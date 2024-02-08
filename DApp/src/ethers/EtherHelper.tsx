/* eslint-disable @typescript-eslint/no-unused-vars */

import { IEtherContext } from "./IEtherContext";
import { IAccount } from "../entities/IAccount";
import { IWalletInfo } from "../entities/IWalletInfo";
import { IToast } from "../entities/IToast";
import { BigNumber, Contract, ContractTransaction, Transaction, ethers } from "ethers";
import AddressFactory from "../common/AddressFactory";
import DivitrendFactoriesABI from './abi/DivitrendFactoriesABI.json'
import DivitrendRewardsABI from './abi/DivitrendRewards.json'
import { DivitrendFactories } from "../entities/typechain-type";
import { NumberInputStepperProps } from "@chakra-ui/react";
import IERC20ABI from './abi/IERC20.json';
import { RouterV2 } from "./abi/RouterV2";
import { PairV2 } from "./abi/PairV2";
import { ISwap } from "../entities/ISwap";
import { TransactionTypes } from "ethers/lib/utils";
import { DivitrendRewards } from "../entities/typechain-type/DivitrendRewards";
import { IClaimETH } from "../entities/IClaimETH";
import { IClaimTRND } from "../entities/IClaimTRND";
import { NftStake, trnd_claim_data } from "../entities/IStaking";
import { Divitrend } from "../entities/typechain-type/Divitrend";
import DIVI from './abi/DIVI.json';


interface IAsset {
    name: string;
    symbol: string;
    address: string;
    logo: string;
    disabled: boolean;
}

interface IFullData {
    amount: number;
    timestamp: number;
    nDeposit: number
}

interface adminData {
    autoSwap: boolean;
    buyTax: number;
    sellTax: number;
    founderPerc: number;
    collectedTaxes: string;
    swapThres: string;
    isPause: boolean;
    cashWallet: string;
    maxCost: string;
    cost: string;
}

interface INFTBoost {
    fact_boost: number;
    fact_rev: number;
}

interface IOptData {
    vestingTime: number;
    apy: number;
    max_nft_slot: number;
    lastChange: number;
}

// @ts-ignore
const { ethereum } = window;

class LinkFactory {
    static getTransctionLink(txHash: string, chainId?: number, name?: string) {
        return this.getLink(name ?? 'Transaction HASH', `${chainId === 42161 ? 'testnet: ' : ''}tx => ${txHash}`);
    }

    static getLink(name: string, url: string) {
        return { name: name, url: url };
    }
}

type Listener = (...args: Array<any>) => void;

export default class EtherHelper {

    public static getChainId(): number { return process.env.REACT_APP_CHAINID ? Number(process.env.REACT_APP_CHAINID) : 25; }

    private static initProvider(): ethers.providers.Web3Provider {
        const chainid = this.getChainId();
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(chainid)) as ethers.providers.Web3Provider;
        if (process.env.REACT_APP_WEB && process.env.REACT_APP_WEB === "1") return provider;
        return ethereum ? new ethers.providers.Web3Provider(ethereum) : provider;
    }

    public static initialAccount(): IAccount {
        return {
            balance: undefined,
            ethAmount: 0,
            connected: false
        } as IAccount;
    }

    public static initialToast(): IToast {
        return {
            toastId: undefined,
            toastDescription: '',
            toastStatus: "success",
            toastTitle: '',
            toastLink: undefined
        } as IToast;
    }

    private static ABI_SWAP(): any[] {
        const ABIs = [{ "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]
        return ABIs
    }

    public static async connect(context: IEtherContext): Promise<IEtherContext> {
        try {
            console.log("EtherHelper.connect");

            let accounts;
            const desiredChainId = 42161; // ChainId desiderata

            if (typeof window !== 'undefined' && (window as any).ethereum !== 'undefined') {
                const ethereum = (window as any).ethereum;

                if (ethereum.networkVersion !== String(desiredChainId)) {
                    try {
                        await ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: ethers.utils.hexlify(desiredChainId) }]
                        });
                    } catch (err: any) {
                        if (err.code === 4902) {
                            await ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainName: 'Arbitrum One',
                                        chainId: ethers.utils.hexlify(desiredChainId),
                                        nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
                                        rpcUrls: [`${AddressFactory.getRpcUrl(42161)}`]
                                    }
                                /*
                                chainName: 'Ethereum Mainnet',
                                    chainId: ethers.utils.hexlify(desiredChainId),
                                    nativeCurrency: { name: 'Ethereum', decimals: 18, symbol: 'ETH' },
                                    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY']
                               */                                ]
                            });
                        }
                    }
                }

                //is the correct place - Initprovider after catching the chain
                const provider = EtherHelper.initProvider();
                if (!context.chainId) context = await this.getNetwork(provider, context);

                accounts = await provider.send("eth_requestAccounts", []);

                return this.queryProviderInfo({ ...context, addressSigner: accounts[0], connected: true }).then(this.querySignerInfo);
            }

            return context;

        } catch (error) {
            console.log("EtherHelper.connect FAILED: ", JSON.stringify(error))
            return context;
        }
    }

    public static async getNetwork(provider: ethers.providers.Web3Provider, context: IEtherContext): Promise<IEtherContext> {
        const network = await provider.getNetwork();
        const chainId = network.chainId ? BigNumber.from(network.chainId).toNumber() : 25;

        return {
            ...context,
            chainId: chainId,
            chainSymbol: network.ensAddress ? await provider.getCode(network.ensAddress) : "ETH"
        };
    }

    public static async disconnect(context: IEtherContext): Promise<IEtherContext> {
        this.disconnectListeners();
        return this.queryProviderInfo({ loaded: false, reload: true });
    }

    // —— // —— // STAKING —— // —— // —— // 

    public static async STAKING_CLAIM_ETH(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const tx = await staking.connect(signer).claimEth()
            let transactionResult = await tx.wait();
            context = {
                ...context, toastId: `Claim_${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'ETH Claim', toastDescription: `Successfully Claimed your ETH - TX: ${JSON.stringify(transactionResult.transactionHash)}`,
            }
            console.log('EtherHelper.STAKING_CLAIM_ETH Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
        } catch (e: any) {
            console.log("Error in STAKING_CLAIM_ETH: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN S_C_E ${Date.now}`, toastStatus: 'error', toastTitle: 'ETH Claim', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async STAKING_CLAIM(stakingOption: number, compoundPerc: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            console.log("stakingOption", stakingOption, compoundPerc)
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const tx = await staking.connect(signer).claimStaking(stakingOption, compoundPerc)
            let transactionResult = await tx.wait();
            context = {
                ...context, toastId: `Claim_${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Claim & Compound', toastDescription: `Successfully Claimed & Compounded - TX: ${JSON.stringify(transactionResult.transactionHash)}`,
            }
            console.log('EtherHelper.STAKING_CLAIM Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
        } catch (e: any) {
            console.log("Error in STAKING_CLAIM: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN C&C ${Date.now}`, toastStatus: 'error', toastTitle: 'Claim & Compound', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async STAKING_DEPOSIT_ETH(amount: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            //amount to WEI — getting Ethers
            const amountToWei = ethers.utils.parseEther(amount.toString())
            const tx = await staking.connect(signer).depositETH({ value: amountToWei })
            let transactionResult = await tx.wait();
            context = {
                ...context, toastId: `Deposit_ETH_${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'SUCCESSFULLY DEPOSITED', toastDescription: `Successfully Deposited ETH into the contract`,
            }
            console.log('EtherHelper.STAKING_DEPOSIT_ETH Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
        } catch (e: any) {
            console.log("Error in STAKING_DEPOSIT_ETH: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN STAKING_DEPOSIT_ETH&C ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR ON DEPOSIT', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async APPROVE_TRND(trnd: number, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), IERC20ABI, provider)
            const tx_approve = await divitrend
                .connect(signer)
                .approve(AddressFactory.getStaking(context.chainId ?? 42161), ethers.utils.parseEther(trnd.toString()));
            console.log(tx_approve)
            context = {
                ...context, toastId: `APPROVED TRND`, toastStatus: 'success', toastTitle: 'SUCCESSFULLY APPROVED TRND', toastDescription: `Successfully approved - ${trnd} $TRND`,
            }
        } catch (e: any) {
            console.log("Error in APPROVE_TRND: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN APPROVE_TRND ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async STAKING_ENTER(tokenAmount: number, stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const amountToWei = ethers.utils.parseEther(tokenAmount.toString())

            console.log(amountToWei + " " + stakingOption);
            const tx = await staking.connect(signer).enterStaking(amountToWei, stakingOption);
            let transactionResult = await tx.wait();
            context = {
                ...context,
                toastId: `STAKING_ENTER${transactionResult.transactionHash}`,
                toastStatus: 'success',
                toastTitle: 'SUCCESSFULLY ENTERED',
                toastDescription: `Successfully entered staking with ${tokenAmount} $TRND`,
            };
            console.log('EtherHelper.STAKING_ENTER Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));

            await this.querySignerInfo({ ...context }).then(this.queryStakingInfo, this.queryProviderInfo);

            return context
        } catch (e: any) {
            console.log("Error in STAKING_ENTER: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN STAKING_ENTER ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR ON ENTER', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context

    }

    public static async STAKING_EXIT(stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const tx = await staking.connect(signer).exitStaking(stakingOption)
            let transactionResult = await tx.wait();
            context = {
                ...context, toastId: `STAKING_EXIT${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'SUCCESSFULLY EXITED', toastDescription: `Successfully exited staking with`,
            }
            console.log('EtherHelper.STAKING_EXIT Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
        } catch (e: any) {
            console.log("Error in STAKING_EXIT: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN STAKING_EXIT ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR ON EXIT', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async STAKING_USER_NFT_STAKED(context: IEtherContext): Promise<number> {
        try {
            if (!context.connected) return 0;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const nft_staked = await staking.connect(signer)
                .getLastNftCount(context.addressSigner ?? '')
                .then((n) => (Array.isArray(n) ? n[0] : n).toNumber()) as number;
            return nft_staked;
        } catch (e: any) {
            console.log("Error in STAKING_USER_NFT_STAKED: ", JSON.stringify(e))
            return 0;
        }
    }

    public static async STAKING_EVENT_ETHCLAIMED(context: IEtherContext): Promise<any> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const tx = staking.getDepositNumber()
                .then((n) => {
                    const deposit = n.toNumber();
                    this.STAKING_USER_NFT_STAKED(context)
                        .then((nfts: number) => {
                            const query = staking.filters.EthClaimed(context.addressSigner ?? '', null)
                            return staking.queryFilter(query);
                        })
                })
            const query = await staking.filters.EthClaimed(context.addressSigner ?? '')
            const queryFilter = await staking.queryFilter(query);

            return queryFilter
        } catch (e: any) {
            console.log("Error in STAKING_EXIT: ", JSON.stringify(e))
            return []
        }
    }

    public static async STAKING_ALL_TOKENS_BALANCE(context: IEtherContext): Promise<any> {
        try {
            if (!context.connected) return 0;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const trnd_balance = await staking.connect(signer).getContractBalance().then((n: BigNumber) => ethers.utils.formatEther(n)) as number;
            const eth_balance = await staking.connect(signer).getTotalRewardedETH().then((n: BigNumber) => ethers.utils.formatEther(n)) as number;
            return { trnd_balance, eth_balance };
        } catch (e: any) {
            console.log("Error in STAKING_ALL_TOKENS_BALANCE: ", JSON.stringify(e))
        }
    }

    public static async STAKING_BOOST(tokenIds: number[], stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;


            console.log(tokenIds + " " + stakingOption);
            const tx = await staking.connect(signer).stakeNfts(tokenIds, stakingOption);
            let transactionResult = await tx.wait();
            context = {
                ...context,
                toastId: `STAKING_BOOST${transactionResult.transactionHash}`,
                toastStatus: 'success',
                toastTitle: 'SUCCESSFULLY STAKED NFTs',
                toastDescription: `Successfully joined staking with ${tokenIds.length}`,
            };
            console.log('EtherHelper.STAKING_BOOST Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));

            setTimeout(async () => {
                await this.querySignerInfo({ ...context }).then(this.queryStakingInfo, this.queryProviderInfo);
            }, 2000);

        } catch (e: any) {
            console.log("Error in STAKING_BOOST: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN STAKING_BOOST ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR ON STAKING', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    public static async STAKING_GET_ACTUAL_MALUS(stakingOption: number, context: IEtherContext): Promise<number> {
        try {
            if (!context.connected) return 0;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            console.log("VESTING: ", stakingOption)
            const malus = await staking.connect(signer).getActualMalus(context.addressSigner ?? '', stakingOption)
            return (malus / 1000)
        } catch (e: any) {
            console.log("Error in STAKING_GET_ACTUAL_MALUS: ", JSON.stringify(e))
            return 0;
        }
    }

    public static async UNSTAKING_BOOST(tokenIds: number[], stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            console.log("tokenIds", tokenIds, ' ', stakingOption)

            console.log(tokenIds + " " + stakingOption);
            const tx = await staking.connect(signer).unstakeNfts(stakingOption, tokenIds);
            let transactionResult = await tx.wait();
            context = {
                ...context,
                toastId: `UNSTAKING_BOOST${transactionResult.transactionHash}`,
                toastStatus: 'success',
                toastTitle: 'SUCCESSFULLY UNSTAKED NFTs',
                toastDescription: `Successfully unstaked #${tokenIds.length}`,
            };
            console.log('EtherHelper.UNSTAKING_BOOST Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));

            setTimeout(async () => {
                await this.querySignerInfo({ ...context }).then(this.queryStakingInfo, this.queryProviderInfo);
            }, 2000);

        } catch (e: any) {
            console.log("Error in UNSTAKING_BOOST: ", JSON.stringify(e))
            context = {
                ...context, toastId: `ERROR IN UNSTAKING_BOOST ${Date.now}`, toastStatus: 'error', toastTitle: 'ERROR ON EXIT', toastDescription: `Something were wrong... ${(e as Error)?.message.split(';')[0]}`,
            }
        }
        return context
    }

    //CALL STAKING

    public static async STAKING_GET_FULL_DATA(context: IEtherContext): Promise<any> {
        const provider = EtherHelper.initProvider()
        const signer = provider.getSigner(context.addressSigner)
        const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

        const user_full_data = await staking
            .connect(context.addressSigner ?? '')
            .getLastStakingCount(context.addressSigner ?? '')
            .then((data: any[]) => {
                return {
                    amount: Number(ethers.utils.formatEther(data[0])),
                    timestamp: data[1].toNumber(),
                    nDeposit: data[2].toNumber()
                }
            });

        return user_full_data as IFullData
    }

    public static async STAKING_CALC_RATE_LIMIT(context: IEtherContext): Promise<number> {
        const fullData = await this.STAKING_GET_FULL_DATA(context) as IFullData
        const rate_limit = await this.STAKING_MAX_STAKABLE(context)

        const rate = rate_limit - fullData.amount

        return rate
    }

    public static async STAKING_MAX_STAKABLE(context: IEtherContext): Promise<number> {
        const provider = EtherHelper.initProvider()
        const signer = provider.getSigner(context.addressSigner)
        const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

        const max_stakable = await staking
            .connect(context.addressSigner ?? '')
            .getStakingLimit()
            .then((n) => Number(ethers.utils.formatEther(n)));

        return max_stakable
    }

    public static async STAKING_REV_SHARE(context: IEtherContext): Promise<IClaimETH[]> {
        const provider = EtherHelper.initProvider()
        const signer = provider.getSigner(context.addressSigner)
        const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

        let nft_eth_rew: number = 0
        let eth_rew: number = 0

        try {
            const ethRew = await staking.pendingEthRew(context.addressSigner ?? '').then((n) => ethers.utils.formatEther(n))
            const nft_ethRew = await staking.pendingNftEthRew(context.addressSigner ?? '').then((n) => ethers.utils.formatEther(n))
            nft_eth_rew = Number(nft_ethRew)
            eth_rew = Number(ethRew)
            console.log("EtherHelper.STAKING_REV_SHARE", nft_ethRew, ethRew)
        } catch (e: any) {
            console.log("ERROR IN STAKING_REV_SHARE", JSON.stringify(e))
        }

        return [{ nft_eth_rew, eth_rew } as IClaimETH]
    }

    public static async STAKING_GET_MALUS(stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const malus = await staking.connect(signer).getActualMalus(context.addressSigner ?? '', stakingOption)
            //% in 3 decimals — n / 1000 = res
            context.malus = [{ vesting: stakingOption, malus_perc: malus }]
        } catch (e: any) {
            console.log("Error in STAKING_EXIT: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async STAKING_GET_USER_FULLDATA(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;

            const eth_claim_data = await staking.connect(signer)
                .getUserEthClaimData(context.addressSigner ?? '')
                .then((data) => {
                    let newData = []
                    newData[0] = Number(ethers.utils.formatEther(data[0])); //claim
                    newData[2] = Number(parseInt(data[2].toString()));
                    newData[1] = Number(parseInt(data[1].toString()));
                    return newData
                }) as IClaimETH;


            context = {
                ...context, eth_claim_history: eth_claim_data
            }
        } catch (e: any) {
            console.log("Error in STAKING_GET_USER_FULLDATA: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async STAKING_GET_USER_TRND_CLAIM(stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const trnd_claim_data = await staking.connect(signer)
                .getUserStakingClaimData(context.addressSigner ?? '', stakingOption)
                .then((data) => {
                    let newData = []
                    newData[0] = Number(ethers.utils.formatEther(data[0])); //claim
                    newData[2] = Number(ethers.utils.formatEther(data[2])); //compound
                    newData[1] = Number(parseInt(data[1].toString()));
                    newData[3] = Number(parseInt(data[3].toString()));
                    return newData
                }) as IClaimTRND;


            context = {
                ...context, trnd_claim_history: trnd_claim_data
            }
        } catch (e: any) {
            console.log("Error in STAKING_GET_USER_TRND_CLAIM: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async STAKING_PENDING_REW(stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const trnd_claim_data = await staking.connect(signer)
                .pendingStakingRew(context.addressSigner ?? '', stakingOption)
                .then(
                    (trnd) => Number(ethers.utils.formatEther(trnd) //trnd to claim
                    ))
            context = {
                ...context, trnd_to_claim: trnd_claim_data
            }
        } catch (e: any) {
            //console.log("Error in STAKING_GET_USER_TRND_CLAIM: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async STAKING_OPT_DATA(stakingOption: number, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const trnd_claim_data = await staking.connect(signer)
                .getStakingOptionData(stakingOption)
                .then((opt: any) => {
                    return {
                        vestingTime: opt[0],
                        apy: opt[1].toNumber(),
                        max_nft_slot: opt[2],
                        lastChange: opt[3].toNumber(),
                    };
                }) as IOptData;

            return trnd_claim_data
        } catch (e: any) {
            console.log("error on STAKING_OPT_DATA: ", e)
        }
    }

    public static async STAKING_DATA_REW_TRND(stakingOption: number, context: IEtherContext): Promise<trnd_claim_data> {
        try {
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const trnd_claim_data = await staking.connect(signer)
                .getUserStakingData(context.addressSigner ?? '', stakingOption)
                .then((trnd: any) => {
                    return {
                        user_pending_trnd: Number(ethers.utils.formatEther(trnd[0])),
                        user_pending_time: trnd[1],
                        user_deposit_numb: trnd[2]
                    };
                });

            return trnd_claim_data;
        } catch (e: any) {
            console.log("Error in STAKING_GET_USER_TRND_CLAIM: ", JSON.stringify(e));
            return {
                user_pending_trnd: 0,
                user_pending_time: BigNumber.from(0),
                user_deposit_numb: BigNumber.from(0)
            };
        }
    }

    public static async STAKING_NFT_DATA(stakingOption: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const stake_claim_data = await staking.connect(signer)
                .getUserNftStakingData(context.addressSigner ?? '', stakingOption)
                .then(
                    (nft) => {
                        let nft_staked = [] as NftStake
                        nft_staked.nft_staked = nft[0].toNumber();
                        nft_staked.nft_staked_ids = nft[1].map((id) => id.toNumber());
                        nft_staked.nft_staked_time = nft[2].toNumber();
                        nft_staked.nft_depositNumb = nft[3].toNumber();
                        return nft_staked
                    })

            console.log("getUserNftStakingData: ", stake_claim_data)
            context = {
                ...context, nft_staked_data: stake_claim_data
            }
        } catch (e: any) {
            console.log("Error in STAKING_CLAIM_DATA: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async STAKING_NFT_DATA_NOCTX(stakingOption: number, context: IEtherContext): Promise<NftStake> {
        const defaultReturn = {
            nft_staked: 0,
            nft_staked_ids: [],
            nft_staked_time: 0,
            nft_depositNumb: 0
        } as NftStake

        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider()
            const signer = provider.getSigner(context.addressSigner)
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, signer) as DivitrendRewards;
            const stake_claim_data = await staking.connect(signer)
                .getUserNftStakingData(context.addressSigner ?? '', stakingOption)
                .then(
                    (nft) => {
                        let nft_staked = [] as NftStake
                        nft_staked.nft_staked = nft[0].toNumber();
                        nft_staked.nft_staked_ids = nft[1].map((id) => id.toNumber());
                        nft_staked.nft_staked_time = nft[2].toNumber();
                        nft_staked.nft_depositNumb = nft[3].toNumber();
                        return nft_staked
                    })

            return stake_claim_data

        } catch (e: any) {
            console.log("Error in STAKING_CLAIM_DATA: ", JSON.stringify(e))
            return defaultReturn
        }
    }

    public static async STAKING_BALANCE(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161))
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, provider) as DivitrendRewards;
            const trnd_claim_data = await staking
                .connect(provider)
                .getContractBalance()
                .then(
                    (trnd) => Number(ethers.utils.formatEther(trnd) //wei to ETH
                    ))


            context = {
                ...context, trnd_to_claim: trnd_claim_data
            }
        } catch (e: any) {
            console.log("Error in STAKING_GET_USER_TRND_CLAIM: ", JSON.stringify(e))
            context = {
                ...context
            }
        }
        return context
    }

    public static async verifyChain(context: IEtherContext): Promise<IEtherContext> {
        if (context.chainId !== 1 && context.chainId !== 42161) {
            context = {
                ...context, toastId: `WRONG NETWORK`, toastStatus: 'error', toastTitle: 'WRONG NETWORK', toastDescription: `Please switch to ETH network`,
            }
            return context
        }
        return context
    }

    public static async queryStakingInfo(context: IEtherContext): Promise<IEtherContext> {
        if (!context.addressSigner) return context;

        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
        const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, provider) as DivitrendRewards;

        const contractBalance = staking
            .getContractBalance()
            .then((n: BigNumber) => context.eth_balance = Number(ethers.utils.formatEther(n)))

        const trndBalance = staking
            .getTotStakingAmount()
            .then((n: BigNumber) => context.tot_trnd_staked = Number(ethers.utils.formatEther(n)))

        const nftBalance = staking
            .getContractNftBalance()
            .then((n: BigNumber) => context.nft_staked = n.toNumber())

        const ethDeposit = staking
            .getLastEthDeposit()
            .then((n) => {
                context.last_eth_dep = Number(ethers.utils.formatEther(n[0]));
                context.last_eth_dep_time = Number(ethers.utils.formatEther(n[1]));
            })


        await Promise.all([contractBalance, trndBalance, nftBalance, ethDeposit])

        return context
    }

    // —— // —— // SWITCHCASE —— // —— // —— //

    public static getVesting(chainId: number): string {
        switch (chainId) {
            case 0:
                return '3';
            case 1:
                return '6';
            case 2:
                return '12';
            case 3:
                return '24';
            default:
                return '';
        }
    }

    // —— // —— // Claim FACTORIES —— // —— // —— //



    public static async FACTORIES_CLAIM(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await Factories.connect(signer).claimNfts({ from: context.addressSigner })
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Claim Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Claim_${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Factories Claim', toastDescription: `Successfully Claimed your Factories`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `ClaimError_${Date.now()}`, toastStatus: 'error', toastTitle: 'Factories Claim', toastDescription: `FAILED to Claim: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Claim Error: ", JSON.stringify(e))
        }
        console.log("claim")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    private static async estimateGasForPayNfts(context: IEtherContext, price: BigNumber, amount: number): Promise<number> {
        try {
            if (!context.connected) return 0;

            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);

            const Factories = new Contract(
                AddressFactory.getFactoriesAddress(context.chainId ?? 42161),
                DivitrendFactoriesABI,
                signer
            ) as DivitrendFactories;

            const gasEstimate = await Factories.estimateGas.payNfts(amount, { value: price });

            return gasEstimate.toNumber();
        } catch (e: any) {
            console.error('Errore durante la stima del gas per payNfts:', e);
            return 0;
        }
    }

    public static async FACTORIES_PAYNFT(context: IEtherContext, price: BigNumber, amount: number): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;

            const gasEstimate = await this.estimateGasForPayNfts(context, price, amount);

            if (gasEstimate === 0) {
                return context;
            }

            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx: ContractTransaction = await Factories.connect(signer).payNfts(amount, { value: price, gasLimit: gasEstimate + 30000 });
            let transactionResult = await tx.wait();
            console.log('EtherHelper.PAY TX Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `PAY${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'FACTORIES_PAYNFT', toastDescription: `Successfully — TX: ${JSON.stringify(transactionResult.transactionHash)} — Please CLAIM your Factories!`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `PAYError_${Date.now()}`, toastStatus: 'error', toastTitle: 'FACTORIES_PAYNFT', toastDescription: `FAILED to PAY: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.PAY Error: ", JSON.stringify(e))
        }
        console.log("pay")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async FACTORIES_APPROVE(context: IEtherContext, tokenIds: number[]): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const fetchIsApproved = await Factories.connect(signer).isApprovedForAll(context.addressSigner ?? '', AddressFactory.getStaking(context.chainId ?? 42161));

            if (fetchIsApproved === true) {
                context = {
                    ...context, toastId: `FACTORIES_ALREADY_APPROVED`, toastStatus: 'success', toastTitle: 'FACTORIES_ALREADY_APPROVED', toastDescription: `Already Approved`,
                }
            } else {
                const tx = await Factories.connect(signer).setApprovalForAll(AddressFactory.getStaking(context.chainId ?? 42161), true)
                let transactionResult = await tx.wait();
                console.log('EtherHelper.FACTORIES_APPROVE TX Hash: ', JSON.stringify(transactionResult.transactionHash));
                context = {
                    ...context, toastId: `FACTORIES_APPROVE${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'FACTORIES_APPROVE', toastDescription: `Successfully Approved - ${JSON.stringify(transactionResult.transactionHash)}`,
                }
            }
        } catch (e: any) {
            context = { ...context, toastId: `ApprovedError_${Date.now()}`, toastStatus: 'error', toastTitle: 'FACTORIES_APPROVE', toastDescription: `FAILED to APPROVE: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.FACTORIES_APPROVE Error: ", JSON.stringify(e))
        }
        console.log("Approved")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async FACTORIES_START_AT(context: IEtherContext): Promise<any> {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, provider) as DivitrendFactories;

            const MintStartAt = (await factories.getTimeStart()).toNumber()
            return MintStartAt
        } catch (e: any) {
            console.log("Error on FACTORIES_START_AT: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_TOTSUPPLY(context: IEtherContext): Promise<any> {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const totSupply = await factories.totalSupply()
            context.FactoriesTotalSupply = totSupply
        } catch (e: any) {
            console.log("Error on FACTORIES_TOTSUPPLY: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_ALREADY_MINTED(context: IEtherContext) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const actualSupply = await factories.getActualSupply()
            context.FactoriesMinted = actualSupply
            return actualSupply
        } catch (e: any) {
            console.log("Error on FACTORIES_ALREADY_MINTED: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_CALC_COST(context: IEtherContext, NFTs: number) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(42161));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const totCost = await factories.calCost(NFTs, { from: context.addressSigner })
            return ethers.utils.formatEther(totCost)
        } catch (e: any) {
            console.log("Error on FACTORIES_CALC_COST: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_TOTAL_REV(context: IEtherContext) {
        try {
            if (!context.connected || !context) return;

            const NFTs = context.nft_staked_data?.nft_staked_ids ?? [];
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(42161));
            const signer = provider.getSigner(context.addressSigner)
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;
            const totData = await factories.getTotalBoosts(NFTs, { from: signer.getAddress() })
                .then((data) => {
                    const numbersArray = data.map((n) => n.toNumber());
                    console.log("EtherHelper.FACTORIES_TOTAL_REV: ", JSON.stringify(numbersArray))
                    const fact_boost = numbersArray[0]
                    const fact_rev = numbersArray[1]
                    return { fact_boost, fact_rev };
                }) as INFTBoost;
            return totData
        } catch (e: any) {
            console.log("Error on FACTORIES_TOTAL_REV: ", JSON.stringify(e))
        }
    }

    public static async getBalance(contract: string, address: string): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(this.getChainId()));
        const erc20 = new ethers.Contract(contract, IERC20ABI, provider)

        let balance = 0;

        await erc20
            .balanceOf(address)
            .then((result: BigNumber) => balance = Number(ethers.utils.formatEther(result)))
            .catch((error: any) => console.log("EtherHelper.getBalance: ", JSON.stringify(error)));

        return balance;
    }

    public static async getQuoteEthToToken(amountIn: number, tokenIn: string, tokenOut: string, context: IEtherContext): Promise<number> {
        console.log("getQuoteEthToToken", tokenOut, tokenIn, amountIn)
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
        const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 42161), EtherHelper.ABI_SWAP(), provider)

        const amountParsed = ethers.utils.parseEther(amountIn.toString())
        const amounts = await UniswapRouter.getAmountsOut(amountParsed, [tokenOut, tokenIn]);
        const amountOut = amounts[1];
        return amountOut;
    }

    public static async getQuoteTokenToEth(amountOut: number, tokenIn: string, tokenOut: string, context: IEtherContext): Promise<number> {

        console.log("getQuoteTokenToEth", tokenOut, tokenIn, amountOut)
        async function getWETHPrice(): Promise<ethers.BigNumber> {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 42161));
            const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 42161), EtherHelper.ABI_SWAP(), provider)
            try {
                const amountParsed = ethers.utils.parseEther(amountOut.toString())
                const amountsOut = await UniswapRouter.getAmountsOut(amountParsed, [tokenOut, tokenIn]);
                const amount = amountsOut[1];
                return amount;
            } catch (error) {
                //console.error('Error quote WETH:', error);
                return BigNumber.from(0)
            }
        }

        try {
            const amountsETH: string = await getWETHPrice().then((price) => {
                console.log('TRND TO WETH:', ethers.utils.formatEther(price));
                return ethers.utils.formatEther(price)
            });
            return Number(amountsETH);
        } catch (e: any) {
            console.log("Error in EtherHelper.getQuoteTokenToEth: ", e)
            return 0
        }
    }

    public static async approveTokenForRouter(tokenAddress: string, amount: BigNumber, context: IEtherContext): Promise<void> {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);

        const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 42161), EtherHelper.ABI_SWAP(), provider)
        const tokenContract = new Contract(tokenAddress, ['function approve(address spender, uint amount) public returns (bool)']);
        const approved = await tokenContract.approve(UniswapRouter.routerAddress, amount, { gasLimit: 100000, gasPrice: ethers.utils.parseUnits('30', 'gwei') });
        await approved.wait();
    }

    public static async getQuote(amount: number, quoteAddress: string, quoteOutAddress: string, chainId: number, isETH: boolean, context: IEtherContext): Promise<number> {
        //const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        try {
            if (!amount || amount === 0) return 0;
            if (isETH === true) {
                try {
                    const gQuote = await EtherHelper.getQuoteEthToToken(amount, quoteAddress, quoteOutAddress, context);
                    console.log("EtherHelper.getQuote(%s):", gQuote);
                    const parsedWei = parseFloat(ethers.utils.formatEther(gQuote)).toFixed(2);
                    const value = parsedWei.replace(",", ""); // Rimuove la virgola
                    return Number(value)
                } catch (error) {
                    console.error("Error in getting ETH to Token quote:", error);
                    return 0
                }
            }

            try {
                const gQuoteOut = await EtherHelper.getQuoteTokenToEth(amount, quoteAddress, quoteOutAddress, context);
                console.log("EtherHelper.getQuote(%s):", gQuoteOut);
                return gQuoteOut
            } catch (error) {
                console.error("Error in getting Token to ETH quote:", error);
                return 0
            }

        } catch (error) {
            // @ts-expect-error
            console.log("EtherHelper.getQuote FAILED [%s]: %s", error.code, error.message);
            return 0;
        }
    }

    public static async executeSwap(
        ABIswap: any[],
        asset: string,
        amountIn: ethers.BigNumber,
        isEthToToken: boolean,
        context: IEtherContext
    ): Promise<IEtherContext> {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);
        const router = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 42161), ABIswap, signer)
        const path = isEthToToken ? [AddressFactory.getWETH(context.chainId ?? 42161), asset] : [AddressFactory.getTokenAddress(context.chainId ?? 42161), AddressFactory.getWETH(context.chainId ?? 42161)];
        console.log(isEthToToken, path)
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const amountInWei = ethers.utils.parseUnits(amountIn.toString(), 0);
        console.log(amountInWei.toString())

        try {
            if (isEthToToken) {
                const amountOutMin = await router.getAmountsOut(amountInWei, path);
                const tx = await router.swapExactETHForTokens(amountOutMin[1], path, signer.getAddress(), deadline, { value: amountInWei.toString() });
                const transactionResult = await tx.wait()
                context = {
                    ...context,
                    toastStatus: 'success',
                    toastId: `swapETHforExactTokens_${transactionResult.transactionHash}`,
                    toastTitle: 'DiviSwap',
                    toastDescription: 'Successfully swapped - TX: ' + transactionResult.transactionHash,
                };
                console.log('EtherHelper.swap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            } else {
                const amountOutMin = await router.getAmountsOut(amountInWei, path)
                const tx = await router.swapExactTokensForETH(amountInWei.toString(), amountOutMin[1], path, signer.getAddress(), deadline)
                const transactionResult = await tx.wait()
                context = {
                    ...context,
                    toastStatus: 'success',
                    toastId: `swapTokensforExactETH_${transactionResult.transactionHash}`,
                    toastTitle: 'DiviSwap',
                    toastDescription: 'Successfully swapped - TX: ' + transactionResult.transactionHash,
                };
                console.log('EtherHelper.swap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            }

        } catch (error) {
            context = {
                ...context,
                toastId: `executeSwapErrorOn${Date.now()}`,
                toastStatus: 'error',
                toastTitle: 'DiviSwap',
                toastDescription: `FAILED to swap: ${(error as Error)?.message}`
            };
        }

        return await this.querySignerInfo({ ...context, ...this.initialSwap() }).then(this.queryProviderInfo);
    }

    public static async swap(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            if (!context.swapAmount) return context;

            const ABIswap = [
                {
                    "inputs": [
                        { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
                        { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
                        { "internalType": "address[]", "name": "path", "type": "address[]" },
                        { "internalType": "address", "name": "to", "type": "address" },
                        { "internalType": "uint256", "name": "deadline", "type": "uint256" }
                    ],
                    "name": "swapExactTokensForETH",
                    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
                        { "internalType": "address[]", "name": "path", "type": "address[]" },
                        { "internalType": "address", "name": "to", "type": "address" },
                        { "internalType": "uint256", "name": "deadline", "type": "uint256" }
                    ],
                    "name": "swapExactETHForTokens",
                    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        }
                    ],
                    "name": "getAmountsOut",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ];

            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const router = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 42161), ABIswap, signer)

            const slippageTolerance = "0.5"
            const swapAmountBN = ethers.utils.parseEther(context.swapAmount.toString())

            let isEthToToken = (context.swapToken?.address ?? '') !== AddressFactory.getWETH(context.chainId ?? 42161);

            if (context.swapToken && context.swapToken?.address) {
                let transactionResult = await EtherHelper.executeSwap(ABIswap, context.swapToken.address, swapAmountBN, isEthToToken, context)
                console.log(transactionResult)
                return transactionResult
            }

        } catch (error) {
            context = {
                ...context,
                toastId: `swapETHtoTokensOrViceversaError_${Date.now()}`,
                toastStatus: 'error',
                toastTitle: 'DiviSwap',
                toastDescription: `FAILED to swap: ${(error as Error)?.message.split(';')[0]}`
            };
        }

        return await this.querySignerInfo({ ...context, ...this.initialSwap() }).then(this.queryProviderInfo);
    }

    // admin functions

    public static async Adm_Unpause_Token(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).unpause({ from: context.addressSigner })
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_Unpause_Token Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_Unpause_Token${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_Unpause_Token', toastDescription: `Successfully Unpause_Token`,
            }
        } catch (e: any) {

            context = { ...context, toastId: `Adm_Deposit_ETHError_${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_Unpause_Token', toastDescription: `FAILED to Adm_Unpause_Token: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_Unpause_Token Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_Pause_Token(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).pause()
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_Pause_Token Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_Pause_Token${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_Pause_Token', toastDescription: `Successfully Adm_Pause_Token`,
            }
        } catch (e: any) {

            context = { ...context, toastId: `Adm_Deposit_ETHError_${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_Pause_Token', toastDescription: `FAILED to Adm_Pause_Token: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_Pause_Token Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
        console.log("Adm_Pause_Token")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_Enable_Blacklist(account: string, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).enableBlacklist(account)
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_Enable_Blacklist Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_Enable_Blacklist${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_Enable_Blacklist', toastDescription: `Successfully Adm_Enable_Blacklist`,
            }
        } catch (e: any) {

            context = { ...context, toastId: `Adm_Enable_BlacklistError${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_Enable_Blacklist', toastDescription: `FAILED to Adm_Enable_Blacklist: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_Enable_Blacklist Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
        console.log("Adm_Enable_Blacklist")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_Disable_Blacklist(account: string, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;
            console.log(account)
            const tx = await divitrend.connect(signer).disableBlacklist(account);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.disableBlacklist Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `disableBlacklist${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'disableBlacklist', toastDescription: `Successfully disableBlacklist`,
            }
        } catch (e: any) {

            context = { ...context, toastId: `disableBlacklist${Date.now()}`, toastStatus: 'error', toastTitle: 'disableBlacklist', toastDescription: `FAILED to disableBlacklist: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.disableBlacklist Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("disableBlacklist")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setBuy_TAX(tax: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setBuyTax(tax);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.disableBlacklist Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `disableBlacklist${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'disableBlacklist', toastDescription: `Successfully disableBlacklist`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `disableBlacklist${Date.now()}`, toastStatus: 'error', toastTitle: 'disableBlacklist', toastDescription: `FAILED to disableBlacklist: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.disableBlacklist Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("disableBlacklist")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setSell_TAX(tax: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setSellTax(tax);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setSell_Tax Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setSell_Tax${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setSell_Tax', toastDescription: `Successfully Adm_setSell_Tax`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_setSell_Tax', toastDescription: `FAILED to Adm_setSell_Tax: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setSell_Tax Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_setSell_Tax")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setFounderWallet(founderWallet: '', context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setFounderWallet(founderWallet);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setFounderWallet Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setFounderWallet${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setFounderWallet', toastDescription: `Successfully Adm_setFounderWallet`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_setFounderWallet', toastDescription: `FAILED to Adm_setFounderWallet: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setFounderWallet Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_setFounderWallet")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setDivitrendRewardsAddress(diviRewAddy: '', context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setDivitrendRewardsAddress(diviRewAddy);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.setDivitrendRewardsAddress Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setDivitrendRewardsAddress${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'setDivitrendRewardsAddress', toastDescription: `Successfully setDivitrendRewardsAddress`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'setDivitrendRewardsAddress', toastDescription: `FAILED to setDivitrendRewardsAddress: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.setDivitrendRewardsAddress Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("setDivitrendRewardsAddress")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setStakedCapital(stakedCapitalAddy: string, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setStakedCapitalWallet(stakedCapitalAddy);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setStakedCapital Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setStakedCapital${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setStakedCapital', toastDescription: `Successfully Adm_setStakedCapital`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'setDivitrendRewardsAddress', toastDescription: `FAILED to Adm_setStakedCapital: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setStakedCapital Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_setStakedCapital")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setStakedCapitalPerc(perc: number, context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setStakedCapPerc(perc);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setStakedCapitalPerc Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setStakedCapitalPerc${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setStakedCapitalPerc', toastDescription: `Successfully Adm_setStakedCapitalPerc`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_setStakedCapitalPerc', toastDescription: `FAILED to Adm_setStakedCapitalPerc: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setStakedCapitalPerc Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_setStakedCapitalPerc")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_setSwapTreshold(amount: number, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setSwapThreshold(amount);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setSwapTreshold Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setSwapTreshold${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setSwapTreshold', toastDescription: `Successfully Adm_setSwapTreshold`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_setSwapTreshold', toastDescription: `FAILED to Adm_setSwapTreshold: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setSwapTreshold Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_setSwapTreshold")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_manualSwapAndLiquify(context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).manualSwapAndLiquify();
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_manualSwapAndLiquify Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_manualSwapAndLiquify${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_manualSwapAndLiquify', toastDescription: `Successfully Adm_manualSwapAndLiquify`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_manualSwapAndLiquify', toastDescription: `FAILED to Adm_manualSwapAndLiquify: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_manualSwapAndLiquify Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_manualSwapAndLiquify")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_autoSwap(isTrue: boolean, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).setAutoSwap(isTrue);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_autoSwap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_autoSwap${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_autoSwap', toastDescription: `Successfully Adm_autoSwap`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_autoSwap', toastDescription: `FAILED to Adm_autoSwap: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_autoSwap Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_autoSwap")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_esclude(exclude: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).exclude(exclude);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_autoSwap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_autoSwap${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_esclude', toastDescription: `Successfully Adm_esclude`,
            }

        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_esclude', toastDescription: `FAILED to Adm_esclude: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_esclude Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_esclude")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_rmv_esclude(rmv_exclude: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;

            const tx = await divitrend.connect(signer).exclude(rmv_exclude);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_rmv_esclude Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_rmv_esclude${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_rmv_esclude', toastDescription: `Successfully Adm_rmv_esclude`,
            }

        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_rmv_esclude', toastDescription: `FAILED to Adm_rmv_esclude: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_rmv_esclude Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');

        }
        console.log("Adm_rmv_esclude")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async Adm_depositETH(amount: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)
            const value = ethers.utils.parseEther(amount);
            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, provider) as DivitrendRewards;

            const tx = await staking.connect(signer).depositETH({ value: value });
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_depositETH Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_depositETH${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_depositETH', toastDescription: `Successfully Adm_depositETH`,
            }

        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_depositETH', toastDescription: `FAILED to Adm_depositETH: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_depositETH Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_setStakingOptionData(opt: string, vestingUNIX: string, apy: number, maxNftSlot: number, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)
            const option = Number(opt);
            const vesting = Number(vestingUNIX);
            const apyValue = Number(apy);
            const maxNft = Number(maxNftSlot);

            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, provider) as DivitrendRewards;

            const tx = await staking.connect(signer).setStakingOptionData(option, vesting, apyValue, maxNft);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Adm_setStakingOptionData Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Adm_setStakingOptionData${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Adm_setStakingOptionData', toastDescription: `Successfully Adm_setStakingOptionData` + { option } + { vesting } + { apyValue } + { maxNft },
            }

        } catch (e: any) {
            context = { ...context, toastId: `setSell${Date.now()}`, toastStatus: 'error', toastTitle: 'Adm_depositETH', toastDescription: `FAILED to Adm_setStakingOptionData: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Adm_setStakingOptionData Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_setStakingPause(opt: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);

            const staking = new Contract(AddressFactory.getStaking(context.chainId ?? 42161), DivitrendRewardsABI, provider) as DivitrendRewards;

            let result: any = {};

            if (opt === 'true') {
                const tx = await staking.connect(signer).pause();
                result = await tx.wait();
            } else {
                const tx = await staking.connect(signer).unpause();
                result = await tx.wait();
            }

            let transactionResult = result as any;
            console.log('EtherHelper.Adm_setStakingPause Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));

            // Nota: la riga seguente è stata modificata per formattare correttamente la stringa di descrizione del toast
            context = {
                ...context,
                toastId: `Adm_setStakingPause${transactionResult.transactionHash}`,
                toastStatus: 'success',
                toastTitle: 'Adm_setStakingPause',
                toastDescription: `Successfully Adm_setStakingPause`,
            };

            return context;
        } catch (e: any) {
            context = {
                ...context,
                toastId: `Adm_setStakingPause${Date.now()}`,
                toastStatus: 'error',
                toastTitle: 'Adm_setStakingPause',
                toastDescription: `FAILED to Adm_setStakingPause: ${(e as Error)?.message.split(';')[0]}`,
            };
            console.log("EtherHelper.Adm_setStakingPause Error: ", JSON.stringify(e));
            return e;
        }
    }

    public static async Adm_fact_adminMint(amount: string, receiver: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner()
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await factories.connect(signer).adminMint(Number(amount), receiver);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.adm_fact_adminMint Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `adm_fact_adminMint ${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'adm_fact_adminMint', toastDescription: `Successfully adm_fact_adminMint`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `adm_fact_adminMint${Date.now()}`, toastStatus: 'error', toastTitle: 'adm_fact_adminMint', toastDescription: `FAILED to adm_fact_adminMint: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.adm_fact_adminMint Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_fact_setCost(amount: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner();
            const value = ethers.utils.parseEther(amount);
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await factories.connect(signer).setCost(value);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.adm_fact_adminMint Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `adm_fact_adminMint ${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'adm_fact_adminMint', toastDescription: `Successfully adm_fact_adminMint`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `adm_fact_adminMint${Date.now()}`, toastStatus: 'error', toastTitle: 'adm_fact_adminMint', toastDescription: `FAILED to adm_fact_adminMint: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.adm_fact_adminMint Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_fact_setMaxCost(amount: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner();
            const value = ethers.utils.parseEther(amount);
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await factories.connect(signer).setMaxCost(value);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.adm_fact_setMaxCost Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `adm_fact_setMaxCost ${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'adm_fact_setMaxCost', toastDescription: `Successfully adm_fact_setMaxCost`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `adm_fact_setMaxCost${Date.now()}`, toastStatus: 'error', toastTitle: 'adm_fact_setMaxCost', toastDescription: `FAILED to adm_fact_setMaxCost: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.adm_fact_setMaxCost Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_fact_setCashWallet(wallet: string, context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner();
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await factories.connect(signer).setCashWallet(wallet);
            let transactionResult = await tx.wait();
            console.log('EtherHelper.adm_fact_setCashWallet Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `adm_fact_setCashWallet ${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'adm_fact_setCashWallet', toastDescription: `Successfully adm_fact_setCashWallet`,
            }
        } catch (e: any) {
            context = { ...context, toastId: `adm_fact_setCashWallet${Date.now()}`, toastStatus: 'error', toastTitle: 'adm_fact_setCashWallet', toastDescription: `FAILED to adm_fact_setCashWallet: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.adm_fact_setCashWallet Error: ", JSON.stringify(e))
            return (e.message || 'An error occurred');
        }
    }

    public static async Adm_get_data(context: IEtherContext) {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), DIVI, signer) as Divitrend;
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const autoSwapPromise = divitrend.connect(signer).getAutoSwap();
            const buyTaxPromise = divitrend.connect(signer).getBuyTax().then(value => value.toNumber());
            const sellTaxPromise = divitrend.connect(signer).getSellTax().then(value => value.toNumber());
            const founderPercPromise = divitrend.connect(signer).getFounderPerc().then(value => value.toNumber());
            const collectedTaxesPromise = divitrend.connect(signer).getCollectedTaxes().then(value => ethers.utils.formatEther(value));
            const swapThresPromise = divitrend.connect(signer).getSwapThreshold().then(value => ethers.utils.formatEther(value));
            const isPausedPromise = divitrend.connect(signer).paused().then(value => value)
            const cashWalletPromise = factories.connect(signer).getCashWallet().then(value => value)
            const maxCostPromise = factories.connect(signer).getMaxCost().then(value => ethers.utils.formatEther(value));
            const factCostPromise = factories.connect(signer).getCost().then(value => ethers.utils.formatEther(value));
            const allDataPromise = await Promise.all([autoSwapPromise, buyTaxPromise, sellTaxPromise, founderPercPromise, collectedTaxesPromise, swapThresPromise, isPausedPromise, cashWalletPromise, factCostPromise, maxCostPromise]);
            const allData = {
                autoSwap: allDataPromise[0],
                buyTax: allDataPromise[1],
                sellTax: allDataPromise[2],
                founderPerc: allDataPromise[3],
                collectedTaxes: allDataPromise[4],
                swapThres: allDataPromise[5],
                isPause: allDataPromise[6],
                cashWallet: allDataPromise[7],
                maxCost: allDataPromise[8],
                cost: allDataPromise[9],
            }

            return allData as adminData

        } catch (e: any) {
            console.log("EtherHelper.Adm_get_data Error: ", JSON.stringify(e))
        }
    }

    public static initialSwap(): ISwap {
        return {
            swapAmount: undefined
        } as ISwap;
    }

    public static async initialInfoPool(context: IEtherContext): Promise<IEtherContext> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(this.getChainId()));

        const router = new ethers.Contract(AddressFactory.getRouterV2(42161), RouterV2, provider)
        const pair = new ethers.Contract(AddressFactory.getPair(42161), PairV2, provider)

        const reserves = pair.getReserves()
            .then(([reserve0, reserve1, blockTimestampLast]: any) => {
                context.reserve0 = reserve0.toString();
                context.reserve1 = reserve1.toString();
                context.blockTimestampLast = blockTimestampLast.toString();
            })
            .catch((e: any) => console.log("Error in initialInfoPool.Reserves:", e));


        const price0CumulativeLast = pair.price0CumulativeLast()
            .then((r: any) => context.price0CumLast = r.toString())
            .catch((e: any) => console.log(e))

        const price1CumulativeLast = pair.price1CumulativeLast()
            .then((r: any) => context.price1CumLast = r.toString())
            .catch((e: any) => console.log(e))

        const kLast = pair.price1CumulativeLast()
            .then((r: any) => context.kLast = r.toString())
            .catch((e: any) => console.log(e))

        await Promise.all([
            price0CumulativeLast,
            price1CumulativeLast,
            kLast,
            reserves,
        ]);

        context = { ...context }
        console.log("EtherHelper.InitialInfoFactory: ", context)

        return { ...context };
    }

    public static async totalSupply(address: string): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(this.getChainId()));
        const erc20 = new ethers.Contract(address, IERC20ABI, provider)

        let supply = 0;

        await erc20
            .totalSupply()
            .then((result: BigNumber) => supply = Number(ethers.utils.formatEther(result)))
            .catch((error: any) => console.log("EtherHelper.getBalance: ", JSON.stringify(error)));

        return supply;
    }

    public static async querySignerInfo(context: IEtherContext): Promise<IEtherContext> {
        if (!context.addressSigner) return context;
        const provider = EtherHelper.initProvider();
        const chainId = EtherHelper.getChainId()
        const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, provider) as DivitrendFactories;
        const divitrend = new Contract(AddressFactory.getTokenAddress(context.chainId ?? 42161), IERC20ABI, provider)
        // const provider = new ethers.providers.Web3Provider(ethereum);

        if (!context.chainId) context = await this.getNetwork(provider, context);

        const signer = provider.getSigner(context.addressSigner);

        function toNumberSafe(bn: BigNumber): number {
            try {
                return bn.toNumber();
            } catch (error) {
                console.error('Error converting BigNumber to number:', error);
                return 0; // o un valore predefinito appropriato in caso di errore
            }
        }

        const trndBalance = divitrend
            .balanceOf(context.addressSigner)
            .then((result: BigNumber) => context.trndBalance = Number(ethers.utils.formatEther(result)))
            .catch((error: any) => console.log("EtherHelper.queryProviderInfo.trndBalance: ", JSON.stringify(error)));

        const otherBalance = signer
            .getBalance()
            .then((result: BigNumber) => context.otherBalance = Number(ethers.utils.formatEther(result)))
            .catch((error: any) => console.log("EtherHelper.queryProviderInfo.otherBalance: ", JSON.stringify(error)));

        const FactOwned = factories
            .tokensOfOwner(context.addressSigner ?? '')
            .then((result: BigNumber[]) => context.FactoriesTokenIds = result.map((n) => n.toNumber()))

        /*
        const mintStartAt = factories
        .getTimeStart()
        .then((result: BigNumber) => context.FactoriesMintStartAt = new Date(ethers.utils.formatEther(result)));
        */

        const totalSupply = factories
            .totalSupply()
            .then((result: number) => context.FactoriesTotalSupply = result);

        const etherBalancePromise = signer
            .getBalance()
            .then((result: BigNumber) => context.balance = Number(ethers.utils.formatEther(result)))
            .catch((error: any) => console.log("EtherHelper.queryProviderInfo.ethBalance: ", JSON.stringify(error)));
        // context.nfts = [];
        const userAddress: string = context.addressSigner || '';

        await Promise.all([etherBalancePromise, FactOwned, totalSupply, otherBalance, trndBalance]);

        return context;
    }

    public static async factoriesTokensOf(context: IEtherContext) {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);
        const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

        if (context.connected) {
            try {
                const tokenIds = await Factories.tokensOfOwner(context.addressSigner ?? '');

                return tokenIds;
            } catch (e: any) {
                console.log("Can't fetch balanceOf owner:", e)
            }
        }
    }

    public static async getTokenURI(context: IEtherContext, tokenId: number) {
        if (context.connected) {
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 42161), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const URIpath = await Factories.tokenURI(tokenId);
            const response = await fetch(URIpath + '.json');
            const tokenData = await response.json();
            return tokenData;
        }
    }

    public static async queryProviderInfo(context: IEtherContext): Promise<IEtherContext> {
        if (context.loaded && !context.reload) return context;

        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);

        if (!context.chainId) context = await this.getNetwork(provider, context);

        //await Promise.all([]);

        return context;
    }

    public static async queryOwnerProviderInfo(context: IEtherContext): Promise<IEtherContext> {

        const provider = EtherHelper.initProvider();

        /*
        if (!context.chainId) context = await this.getNetwork(provider, context);
        await Promise.all([isTokenPausedPromise, isRewardsPausedPromise, isAutoSwapEnabledPromise,
            rewardsBalancePromise, taxTokensromise, liqTokensPromise, thresholdPromise]);
        */

        return context;
    }

    //#endregion


    public static connectChainListener(chainChanged: Listener) {
        ethereum?.on('chainChanged', chainChanged);
    }

    public static connectAccountListener(accountsChanged: Listener) {
        ethereum?.on('accountsChanged', accountsChanged);
    }

    public static connectErrorListener(error: Listener) {
        ethereum?.on("error", error);
    }

    public static async getBlockTimeStamp(): Promise<number> {
        const provider = EtherHelper.initProvider();
        const block = await provider.getBlock("latest");
        return block.timestamp * 1000;
    }

    public static disconnectListeners() {
        ethereum?.removeAllListeners();
    }
}