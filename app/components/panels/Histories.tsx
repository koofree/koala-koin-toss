import Link from 'next/link';

import { clientConfig } from '@/config';
import { GameResult } from '@/types';
import { floorNumber } from '@/utils/floorNumber';
import { dateFormat, formatAddress } from '@/utils/format';

interface HistoriesProps {
  myGameHistory: GameResult[];
  allGameHistory: GameResult[];
  allGameOptions: Array<[number, number, number, string, number]>;
}

const Histories = ({ myGameHistory, allGameHistory, allGameOptions }: HistoriesProps) => {
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
                  const gameOption = allGameOptions.find(
                    (option) => BigInt(option[0]) === game.gameId
                  );
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
                            <span
                              className={game.won ? 'text-green-400' : 'text-red-400'}
                            >{`${game.won ? floorNumber(game.reward) + ' ETH' : ''}`}</span>
                          ) : (
                            '-'
                          )}
                        </Link>
                      </td>
                      <td className="pt-2 w-[160px] text-white/50">
                        {dateFormat(new Date(game.timestamp))}
                      </td>
                      <td className="pt-2">
                        {gameOption?.[1]}:{gameOption?.[2]} (x{gameOption?.[4]})
                      </td>
                    </tr>
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
                  const gameOption = allGameOptions.find(
                    (option) => BigInt(option[0]) === game.gameId
                  );
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
                            >{`${game.won ? floorNumber(game.reward) + ' ETH' : ''}`}</span>
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
