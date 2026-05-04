/**
 * 游戏状态管理系统模块
 * 管理游戏状态流转、得分计算、胜利/失败判断和关卡进度保存
 */
import { GAME_STATES } from '../utils/constants.js';
import { GameConfig, LevelsConfig } from '../config/game.config.js';

export class GameStateSystem {
    constructor(scene) {
        this.scene = scene;
        this.gameState = GAME_STATES.READY;  // 初始状态为READY，等小鸟发射后才进入PLAYING
        this.previousState = null;  // 记录暂停前的状态
        this.score = 0;
        this.currentLevel = 1;
        this.levelData = null;
        this.currentBirdIndex = 0;
        
        // 回调函数
        this.onWin = null;
        this.onLose = null;
        this.onNextBird = null;
    }
    
    /**
     * 初始化状态系统
     * @param {Object} config - 配置参数
     */
    init(config = {}) {
        this.currentLevel = config.level || 1;
        this.levelData = LevelsConfig[this.currentLevel - 1];
        this.score = 0;
        this.currentBirdIndex = 0;
        this.gameState = GAME_STATES.READY;  // 初始为READY，不处理碰撞伤害
        
        if (config.onWin) this.onWin = config.onWin;
        if (config.onLose) this.onLose = config.onLose;
        if (config.onNextBird) this.onNextBird = config.onNextBird;
    }
    
    /**
     * 获取当前游戏状态
     */
    getState() { return this.gameState; }
    
    /**
     * 检查是否正在游戏（READY或PLAYING状态都算）
     */
    isPlaying() { return this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.READY; }

    /**
     * 回合结束，回到READY状态等待下一只小鸟
     */
    backToReady() {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.gameState = GAME_STATES.READY;
        }
    }
    
    /**
     * 小鸟发射后调用，从READY切换到PLAYING
     */
    startPlaying() {
        if (this.gameState === GAME_STATES.READY) {
            this.gameState = GAME_STATES.PLAYING;
        }
    }
    
    /**
     * 添加分数
     * @param {number} points - 分数
     */
    addScore(points) {
        this.score += points;
        return this.score;
    }
    
    /**
     * 获取当前分数
     */
    getScore() { return this.score; }
    
    /**
     * 检查回合结束（所有物体静止后调用）
     * @param {Array} pigs - 猪对象数组
     * @param {Array} birds - 小鸟对象数组
     * @returns {string} 状态: 'win', 'lose', 'next_bird'
     */
    checkGameState(pigs, birds) {
        const alivePigs = pigs.filter(pig => !pig.destroyed);
        
        if (alivePigs.length === 0) {
            return 'win';
        } else if (this.currentBirdIndex >= birds.length - 1) {
            return 'lose';
        } else {
            return 'next_bird';
        }
    }
    
    /**
     * 处理游戏胜利
     * @param {number} totalBirds - 总小鸟数
     * @returns {Object} { score, stars }
     */
    handleWin(totalBirds) {
        this.gameState = GAME_STATES.WIN;
        const remainingBirds = totalBirds - this.currentBirdIndex - 1;
        this.score += remainingBirds * GameConfig.scores.birdBonus;
        const stars = this.calculateStars();
        
        // 保存进度
        this.saveLevelProgress();
        
        if (this.onWin) this.onWin(this.score, stars);
        return { score: this.score, stars };
    }
    
    /**
     * 处理游戏失败
     */
    handleLose() {
        this.gameState = GAME_STATES.LOSE;
        if (this.onLose) this.onLose(this.score);
        return { score: this.score };
    }
    
    /**
     * 前进到下一只小鸟
     */
    advanceBird() {
        this.currentBirdIndex++;
        return this.currentBirdIndex;
    }
    
    /**
     * 计算星级评价
     * @returns {number} 1-3星
     */
    calculateStars() {
        if (!this.levelData) return 1;
        const starScores = this.levelData.starScores;
        if (this.score >= starScores[2]) return 3;
        if (this.score >= starScores[1]) return 2;
        return 1;
    }
    
    /**
     * 暂停游戏
     */
    pause() {
        if (this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.READY) {
            this.previousState = this.gameState;
            this.gameState = GAME_STATES.PAUSED;
            this.scene.matter.world.pause();
            return true;
        }
        return false;
    }
    
    /**
     * 恢复游戏
     */
    resume() {
        if (this.gameState === GAME_STATES.PAUSED) {
            this.gameState = this.previousState || GAME_STATES.READY;
            this.previousState = null;
            this.scene.matter.world.resume();
            return true;
        }
        return false;
    }
    
    /**
     * 切换暂停状态
     */
    togglePause() {
        if (this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.READY) {
            return this.pause();
        } else if (this.gameState === GAME_STATES.PAUSED) {
            return this.resume();
        }
        return false;
    }
    
    /**
     * 保存关卡进度到本地存储
     */
    saveLevelProgress() {
        try {
            const key = 'angrybird_progress';
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            const prevStars = data[this.currentLevel] || 0;
            const newStars = this.calculateStars();
            if (newStars > prevStars) data[this.currentLevel] = newStars;
            const prevScore = data[this.currentLevel + '_score'] || 0;
            if (this.score > prevScore) data[this.currentLevel + '_score'] = this.score;
            if (this.currentLevel < LevelsConfig.length) {
                if (!data[this.currentLevel + 1]) data[this.currentLevel + 1] = 0;
            }
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) { /* localStorage may not be available */ }
    }
    
    /**
     * 获取关卡进度（静态方法）
     */
    static getLevelProgress() {
        try {
            return JSON.parse(localStorage.getItem('angrybird_progress') || '{}');
        } catch (e) { return {}; }
    }
    
    /**
     * 获取当前关卡剩余小鸟数
     */
    getRemainingBirds(totalBirds) {
        return totalBirds - this.currentBirdIndex;
    }
}
