import { useEffect, useState } from 'react';

interface GameResult {
  gameId: string;
  betAmount: number;
  selectedSide: 'HEADS' | 'TAILS';
  result: 'WIN' | 'LOSS';
  timestamp: string;
}

export const GameHistory = () => {
  const [history, setHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem('gameHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div className="w-1/5 bg-gray-900 p-5 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Game History</h2>
      <div className="space-y-2">
        {history.slice(0, 10).map((game) => (
          <div
            key={game.gameId}
            className={`p-3 rounded-lg ${game.result === 'WIN' ? 'bg-green-800' : 'bg-red-800'}`}
          >
            <div className="text-sm font-mono">Game #{game.gameId}</div>
            <div className="flex justify-between">
              <span>{game.betAmount} FCT</span>
              <span>{game.selectedSide}</span>
            </div>
            <div className="text-xs opacity-75">{game.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
