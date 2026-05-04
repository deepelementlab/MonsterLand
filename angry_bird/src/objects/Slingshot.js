import { COLORS } from '../utils/constants.js';

export class Slingshot {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // 弹弓叉口中心（小鸟放置和发射的参考点）
        this.launchPoint = { x: x, y: y - 100 };
        
        this.create();
    }
    
    create() {
        // 创建弹弓图形
        this.graphics = this.scene.add.graphics();
        
        // 左支架
        this.graphics.fillStyle(0x8B4513, 1);
        this.graphics.fillRect(-30, -80, 15, 100);
        
        // 右支架
        this.graphics.fillRect(15, -80, 15, 100);
        
        // Y形顶部
        this.graphics.fillStyle(0x5D3A1A, 1);
        this.graphics.fillTriangle(-30, -80, -15, -80, -22, -100);
        this.graphics.fillTriangle(15, -80, 30, -80, 22, -100);
        
        // 底座
        this.graphics.fillStyle(0x8B4513, 1);
        this.graphics.fillRect(-35, 20, 70, 15);
        
        this.graphics.setPosition(this.x, this.y);
        
        // 创建皮筋
        this.band = this.scene.add.graphics();
        this.leftAnchor = { x: this.x - 22, y: this.y - 100 };
        this.rightAnchor = { x: this.x + 22, y: this.y - 100 };
        
        this.resetBand();
    }
    
    updateBand(birdX, birdY) {
        this.band.clear();
        
        // 绘制皮筋
        this.band.lineStyle(4, 0x8B4513, 1);
        
        // 左边皮筋
        this.band.lineBetween(this.leftAnchor.x, this.leftAnchor.y, birdX, birdY);
        
        // 右边皮筋
        this.band.lineBetween(this.rightAnchor.x, this.rightAnchor.y, birdX, birdY);
    }
    
    resetBand() {
        this.band.clear();
        
        // 绘制默认状态的皮筋
        this.band.lineStyle(4, 0x8B4513, 1);
        this.band.lineBetween(
            this.leftAnchor.x, this.leftAnchor.y,
            this.rightAnchor.x, this.rightAnchor.y
        );
    }
    
    release() {
        // 释放动画效果
        this.scene.tweens.add({
            targets: this.band,
            alpha: 0.5,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                this.resetBand();
            }
        });
    }
    
    destroy() {
        this.graphics.destroy();
        this.band.destroy();
    }
}
