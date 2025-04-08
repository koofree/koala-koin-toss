import { GameResult } from '@/types';
import { create } from 'zustand';

interface GameHistory {
  allGameHistory: GameResult[];
  myGameHistory: GameResult[];
  setAllGameHistory: (allGameHistory: (prev: GameResult[]) => GameResult[]) => void;
  setMyGameHistory: (myGameHistory: (prev: GameResult[]) => GameResult[]) => void;
}

export const useGameHistoryStore = create<GameHistory>((set, get) => ({
  allGameHistory: [],
  myGameHistory: [],
  setAllGameHistory: (allGameHistory: (prev: GameResult[]) => GameResult[]) =>
    set({ allGameHistory: allGameHistory(get().allGameHistory) }),
  setMyGameHistory: (myGameHistory: (prev: GameResult[]) => GameResult[]) =>
    set({ myGameHistory: myGameHistory(get().myGameHistory) }),
}));

interface LastBlockNumberStore {
  lastBlockNumber: bigint;
  setLastBlockNumber: (lastBlockNumber: bigint) => void;
}

export const useLastBlockNumberStore = create<LastBlockNumberStore>((set) => ({
  lastBlockNumber: BigInt(0),
  setLastBlockNumber: (lastBlockNumber: bigint) => set({ lastBlockNumber }),
}));
