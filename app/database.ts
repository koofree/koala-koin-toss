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
