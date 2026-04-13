/**
 * 游戏引擎类
 * 负责管理游戏主循环、状态和协调各模块
 */

import { GameConfig, GameState } from '../config.js';
import { BlockFactory, Block } from '../block/block.js';
import { GameGrid } from './grid.js';
import { ScoreManager } from './score.js';

export class GameEngine {
  /**
   * 构造函数
   */
  constructor() {
    // 游戏状态
    this.state = GameState.INITIAL;
    this.lastUpdateTime = 0;
    this.dropInterval = GameConfig.INITIAL_SPEED;
    this.dropTimer = 0;
    this.animationFrameId = null;
    
    // 游戏组件
    this.grid = new GameGrid();
    this.blockFactory = new BlockFactory();
    this.scoreManager = new ScoreManager();
    
    // 当前方块和下一个方块
    this.currentBlock = null;
    this.nextBlock = this.blockFactory.createNextBlock();
    
    // 游戏统计
    this.level = 1;
    this.linesCleared = 0;
    this.isDropping = false;
    
    // 回调函数
    this.onStateChange = null;
    this.onScoreUpdate = null;
    this.onLinesCleared = null;
    this.onLevelChange = null;
  }
  
  /**
   * 启动游戏
   */
  start() {
    console.log('GameEngine.start() 被调用，当前状态:', this.state);
    
    if (this.state === GameState.INITIAL || this.state === GameState.GAME_OVER) {
      console.log('符合启动条件，开始重置游戏...');
      this.reset();
      this.state = GameState.PLAYING;
      console.log('游戏状态设置为 PLAYING');
      this.spawnNewBlock();
      this.lastUpdateTime = performance.now();
      this.startGameLoop();
      this.notifyStateChange();
      console.log('已通知状态变化到 PLAYING');
    } else {
      console.log('不符合启动条件，当前状态:', this.state);
    }
  }
  
  /**
   * 暂停/继续游戏
   */
  togglePause() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      this.stopGameLoop();
    } else if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
      this.lastUpdateTime = performance.now();
      this.startGameLoop();
    }
    this.notifyStateChange();
  }
  
  /**
   * 重置游戏
   */
  reset() {
    // 停止游戏循环
    this.stopGameLoop();
    
    // 重置游戏组件
    this.grid.reset();
    this.blockFactory.reset();
    this.scoreManager.reset();
    
    // 重置游戏状态
    this.currentBlock = null;
    this.nextBlock = this.blockFactory.createNextBlock();
    this.state = GameState.INITIAL;
    this.level = 1;
    this.linesCleared = 0;
    this.dropInterval = GameConfig.INITIAL_SPEED;
    this.dropTimer = 0;
    this.isDropping = false;
    
    // 通知更新
    this.notifyStateChange();
    this.notifyScoreUpdate();
    this.notifyLevelChange();
  }
  
  /**
   * 开始游戏循环
   */
  startGameLoop() {
    const gameLoop = (timestamp) => {
      if (this.state === GameState.PLAYING) {
        this.update(timestamp);
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }
  
  /**
   * 停止游戏循环
   */
  stopGameLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * 更新游戏状态
   * @param {number} timestamp - 当前时间戳
   */
  update(timestamp) {
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;
    
    // 更新下落计时器
    this.dropTimer += deltaTime;
    
    // 检查是否应该自动下落
    if (this.dropTimer >= this.dropInterval && !this.isDropping) {
      this.dropTimer = 0;
      this.moveCurrentBlock(0, 1);
    }
  }
  
  /**
   * 生成新方块
   */
  spawnNewBlock() {
    this.currentBlock = this.nextBlock;
    this.nextBlock = this.blockFactory.createNextBlock();
    
    // 检查游戏是否结束
    if (!this.grid.canPlaceBlock(this.currentBlock)) {
      this.gameOver();
      return;
    }
  }
  
  /**
   * 移动当前方块
   * @param {number} dx - x方向移动量
   * @param {number} dy - y方向移动量
   * @returns {boolean} 是否移动成功
   */
  moveCurrentBlock(dx, dy) {
    if (!this.currentBlock || this.state !== GameState.PLAYING) {
      return false;
    }
    
    // 创建测试方块
    const testBlock = this.currentBlock.clone();
    testBlock.move(dx, dy);
    
    // 检查是否可以移动
    if (this.grid.canPlaceBlock(testBlock)) {
      this.currentBlock.move(dx, dy);
      
      // 如果是下落，重置计时器
      if (dy > 0) {
        this.dropTimer = 0;
      }
      
      return true;
    }
    
    // 如果是向下移动失败，则固定方块
    if (dy > 0) {
      this.lockCurrentBlock();
    }
    
    return false;
  }
  
  /**
   * 旋转当前方块
   * @param {number} direction - 旋转方向 (1: 顺时针, -1: 逆时针)
   * @returns {boolean} 是否旋转成功
   */
  rotateCurrentBlock(direction = 1) {
    if (!this.currentBlock || this.state !== GameState.PLAYING) {
      return false;
    }
    
    // 获取旋转测试的形状
    const testShape = this.currentBlock.getRotationTestShape(direction);
    const testBlock = this.currentBlock.clone();
    testBlock.rotation = (testBlock.rotation + direction + 4) % 4;
    testBlock.shape = testShape;
    
    // 检查是否可以旋转
    if (this.grid.canPlaceBlock(testBlock)) {
      this.currentBlock.rotate(direction);
      return true;
    }
    
    // 尝试墙踢（Wall Kick）：如果旋转失败，尝试左右移动一格再旋转
    const kickTests = [
      [-1, 0],  // 向左移动一格
      [1, 0],   // 向右移动一格
      [0, -1],  // 向上移动一格（特殊情况）
      [-2, 0],  // 向左移动两格
      [2, 0]    // 向右移动两格
    ];
    
    for (const [dx, dy] of kickTests) {
      testBlock.x = this.currentBlock.x + dx;
      testBlock.y = this.currentBlock.y + dy;
      
      if (this.grid.canPlaceBlock(testBlock)) {
        this.currentBlock.x = testBlock.x;
        this.currentBlock.y = testBlock.y;
        this.currentBlock.rotate(direction);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * 软降（加速下落）
   * @returns {boolean} 是否下落成功
   */
  softDrop() {
    if (!this.currentBlock || this.state !== GameState.PLAYING) {
      return false;
    }
    
    this.isDropping = true;
    const moved = this.moveCurrentBlock(0, 1);
    
    if (moved) {
      // 加分：软降每格1分
      this.scoreManager.addSoftDropPoints();
      this.notifyScoreUpdate();
    }
    
    this.isDropping = false;
    return moved;
  }
  
  /**
   * 硬降（立即下落）
   * @returns {number} 下落的格数
   */
  hardDrop() {
    if (!this.currentBlock || this.state !== GameState.PLAYING) {
      return 0;
    }
    
    let dropDistance = 0;
    this.isDropping = true;
    
    // 一直下落直到不能移动
    while (this.moveCurrentBlock(0, 1)) {
      dropDistance++;
    }
    
    if (dropDistance > 0) {
      // 加分：硬降每格2分
      this.scoreManager.addHardDropPoints(dropDistance);
      this.notifyScoreUpdate();
    }
    
    this.isDropping = false;
    return dropDistance;
  }
  
  /**
   * 固定当前方块
   */
  lockCurrentBlock() {
    if (!this.currentBlock || this.state !== GameState.PLAYING) {
      return;
    }
    
    // 将方块固定到网格
    const completedLines = this.grid.placeBlock(this.currentBlock);
    
    if (completedLines.length > 0) {
      // 更新分数
      this.scoreManager.addLineClearPoints(completedLines.length);
      this.notifyScoreUpdate();
      
      // 更新消行统计
      this.linesCleared += completedLines.length;
      this.notifyLinesCleared();
      
      // 检查是否升级
      this.checkLevelUp();
    }
    
    // 生成新方块
    this.spawnNewBlock();
    this.dropTimer = 0;
  }
  
  /**
   * 检查是否升级
   */
  checkLevelUp() {
    const newLevel = Math.floor(this.linesCleared / GameConfig.LINES_PER_LEVEL) + 1;
    
    if (newLevel > this.level && newLevel <= GameConfig.MAX_LEVEL) {
      this.level = newLevel;
      // 更新下落速度
      this.dropInterval = Math.max(
        GameConfig.INITIAL_SPEED - (this.level - 1) * GameConfig.SPEED_DECREMENT,
        GameConfig.MIN_SPEED
      );
      this.notifyLevelChange();
    }
  }
  
  /**
   * 游戏结束
   */
  gameOver() {
    this.state = GameState.GAME_OVER;
    this.stopGameLoop();
    this.notifyStateChange();
    
    // 保存最高分
    this.scoreManager.saveHighScore();
  }
  
  /**
   * 获取游戏状态
   * @returns {Object} 游戏状态对象
   */
  getGameState() {
    return {
      state: this.state,
      score: this.scoreManager.getCurrentScore(),
      highScore: this.scoreManager.getHighScore(),
      level: this.level,
      linesCleared: this.linesCleared,
      currentBlock: this.currentBlock,
      nextBlock: this.nextBlock,
      grid: this.grid.getGridCopy()
    };
  }
  
  /**
   * 设置状态变化回调
   * @param {Function} callback - 回调函数
   */
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }
  
  /**
   * 设置分数更新回调
   * @param {Function} callback - 回调函数
   */
  setOnScoreUpdate(callback) {
    this.onScoreUpdate = callback;
  }
  
  /**
   * 设置消行回调
   * @param {Function} callback - 回调函数
   */
  setOnLinesCleared(callback) {
    this.onLinesCleared = callback;
  }
  
  /**
   * 设置等级变化回调
   * @param {Function} callback - 回调函数
   */
  setOnLevelChange(callback) {
    this.onLevelChange = callback;
  }
  
  /**
   * 通知状态变化
   */
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
  
  /**
   * 通知分数更新
   */
  notifyScoreUpdate() {
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.scoreManager.getCurrentScore(), this.scoreManager.getHighScore());
    }
  }
  
  /**
   * 通知消行
   */
  notifyLinesCleared() {
    if (this.onLinesCleared) {
      this.onLinesCleared(this.linesCleared);
    }
  }
  
  /**
   * 通知等级变化
   */
  notifyLevelChange() {
    if (this.onLevelChange) {
      this.onLevelChange(this.level, this.dropInterval);
    }
  }
}