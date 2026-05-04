/**
 * 重构后的GameScene.js
 * 使用系统模块架构，职责分离，代码精简
 */
import { SCENE_KEYS, COLORS, GAME_STATES, VISUAL, POSITIONS, SIZES } from '../utils/constants.js';
import { GameConfig, LevelsConfig } from '../config/game.config.js';
import { Slingshot } from '../objects/Slingshot.js';

// 系统模块导入
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { UISystem } from '../systems/UISystem.js';
import { InputSystem } from '../systems/InputSystem.js';
import { GameStateSystem } from '../systems/GameStateSystem.js';
import { EntityManager } from '../systems/EntityManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.GAME });
        
        // 系统模块实例
        this.physicsSystem = null;
        this.uiSystem = null;
        this.inputSystem = null;
        this.gameStateSystem = null;
        this.entityManager = null;
        this.slingshot = null;
    }

    init(data) {
        this.currentLevel = data.level || 1;
        this.levelData = LevelsConfig[this.currentLevel - 1];
    }

    create() {
        // 初始化系统模块
        this.initSystems();
        
        // 创建背景和环境
        this.createEnvironment();
        
        // 创建关卡内容
        this.createLevelContent();
        
        // 设置系统间通信
        this.setupSystemCommunication();
        
        // 初始化UI
        this.uiSystem.createGameUI();
        
        console.log('GameScene created with modular architecture');
    }
    
    /**
     * 初始化所有系统模块
     */
    initSystems() {
        // 物理系统
        this.physicsSystem = new PhysicsSystem(this);
        
        // UI系统
        this.uiSystem = new UISystem(this);
        this.uiSystem.init({
            level: this.currentLevel,
            levelData: this.levelData,
            score: 0,
            gameState: GAME_STATES.PLAYING
        });
        
        // 游戏状态系统
        this.gameStateSystem = new GameStateSystem(this);
        this.gameStateSystem.init({
            level: this.currentLevel,
            levelData: this.levelData
        });
        
        // 输入系统
        this.inputSystem = new InputSystem(this);
        this.inputSystem.init({
            slingshot: {
                x: POSITIONS.SLINGSHOT_X,
                y: POSITIONS.SLINGSHOT_Y
            }
        });
        
        // 实体管理系统
        this.entityManager = new EntityManager(this);
        this.entityManager.init();
        
        // 弹弓对象
        this.slingshot = new Slingshot(
            this, 
            POSITIONS.SLINGSHOT_X, 
            POSITIONS.SLINGSHOT_Y
        );
    }
    
    /**
     * 创建游戏环境（背景、地面等）
     */
    createEnvironment() {
        // 天空背景
        const sky = this.add.graphics();
        sky.fillGradientStyle(COLORS.SKY_TOP, COLORS.SKY_TOP, COLORS.SKY_BOTTOM, COLORS.SKY_BOTTOM, 1);
        sky.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // 远景山丘
        const hills = this.add.graphics();
        hills.fillStyle(VISUAL.HILL_COLOR, VISUAL.HILL_ALPHA);
        hills.fillTriangle(0, 500, 300, 350, 600, 500);
        hills.fillTriangle(400, 500, 700, 300, 1000, 500);
        
        // 云朵
        for (let i = 0; i < VISUAL.CLOUD_COUNT; i++) {
            const x = Phaser.Math.Between(VISUAL.CLOUD_MIN_X, VISUAL.CLOUD_MAX_X);
            const y = Phaser.Math.Between(VISUAL.CLOUD_MIN_Y, VISUAL.CLOUD_MAX_Y);
            const cloud = this.add.graphics();
            cloud.fillStyle(0xFFFFFF, VISUAL.CLOUD_ALPHA);
            cloud.fillCircle(x, y, VISUAL.CLOUD_RADIUS_LARGE);
            cloud.fillCircle(x + VISUAL.CLOUD_SPACING, y, VISUAL.CLOUD_RADIUS_SMALL);
            cloud.fillCircle(x - VISUAL.CLOUD_SPACING, y, VISUAL.CLOUD_RADIUS_SMALL);
        }
    }
    
    /**
     * 创建关卡内容（实体）
     */
    createLevelContent() {
        // 创建地面
        const ground = this.physicsSystem.createBody({
            type: 'rectangle',
            x: this.cameras.main.width / 2,
            y: 720 - SIZES.GROUND_HEIGHT / 2,
            width: this.cameras.main.width,
            height: SIZES.GROUND_HEIGHT,
            material: 'stone',
            isStatic: true,
            label: 'ground'
        });
        
        // 创建草地
        const grassY = 720 - SIZES.GROUND_HEIGHT + SIZES.GRASS_HEIGHT / 2;
        const grass = this.add.graphics();
        grass.fillStyle(COLORS.GRASS, 1);
        grass.fillRect(0, grassY - SIZES.GRASS_HEIGHT / 2, this.cameras.main.width, SIZES.GRASS_HEIGHT);
        
        // 创建关卡实体
        this.createLevelEntities();
    }
    
    /**
     * 创建关卡实体
     */
    createLevelEntities() {
        if (!this.levelData) return;
        
        // 创建小鸟
        const birdType = this.levelData.birds[0] || 'red';
        for (let i = 0; i < this.levelData.birdCount; i++) {
            const x = POSITIONS.BIRD_START_X - i * POSITIONS.BIRD_SPACING;
            const bird = this.entityManager.createEntity('bird', {
                x: x,
                y: POSITIONS.BIRD_START_Y,
                birdType: birdType
            });
            
            this.gameStateSystem.birds.push(bird);
        }
        
        // 准备第一只小鸟
        this.gameStateSystem.prepareNextBird();
        const currentBird = this.gameStateSystem.getCurrentBird();
        if (currentBird) {
            currentBird.moveToSlingshot(POSITIONS.SLINGSHOT_X, POSITIONS.SLINGSHOT_Y);
        }
        
        // 创建关卡结构
        this.levelData.structures.forEach(structure => {
            if (structure.type === 'block') {
                this.entityManager.createEntity('block', {
                    x: structure.x,
                    y: structure.y,
                    material: structure.material,
                    width: structure.width,
                    height: structure.height
                });
            } else if (structure.type === 'pig') {
                this.entityManager.createEntity('pig', {
                    x: structure.x,
                    y: structure.y,
                    radius: structure.radius
                });
            }
        });
        
        // 初始化游戏状态数据
        this.updateGameStateCounts();
    }
    
    /**
     * 更新游戏状态计数器
     */
    updateGameStateCounts() {
        const pigs = this.entityManager.getEntities('pig');
        const blocks = this.entityManager.getEntities('block');
        
        this.gameStateSystem.pigsRemaining = pigs.length;
        this.gameStateSystem.blocksRemaining = blocks.length;
    }
    
    /**
     * 设置系统间通信
     */
    setupSystemCommunication() {
        // 输入系统事件
        this.inputSystem.on('onDragStart', (data) => {
            const currentBird = this.gameStateSystem.getCurrentBird();
            if (currentBird) {
                currentBird.startAiming();
            }
        });
        
        this.inputSystem.on('onDragging', (data) => {
            const currentBird = this.gameStateSystem.getCurrentBird();
            if (currentBird) {
                currentBird.setPosition(data.x, data.y);
                this.slingshot.updateBand(data.x, data.y);
            }
        });
        
        this.inputSystem.on('onDragEnd', (data) => {
            const currentBird = this.gameStateSystem.getCurrentBird();
            if (currentBird) {
                this.gameStateSystem.launchBird(data.velocityX, data.velocityY);
                this.slingshot.release();
                
                // 准备下一只小鸟
                this.gameStateSystem.currentBirdIndex++;
                this.gameStateSystem.prepareNextBird();
                
                // 移动下一只小鸟到弹弓位置
                const nextBird = this.gameStateSystem.getCurrentBird();
                if (nextBird) {
                    nextBird.moveToSlingshot(POSITIONS.SLINGSHOT_X, POSITIONS.SLINGSHOT_Y);
                    this.slingshot.resetBand();
                }
                
                this.uiSystem.updateBirdQueue(this.gameStateSystem.getRemainingBirds());
            }
        });
        
        this.inputSystem.on('onDragCancel', () => {
            const currentBird = this.gameStateSystem.getCurrentBird();
            if (currentBird) {
                currentBird.moveToSlingshot(POSITIONS.SLINGSHOT_X, POSITIONS.SLINGSHOT_Y);
                this.slingshot.resetBand();
            }
        });
        
        // 游戏状态系统事件
        this.gameStateSystem.on('onScoreUpdate', (totalScore, points, source, x, y) => {
            this.uiSystem.updateScore(totalScore);
            if (x && y) {
                this.uiSystem.showScorePopup(points, x, y);
            }
        });
        
        this.gameStateSystem.on('onPigDestroyed', (remaining, points, x, y) => {
            // 猪被消灭处理
        });
        
        this.gameStateSystem.on('onBlockDestroyed', (material, points, x, y) => {
            // 方块被破坏处理
        });
        
        this.gameStateSystem.on('onLevelComplete', (level, score, stars, bonus) => {
            this.uiSystem.showResult('win', score, stars);
        });
        
        this.gameStateSystem.on('onGameOver', (level, score) => {
            this.uiSystem.showResult('lose', score, 0);
        });
        
        this.gameStateSystem.on('onStateChange', (newState, oldState) => {
            // 游戏状态变化处理
        });
        
        // 物理系统碰撞事件
        this.physicsSystem.onCollision((bodyA, bodyB, impactForce) => {
            // 实体管理器处理碰撞
            this.entityManager.handleCollision(bodyA, bodyB, impactForce);
        });
        
        // UI系统事件
        this.uiSystem.onPause(() => {
            this.gameStateSystem.setGameState(GAME_STATES.PAUSED);
        });
    }
    
    update() {
        // 更新所有实体
        this.entityManager.updateAll();
        
        // 更新UI状态
        if (this.gameStateSystem.gameState === GAME_STATES.PLAYING) {
            // 检查游戏状态
            this.checkGameStatus();
        }
    }
    
    /**
     * 检查游戏状态
     */
    checkGameStatus() {
        // 检查物理世界是否稳定
        if (this.physicsSystem.isAllSleeping()) {
            this.gameStateSystem.checkRoundEnd();
        }
    }
}