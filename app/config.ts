// Configuration based on environment
import { formatUnits } from 'viem';
import { abstractTestnet } from 'viem/chains';
import koalaKoinTossV1 from '../public/abis/KoalaKoinTossV1.json';

/**
 * Environment-specific configurations for different deployment environments
 * Used in:
 * - useContract.ts for contract initialization
 * - useWallet.ts for wallet connection
 * - usePaymaster.ts for paymaster operations
 */
const environments = {
  development: {
    chain: abstractTestnet,
    contractAddress: '0xb7732fb08646261f69DAd26f2f2C8b4f8dcC5070', // Used in useContract.ts for contract initialization
    kpAddress: '0xf3E1263c2C0a660f567B5338895C4E7D616a138B', // Used in usePaymaster.ts for KP token operations
    paymasterAddress: '0x5407B5040dec3D339A9247f3654E59EEccbb6391', // Used in usePaymaster.ts for paymaster operations
  },
  production: {
    chain: {
      ...abstractTestnet,
      // id: 2_741,
      // name: 'Abstract',
      // rpcUrls: {
      //   default: {
      //     http: ['https://api.mainnet.abs.xyz'],
      //     webSocket: ['wss://api.mainnet.abs.xyz/ws'],
      //   },
      // },
      // blockExplorers: {
      //   default: {
      //     name: 'Abstract Block Explorer',
      //     url: 'https://explorer.mainnet.abs.xyz',
      //   },
      // },
      // testnet: false,
    },
    contractAddress: '0xb7732fb08646261f69DAd26f2f2C8b4f8dcC5070', // TODO:Replace with production contract address
    kpAddress: '0xf3E1263c2C0a660f567B5338895C4E7D616a138B', // TODO:Replace with production kp address
    paymasterAddress: '0x5407B5040dec3D339A9247f3654E59EEccbb6391',
  },
};

// Select configuration based on NODE_ENV
export const environment = (process.env.NODE_ENV || 'development') as keyof typeof environments;
const currentConfig = environments[environment] || environments.development;

/**
 * Contract ABI used in:
 * - useContract.ts for contract method calls
 * - useGameOptionsStore.ts for reading game options
 * - useGameCountStore.ts for tracking game count
 */
export const koalaKoinTossV1Abi = koalaKoinTossV1.abi;

/**
 * Contract addresses and configurations used across the application
 * Used in:
 * - useContract.ts for contract initialization
 * - usePaymaster.ts for paymaster operations
 * - useWallet.ts for wallet connection
 */
export const contractAddress: `0x${string}` = currentConfig.contractAddress as `0x${string}`;
export const kpAddress: `0x${string}` = currentConfig.kpAddress as `0x${string}`;
export const kpSymbol = 'XT';
export const paymasterAddress: `0x${string}` = currentConfig.paymasterAddress as `0x${string}`;
export const clientConfig = {
  chain: currentConfig.chain,
};

/**
 * Contract function names used in:
 * - useContract.ts for contract method calls
 * - useGameOptionsStore.ts for reading game options
 * - useGameCountStore.ts for tracking game count
 */
export const functionNames = {
  koinToss: 'koin_toss', // Used in useContract.ts for placing bets
  koinTossEth: 'koin_toss_eth', // Used in useContract.ts for ETH bets
  getPayout: 'getPayout', // Used in useGameOptionsStore.ts for calculating payouts
  getGameOptions: 'gameOptions', // Used in useGameOptionsStore.ts for fetching game options
  getBetLimits: 'getBetLimits', // Used in useGameOptionsStore.ts for bet limits
  getGameCount: 'gameCount', // Used in useGameCountStore.ts for tracking games
  getPrizePools: 'prizePools', // Used in useGameOptionsStore.ts for prize pool info
};

/**
 * Contract event names used in:
 * - useContract.ts for event listening
 * - useGameCountStore.ts for game state updates
 */
export const eventNames = {
  TossCommitted: 'TossCommitted', // Used in useContract.ts for bet commitment events
  TossRevealed: 'TossRevealed', // Used in useContract.ts for bet reveal events
};

// For build-time timestamp (this will be replaced with actual build time)
export const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();

/**
 * Storage key prefixes used in:
 * - useSettingStore.ts for user settings
 * - useGameOptionsStore.ts for game options caching
 * - useGameCountStore.ts for game count persistence
 */
export const KEY_PREFIX = 'koala_koin_toss_';
export const SESSION_STORAGE_KEY_PREFIX = `${KEY_PREFIX}session_`;
export const SETTING_STORAGE_KEY = `${KEY_PREFIX}setting`;
export const GAME_OPTIONS_STORAGE_KEY = `${KEY_PREFIX}game_options`;
export const GAME_OPTIONS_STORAGE_UPDATED_AT_KEY = `${KEY_PREFIX}game_options_updated_at`;

/**
 * Game configuration constants used in:
 * - useGameOptionsStore.ts for game options
 * - useContract.ts for contract interactions
 */
export const BLOCK_NUMBER_TO_FETCH = 1000000;

/**
 * Pool edge configuration used in:
 * - useGameOptionsStore.ts for payout calculations
 * - useContract.ts for contract interactions
 */
const getPoolEdge = (blockNumber?: number): number => {
  switch (true) {
    // TODO: Add more cases when the pool edge is updated
    case blockNumber === undefined:
      return 15000000;
    default:
      return 15000000;
  }
};
export const POOL_EDGE: bigint = BigInt(getPoolEdge());
export const POOL_EDGE_DISCRIMINATOR = 1 - Number(formatUnits(POOL_EDGE, 8));

/**
 * Initial game settings used in:
 * - useUserGameOptionStore.ts for default bet amounts
 * - useSettingStore.ts for default sound settings
 */
export const INITIAL_BET_AMOUNT = 0.001;
export const INITIAL_BGM_VOLUME = 0.3;
