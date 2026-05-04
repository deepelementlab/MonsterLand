import Phaser from 'phaser';
import { GameConfig } from './config/game.config.js';
import { SCENE_KEYS } from './utils/constants.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';

// Phaser游戏配置
const config = {
    type: Phaser.AUTO,
    width: GameConfig.width,
    height: GameConfig.height,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'matter',
        matter: {
            gravity: GameConfig.physics.gravity,
            debug: GameConfig.physics.debug
        }
    },
    scene: [BootScene, PreloadScene, MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// 创建游戏实例
const game = new Phaser.Game(config);

// 导出游戏实例供调试使用
window.game = game;
