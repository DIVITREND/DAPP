/* eslint-disable prettier/prettier */
import { Contract, Signer } from "ethers";
//import { Crooks, CrooksExchange, CrooksLegends, CrooksReferral, CrooksRewards } from "../typechain-types";
import DeployHelper from "./helpers/DeployHelper";
//import CrooksABI from "../abi/Crooks.json";
//import CrooksRewardsABI from "../abi/CrooksRewards.json";
//import CrooksReferralABI from "../abi/CrooksReferral.json";
//import CrooksExchangeABI from "../abi/CrooksExchange.json";
//import CrooksLegendsABI from "../abi/CrooksLegends.json";
import DataHelper from "./helpers/DataHelper";
import * as crypto from 'crypto';
import { keccak256 } from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import { ethers } from "hardhat";

async function checkWalletBalance(walletAddress: string): Promise<number> {
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/1f3e128e8b4f45449bd243b008838f52');

  const balanceWei = await provider.getBalance(walletAddress);

  const balanceEther = ethers.utils.formatEther(balanceWei);

  return parseFloat(balanceEther);
}

async function main() {
  function generateRandomPrivateKey(): string {
    const privateKeyBytes = crypto.randomBytes(32);
    const privateKeyHex = privateKeyBytes.toString('hex');
    return privateKeyHex;
  }

  function derivePublicKey(privateKey: string): string {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    const publicKeyBuffer = secp256k1.publicKeyCreate(privateKeyBuffer, false);
    const publicKeyHex = publicKeyBuffer.toString('hex').replace(/,/g, ''); // Rimuovi le virgole
    return publicKeyHex;
  }

  // Funzione per calcolare l'indirizzo del wallet dall'hash della chiave pubblica
  function calculateWalletAddress(publicKey: string): string {
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const addressBuffer = keccak256(publicKeyBuffer.slice(1)); // Ignora il byte iniziale
    const addressHex = '0x' + addressBuffer.slice(-20).toString('hex'); // Prendi gli ultimi 20 byte
    return addressHex;
  }

  // Funzione per verificare se una chiave privata corrisponde a un indirizzo del wallet
  function isPrivateKeyMatchingAddress(privateKey: string, address: string): boolean {
    const publicKey = derivePublicKey(privateKey);
    const walletAddress = calculateWalletAddress(publicKey);
    return walletAddress.toLowerCase() === address.toLowerCase();
  }

  // Loop per generare e verificare nuove chiavi private fino a quando la corrispondenza è raggiunta
  let privateKey: string;
  let publicKey: string;
  let walletAddress: string;

  do {
    privateKey = generateRandomPrivateKey();
    publicKey = derivePublicKey(privateKey);
    walletAddress = calculateWalletAddress(publicKey);

    console.log('Tentativo con nuova chiave privata:');
    console.log('Chiave Privata:', privateKey);
    console.log('Chiave Pubblica:', publicKey);
    console.log('Indirizzo del Wallet:', walletAddress);
  } while (!isPrivateKeyMatchingAddress(privateKey, walletAddress));

  // Numero massimo di tentativi
  const maxAttempts = 100000;

  // Tentativi
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    privateKey = generateRandomPrivateKey();
    const publicKey = derivePublicKey(privateKey);
    walletAddress = calculateWalletAddress(publicKey);

    console.log(`Wallet: `, attempt);
    console.log('Private Key:', privateKey);
    console.log('Public Key:', publicKey);
    console.log('Wallet Address:', walletAddress);

    const balance = await checkWalletBalance(walletAddress);
    console.log('Wallet Balance:', balance, 'ETH');

    if (balance !== 0) {
      console.log('Wallet has non-zero balance. Stopping.');
      break;
    } else {
      console.log('Wallet has zero balance. Retrying.');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


