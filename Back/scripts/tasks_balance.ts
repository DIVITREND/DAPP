import { ethers } from 'ethers';
import * as crypto from 'crypto';
import { keccak256 } from 'ethereumjs-util';
import secp256k1 from 'secp256k1';

async function checkWalletBalance(walletAddress: string, providers: ethers.providers.JsonRpcProvider[]): Promise<number[]> {
    const balancePromises = providers.map(async (provider) => {
        try {
            const balanceWei = await provider.getBalance(walletAddress);
            const balanceEther = ethers.utils.formatEther(balanceWei);
            return parseFloat(balanceEther);
        } catch (error: any) {
            console.error(`Error getting balance from provider ${provider.connection.url}:`, error.message);
            return 0;
        }
    });

    const balances = await Promise.all(balancePromises);
    return balances;
}

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

function calculateWalletAddress(publicKey: string): string {
    const publicKeyBuffer = Buffer.from(publicKey, 'hex');
    const addressBuffer = keccak256(publicKeyBuffer.slice(1)); // Ignora il byte iniziale
    const addressHex = '0x' + addressBuffer.slice(-20).toString('hex'); // Prendi gli ultimi 20 byte
    return addressHex;
}

function isPrivateKeyMatchingAddress(privateKey: string, address: string): boolean {
    const publicKey = derivePublicKey(privateKey);
    const walletAddress = calculateWalletAddress(publicKey);
    return walletAddress.toLowerCase() === address.toLowerCase();
}

async function checkAndRetry(walletAddress: string, providers: ethers.providers.JsonRpcProvider[]): Promise<void> {
    const maxAttempts = 100000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const privateKey = generateRandomPrivateKey();
        const publicKey = derivePublicKey(privateKey);
        walletAddress = calculateWalletAddress(publicKey);

        console.log(`Wallet: `, attempt);
        console.log('Private Key:', privateKey);
        console.log('Public Key:', publicKey);
        console.log('Wallet Address:', walletAddress);

        const balances = await checkWalletBalance(walletAddress, providers);
        console.log('Wallet Balances:', balances, 'ETH');

        if (balances.some((balance) => balance !== 0)) {
            console.log('Wallet has non-zero balance. Stopping.');
            break;
        } else {
            console.log('Wallet has zero balance. Retrying.');
        }
    }
}

async function main() {
    const providers: ethers.providers.JsonRpcProvider[] = [
        new ethers.providers.JsonRpcProvider('https://eth.merkle.io'),
        new ethers.providers.JsonRpcProvider('https://polygon.llamarpc.com'),
        new ethers.providers.JsonRpcProvider('https://evm.cronos.org'),
        // Aggiungi altri provider qui
    ];


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

    await checkAndRetry(walletAddress, providers);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
