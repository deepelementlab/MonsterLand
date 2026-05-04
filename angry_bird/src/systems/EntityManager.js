/**
 * 实体管理系统模块
 * 集中管理所有游戏实体（小鸟、猪、方块）的创建、更新和销毁
 */
import { Bird } from '../objects/Bird.js';
import { Pig } from '../objects/Pig.js';
import { Block } from '../objects/Block.js';
import { Slingshot } from '../objects/Slingshot.js';
import { POSITIONS, BIRD_TYPES, COLLISION } from '../utils/constants.js';

export class EntityManager {
    constructor(scene) {
        this.scene = scene;
        
        // 实体集合
        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.slingshot = null;
        
        // 当前小鸟索引
        this.currentBirdIndex = 0;
        this.currentBird = null;
    }
    
    /**
     * 初始化实体管理器
     * @param {Object} levelData - 关卡配置数据
     */
    init(levelData) {
        this.clearAll();
        
        // 创建弹弓
        this.slingshot = new Slingshot(this.scene, POSITIONS.SLINGSHOT_X, POSITIONS.SLINGSHOT_Y);
        
        // 创建小鸟队列（在弹弓左下方的等待区域）
        levelData.birds.forEach((birdType, index) => {
            const x = POSITIONS.BIRD_START_X + index * POSITIONS.BIRD_SPACING;
            const bird = new Bird(this.scene, x, POSITIONS.BIRD_START_Y, birdType);
            this.birds.push(bird);
        });
        
        // 创建关卡结构（方块和猪）
        levelData.structures.forEach(structure => {
            if (structure.type === 'block') {
                const block = new Block(
                    this.scene, structure.x, structure.y,
                    structure.material, structure.width, structure.height
                );
                this.blocks.push(block);
            } else if (structure.type === 'pig') {
                const pig = new Pig(this.scene, structure.x, structure.y, structure.radius);
                this.pigs.push(pig);
            }
        });
        
        // 准备第一只小鸟到弹弓叉口
        this.prepareNextBird();
    }
    
    /**
     * 准备下一只小鸟到弹弓叉口位置
     * @returns {boolean} 是否成功准备
     */
    prepareNextBird() {
        if (this.currentBirdIndex >= this.birds.length) return false;
        const bird = this.birds[this.currentBirdIndex];
        // 将小鸟移动到弹弓叉口（launchPoint），不是弹弓底部
        const lp = this.slingshot.launchPoint;
        bird.moveToSlingshot(lp.x, lp.y);
        this.currentBird = bird;
        return true;
    }
    
    /**
     * 前进到下一只小鸟
     * @returns {boolean} 是否还有下一只
     */
    advanceToNextBird() {
        this.currentBirdIndex++;
        return this.prepareNextBird();
    }
    
    /**
     * 获取当前小鸟
     */
    getCurrentBird() { return this.currentBird; }
    
    /**
     * 获取弹弓引用
     */
    getSlingshot() { return this.slingshot; }
    
    /**
     * 获取存活的猪数量
     */
    getAlivePigCount() {
        return this.pigs.filter(pig => !pig.destroyed).length;
    }
    
    /**
     * 获取剩余小鸟数量
     */
    getRemainingBirdCount() {
        return this.birds.length - this.currentBirdIndex;
    }
    
    /**
     * 检查所有物体是否静止
     */
    isAllSleeping() {
        return this.scene.matter.world.engine.world.bodies.every(
            body => body.isStatic || body.speed < COLLISION.SLEEP_SPEED_THRESHOLD
        );
    }
    
    /**
     * 更新所有实体
     */
    update() {
        // 更新当前小鸟
        if (this.currentBird && !this.currentBird.destroyed) {
            this.currentBird.update();
        }
        
        // 更新所有猪
        this.pigs.forEach(pig => {
            if (!pig.destroyed) pig.update();
        });
        
        // 更新所有方块
        this.blocks.forEach(block => {
            if (!block.destroyed) block.update();
        });
        
        // 更新已发射但非当前的小鸟
        this.birds.forEach(bird => {
            if (bird !== this.currentBird && !bird.destroyed && bird.launched) {
                bird.update();
            }
        });
    }
    
    /**
     * 清除所有实体
     */
    clearAll() {
        this.birds.forEach(bird => { if (bird.destroy) bird.destroy(); });
        this.pigs.forEach(pig => { if (pig.destroy) pig.destroy(); });
        this.blocks.forEach(block => { if (block.destroy) block.destroy(); });
        if (this.slingshot && this.slingshot.destroy) this.slingshot.destroy();
        
        this.birds = [];
        this.pigs = [];
        this.blocks = [];
        this.slingshot = null;
        this.currentBird = null;
        this.currentBirdIndex = 0;
    }
    
    /**
     * 销毁管理器
     */
    destroy() {
        this.clearAll();
    }
}
