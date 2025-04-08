import {
  BUILD_TIME,
  contractAddress,
  functionNames,
  koalaKoinTossV1Abi,
  POOL_EDGE_DISCRIMINATOR,
} from '@/config';
import { GameOption } from '@/types';
import { floorNumber, roundNumber } from '@/utils/floorNumber';
import { formatUnits, PublicClient } from 'viem';
import { create } from 'zustand';

interface GameOptions {
  loadingProgress: number;
  gameOptions: Array<GameOption>;
  getByCoinCountAndMinHeads: (coinCount: number, minHeads: number) => GameOption | undefined;
  getByGameId: (gameId: bigint) => GameOption | undefined;
  initializeAllGameOptions: (publicClient: PublicClient) => Promise<void>;
}

// Create a store that accepts publicClient as a parameter
export const useGameOptionsStore = create<GameOptions>((set, get) => {
  const getByCoinCountAndMinHeads = (
    coinCount: number,
    minHeads: number
  ): GameOption | undefined => {
    const gameOptions = get().gameOptions;

    return gameOptions.find((v) => v[1] === coinCount && v[2] === minHeads);
  };

  const getByGameId = (gameId: bigint): GameOption | undefined => {
    const gameOptions = get().gameOptions;

    return gameOptions.find((v) => v[0] === Number(gameId));
  };

  const initializeAllGameOptions = async (publicClient: PublicClient) => {
    let storedAllGameOptionsUpdatedAt = localStorage.getItem('allGameOptionsUpdatedAt');
    let storedAllGameOptions = localStorage.getItem('allGameOptions');

    // check if the allGameOptions is outdated
    if (
      storedAllGameOptions &&
      storedAllGameOptionsUpdatedAt &&
      new Date(storedAllGameOptionsUpdatedAt) < new Date(BUILD_TIME)
    ) {
      localStorage.removeItem('allGameOptionsUpdatedAt');
      localStorage.removeItem('allGameOptions');
      storedAllGameOptions = null;
      storedAllGameOptionsUpdatedAt = null;
    }

    if (storedAllGameOptions) {
      set({ gameOptions: JSON.parse(storedAllGameOptions), loadingProgress: 100 });
      return;
    }

    const gameCount = await publicClient.readContract({
      address: contractAddress,
      abi: koalaKoinTossV1Abi,
      functionName: functionNames.getGameCount,
    });

    set((prev) => ({ ...prev, loadingProgress: prev.loadingProgress + 1 }));

    const newAllGameOptions = [];
    const prizePoolMap: Record<number, unknown> = {};

    try {
      for (let i = 0; i < Number(gameCount); i++) {
        // Reference: /public/abis/KoalaKoinTossV1.json gameOptions()
        const gameOption = await publicClient.readContract({
          address: contractAddress,
          abi: koalaKoinTossV1Abi,
          functionName: functionNames.getGameOptions,
          args: [i],
        });
        set((prev) => ({ ...prev, loadingProgress: prev.loadingProgress + 1 }));

        if (Array.isArray(gameOption)) {
          let prizePools = prizePoolMap[Number(gameOption[7])];
          if (!prizePools) {
            prizePools = await publicClient.readContract({
              address: contractAddress,
              abi: koalaKoinTossV1Abi,
              functionName: functionNames.getPrizePools,
              args: [Number(gameOption[7])],
            });

            prizePoolMap[Number(gameOption[7])] = prizePools;
          }

          if (
            Array.isArray(prizePools) &&
            gameOption[6] === true &&
            String(prizePools[1]).toUpperCase() === 'WETH'
          ) {
            const betLimits = (await publicClient.readContract({
              address: contractAddress,
              abi: koalaKoinTossV1Abi,
              functionName: functionNames.getBetLimits,
              args: [Number(gameOption[0])],
            })) as Array<bigint>;

            const newGameOption = [
              Number(gameOption[0]),
              Number(gameOption[1]),
              Number(gameOption[2]),
              String(prizePools[1]).toUpperCase(),
              roundNumber(
                Number(formatUnits(gameOption[5], 8)) * (1 - 0.035) * POOL_EDGE_DISCRIMINATOR,
                2
              ),
              Number(roundNumber(Number(gameOption[4]) / 1_000_000, 2)),
              [
                roundNumber(Number(formatUnits(betLimits[0], 18))),
                floorNumber(Number(formatUnits(betLimits[1], 18))),
              ],
            ];

            newAllGameOptions.push(newGameOption);
          }
        }
      }
    } catch (error) {
      console.error('Error loading game options:', error);
    } finally {
      set((prev) => ({ ...prev, loadingProgress: 100 }));
    }

    set({ gameOptions: newAllGameOptions as Array<GameOption> });

    localStorage.setItem('allGameOptions', JSON.stringify(newAllGameOptions));
    localStorage.setItem('allGameOptionsUpdatedAt', new Date().toISOString());
  };

  return {
    loadingProgress: 0,
    gameOptions: [],
    getByCoinCountAndMinHeads,
    getByGameId,
    initializeAllGameOptions,
  };
});
