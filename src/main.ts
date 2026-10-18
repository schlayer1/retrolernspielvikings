import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { UIScene } from './scenes/UIScene';
import { WorldScene } from './scenes/WorldScene';
import { gameState } from './systems/GameState';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#0a100d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, WorldScene, UIScene],
};

const game = new Phaser.Game(config);

// Expose for automated browser verification & classroom inspection
(window as unknown as Record<string, unknown>).__VIK_GAME__ = game;
(window as unknown as Record<string, unknown>).__VIK_STATE__ = gameState;
(window as unknown as Record<string, unknown>).__GERM_GAME__ = game;
(window as unknown as Record<string, unknown>).__GERM_STATE__ = gameState;

// Global helper for UI buttons
window.addEventListener('load', () => {
  const checkUI = setInterval(() => {
    const uiScene = game.scene.getScene('UI') as UIScene;
    if (uiScene) {
      (window as unknown as Record<string, unknown>).__VIK_UI__ = uiScene;
      (window as unknown as Record<string, unknown>).__GERM_UI__ = uiScene;
      clearInterval(checkUI);
    }
  }, 100);
});
