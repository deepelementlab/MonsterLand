import { SCENE_KEYS } from '../utils/constants.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.PRELOAD });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 创建加载进度条
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        // 加载文字
        const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // 加载进度事件
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4CAF50, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        this.scene.start(SCENE_KEYS.MENU);
    }
}
