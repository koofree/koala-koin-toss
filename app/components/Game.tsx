'use client';

import { Game as PhaserGame } from 'phaser';
import { useEffect, useRef } from 'react';
import { GameConfig } from '../game/config';

export default function Game() {
  const gameRef = useRef<PhaserGame | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !gameRef.current) {
      // Create new game instance
      gameRef.current = new PhaserGame({
        ...GameConfig,
        audio: {
          ...GameConfig.audio,
          context: new AudioContext(),
        },
      });

      // Handle visibility change to manage audio context
      const handleVisibilityChange = () => {
        if (document.hidden) {
          gameRef.current?.sound?.pauseAll();
        } else {
          gameRef.current?.sound?.resumeAll();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (gameRef.current) {
          gameRef.current.sound?.stopAll();
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    }
  }, []);

  return <div id="game-container" className="w-full h-full" />;
}
