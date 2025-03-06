'use client';

import React from 'react';

interface GameResult {
  id: number;
  side: 'heads' | 'tails';
  amount: number;
  won: boolean;
  timestamp: Date;
}

interface GameHistoryProps {
  results: GameResult[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ results }) => {
  return (
    <div className="w-full max-w-md mt-8 p-6 rounded-lg bg-gray-800">
      <h3 className="text-xl font-bold mb-4 text-white">Game History</h3>
      <div className="space-y-2">
        {results.map((result) => (
          <div
            key={result.id}
            className={`p-3 rounded-lg flex justify-between items-center ${
              result.won ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-white">
                {result.side.toUpperCase()}
              </span>
              <span className="text-sm text-gray-300">
                {result.amount} FCT
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? '+' : '-'}{result.amount * 2} FCT
              </span>
              <span className="text-xs text-gray-400">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory; 