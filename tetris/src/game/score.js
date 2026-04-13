/**
 * 分数管理器类
 * 负责管理游戏分数和等级
 */

import { GameConfig } from '../config.js';

export class ScoreManager {
  /**
   * 构造函数
   */
  constructor() {
    this.currentScore = 0;
    this.highScore = this.loadHighScore();
    this.totalLinesCleared = 0;
    this.currentLevel = 1;
  }
  
  /**
   * 从本地存储加载最高分
   * @returns {number} 最高分
   */
  loadHighScore() {
    try {
      const savedHighScore = localStorage.getItem('tetris_high_score');
      return savedHighScore ? parseInt(savedHighScore, 10) : 0;
    } catch (error) {
      console.warn('无法读取本地存储，使用默认最高分:', error);
      return 0;
    }
  }
  
  /**
   * 保存最高分到本地存储
   */
  saveHighScore() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      try {
        localStorage.setItem('tetris_high_score', this.highScore.toString());
      } catch (error) {
        console.warn('无法保存到本地存储:', error);
      }
    }
  }
  
  /**
   * 重置分数
   */
  reset() {
    this.currentScore = 0;
    this.totalLinesCleared = 0;
    this.currentLevel = 1;
  }
  
  /**
   * 添加消行得分
   * @param {number} lines - 消除的行数
   */
  addLineClearPoints(lines) {
    let points = 0;
    
    switch (lines) {
      case 1:
        points = GameConfig.SCORE_SINGLE_LINE;
        break;
      case 2:
        points = GameConfig.SCORE_DOUBLE_LINE;
        break;
      case 3:
        points = GameConfig.SCORE_TRIPLE_LINE;
        break;
      case 4:
        points = GameConfig.SCORE_TETRIS_LINE;
        break;
      default:
        points = 0;
    }
    
    // 乘以当前等级的倍率
    points = points * this.currentLevel;
    this.currentScore += points;
  }
  
  /**
   * 添加软降得分
   */
  addSoftDropPoints() {
    this.currentScore += GameConfig.SCORE_SOFT_DROP;
  }
  
  /**
   * 添加硬降得分
   * @param {number} distance - 下落格数
   */
  addHardDropPoints(distance) {
    this.currentScore += GameConfig.SCORE_HARD_DROP * distance;
  }
  
  /**
   * 获取当前分数
   * @returns {number} 当前分数
   */
  getCurrentScore() {
    return this.currentScore;
  }
  
  /**
   * 获取最高分
   * @returns {number} 最高分
   */
  getHighScore() {
    return this.highScore;
  }
  
  /**
   * 获取消行总数
   * @returns {number} 消行总数
   */
  getTotalLinesCleared() {
    return this.totalLinesCleared;
  }
  
  /**
   * 设置当前等级
   * @param {number} level - 等级
   */
  setLevel(level) {
    this.currentLevel = Math.max(1, Math.min(level, GameConfig.MAX_LEVEL));
  }
  
  /**
   * 获取当前等级
   * @returns {number} 当前等级
   */
  getLevel() {
    return this.currentLevel;
  }
  
  /**
   * 更新消行统计
   * @param {number} lines - 新增的消行数
   */
  addLinesCleared(lines) {
    this.totalLinesCleared += lines;
  }
  
  /**
   * 获取格式化分数（补零到指定位数）
   * @param {number} score - 分数
   * @param {number} digits - 位数（默认6位）
   * @returns {string} 格式化后的分数
   */
  formatScore(score, digits = 6) {
    return score.toString().padStart(digits, '0');
  }
  
  /**
   * 获取游戏统计信息
   * @returns {Object} 统计信息对象
   */
  getStats() {
    return {
      score: this.currentScore,
      highScore: this.highScore,
      level: this.currentLevel,
      linesCleared: this.totalLinesCleared,
      formattedScore: this.formatScore(this.currentScore),
      formattedHighScore: this.formatScore(this.highScore)
    };
  }
}