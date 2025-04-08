import Link from 'next/link';

import { clientConfig, kpSymbol } from '@/config';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useGameOptionsStore } from '@/store/useGameOptionsStore';
import { GameOption, GameResult } from '@/types';
import { roundNumber } from '@/utils/floorNumber';
import { dateFormat, formatAddress } from '@/utils/format';
import { getErc20Transfer } from '@/utils/getLogs';
import { useEffect, useState } from 'react';
import { createPublicClient, http, PublicClient, TransactionReceipt } from 'viem';
import { useAccount } from 'wagmi';

interface HistoriesProps {}

const MyHistoryRow = ({
  publicClient,
  address,
  game,
  gameOption,
}: {
  publicClient: PublicClient;
  address: `0x${string}`;
  game: GameResult;
  gameOption?: GameOption;
}) => {
  const [reward, setReward] = useState('');

  const setRewardAsync = async () => {
    // Get token transfers for this transaction if it exists
    if (game.revealTransactionHash && !game.won) {
      const receipt: TransactionReceipt = (await publicClient.getTransactionReceipt({
        hash: game.revealTransactionHash,
      })) as TransactionReceipt;

      const reward: number | undefined = receipt
        ? await getErc20Transfer(receipt, address)
        : undefined;

      setReward(reward ? `${reward} ${kpSymbol}` : '');
    }
  };

  useEffect(() => {
    if (game.won === true) {
      setReward(roundNumber(game.reward) + ' ETH');
    } else {
      setRewardAsync();
    }
  }, [game]);

  return (
    <tr key={game.timestamp} className="">
      <td className="pt-2 w-[60px]">
        {game.won !== undefined ? (
          <span className="text-white/50">{game.won ? 'WIN' : 'LOSE'}</span>
        ) : (
          ''
        )}
      </td>
      <td className="pt-2 w-[140px]">
        <Link
          href={`${clientConfig.chain.blockExplorers.default.url}/tx/${game.revealTransactionHash}`}
          target="_blank"
          className="text-white/50 hover:text-white"
        >
          {game.won !== undefined ? (
            <span className={game.won ? 'text-green-400' : 'text-red-400'}>{reward}</span>
          ) : (
            '-'
          )}
        </Link>
      </td>
      <td className="pt-2 w-[160px] text-white/50">{dateFormat(new Date(game.timestamp))}</td>
      <td className="pt-2">
        {gameOption?.[1]}:{gameOption?.[2]} (x{gameOption?.[4]})
      </td>
    </tr>
  );
};

const Histories = () => {
  const { address } = useAccount();
  const { myGameHistory, allGameHistory } = useGameHistory(address);
  const { getByGameId } = useGameOptionsStore();

  // Create a public client to interact with the blockchain
  const publicClient = createPublicClient({
    ...clientConfig,
    transport: http(),
  });

  return (
    <div className="flex flex-row items-center px-10 mt-2 h-[280px] w-[1160px] relative">
      <div className="w-full h-full flex flex-row">
        <div className="w-1/2 h-full flex flex-col">
          <p className="text-white">
            <span className="font-semibold">My Plays</span>
          </p>
          <div className="w-[515px] text-white mt-2 pb-1 border-b border-[#4C4A63]">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0">
                <tr className="font-thin">
                  <th className="text-left font-thin w-[60px]">Result</th>
                  <th className="text-left font-thin w-[140px]">Prize</th>
                  <th className="text-left font-thin w-[160px]">Time</th>
                  <th className="text-left font-thin">Game</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="w-[515px] text-white mt-1 overflow-scroll scrollbar-hide">
            <table className="w-full border-collapse text-xs">
              <tbody>
                {myGameHistory.map((game) => {
                  const gameOption = getByGameId(game.gameId);
                  return (
                    <MyHistoryRow
                      key={game.timestamp}
                      publicClient={publicClient as PublicClient}
                      address={game.address}
                      game={game}
                      gameOption={gameOption}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="w-[3px] h-[310px] -top-[8px] absolute left-[580px]"
          style={{
            backgroundColor: '#353345',
          }}
        ></div>
        <div className="w-1/2 h-full flex flex-col pl-[28px]">
          <p className="text-white font-semibold">Recent Games</p>
          <div className="w-[515px] text-white mt-2 pb-1 border-b border-[#4C4A63]">
            <table className="w-full border-collapse text-xs">
              <thead className="sticky top-0">
                <tr className="font-thin">
                  <th className="text-left font-thin w-[120px]">Player</th>
                  <th className="text-left font-thin w-[40px]">Prize</th>
                  <th className="text-left font-thin w-[120px]"></th>
                  <th className="text-left font-thin w-[120px]">Time</th>
                  <th className="text-left font-thin">Game</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="w-full text-white mt-1 scrollbar-hide overflow-scroll">
            <table className="w-full border-collapse text-xs scrollbar-hide">
              <tbody>
                {allGameHistory.map((game) => {
                  const gameOption = getByGameId(game.gameId);
                  return (
                    <tr key={game.timestamp} className="">
                      <td className="pt-2 w-[120px]">
                        <Link
                          href={`${clientConfig.chain.blockExplorers.default.url}/address/${game.address}`}
                          target="_blank"
                          className="text-white/50 hover:text-white"
                        >
                          {formatAddress(game.address, 6, 4)}
                        </Link>
                      </td>
                      <td className="pt-2 w-[40px]">
                        {game.won !== undefined ? (
                          <span className="text-white/50">{game.won ? 'WON' : 'LOSE'}</span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="pt-2 w-[120px]">
                        <Link
                          href={`${clientConfig.chain.blockExplorers.default.url}/tx/${game.revealTransactionHash}`}
                          target="_blank"
                          className="text-white/50 hover:text-white"
                        >
                          {game.won !== undefined ? (
                            <span
                              className={game.won ? 'text-green-400' : 'text-red-400'}
                            >{`${game.won ? roundNumber(game.reward) + ' ETH' : ''}`}</span>
                          ) : (
                            '-'
                          )}
                        </Link>
                      </td>
                      <td className="pt-2 w-[120px] text-white/50">
                        {dateFormat(new Date(game.timestamp))}
                      </td>
                      <td className="pt-2 ">
                        {gameOption?.[1]}:{gameOption?.[2]} (x{gameOption?.[4]})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Histories;
