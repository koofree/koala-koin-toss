import Link from 'next/link';

import { clientConfig } from '@/config';
import { GameResult } from '@/database';
import { floorNumber } from '@/utils/floorNumber';
import { formatAddress } from '@/utils/format';

interface HistoriesProps {
  myGameHistory: GameResult[];
  allGameHistory: GameResult[];
  allGameOptions: Array<[number, number, number, string]>;
}

const Histories = ({ myGameHistory, allGameHistory, allGameOptions }: HistoriesProps) => {
  return (
    <div className="flex flex-row items-center px-10 mt-2 h-[160px] w-[715px] relative">
      <div className="w-full h-full flex flex-row">
        <div className="w-1/2 h-full flex flex-col">
          <p className="text-white text-[10px]">My Wins</p>
          <div className="w-full text-white mt-2 overflow-scroll">
            <table className="w-full border-collapse text-[7px]">
              <thead className="sticky top-0">
                <tr className="font-thin">
                  <th className="text-left font-thin w-[30px]">Prize</th>
                  <th className="text-left font-thin w-[80px]"></th>
                  <th className="text-left font-thin w-[100px]">Time</th>
                  <th className="text-left font-thin">Game</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="w-full max-h-[160px] text-white mt-2 overflow-scroll">
            <table className="w-full border-collapse text-[7px]">
              <tbody className="overflow-scroll">
                {myGameHistory.map((game) => {
                  const gameOption = allGameOptions.find(
                    (option) => BigInt(option[0]) === game.gameId
                  );
                  return (
                    <tr key={game.timestamp} className="text-[7px]">
                      <td className="pt-1 w-[30px]">
                        {game.won !== undefined ? (
                          <span className="text-white/50">{game.won ? 'WON' : 'LOSE'}</span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="pt-1 w-[80px]">
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
                      <td className="pt-1 w-[100px] text-white/50">
                        {new Date(game.timestamp).toDateString()}
                      </td>
                      <td className="pt-1 ">
                        {gameOption?.[1]}:{gameOption?.[2]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="w-[3px] h-[180px] -top-[8px] absolute left-[355px]"
          style={{
            backgroundColor: '#353345',
          }}
        ></div>
        <div className="w-1/2 h-full flex flex-col pl-[14px]">
          <p className="text-white text-[10px]">Recent Games</p>
          <div className="w-full text-white mt-2 overflow-scroll">
            <table className="w-full border-collapse text-[7px]">
              <thead className="sticky top-0">
                <tr className="font-thin">
                  <th className="text-left font-thin w-[60px]">Player</th>
                  <th className="text-left font-thin w-[30px]">Prize</th>
                  <th className="text-left font-thin w-[80px]"></th>
                  <th className="text-left font-thin w-[100px]">Time</th>
                  <th className="text-left font-thin">Game</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="w-full max-h-[160px] text-white mt-2 overflow-scroll">
            <table className="w-full border-collapse text-[7px]">
              <tbody className="overflow-scroll">
                {allGameHistory.map((game) => {
                  const gameOption = allGameOptions.find(
                    (option) => BigInt(option[0]) === game.gameId
                  );
                  return (
                    <tr key={game.timestamp} className="text-[7px]">
                      <td className="pt-1 w-[60px]">
                        <Link
                          href={`${clientConfig.chain.blockExplorers.default.url}/address/${game.address}`}
                          target="_blank"
                          className="text-white/50 hover:text-white"
                        >
                          {formatAddress(game.address, 6, 4)}
                        </Link>
                      </td>
                      <td className="pt-1 w-[30px]">
                        {game.won !== undefined ? (
                          <span className="text-white/50">{game.won ? 'WON' : 'LOSE'}</span>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className="pt-1 w-[80px]">
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
                      <td className="pt-1 w-[100px] text-white/50">
                        {new Date(game.timestamp).toDateString()}
                      </td>
                      <td className="pt-1 ">
                        {gameOption?.[1]}:{gameOption?.[2]}
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
