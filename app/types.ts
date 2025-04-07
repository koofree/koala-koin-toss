import { Address, Hash as _Hash } from 'viem';

export type Hash = _Hash;
export type UserStatus = 'connected' | 'disconnected' | 'reconnecting' | 'connecting';
export type WalletBalance = { value: bigint; decimals: number; symbol: string };

// Define a type for game results
export type GameResult = {
  id: bigint;
  gameId: bigint;
  address: Address;
  timestamp: string;
  betAmount: number;
  selectedSide: 'HEADS' | 'TAILS';
  coinCount: number;
  minHeads: number;
  results?: Array<'HEADS' | 'TAILS'>;
  won: boolean;
  reward: number;
  commitTransactionHash: Hash;
  revealTransactionHash: Hash;
};
