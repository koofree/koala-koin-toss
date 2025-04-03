'use client';

import { useLoginWithAbstract } from '@abstract-foundation/agw-react';
import { useEffect, useState } from 'react';
import { createPublicClient, formatUnits, http } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import {
  BLOCK_NUMBER_TO_FETCH,
  clientConfig,
  contractAddress,
  eventNames,
  koalaKoinTossV1Abi,
  kpAddress,
} from '@/config';
import Link from 'next/link';
import { Image } from './components/image/image';
import { MainGame } from './components/MainGame';
import { UserPanel } from './components/UserPanel';
import { GameResult } from './database';

export default function Home() {
  // Create a public client to interact with the blockchain
  const publicClient = createPublicClient({
    ...clientConfig,
    transport: http(),
  });

  const { login, logout } = useLoginWithAbstract();
  const { address, status } = useAccount();

  const { data: walletBalance, refetch: refetchWalletBalance } = useBalance({
    address: address,
  });

  const { data: kpBalance, refetch: refetchKpBalance } = useBalance({
    address: address,
    token: kpAddress,
  });

  const [allGameHistory, setAllGameHistory] = useState<GameResult[]>([]);
  const [myGameHistory, setMyGameHistory] = useState<GameResult[]>([]);
  const [lastBlockNumber, setLastBlockNumber] = useState<bigint>(BigInt(0));

  const appendGameHistory = (result: GameResult) => {
    setAllGameHistory((prev) =>
      prev.find((v) => v.timestamp === result.timestamp) === undefined
        ? [result, ...(prev.length > 10 ? prev.slice(0, 9) : prev)]
        : prev
    );

    if (result.address === address) {
      setMyGameHistory((prev) =>
        prev.find((v) => v.timestamp === result.timestamp) === undefined
          ? [result, ...(prev.length > 10 ? prev.slice(0, 9) : prev)]
          : prev
      );
    }
  };

  const getGameLogs = async (fromBlock: bigint, toBlock: bigint) => {
    // Fetch events

    const logs = await publicClient
      .getLogs({
        address: contractAddress,
        fromBlock: fromBlock,
        toBlock: toBlock,
        events: koalaKoinTossV1Abi.filter((v) => v.type === 'event'), // filtering type is event
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
            // feeAmount is included in betAmount
            formatUnits(tossCommitedEvent.args.betAmount + tossCommitedEvent.args.feeAmount, 18)
          ),
          selectedSide: tossCommitedEvent.args.selectedSide,
          coinCount: tossCommitedEvent.args.coinCount,
          minHeads: tossCommitedEvent.args.minHeads,
          results: undefined,
          won: tossRevealedEvent.args.didWin,
          reward: Number(formatUnits(tossRevealedEvent.args.payout, 18)),
          commitTransactionHash: v.transactionHash,
          revealTransactionHash: tossRevealedEvent.transactionHash,
        };
        appendGameHistory(gameResult);
      }
    });

    setLastBlockNumber(toBlock);
  };

  // Set up listener for new blocks
  useEffect(() => {
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        if (blockNumber > lastBlockNumber) {
          getGameLogs(
            lastBlockNumber > BigInt(5)
              ? lastBlockNumber - BigInt(5)
              : blockNumber > BigInt(BLOCK_NUMBER_TO_FETCH)
                ? blockNumber - BigInt(BLOCK_NUMBER_TO_FETCH)
                : BigInt(0), // 1000000 is the number of blocks to fetch
            blockNumber
          );
        }
      },
    });

    // Clean up watcher on component unmount
    return () => {
      unwatch();
    };
  }, [publicClient]);

  useEffect(() => {
    if (address) {
      setLastBlockNumber(BigInt(0));
    }
  }, [address]);

  return (
    <main className="inline-block text-left mt-10">
      <div className="flex flex-col items-center relative">
        <div className="w-[1024px] h-[512px] bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat relative">
          <div className="w-full h-full flex flex-row items-center">
            <div className="w-2/12 h-full flex flex-col items-center">
              <Link href="/">
                <Image
                  src="/images/header/lg_koala_koin-toss_original.png"
                  alt="Dancing Koala"
                  width={80}
                  className="mt-[20px]"
                  unoptimized
                />
              </Link>
              <Image
                src="/images/koala/dancing/dancing_koala_front.gif"
                alt="Dancing Koala"
                width={80}
                className="mt-[300px]"
                unoptimized
              />
              <div className="flex flex-col items-center justify-center absolute bottom-0">
                <div className="flex space-x-2">
                  <Image
                    src="/images/footer/ic_cactus1.png"
                    alt="Cactus 1"
                    width={24}
                    height={24}
                  />
                  <Image
                    src="/images/footer/ic_cactus2.png"
                    alt="Cactus 2"
                    width={24}
                    height={24}
                  />
                  <Image
                    src="/images/footer/ic_cactus4.png"
                    alt="Cactus 4"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>

            <MainGame
              userAddress={address}
              refetchWalletBalance={() => {
                refetchWalletBalance();
                refetchKpBalance();
              }}
              walletBalance={walletBalance}
              myGameHistory={myGameHistory}
              allGameHistory={allGameHistory}
            />

            <div className="w-2/12 h-full flex flex-col items-center">
              <UserPanel
                address={address}
                walletBalance={walletBalance}
                kpBalance={kpBalance}
                login={login}
                logout={logout}
                status={status}
              />
              <Image
                src="/images/koala/dancing/dancing_koala_back.gif"
                alt="Dancing Koala"
                width={80}
                className="mt-[340px]"
                unoptimized
              />
              <div className="flex flex-col items-center justify-center absolute bottom-0">
                <div className="flex space-x-2">
                  <Image
                    src="/images/footer/ic_cactus1.png"
                    alt="Cactus 1"
                    width={24}
                    height={24}
                  />
                  <Image
                    src="/images/footer/ic_cactus2.png"
                    alt="Cactus 2"
                    width={24}
                    height={24}
                  />
                  <Image
                    src="/images/footer/ic_cactus4.png"
                    alt="Cactus 4"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
