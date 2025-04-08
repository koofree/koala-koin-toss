import { INITIAL_BET_AMOUNT } from '@/config';
import { GameOption } from '@/types';
import { create } from 'zustand';
import { useGameOptionsStore } from './useGameOptionsStore';

interface UserGameOption {
  gameId: number | undefined;
  userGameOption: {
    coinCount: number;
    minHeads: number;
    betAmount: number;
    selectedSide: 'HEADS' | 'TAILS';
    option: GameOption | undefined;
  };
  setCoinCount: (coinCount: number) => void;
  setMinHeads: (minHeads: number) => void;
  setOption: (option: { coinCount: number; minHeads: number }) => void;
  setBetAmount: (betAmount: number) => void;
  setSelectedSide: (selectedSide: 'HEADS' | 'TAILS') => void;
}

export const useUserGameOptionStore = create<UserGameOption>((set, get) => {
  return {
    gameId: undefined,
    userGameOption: {
      coinCount: 1,
      minHeads: 1,
      betAmount: INITIAL_BET_AMOUNT,
      selectedSide: 'HEADS',
      option: undefined,
    },
    setCoinCount: (coinCount) => {
      const { getByCoinCountAndMinHeads } = useGameOptionsStore.getState();
      const minHeads = Math.min(coinCount, get().userGameOption.minHeads);
      const option = getByCoinCountAndMinHeads(coinCount, minHeads);
      set({
        gameId: option?.[0],
        userGameOption: { ...get().userGameOption, coinCount, minHeads, option },
      });
    },
    setMinHeads: (minHeads) => {
      const { getByCoinCountAndMinHeads } = useGameOptionsStore.getState();
      const option = getByCoinCountAndMinHeads(get().userGameOption.coinCount, minHeads);
      set({
        gameId: option?.[0],
        userGameOption: { ...get().userGameOption, minHeads, option },
      });
    },
    setOption: (option: { coinCount: number; minHeads: number }) => {
      const { getByCoinCountAndMinHeads } = useGameOptionsStore.getState();
      const gameOption = getByCoinCountAndMinHeads(option.coinCount, option.minHeads);
      set({
        gameId: gameOption?.[0],
        userGameOption: { ...get().userGameOption, ...option, option: gameOption },
      });
    },
    setBetAmount: (betAmount) => {
      set({
        userGameOption: { ...get().userGameOption, betAmount },
      });
    },
    setSelectedSide: (selectedSide) => {
      set({ userGameOption: { ...get().userGameOption, selectedSide } });
    },
  };
});
