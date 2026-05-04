import { SCENE_KEYS } from '../utils/constants.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.BOOT });
    }

    preload() {
        // Boot场景不需要加载资源
    }

    create() {
        // 设置游戏标题
        this.game.config.backgroundColor = '#87CEEB';
        
        // 跳转到资源加载场景
        this.scene.start(SCENE_KEYS.PRELOAD);
    }
}
