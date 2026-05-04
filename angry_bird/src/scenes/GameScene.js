/**
 * 游戏主场景
 * 职责：场景生命周期管理 + 各子系统协调
 * 所有具体逻辑委托给系统模块处理
 */
import { SCENE_KEYS, COLORS, GAME_STATES, POSITIONS, TEXT_STYLES, COLLISION } from '../utils/constants.js';
import { GameConfig, LevelsConfig } from '../config/game.config.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { InputSystem } from '../systems/InputSystem.js';
import { UISystem } from '../systems/UISystem.js';
import { GameStateSystem } from '../systems/GameStateSystem.js';
import { EntityManager } from '../systems/EntityManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.GAME });
    }

    init(data) {
        // 初始化系统模块
        this.stateSystem = new GameStateSystem(this);
        this.stateSystem.init({
            level: data.level || 1
            // 不设置onWin/onLose回调，由GameScene直接调用
            // 避免handleWin -> onWin -> onGameWin -> handleWin无限递归
        });
    }

    create() {
        // 创建渲染环境
        this.createBackground();
        this.createGround();
        
        // 初始化实体管理器（创建关卡内容）
        this.entityManager = new EntityManager(this);
        this.entityManager.init(this.stateSystem.levelData);
        
        // 初始化物理系统
        this.physicsSystem = new PhysicsSystem(this);
        this.physicsSystem.onCollision((bodyA, bodyB, impactForce) => {
            this.handleCollision(bodyA, bodyB, impactForce);
        });
        
        // 初始化UI系统
        this.uiSystem = new UISystem(this);
        this.uiSystem.init({
            level: this.stateSystem.currentLevel,
            levelData: this.stateSystem.levelData
        });
        this.uiSystem.createGameUI();
        
        // 初始化输入系统
        this.inputSystem = new InputSystem(this);
        this.inputSystem.init({
            getSlingshot: () => this.entityManager.getSlingshot(),
            getCurrentBird: () => this.entityManager.getCurrentBird(),
            getGameState: () => this.stateSystem.getState(),
            onLaunch: (bird) => this.onBirdLaunched(bird),
            onRoundEnd: () => this.checkRoundEnd()
        });
        this.inputSystem.setup();
    }
    
    // ==================== 渲染相关 ====================
    
    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const sky = this.add.graphics();
        sky.fillGradientStyle(COLORS.SKY_TOP, COLORS.SKY_TOP, COLORS.SKY_BOTTOM, COLORS.SKY_BOTTOM, 1);
        sky.fillRect(0, 0, width, height);
        
        // 远景山丘
        const hills = this.add.graphics();
        hills.fillStyle(0x6B8E23, 0.5);
        hills.fillCircle(200, 640, 150);
        hills.fillCircle(600, 640, 200);
        hills.fillCircle(1000, 640, 180);
        
        // 云朵
        for (let i = 0; i < 4; i++) {
            const cx = Phaser.Math.Between(100, 1100);
            const cy = Phaser.Math.Between(50, 200);
            this.createCloud(cx, cy);
        }
    }
    
    createCloud(x, y) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xFFFFFF, 0.8);
        cloud.fillCircle(x, y, 25);
        cloud.fillCircle(x + 20, y - 5, 35);
        cloud.fillCircle(x + 45, y, 25);
    }
    
    createGround() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // 草地
        const ground = this.add.graphics();
        ground.fillStyle(COLORS.GROUND, 1);
        ground.fillRect(0, 640, width, height - 640);
        
        // 草地顶部装饰
        ground.fillStyle(COLORS.GRASS, 1);
        ground.fillRect(0, 640, width, 15);
        
        // 物理地面（不可见的静态体）
        this.matter.add.rectangle(width / 2, 680, width, 80, { isStatic: true, label: 'ground' });
    }
    
    // ==================== 碰撞处理 ====================
    
    handleCollision(bodyA, bodyB, impactForce) {
        if (this.stateSystem.getState() !== GAME_STATES.PLAYING) return;
        
        // 猪被撞击
        if (bodyA.label === 'pig' || bodyB.label === 'pig') {
            const pigBody = bodyA.label === 'pig' ? bodyA : bodyB;
            if (impactForce > COLLISION.PIG_DAMAGE_THRESHOLD) {
                const pig = this.entityManager.pigs.find(p => p.body === pigBody);
                if (pig && !pig.destroyed) {
                    pig.takeDamage(impactForce * COLLISION.PIG_DAMAGE_MULTIPLIER);
                    if (pig.destroyed) {
                        const score = this.stateSystem.addScore(GameConfig.scores.pig);
                        this.uiSystem.updateScore(score);
                        this.uiSystem.showScorePopup(GameConfig.scores.pig, pig.x, pig.y);
                    }
                }
            }
        }
        
        // 方块碰撞
        if (bodyA.label === 'block' || bodyB.label === 'block') {
            const blockBody = bodyA.label === 'block' ? bodyA : bodyB;
            if (impactForce > COLLISION.BLOCK_DAMAGE_THRESHOLD) {
                const block = this.entityManager.blocks.find(b => b.body === blockBody);
                if (block && !block.destroyed) {
                    block.takeDamage(impactForce * COLLISION.BLOCK_DAMAGE_MULTIPLIER);
                    if (block.destroyed) {
                        const points = GameConfig.scores[block.material] || 100;
                        const score = this.stateSystem.addScore(points);
                        this.uiSystem.updateScore(score);
                        this.uiSystem.showScorePopup(points, block.x, block.y);
                    }
                }
            }
        }
    }
    
    // ==================== 游戏流程控制 ====================
    
    onBirdLaunched(bird) {
        // 小鸟发射后，从READY切换到PLAYING，开始处理碰撞伤害
        this.stateSystem.startPlaying();
    }
    
    checkRoundEnd() {
        // 防止并发检查（多个delayedCall可能同时触发）
        if (this._checkingRound) return;
        if (!this.stateSystem.isPlaying()) return;
        
        // 最大重试次数，防止物体卡住导致无限等待
        if (!this._roundCheckRetries) this._roundCheckRetries = 0;
        const MAX_RETRIES = 20; // 20次 * 500ms = 10秒后强制结算
        
        this._checkingRound = true;
        const allSleeping = this.entityManager.isAllSleeping();
        
        if (!allSleeping && this._roundCheckRetries < MAX_RETRIES) {
            this._checkingRound = false;
            this._roundCheckRetries++;
            this.time.delayedCall(500, () => this.checkRoundEnd());
            return;
        }
        
        // 超过最大重试次数时强制结算（物体可能卡住）
        if (this._roundCheckRetries >= MAX_RETRIES) {
            console.warn('checkRoundEnd: 强制结算，物体未完全静止');
        }
        this._roundCheckRetries = 0;
        
        const result = this.stateSystem.checkGameState(
            this.entityManager.pigs,
            this.entityManager.birds
        );
        
        this._checkingRound = false;
        this._roundCheckRetries = 0;
        
        if (result === 'win') {
            this.onGameWin();
        } else if (result === 'lose') {
            this.onGameLose();
        } else {
            // 下一只小鸟
            this.stateSystem.advanceBird();
            if (this.entityManager.advanceToNextBird()) {
                this.stateSystem.backToReady();
                this.uiSystem.updateBirdQueue(this.entityManager.getRemainingBirdCount());
            } else {
                this.onGameLose();
            }
        }
    }
    
    onGameWin(score, stars) {
        const result = this.stateSystem.handleWin(this.entityManager.birds.length);
        this.uiSystem.updateScore(result.score);
        this.inputSystem.disable();
        this.uiSystem.showResult('win', result.score, result.stars, {
            onRetry: () => this.scene.restart({ level: this.stateSystem.currentLevel }),
            onNext: () => this.scene.restart({ level: this.stateSystem.currentLevel + 1 }),
            onMenu: () => this.scene.start(SCENE_KEYS.MENU),
            hasNextLevel: this.stateSystem.currentLevel < LevelsConfig.length
        });
    }
    
    onGameLose(score) {
        this.stateSystem.handleLose();
        this.inputSystem.disable();
        this.uiSystem.showResult('fail', this.stateSystem.getScore(), null, {
            onRetry: () => this.scene.restart({ level: this.stateSystem.currentLevel }),
            onMenu: () => this.scene.start(SCENE_KEYS.MENU)
        });
    }
    
    // ==================== 场景清理 ====================
    
    shutdown() {
        // 场景关闭时清理所有系统和实体
        if (this.physicsSystem) this.physicsSystem.cleanup();
        if (this.inputSystem) this.inputSystem.destroy();
        if (this.entityManager) this.entityManager.destroy();
        if (this.uiSystem) this.uiSystem.destroy();
        this._checkingRound = false;
        this._roundCheckRetries = 0;
    }
    
    // ==================== 暂停控制 ====================
    
    pauseGame() {
        const isNowPaused = this.stateSystem.togglePause();
        if (this.stateSystem.getState() === GAME_STATES.PAUSED) {
            this.uiSystem.showPauseOverlay({
                onResume: () => this.pauseGame(),
                onRetry: () => { this.uiSystem.hidePauseOverlay(); this.scene.restart({ level: this.stateSystem.currentLevel }); },
                onMenu: () => { this.uiSystem.hidePauseOverlay(); this.scene.start(SCENE_KEYS.MENU); }
            });
        } else {
            this.uiSystem.hidePauseOverlay();
        }
    }
    
    // ==================== 场景更新 ====================
    
    update() {
        if (this.entityManager) {
            this.entityManager.update();
        }
    }
}
