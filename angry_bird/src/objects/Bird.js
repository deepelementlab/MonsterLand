import { COLORS, BIRD_TYPES, COLLISION } from '../utils/constants.js';

export class Bird {
    constructor(scene, x, y, type = BIRD_TYPES.RED) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 25;
        this.launched = false;
        this.aiming = false;
        this.destroyed = false;
        
        this.create();
    }
    
    create() {
        // 获取颜色
        const color = this.getColor();
        
        // 创建图形
        this.graphics = this.scene.add.graphics();
        
        // 绘制小鸟身体
        this.graphics.fillStyle(color, 1);
        this.graphics.fillCircle(0, 0, this.radius);
        
        // 绘制眼睛
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillCircle(-8, -5, 8);
        this.graphics.fillCircle(8, -5, 8);
        
        // 绘制瞳孔
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillCircle(-6, -5, 4);
        this.graphics.fillCircle(10, -5, 4);
        
        // 绘制愤怒的眉毛
        this.graphics.lineStyle(3, 0x000000, 1);
        this.graphics.lineBetween(-15, -15, -2, -12);
        this.graphics.lineBetween(2, -12, 15, -15);
        
        // 绘制嘴巴
        this.graphics.fillStyle(0xFFA500, 1);
        this.graphics.fillTriangle(20, 0, 35, 5, 35, -5);
        
        this.graphics.setPosition(this.x, this.y);
        
        // 创建物理体
        this.body = this.scene.matter.add.circle(this.x, this.y, this.radius, {
            label: 'bird',
            mass: 5,
            restitution: 0.6,
            friction: 0.3,
            frictionAir: 0.001
        });
        
        // 存储引用，方便碰撞时查找（注意：不用gameObject，避免Phaser内部emit调用）
        this.body.birdRef = this;
        
        // 初始静止
        this.body.plugin = this.body.plugin || {}; this.body.plugin.originalMass = this.body.plugin.originalMass || 5; this.scene.matter.body.setStatic(this.body, true);
    }
    
    getColor() {
        switch (this.type) {
            case BIRD_TYPES.RED:
                return COLORS.BIRD_RED;
            case BIRD_TYPES.YELLOW:
                return COLORS.BIRD_YELLOW;
            case BIRD_TYPES.BLUE:
                return COLORS.BIRD_BLUE;
            default:
                return COLORS.BIRD_RED;
        }
    }
    
    moveToSlingshot(x, y) {
        this.x = x;
        this.y = y;
        this.graphics.setPosition(x, y);
        this.scene.matter.body.setPosition(this.body, { x, y });
        this.body.plugin = this.body.plugin || {}; this.body.plugin.originalMass = this.body.plugin.originalMass || 5; this.scene.matter.body.setStatic(this.body, true);
    }
    
    startAiming() {
        this.aiming = true;
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.graphics.setPosition(x, y);
        this.scene.matter.body.setPosition(this.body, { x, y });
    }
    
    launch(velocityX, velocityY) {
        this.launched = true;
        this.aiming = false;
        
        // 解除静止状态
        this.scene.matter.body.setStatic(this.body, false);
        
        // 设置速度
        this.scene.matter.body.setVelocity(this.body, {
            x: velocityX,
            y: velocityY
        });
        
        // 添加旋转
        this.scene.matter.body.setAngularVelocity(this.body, 0.1);
    }
    
    update() {
        if (this.launched && !this.destroyed) {
            // 更新图形位置
            this.graphics.setPosition(this.body.position.x, this.body.position.y);
            this.graphics.rotation = this.body.angle;
            
            this.x = this.body.position.x;
            this.y = this.body.position.y;
            
            // 边界检测：飞出画面太远则标记为需要清理
            this._checkOutOfBounds();
        }
    }
    
    /**
     * 检查是否飞出画面边界，如果太远则强制减速/销毁
     */
    _checkOutOfBounds() {
        const cam = this.scene.cameras.main;
        const margin = 200; // 容许飞出画面200px
        const outX = this.x < -margin || this.x > cam.width + margin;
        const outY = this.y > cam.height + margin;
        
        if (outX || outY) {
            // 强制让物理体静止，确保isAllSleeping能通过
            this.scene.matter.body.setVelocity(this.body, { x: 0, y: 0 });
            this.scene.matter.body.setStatic(this.body, true);
        }
    }
    
    onCollision(impactForce) {
        // 碰撞处理
        if (impactForce > COLLISION.BIRD_DAMAGE_THRESHOLD) {
            this.takeDamage(impactForce);
        }
    }
    
    takeDamage(amount) {
        // 小鸟可以承受一些伤害
        if (amount > COLLISION.BIRD_DESTROY_THRESHOLD) {
            this.destroy();
        }
    }
    
    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;
        this.graphics.destroy();
        this.scene.matter.world.remove(this.body);
    }
}
