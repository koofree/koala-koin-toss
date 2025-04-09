import {
  BUILD_TIME,
  contractAddress,
  functionNames,
  GAME_OPTIONS_STORAGE_KEY,
  GAME_OPTIONS_STORAGE_UPDATED_AT_KEY,
  koalaKoinTossV1Abi,
} from '@/config';
import { GameOption } from '@/types';
import { calculateMultiplier, floorNumber, roundNumber } from '@/utils/floorNumber';
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
    let storedAllGameOptions = localStorage.getItem(GAME_OPTIONS_STORAGE_KEY);
    let storedAllGameOptionsUpdatedAt = localStorage.getItem(GAME_OPTIONS_STORAGE_UPDATED_AT_KEY);

    // check if the allGameOptions is outdated
    if (
      storedAllGameOptions &&
      storedAllGameOptionsUpdatedAt &&
      new Date(storedAllGameOptionsUpdatedAt) < new Date(BUILD_TIME)
    ) {
      localStorage.removeItem(GAME_OPTIONS_STORAGE_KEY);
      localStorage.removeItem(GAME_OPTIONS_STORAGE_UPDATED_AT_KEY);
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
      // Create a function to fetch a single game option
      const fetchGameOption = async (gameId: number) => {
        try {
          // Reference: /public/abis/KoalaKoinTossV1.json gameOptions()
          const gameOption = await publicClient.readContract({
            address: contractAddress,
            abi: koalaKoinTossV1Abi,
            functionName: functionNames.getGameOptions,
            args: [gameId],
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

              return [
                Number(gameOption[0]),
                Number(gameOption[1]),
                Number(gameOption[2]),
                String(prizePools[1]).toUpperCase(),
                calculateMultiplier(gameOption as [number, number, number, string, number, bigint]),
                Number(roundNumber(Number(gameOption[4]) / 1_000_000, 2)),
                [
                  roundNumber(Number(formatUnits(betLimits[0], 18))),
                  floorNumber(Number(formatUnits(betLimits[1], 18))),
                ],
              ];
            }
          }
          return null;
        } catch (error) {
          console.error(`Error fetching game option ${gameId}:`, error);
          return null;
        }
      };

      // Create an array of promises to fetch all game options in parallel
      const fetchPromises = Array.from({ length: Number(gameCount) }, (_, i) => fetchGameOption(i));

      // Wait for all promises to resolve and filter out null results
      const results = await Promise.all(fetchPromises);
      newAllGameOptions.push(...results.filter(Boolean));
    } catch (error) {
      console.error('Error loading game options:', error);
    } finally {
      set((prev) => ({ ...prev, loadingProgress: 100 }));
    }

    set({ gameOptions: newAllGameOptions as Array<GameOption> });

    localStorage.setItem(GAME_OPTIONS_STORAGE_KEY, JSON.stringify(newAllGameOptions));
    localStorage.setItem(GAME_OPTIONS_STORAGE_UPDATED_AT_KEY, new Date().toISOString());
  };

  return {
    loadingProgress: 0,
    gameOptions: [],
    getByCoinCountAndMinHeads,
    getByGameId,
    initializeAllGameOptions,
  };
});
