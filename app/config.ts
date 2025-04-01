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

// For build-time timestamp (this will be replaced with actual build time)
export const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();

/**
 * @constant {string} SESSION_KEY_VALIDATOR
 * @description The address of the Abstract Global Wallet session key validator contract
 * Docs: https://docs.abs.xyz/abstract-global-wallet/session-keys/going-to-production
 *
 * This contract is used to verify the validity of session keys and determine their status.
 * It implements the sessionStatus function which takes an account address and a session hash
 * and returns the current status of that session.
 */
export const SESSION_KEY_VALIDATOR = '0x00180f0b9d72664AC2D494Dec6E39d3aC061ed65';

/**
 * @constant {Array} SESSION_VALIDATOR_ABI
 * @description The ABI (Application Binary Interface) for the session key validator contract
 *
 * Contains the function signature for sessionStatus which can be used to check if a session
 * is still valid. This ABI only includes the relevant function needed for session validation.
 */
export const SESSION_VALIDATOR_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'sessionHash', type: 'bytes32' },
    ],
    name: 'sessionStatus',
    outputs: [{ internalType: 'enum SessionLib.Status', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
];

/**
 * @constant {string} ENCRYPTION_KEY_PREFIX
 * @description Prefix used for storing encryption keys in local storage
 *
 * The actual storage key is created by appending the user's wallet address to this prefix,
 * ensuring each wallet address has its own unique encryption key stored separately from the
 * encrypted session data.
 */
export const ENCRYPTION_KEY_PREFIX = 'kkt_encryption_key_';

/**
 * @constant {string} STORAGE_KEY_PREFIX
 * @description Prefix used for storing session data in local storage
 *
 * The actual storage key is created by appending the user's wallet address to this prefix,
 * ensuring each wallet address has its own unique session data stored separately from the
 * other wallets.
 */
export const STORAGE_KEY_PREFIX = 'kkt_session_';
