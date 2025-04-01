// Configuration based on environment
import { abstractTestnet } from 'viem/chains';
import koalaKoinTossV1 from '../public/abis/KoalaKoinTossV1.json';

// Define environment-specific configurations
const environments = {
  development: {
    chain: abstractTestnet,
    contractAddress: '0x14444806071625C010f01D5240d379C6247e7428',
    getGameNumber: (coinCount: number, minHeads: number): number | undefined => {
      switch (true) {
        case coinCount === 1 && minHeads === 1:
          return 0;
        case coinCount === 2 && minHeads === 2:
          return 1;
        default:
          return undefined;
      }
    },
  },
  production: {
    chain: {
      ...abstractTestnet,
      id: 2_741,
      name: 'Abstract',
      rpcUrls: {
        default: {
          http: ['https://api.mainnet.abs.xyz'],
          webSocket: ['wss://api.mainnet.abs.xyz/ws'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Abstract Block Explorer',
          url: 'https://explorer.mainnet.abs.xyz',
        },
      },
      testnet: false,
    },
    contractAddress: '0x14444806071625C010f01D5240d379C6247e7428', // TODO:Replace with production contract address
    getGameNumber: (coinCount: number, minHeads: number): number | undefined => {
      switch (true) {
        case coinCount === 1 && minHeads === 1:
          return 0;
        case coinCount === 2 && minHeads === 2:
          return 1;
        default:
          return undefined;
      }
    },
  },
};

// Select configuration based on NODE_ENV
const environment = (process.env.NODE_ENV || 'development') as keyof typeof environments;
const currentConfig = environments[environment] || environments.development;

// Import KoalaKoinTossV1 ABI from the JSON file
export const koalaKoinTossV1Abi = koalaKoinTossV1.abi;
// Replace with your actual contract address
export const contractAddress: `0x${string}` = currentConfig.contractAddress as `0x${string}`;
// client config to specify the chain
export const clientConfig = {
  chain: currentConfig.chain,
};
export const getGameNumber = currentConfig.getGameNumber;
