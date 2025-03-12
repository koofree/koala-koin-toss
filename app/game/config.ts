import { Types } from 'phaser';
import MainScene from './scenes/MainScene';

export const GameConfig: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#282c34',
  scale: {
    mode: Phaser.Scale.NO_ZOOM,
    width: 1024,
    height: 768,
    autoCenter: Phaser.Scale.NO_ZOOM,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: MainScene,
};
