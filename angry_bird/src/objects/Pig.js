import { COLORS } from '../utils/constants.js';

export class Pig {
    constructor(scene, x, y, radius = 25) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.health = 100;
        this.destroyed = false;
        
        this.create();
    }
    
    create() {
        // 创建图形
        this.graphics = this.scene.add.graphics();
        
        // 绘制猪身体
        this.graphics.fillStyle(COLORS.PIG, 1);
        this.graphics.fillCircle(0, 0, this.radius);
        
        // 绘制耳朵
        this.graphics.fillStyle(0x7CCD7C, 1);
        this.graphics.fillEllipse(-20, -20, 15, 20);
        this.graphics.fillEllipse(20, -20, 15, 20);
        
        // 绘制眼睛
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillCircle(-8, -5, 8);
        this.graphics.fillCircle(8, -5, 8);
        
        // 绘制瞳孔
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillCircle(-6, -5, 4);
        this.graphics.fillCircle(10, -5, 4);
        
        // 绘制猪鼻子
        this.graphics.fillStyle(0x8B4513, 1);
        this.graphics.fillEllipse(0, 8, 12, 8);
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillCircle(-3, 8, 2);
        this.graphics.fillCircle(3, 8, 2);
        
        this.graphics.setPosition(this.x, this.y);
        
        // 创建物理体
        this.body = this.scene.matter.add.circle(this.x, this.y, this.radius, {
            label: 'pig',
            mass: 3,
            restitution: 0.3,
            friction: 0.5
        });
        
        // 存储引用（不用gameObject，避免Phaser内部emit调用）
        this.body.pigRef = this;
    }
    
    takeDamage(amount) {
        if (this.destroyed) return;
        
        this.health -= amount;
        
        // 视觉反馈 - 变红
        if (this.health < 50) {
            this.graphics.clear();
            this.graphics.fillStyle(0xFFA07A, 1);
            this.graphics.fillCircle(0, 0, this.radius);
            
            // 重绘眼睛
            this.graphics.fillStyle(0xFFFFFF, 1);
            this.graphics.fillCircle(-8, -5, 8);
            this.graphics.fillCircle(8, -5, 8);
            this.graphics.fillStyle(0x000000, 1);
            this.graphics.fillCircle(-6, -5, 4);
            this.graphics.fillCircle(10, -5, 4);
            
            // 受伤表情
            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.lineBetween(-12, -5, -4, -5);
            this.graphics.lineBetween(4, -5, 12, -5);
        }
        
        if (this.health <= 0) {
            this.destroy();
        }
    }
    
    update() {
        if (!this.destroyed) {
            this.graphics.setPosition(this.body.position.x, this.body.position.y);
            this.graphics.rotation = this.body.angle;
            this.x = this.body.position.x;
            this.y = this.body.position.y;
        }
    }
    
    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        
        // 破坏效果
        this.createDestroyEffect();
        
        this.graphics.destroy();
        this.scene.matter.world.remove(this.body);
    }
    
    createDestroyEffect() {
        // 创建粒子效果
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(COLORS.PIG, 1);
            particle.fillCircle(0, 0, 5);
            particle.setPosition(this.x, this.y);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = Phaser.Math.Between(30, 60);
            
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance - 30,
                alpha: 0,
                scale: 0.5,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
}
