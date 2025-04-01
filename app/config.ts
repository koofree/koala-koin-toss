// Configuration based on environment
import { abstractTestnet } from 'viem/chains';
import koalaKoinTossV1 from '../public/abis/KoalaKoinTossV1.json';

// Define environment-specific configurations
const environments = {
  development: {
    chain: abstractTestnet,
    contractAddress: '0x2439D8c9938a9181B17bfb474DC601Aa5d5eff7e',
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
    contractAddress: '0x2439D8c9938a9181B17bfb474DC601Aa5d5eff7e', // TODO:Replace with production contract address
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
export const functionNames = {
  koinToss: 'koin_toss',
  koinTossEth: 'koin_toss_eth',
  getPayout: 'getPayout',
  getGameOptions: 'gameOptions',
  getBetLimits: 'getBetLimits',
  getGameCount: 'gameCount',
  getPrizePools: 'prizePools',
};

export const eventNames = {
  TossCommitted: 'TossCommitted',
  TossRevealed: 'TossRevealed',
};
