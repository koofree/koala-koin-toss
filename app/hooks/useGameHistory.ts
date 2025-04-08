import { useGameHistoryStore } from '@/store/useGameHistoryStore';
import { GameResult } from '../types';
import { useGameHistorySubscriber } from './useGameHistorySubscriber';

export const useGameHistory = (address: `0x${string}` | undefined) => {
  const { allGameHistory, myGameHistory, setAllGameHistory, setMyGameHistory } =
    useGameHistoryStore();

  const subscribe = (result: GameResult) => {
    // only add to allGameHistory if the result is won
    if (result.won) {
      setAllGameHistory((prev) =>
        prev.find((v) => v.timestamp === result.timestamp) === undefined
          ? [result, ...(prev.length > 100 ? prev.slice(0, 99) : prev)]
          : prev
      );
    }

    // only add to myGameHistory if the address is the same as the user's address
    if (result.address === address) {
      setMyGameHistory((prev) =>
        prev.find((v) => v.timestamp === result.timestamp) === undefined
          ? [result, ...(prev.length > 100 ? prev.slice(0, 99) : prev)]
          : prev
      );
    }
  };

  useGameHistorySubscriber(subscribe);

  return {
    allGameHistory,
    myGameHistory,
  };
};
