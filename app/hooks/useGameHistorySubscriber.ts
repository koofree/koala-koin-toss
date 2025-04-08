import {
  BLOCK_NUMBER_TO_FETCH,
  clientConfig,
  contractAddress,
  eventNames,
  koalaKoinTossV1Abi,
} from '@/config';
import { useLastBlockNumberStore } from '@/store/useGameHistoryStore';
import { useEffect } from 'react';
import { createPublicClient, formatUnits, Hash, http } from 'viem';
import { GameResult } from '../types';

export const useGameHistorySubscriber = (subscribe: (result: GameResult) => void) => {
  const publicClient = createPublicClient({
    ...clientConfig,
    transport: http(),
  });

  const { lastBlockNumber, setLastBlockNumber } = useLastBlockNumberStore();

  const getGameLogs = async (fromBlock: bigint, toBlock: bigint) => {
    const logs = await publicClient
      .getLogs({
        address: contractAddress,
        fromBlock: fromBlock,
        toBlock: toBlock,
        events: koalaKoinTossV1Abi.filter((v) => v.type === 'event'),
      })
      .then((r) =>
        r.map(
          (v) =>
            v as unknown as {
              eventName: string;
              blockTimestamp: bigint;
              args: {
                requestId: bigint;
                gameId: bigint;
                player: `0x${string}`;
                betAmount: bigint;
                feeAmount: bigint;
                selectedSide: 'HEADS' | 'TAILS';
                coinCount: number;
                minHeads: number;
                didWin: boolean;
                payout: bigint;
              };
              transactionHash: string;
              blockNumber: bigint;
              transactionIndex: bigint;
              logIndex: bigint;
            }
        )
      );

    const tossCommitedEvents = logs.filter((v) => v.eventName === eventNames.TossCommitted);
    const tossRevealedEvents = logs.filter((v) => v.eventName === eventNames.TossRevealed);

    tossCommitedEvents.forEach((v) => {
      const tossCommitedEvent = v;
      const tossRevealedEvent = tossRevealedEvents.find(
        (v) => v.args.requestId === tossCommitedEvent.args.requestId
      );

      if (tossRevealedEvent) {
        const date = new Date(Number(tossRevealedEvent.blockTimestamp) * 1000);
        const gameResult: GameResult = {
          id: tossRevealedEvent.args.requestId,
          gameId: tossCommitedEvent.args.gameId,
          address: tossCommitedEvent.args.player,
          timestamp: date.toUTCString(),
          betAmount: Number(
            formatUnits(tossCommitedEvent.args.betAmount + tossCommitedEvent.args.feeAmount, 18)
          ),
          selectedSide: tossCommitedEvent.args.selectedSide,
          coinCount: tossCommitedEvent.args.coinCount,
          minHeads: tossCommitedEvent.args.minHeads,
          results: undefined,
          won: tossRevealedEvent.args.didWin,
          reward: Number(formatUnits(tossRevealedEvent.args.payout, 18)),
          commitTransactionHash: v.transactionHash as Hash,
          revealTransactionHash: tossRevealedEvent.transactionHash as Hash,
        };

        subscribe(gameResult);
      }
    });

    setLastBlockNumber(toBlock);
  };

  useEffect(() => {
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        if (blockNumber > lastBlockNumber) {
          getGameLogs(
            lastBlockNumber > BigInt(5)
              ? lastBlockNumber - BigInt(5)
              : blockNumber > BigInt(BLOCK_NUMBER_TO_FETCH)
                ? blockNumber - BigInt(BLOCK_NUMBER_TO_FETCH)
                : BigInt(0),
            blockNumber
          );
        }
      },
    });

    return () => {
      unwatch();
    };
  }, [publicClient, lastBlockNumber]);

  return {
    lastBlockNumber,
    setLastBlockNumber,
  };
};
