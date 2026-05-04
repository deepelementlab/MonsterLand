import { COLORS, MATERIAL_TYPES } from '../utils/constants.js';
import { GameConfig } from '../config/game.config.js';

export class Block {
    constructor(scene, x, y, material = MATERIAL_TYPES.WOOD, width = 40, height = 80) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.material = material;
        this.width = width;
        this.height = height;
        this.destroyed = false;
        
        // 获取材质属性
        const materialConfig = GameConfig.materials[material];
        this.health = materialConfig?.health || 100;
        this.maxHealth = this.health;
        
        this.create();
    }
    
    create() {
        // 创建图形
        this.graphics = this.scene.add.graphics();
        
        // 获取颜色
        const color = this.getColor();
        
        // 绘制方块
        this.graphics.fillStyle(color, 1);
        this.graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 添加边框
        this.graphics.lineStyle(2, this.getBorderColor(), 1);
        this.graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 添加纹理线条
        this.addTextureLines();
        
        this.graphics.setPosition(this.x, this.y);
        
        // 创建物理体
        const materialConfig = GameConfig.materials[this.material];
        
        this.body = this.scene.matter.add.rectangle(this.x, this.y, this.width, this.height, {
            label: 'block',
            mass: this.width * this.height * (materialConfig?.density || 0.001),
            restitution: materialConfig?.restitution || 0.3,
            friction: materialConfig?.friction || 0.5
        });
        
        // 存储引用（不用gameObject，避免Phaser内部emit调用）
        this.body.blockRef = this;
    }
    
    getColor() {
        switch (this.material) {
            case MATERIAL_TYPES.WOOD:
                return COLORS.WOOD;
            case MATERIAL_TYPES.STONE:
                return COLORS.STONE;
            case MATERIAL_TYPES.GLASS:
                return COLORS.GLASS;
            default:
                return COLORS.WOOD;
        }
    }
    
    getBorderColor() {
        switch (this.material) {
            case MATERIAL_TYPES.WOOD:
                return 0x5D3A1A;
            case MATERIAL_TYPES.STONE:
                return 0x4A4A5A;
            case MATERIAL_TYPES.GLASS:
                return 0x87CEEB;
            default:
                return 0x000000;
        }
    }
    
    addTextureLines() {
        this.graphics.lineStyle(1, this.getBorderColor(), 0.5);
        
        if (this.material === MATERIAL_TYPES.WOOD) {
            // 木纹
            for (let i = 0; i < 3; i++) {
                const y = -this.height / 2 + (i + 1) * (this.height / 4);
                this.graphics.lineBetween(-this.width / 2 + 5, y, this.width / 2 - 5, y);
            }
        } else if (this.material === MATERIAL_TYPES.STONE) {
            // 石头裂纹
            this.graphics.lineBetween(-10, -this.height / 4, 5, this.height / 4);
            this.graphics.lineBetween(5, -this.height / 3, 15, 0);
        }
    }
    
    takeDamage(amount) {
        if (this.destroyed) return;
        
        this.health -= amount;
        
        // 视觉反馈
        if (this.health < this.maxHealth * 0.5) {
            this.showDamage();
        }
        
        if (this.health <= 0) {
            this.destroy();
        }
    }
    
    showDamage() {
        // 显示裂纹效果
        this.graphics.lineStyle(2, 0x000000, 0.8);
        
        // 添加裂纹
        this.graphics.lineBetween(
            -this.width / 4, -this.height / 4,
            this.width / 4, this.height / 4
        );
        this.graphics.lineBetween(
            this.width / 4, -this.height / 4,
            -this.width / 4, 0
        );
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
        
        // 创建破坏效果
        this.createDestroyEffect();
        
        this.graphics.destroy();
        this.scene.matter.world.remove(this.body);
    }
    
    createDestroyEffect() {
        // 创建碎片
        const fragmentCount = this.material === MATERIAL_TYPES.GLASS ? 6 : 4;
        const color = this.getColor();
        
        for (let i = 0; i < fragmentCount; i++) {
            const fragment = this.scene.add.graphics();
            fragment.fillStyle(color, 1);
            
            const size = Phaser.Math.Between(5, 15);
            fragment.fillRect(-size / 2, -size / 2, size, size);
            fragment.setPosition(this.x, this.y);
            
            const angle = (i / fragmentCount) * Math.PI * 2;
            const distance = Phaser.Math.Between(20, 50);
            
            this.scene.tweens.add({
                targets: fragment,
                x: this.x + Math.cos(angle) * distance,
                y: this.y + Math.sin(angle) * distance + 50,
                rotation: Phaser.Math.Between(1, 6),
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => fragment.destroy()
            });
        }
    }
}
