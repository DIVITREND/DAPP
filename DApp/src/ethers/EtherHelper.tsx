/* eslint-disable @typescript-eslint/no-unused-vars */

import { IEtherContext } from "./IEtherContext";
import { IAccount } from "../entities/IAccount";
import { IWalletInfo } from "../entities/IWalletInfo";
import { IToast } from "../entities/IToast";
import { BigNumber, Contract, ContractTransaction, Transaction, ethers } from "ethers";
import AddressFactory from "../common/AddressFactory";
import DivitrendFactoriesABI from './abi/DivitrendFactoriesABI.json'
import { DivitrendFactories } from "../entities/typechain-type";
import { NumberInputStepperProps } from "@chakra-ui/react";
import IERC20ABI from './abi/IERC20.json';
import { RouterV2 } from "./abi/RouterV2";
import { PairV2 } from "./abi/PairV2";
import { ISwap } from "../entities/ISwap";
import { TransactionTypes } from "ethers/lib/utils";



interface IAsset {
    name: string;
    symbol: string;
    address: string;
    logo: string;
    disabled: boolean;
}

// @ts-ignore
const { ethereum } = window;

class LinkFactory {
    static getTransctionLink(txHash: string, chainId?: number, name?: string) {
        return this.getLink(name ?? 'Transaction HASH', `${chainId === 11155111 ? 'testnet: ' : ''}tx => ${txHash}`);
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
            const provider = EtherHelper.initProvider();

            if (!context.chainId) context = await this.getNetwork(provider, context);

            let accounts = await provider.send("eth_requestAccounts", []);
            // return this.querySignerInfo({...context, addressSigner: accounts[0], connected: true});
            return this.queryProviderInfo({ ...context, addressSigner: accounts[0], connected: true }).then(this.querySignerInfo);

        } catch (error) {
            console.log("EtherHelper.connect FAILED: ", JSON.stringify(error))
        }

        return context;
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
        this.disconnectListeners(); // TODO correct place?
        return this.queryProviderInfo({ loaded: false, reload: true });
    }

    // —— // —— // Claim FACTORIES —— // —— // —— //



    public static async FACTORIES_CLAIM(context: IEtherContext): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await Factories.connect(signer).claimNfts({ from: context.addressSigner })
            let transactionResult = await tx.wait();
            console.log('EtherHelper.Claim Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `Claim_${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'Factories Claim', toastDescription: `Successfully Claimed your Factories`,
            }
        } catch (e) {
            context = { ...context, toastId: `ClaimError_${Date.now()}`, toastStatus: 'error', toastTitle: 'Factories Claim', toastDescription: `FAILED to Claim: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.Claim Error: ", JSON.stringify(e))
        }
        console.log("claim")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async FACTORIES_PAYNFT(context: IEtherContext, price: number, amount: number): Promise<IEtherContext> {
        try {
            if (!context.connected) return context;
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner)

            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, signer) as DivitrendFactories;

            const tx = await Factories.connect(signer).payNfts(amount, { value: price })
            let transactionResult = await tx.wait();
            console.log('EtherHelper.PAY TX Hash: ', JSON.stringify(transactionResult.transactionHash));
            context = {
                ...context, toastId: `PAY${transactionResult.transactionHash}`, toastStatus: 'success', toastTitle: 'FACTORIES_PAYNFT', toastDescription: `Successfully — TX: ${JSON.stringify(transactionResult.transactionHash)} — Please CLAIM your Factories!`,
            }
        } catch (e) {
            context = { ...context, toastId: `PAYError_${Date.now()}`, toastStatus: 'error', toastTitle: 'FACTORIES_PAYNFT', toastDescription: `FAILED to PAY: ${(e as Error)?.message.split(';')[0]}` };
            console.log("EtherHelper.PAY Error: ", JSON.stringify(e))
        }
        console.log("pay")
        return await this.querySignerInfo({ ...context }).then(this.queryProviderInfo);
    }

    public static async FACTORIES_START_AT(context: IEtherContext): Promise<any> {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, provider) as DivitrendFactories;

            const MintStartAt = (await factories.getTimeStart()).toNumber()
            return MintStartAt
        } catch (e) {
            console.log("Error on FACTORIES_START_AT: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_TOTSUPPLY(context: IEtherContext): Promise<any> {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const totSupply = await factories.totalSupply()
            context.FactoriesTotalSupply = totSupply
        } catch (e) {
            console.log("Error on FACTORIES_TOTSUPPLY: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_ALREADY_MINTED(context: IEtherContext) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const actualSupply = await factories.getActualSupply()
            context.FactoriesMinted = actualSupply
            return actualSupply
        } catch (e) {
            console.log("Error on FACTORIES_ALREADY_MINTED: ", JSON.stringify(e))
        }
    }

    public static async FACTORIES_CALC_COST(context: IEtherContext, NFTs: number) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(11155111));
            const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, provider) as DivitrendFactories;
            const totCost = await factories.calCost(NFTs, { from: context.addressSigner })
            return totCost.toNumber()
        } catch (e) {
            console.log("Error on FACTORIES_CALC_COST: ", JSON.stringify(e))
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

    public static async getQuoteEthToToken(amountIn: number, tokenOut: string, context: IEtherContext): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
        const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), EtherHelper.ABI_SWAP(), provider)

        const amounts = await UniswapRouter.getAmountsOut(amountIn, [AddressFactory.getWETH(context.chainId ?? 11155111), tokenOut]);
        const amountOut = amounts[amounts.length - 1];
        return amountOut;
    }

    // Ottieni la quotazione per uno swap Token a ETH
    public static async getQuoteTokenToEth(amountOut: number, tokenIn: string, context: IEtherContext): Promise<number> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
        console.log("getQuoteTokenToEth.amount: ", amountOut.toFixed(0))
        const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), EtherHelper.ABI_SWAP(), provider)

        async function getWETHPrice(): Promise<ethers.BigNumber> {
            const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(context.chainId ?? 11155111));
            const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), EtherHelper.ABI_SWAP(), provider)
            try {
                const amountsOut = await UniswapRouter.getAmountsIn(amountOut, [tokenIn, AddressFactory.getWETH(context.chainId ?? 11155111)]);
                const wethPrice = amountsOut[0];
                console.log(amountsOut[1])
                return wethPrice;
            } catch (error) {
                console.error('Errore nel recupero del prezzo di WETH:', error);
                return BigNumber.from(0)
            }
        }

        try {
            const amountsETH: string = await getWETHPrice().then((price) => {
                console.log('Prezzo di WETH:', ethers.utils.formatUnits(price, 18));
                return ethers.utils.formatUnits(price, 18)
              });
            return Number(amountsETH);
        } catch (e) {
            console.log("Error in EtherHelper.getQuoteTokenToEth: ", e)
            return 0
        }
    }

    // Altri metodi utili possono essere aggiunti qui in base alle tue esigenze

    // Esempio: Approva il Router a spendere un certo importo di token
    public static async approveTokenForRouter(tokenAddress: string, amount: BigNumber, context: IEtherContext): Promise<void> {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);

        const UniswapRouter = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), EtherHelper.ABI_SWAP(), provider)
        const tokenContract = new Contract(tokenAddress, ['function approve(address spender, uint amount) public returns (bool)']);
        const approved = await tokenContract.approve(UniswapRouter.routerAddress, amount, { gasLimit: 100000, gasPrice: ethers.utils.parseUnits('30', 'gwei') });
        await approved.wait();
    }

    public static async getQuote(amount: number, quoteAddress: string, chainId: number, isETH: boolean, context: IEtherContext): Promise<number> {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        console.log(amountInWei)
        console.log(amountInWei.toString(), quoteAddress, chainId)
        try {
            if (!amount || amount === 0) return 0;
            if (isETH) {
                try {
                    const gQuote = await EtherHelper.getQuoteEthToToken(amount, quoteAddress, context);
                    const q_map = ethers.utils.formatEther(gQuote)
                    console.log("EtherHelper.getQuote(%s):", q_map, q_map);
                } catch (error) {
                    console.error("Error in getting ETH to Token quote:", error);
                }
            } else {
                try {
                    const gQuoteOut = await EtherHelper.getQuoteTokenToEth(amount, quoteAddress, context);
                    const q_mapOut = ethers.utils.formatEther(gQuoteOut)
                    console.log("EtherHelper.getQuote(%s):", q_mapOut, q_mapOut);
                } catch (error) {
                    console.error("Error in getting Token to ETH quote:", error);
                }
            }
        } catch (error) {
            // @ts-expect-error
            console.log("EtherHelper.getQuote FAILED [%s]: %s", error.code, error.message);
        }

        return 0;
    }

    public static initialSwap(): ISwap {
        return {
            swapAmount: undefined
        } as ISwap;
    }

    public static async initialInfoPool(context: IEtherContext): Promise<IEtherContext> {
        const provider = new ethers.providers.JsonRpcProvider(AddressFactory.getRpcUrl(this.getChainId()));

        const router = new ethers.Contract(AddressFactory.getRouterV2(11155111), RouterV2, provider)
        const pair = new ethers.Contract(AddressFactory.getPair(11155111), PairV2, provider)

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

    public static async executeSwap(
        ABIswap: any[],
        asset: string,
        amountIn: ethers.BigNumber,
        isEthToToken: boolean,
        context: IEtherContext
    ): Promise<IEtherContext> {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);
        const router = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), ABIswap, signer)
        const path = isEthToToken ? [AddressFactory.getWETH(context.chainId ?? 11155111), asset] : [asset, AddressFactory.getWETH(context.chainId ?? 11155111)];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const amountInWei = ethers.utils.parseUnits(amountIn.toString(), 0);
        console.log(amountInWei.toString())

        try {
            if (isEthToToken) {
                const amountOutMin = await router.getAmountsOut(amountInWei, path);
                const transactionResult = await router.swapExactETHForTokens(amountOutMin[1], path, signer.getAddress(), deadline, { value: amountInWei.toString() });
                context.toastId = `swapETHforExactTokens_${transactionResult.transactionHash}`
                console.log('EtherHelper.swap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            } else {
                const amountOutMin = await router.getAmountsOut(amountIn, path);
                const transactionResult = await router.swapExactTokensForETH(amountInWei.toString(), amountOutMin, path, signer.getAddress(), deadline);
                context.toastId = `swapTokensforExactETH_${transactionResult.transactionHash}`
                console.log('EtherHelper.swap Transaction Hash: ', JSON.stringify(transactionResult.transactionHash));
            }

            context = {
                ...context,
                toastStatus: 'success',
                toastTitle: 'DiviSwap',
                toastDescription: 'Successfully swapped ETH',
            };

        } catch (error) {
            context = {
                ...context,
                toastId: `executeSwapErrorOn${Date.now()}`,
                toastStatus: 'error',
                toastTitle: 'DiviSwap',
                toastDescription: `FAILED to swap: ${(error as Error)?.message}`
            };
        }

        return context;
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
            const router = new ethers.Contract(AddressFactory.getRouterV2(context.chainId ?? 11155111), ABIswap, signer)

            const slippageTolerance = "0.5"
            const swapAmountBN = ethers.utils.parseEther(context.swapAmount.toString())

            if (context.swapToken && context.swapToken?.address) {
                let transactionResult = await EtherHelper.executeSwap(ABIswap, context.swapToken.address, swapAmountBN, true, context)
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


    public static async querySignerInfo(context: IEtherContext): Promise<IEtherContext> {
        if (!context.addressSigner) return context;
        const provider = EtherHelper.initProvider();
        const chainId = EtherHelper.getChainId()
        const factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, provider) as DivitrendFactories;

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

        await Promise.all([etherBalancePromise, FactOwned, totalSupply, otherBalance]);

        return context;
    }

    public static async factoriesTokensOf(context: IEtherContext) {
        const provider = EtherHelper.initProvider();
        const signer = provider.getSigner(context.addressSigner);
        const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, signer) as DivitrendFactories;

        if (context.connected) {
            try {
                const tokenIds = await Factories.tokensOfOwner(context.addressSigner ?? '');

                return tokenIds;
            } catch (e) {
                console.log("Can't fetch balanceOf owner:", e)
            }
        }
    }

    public static async getTokenURI(context: IEtherContext, tokenId: number) {
        if (context.connected) {
            const provider = EtherHelper.initProvider();
            const signer = provider.getSigner(context.addressSigner);
            const Factories = new Contract(AddressFactory.getFactoriesAddress(context.chainId ?? 11155111), DivitrendFactoriesABI, signer) as DivitrendFactories;

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