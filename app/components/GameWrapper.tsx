'use client';

import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./Game'), {
  ssr: false,
});

export default function GameWrapper() {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <Game />
    </div>
  );
}
