export type Address = `0x${string}`;
export type UserStatus = 'connected' | 'disconnected' | 'reconnecting' | 'connecting';
export type WalletBalance = { value: bigint; decimals: number; symbol: string };

// Define a type for game results
export type GameResult = {
  id: bigint;
  gameId: bigint;
  address: `0x${string}`;
  timestamp: string;
  betAmount: number;
  selectedSide: 'HEADS' | 'TAILS';
  coinCount: number;
  minHeads: number;
  results?: Array<'HEADS' | 'TAILS'>;
  won: boolean;
  reward: number;
  commitTransactionHash: string;
  revealTransactionHash: string;
};
