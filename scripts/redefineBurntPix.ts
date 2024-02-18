import { ethers, network } from 'hardhat';
import * as dotenv from 'dotenv';
import { ERC725 } from '@erc725/erc725.js';

import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'; // @ts-ignore: Unreachable code error
// @ts-ignore: Constant exported properly
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts/constants';

import {
  TOKEN_ID,
  ITERATION_NUMBER,
  SPLITTER,
  BURNT_PIX_CONTRACT,
  MIN_LYX_BALANCE,
  MAX_GAS_PRICE,
} from '../consts/constants';
import BurntPixABI from '../consts/BurntPixABI.json';

interface CustomNetworkConfig {
  url?: string;
}

interface BurntPixAttribute {
  key: string;
  type: string;
  value: number | string;
}

interface BurntPixAttributeValue {
  [key: string]: number | string;
}

// Load the environment variables
dotenv.config();

async function main() {
  // Set your token ID and it's final redefinenent number
  const burntPix = TOKEN_ID.BURNT_STAR;
  const maximumRedefines = 1111000;

  // Import private key to create wallet
  const { PRIVATE_KEY } = process.env;

  // Setup network parameters for ERC725
  const customNetworkConfig = network.config as CustomNetworkConfig;
  const networkUrl = customNetworkConfig.url;

  // Check if transaction is pending
  let isWaitingForTransaction = false;

  // Check if RPC URL is provided
  if (!networkUrl) {
    throw new Error('Network URL is not defined in the Hardhat configuration.');
  }

  // Check if private key is provided
  if (!PRIVATE_KEY) {
    throw new Error('No private key provided.');
  }

  // Create new wallet for EOA controller
  const provider = new ethers.JsonRpcProvider(networkUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create instance of the BurntPix contract
  const contractABI = BurntPixABI;
  // Use address based on used Hardhat network
  const contract = new ethers.Contract(
    BURNT_PIX_CONTRACT[network.name as keyof typeof BURNT_PIX_CONTRACT],
    contractABI,
    wallet,
  );

  // Function to check conditions and call refine
  const refineScript = async () => {
    // Check for balance of the controller
    const balanceinWei = await provider.getBalance(wallet.address);
    const balanceInLYX = ethers.formatEther(balanceinWei);
    console.log(SPLITTER);

    if (isWaitingForTransaction) {
      console.log('Previous refinement is still processing. Skipping this round.');
      console.log(SPLITTER);
      return;
    }

    console.log('--- Current Controller: ', wallet.address);
    console.log('--- Current LYX Balance: ', balanceInLYX);

    // Get gas price of the network and convert to Gwei
    const gasPrice = (await provider.getFeeData()).gasPrice;

    if (gasPrice === null) {
      throw new Error('Failed to fetch the gas price');
    }

    const gasPriceInGwei = ethers.formatUnits(gasPrice, 'gwei');
    console.log('--- Current Gas Price: ', gasPriceInGwei);

    // Get the metadata of the token ID
    console.log('--- Getting Metadata for: ', burntPix);
    console.log(SPLITTER);
    const tokenIdMetadata = await contract.getDataForTokenId(
      burntPix,
      ERC725YDataKeys.LSP4['LSP4Metadata'],
    );

    const erc725js = new ERC725(lsp4Schema);

    // Decode the content from the ERC725Y storage
    const decodedMetadata = erc725js.decodeData([
      {
        keyName: 'LSP4Metadata',
        value: tokenIdMetadata,
      },
    ]);

    // Get the actual data from the URL field
    const urlContent = decodedMetadata[0].value.url;

    // Get the inner JSON containing the metadata
    const metadataString = urlContent.substring(
      urlContent.indexOf('{'),
      urlContent.lastIndexOf('}') + 1,
    );

    // Parse the content string to get it's JSON
    const innerJsonObject = JSON.parse(metadataString);
    const attributesArray: BurntPixAttribute[] = innerJsonObject.LSP4Metadata.attributes;

    // Convert the array to an object with dynamic keys and values
    // Convert the array to an object with dynamic keys and values
    const attributes: BurntPixAttributeValue = attributesArray.reduce<BurntPixAttributeValue>(
      (acc, attr: BurntPixAttribute) => {
        acc[attr.key] = attr.value;
        return acc;
      },
      {},
    );

    // Prepare attributes for terminal output
    const attributesOutput = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    console.log(attributesOutput);
    console.log(SPLITTER);

    // Prepare values for comparison
    const totalIterations = Number(attributes['Iterations']);
    const balanceInLYXNumber = parseFloat(balanceInLYX);
    const gasPriceInGweiNumber = parseFloat(gasPriceInGwei);

    const stopScript = () => {
      // Stop the script
      console.log('Stopping the script...');
      console.log(SPLITTER);
      process.exit(1);
    };

    /**
     * Metrix for redifinement
     * - Controller balance that must be fulfilled
     * - Maximum iteration count for the token ID
     * - Maximum gas price you want to redefine at
     */
    console.log(`[${new Date().toLocaleTimeString()}] Checking conditions for refinement...`);
    if (balanceInLYXNumber <= MIN_LYX_BALANCE) {
      console.log('XXX Requirement not met: Balance less than 0.3 LYX.');
      stopScript();
    } else if (totalIterations >= maximumRedefines) {
      console.log('XXX Requirement not met: Redefines fulfilled');
      stopScript();
    }

    if (gasPriceInGweiNumber <= MAX_GAS_PRICE) {
      console.log('--- Calling refine...');
      isWaitingForTransaction = true;
      try {
        const tx = await contract.refine(burntPix, ITERATION_NUMBER, {
          gasPrice: gasPrice,
        });
        await tx.wait();
        console.log('Refine called successfully. Waiting for next round...');
      } catch (error) {
        console.error('Transaction reverted');
      } finally {
        // Reset the flag after transaction completes or fails
        isWaitingForTransaction = false;
      }
    } else {
      console.log('XXX Requirement not met: Gas price too high');
      console.log('Skipping this round...');
      console.log(SPLITTER);
    }
  };
  // Check conditions and call refine periodically
  setInterval(refineScript, 10000); // 10 seconds

  // Initial call
  await refineScript();
}

main();

// Prevent the process from exiting
process.stdin.resume();
