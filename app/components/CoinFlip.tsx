'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameHistory from './GameHistory';

interface GameResult {
  id: number;
  side: 'heads' | 'tails';
  amount: number;
  won: boolean;
  timestamp: Date;
}

interface CoinFlipProps {
  onGameComplete?: (won: boolean) => void;
}

const CoinFlip: React.FC<CoinFlipProps> = ({ onGameComplete }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [balance, setBalance] = useState(100); // Starting balance
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);

  const handleBet = () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsFlipping(true);
    setBalance(prev => prev - betAmount);

    // Simulate coin flip with random result
    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setIsFlipping(false);

      // Handle win/lose
      const won = newResult === selectedSide;
      if (won) {
        setBalance(prev => prev + (betAmount * 2));
      }
      
      const gameResult: GameResult = {
        id: Date.now(),
        side: selectedSide,
        amount: betAmount,
        won,
        timestamp: new Date(),
      };
      
      setGameHistory(prev => [gameResult, ...prev].slice(0, 10));
      onGameComplete?.(won);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-800 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Balance: {balance} FCT</h2>
        </div>

        <div className="relative w-40 h-40 mx-auto mb-8">
          <motion.div
            className="w-full h-full rounded-full bg-yellow-400"
            animate={{
              rotateX: isFlipping ? 1800 : 0,
              scale: isFlipping ? 1.2 : 1,
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-2xl">
              {result || '?'}
            </div>
          </motion.div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className={`flex-1 py-2 rounded ${
              selectedSide === 'heads'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedSide('heads')}
          >
            Heads
          </button>
          <button
            className={`flex-1 py-2 rounded ${
              selectedSide === 'tails'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedSide('tails')}
          >
            Tails
          </button>
        </div>

        <div className="mb-6">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            min="1"
          />
        </div>

        <button
          className="w-full py-3 rounded bg-green-500 hover:bg-green-600 disabled:opacity-50"
          onClick={handleBet}
          disabled={isFlipping}
        >
          {isFlipping ? 'Flipping...' : 'Flip Coin'}
        </button>
      </div>

      <GameHistory results={gameHistory} />
    </div>
  );
};

export default CoinFlip; 