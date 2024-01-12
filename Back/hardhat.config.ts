import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter";
import '@openzeppelin/hardhat-upgrades';

// import { DeployHelper } from "./scripts/Deployhelper";
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// task("unpause", "Unpauses the current contract", async (taskArgs, hre) => {
//   // const provider = hre.ethers.provider;
//   // const signer = await hre.ethers.getSigner(
//   //   AddressHelper.getDeployerAddress(25)
//   // );
// });

const config: HardhatUserConfig = {

  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.7.0",
        settings: {},
      },
    ],
    settings: {
      optimizer: { enabled: true, runs: 200 },
      metadata: {
        bytecodeHash: 'none',
      },
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    },
  },
  networks: {
    hardhat: { // https://hardhat.org/hardhat-network/guides/mainnet-forking.html
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/d3UhDgKfp9ONJ_nb7M3sIm4IbAutzl0l",
        blockNumber: 14501931, // 14501731 ERV3 ;)
      },
    },
    testnet: {
      url: "https://eth-sepolia.g.alchemy.com/v2/d9hHRJdy6salX7wZ8wyrmrT5aTiYwhwO",
      chainId: 11155111,
      accounts:
        process.env.PRIVATE_KEY_TESTNET !== undefined
          ? [process.env.PRIVATE_KEY_TESTNET]
          : [],
    },
    // testnft: {
    //   url: "https://rpc.sepolia.org",
    //   chainId: 11155111,
    //   accounts:
    //     process.env.PRIVATE_KEY_TESTNET !== undefined
    //       ? [process.env.PRIVATE_KEY_TESTNET]
    //       : [],
    // },
    /*
    mainnet: {
      url: "https://api.securerpc.com/v1",
      chainId: 1,
      gasPrice: 4975980783401,
      // timeout: 100_000,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    */
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined && process.env.REPORT_GAS === "1",
    currency: "USD",
  },
  abiExporter: {
    path: "./abi",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [], // [":ERC20$"],
    spacing: 2,
    pretty: true,
  },
  etherscan: {
    apiKey: {
      testnet: "<cronoscan-api-key>",
      mainnet: "<cronoscan-api-key>",
    },
  },
};

export default config;
