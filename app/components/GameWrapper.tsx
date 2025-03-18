'use client';

import dynamic from 'next/dynamic';
import { GameHistory } from './GameHistory';
import { MainGame } from './MainGame';
import { StatsPanel } from './StatsPanel';

const Game = dynamic(() => import('./Game'), {
  ssr: false,
});

export const GameWrapper = () => {
  return (
    <div className="flex min-w-[1024px] max-w-[1920px] h-screen bg-[#282c34]">
      {/* Left Panel - 20% width */}
      <GameHistory />

      {/* Center Panel - 60% width */}
      <MainGame />

      {/* Right Panel - 20% width */}
      <StatsPanel />
    </div>
  );
};
