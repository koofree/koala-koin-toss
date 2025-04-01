'use client';

import { useLoginWithAbstract } from '@abstract-foundation/agw-react';
import { useEffect, useState } from 'react';
import { createPublicClient, formatUnits, http } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { clientConfig, contractAddress, koalaKoinTossV1Abi } from '@/config';
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
                requestId: string;
                player: string;
                betAmount: bigint;
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

    const betCommitedEvents = logs.filter((v) => v.eventName === 'BetCommitted');
    const betRevealedEvents = logs.filter((v) => v.eventName === 'BetRevealed');

    betCommitedEvents.forEach((v) => {
      const betCommitedEvent = v;
      const betRevealedEvent = betRevealedEvents.find(
        (v) => v.args.requestId === betCommitedEvent.args.requestId
      );

      if (betRevealedEvent) {
        const date = new Date(Number(betRevealedEvent.blockTimestamp) * 1000);
        const gameResult: GameResult = {
          id: betRevealedEvent.args.requestId,
          address: betCommitedEvent.args.player,
          timestamp: date.toUTCString(),
          betAmount: Number(formatUnits(betCommitedEvent.args.betAmount, 18)),
          selectedSide: betCommitedEvent.args.selectedSide,
          coinCount: betCommitedEvent.args.coinCount,
          minHeads: betCommitedEvent.args.minHeads,
          results: undefined,
          won: betRevealedEvent.args.didWin,
          reward: Number(formatUnits(betRevealedEvent.args.payout, 18)),
          commitTransactionHash: v.transactionHash,
          revealTransactionHash: betRevealedEvent.transactionHash,
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
            lastBlockNumber > BigInt(5) ? lastBlockNumber - BigInt(5) : lastBlockNumber,
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
    <main className="flex flex-col items-center relative">
      <UserPanel
        address={address}
        walletBalance={walletBalance}
        login={login}
        logout={logout}
        status={status}
        createSession={() => {
          // TODO: Implement createSession
        }}
      />
      <div className="w-[1024px] h-[512px] bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat relative">
        <div className="w-full h-full flex flex-row items-center">
          <div className="w-2/12 h-full flex flex-col items-center justify-center">
            <Image
              src="/images/koala/dancing/dancing_koala_front.gif"
              alt="Dancing Koala"
              width={80}
              className="mt-[250px]"
              unoptimized
            />
            <div className="flex flex-col items-center justify-center absolute bottom-0">
              <div className="flex space-x-2">
                <Image src="/images/footer/ic_cactus1.png" alt="Cactus 1" className="w-6 h-6" />
                <Image src="/images/footer/ic_cactus2.png" alt="Cactus 2" className="w-6 h-6" />
                <Image src="/images/footer/ic_cactus4.png" alt="Cactus 4" className="w-6 h-6" />
              </div>
            </div>
          </div>
          {true && (
            <MainGame
              refetchWalletBalance={refetchWalletBalance}
              walletBalance={walletBalance}
              myGameHistory={myGameHistory}
            />
          )}
          <div className="w-2/12 h-full flex flex-col items-center justify-center">
            <Image
              src="/images/koala/dancing/dancing_koala_back.gif"
              alt="Dancing Koala"
              width={80}
              className="mt-[250px]"
              unoptimized
            />
            <div className="flex flex-col items-center justify-center absolute bottom-0">
              <div className="flex space-x-2">
                <Image src="/images/footer/ic_cactus1.png" alt="Cactus 1" className="w-6 h-6" />
                <Image src="/images/footer/ic_cactus2.png" alt="Cactus 2" className="w-6 h-6" />
                <Image src="/images/footer/ic_cactus4.png" alt="Cactus 4" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-[1024px]">
        <div className="w-full h-full flex flex-row items-center">
          <div className="w-1/2 h-full flex flex-col items-center">
            <p>My Game History</p>

            <div className="w-full max-h-[300px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-white/10 sticky top-0">
                  <tr className="text-xs font-medium">
                    <th className="p-2 text-left">Time</th>
                    <th className="p-2 text-left">Amount</th>
                    {/* <th className="p-2 text-left">Coins</th>
                    <th className="p-2 text-left">Min</th> */}
                    <th className="p-2 text-left">Outcome</th>
                    <th className="p-2 text-left">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {myGameHistory.map((game) => (
                    <tr
                      key={game.timestamp}
                      className="text-xs border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="p-2">{new Date(game.timestamp).toLocaleString()}</td>
                      <td className="p-2">{game.betAmount.toFixed(8)} ETH</td>
                      {/* <td className="p-2">{game.coinCount} coins</td>
                      <td className="p-2">{game.minHeads} min</td> */}
                      <td className="p-2">
                        {game.won !== undefined ? (
                          <span className={game.won ? 'text-green-400' : 'text-red-400'}>
                            {game.won ? 'Won' : 'Lost'}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2">
                        {game.won !== undefined ? (
                          <span
                            className={game.won ? 'text-green-400' : 'text-red-400'}
                          >{`${game.won ? '+ ' + game.reward.toFixed(8) : ''}`}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-1/2 h-full flex flex-col items-center">
            <p>Game Logs</p>
            <div className="w-full max-h-[300px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-white/10 sticky top-0">
                  <tr className="text-xs font-medium">
                    <th className="p-2 text-left">Time</th>
                    <th className="p-2 text-left">Amount</th>
                    {/* <th className="p-2 text-left">Coins</th>
                    <th className="p-2 text-left">Min</th> */}
                    <th className="p-2 text-left">Outcome</th>
                    <th className="p-2 text-left">Reward</th>
                  </tr>
                </thead>
                <tbody>
                  {allGameHistory.map((game) => (
                    <tr
                      key={game.timestamp}
                      className="text-xs border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="p-2">{new Date(game.timestamp).toLocaleString()}</td>
                      <td className="p-2">{game.betAmount.toFixed(8)} ETH</td>
                      {/* <td className="p-2">{game.coinCount} coins</td>
                      <td className="p-2">{game.minHeads} min</td> */}
                      <td className="p-2">
                        {game.won !== undefined ? (
                          <span className={game.won ? 'text-green-400' : 'text-red-400'}>
                            {game.won ? 'Won' : 'Lost'}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2">
                        {game.won !== undefined ? (
                          <span
                            className={game.won ? 'text-green-400' : 'text-red-400'}
                          >{`${game.won ? '+ ' + game.reward.toFixed(8) : ''}`}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
