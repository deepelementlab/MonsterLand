/**
 * 游戏网格类
 * 负责管理游戏区域的网格状态
 */

import { GameConfig, BlockType } from '../config.js';

export class GameGrid {
  /**
   * 构造函数
   */
  constructor() {
    this.width = GameConfig.GRID_WIDTH;
    this.height = GameConfig.GRID_HEIGHT;
    this.cells = this.createEmptyGrid();
  }
  
  /**
   * 创建空网格
   * @returns {Array<Array<string>>} 空网格
   */
  createEmptyGrid() {
    const grid = [];
    for (let row = 0; row < this.height; row++) {
      grid[row] = [];
      for (let col = 0; col < this.width; col++) {
        grid[row][col] = BlockType.EMPTY;
      }
    }
    return grid;
  }
  
  /**
   * 重置网格
   */
  reset() {
    this.cells = this.createEmptyGrid();
  }
  
  /**
   * 检查位置是否为空
   * @param {number} row - 行
   * @param {number} col - 列
   * @returns {boolean} 是否为空
   */
  isEmpty(row, col) {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      return false; // 越界视为非空（碰撞）
    }
    return this.cells[row][col] === BlockType.EMPTY;
  }
  
  /**
   * 检查方块是否可以放置到指定位置
   * @param {Block} block - 要检查的方块
   * @returns {boolean} 是否可以放置
   */
  canPlaceBlock(block) {
    const cells = block.getCells();
    
    for (const cell of cells) {
      // 如果超出左右边界或底部边界，不能放置
      if (cell.col < 0 || cell.col >= this.width || cell.row >= this.height) {
        return false;
      }
      
      // 如果超出顶部边界（新方块生成时），暂时允许
      if (cell.row < 0) {
        continue;
      }
      
      // 如果该位置已有方块，不能放置
      if (!this.isEmpty(cell.row, cell.col)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * 将方块固定到网格中
   * @param {Block} block - 要固定的方块
   * @returns {Array<number>} 被消除的行号数组
   */
  placeBlock(block) {
    const cells = block.getCells();
    
    // 将方块添加到网格
    for (const cell of cells) {
      // 忽略超出顶部的部分（新方块生成时）
      if (cell.row >= 0 && cell.row < this.height && 
          cell.col >= 0 && cell.col < this.width) {
        this.cells[cell.row][cell.col] = block.type;
      }
    }
    
    // 检查并消除完整的行
    return this.clearCompleteLines();
  }
  
  /**
   * 清除完整的行
   * @returns {Array<number>} 被消除的行号数组
   */
  clearCompleteLines() {
    const completedLines = [];
    
    // 从下往上检查每一行
    for (let row = this.height - 1; row >= 0; row--) {
      if (this.isLineComplete(row)) {
        completedLines.push(row);
      }
    }
    
    // 如果有完整的行，消除它们
    if (completedLines.length > 0) {
      this.removeLines(completedLines);
    }
    
    return completedLines;
  }
  
  /**
   * 检查一行是否完整
   * @param {number} row - 要检查的行
   * @returns {boolean} 是否完整
   */
  isLineComplete(row) {
    for (let col = 0; col < this.width; col++) {
      if (this.isEmpty(row, col)) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * 消除指定的行
   * @param {Array<number>} lines - 要消除的行号数组
   */
  removeLines(lines) {
    // 按行号排序（从大到小）
    lines.sort((a, b) => b - a);
    
    for (const line of lines) {
      // 移除该行
      this.cells.splice(line, 1);
      // 在顶部添加新的空行
      this.cells.unshift(Array(this.width).fill(BlockType.EMPTY));
    }
  }
  
  /**
   * 获取网格的副本（用于渲染）
   * @returns {Array<Array<string>>} 网格副本
   */
  getGridCopy() {
    return this.cells.map(row => [...row]);
  }
  
  /**
   * 获取指定位置的方块类型
   * @param {number} row - 行
   * @param {number} col - 列
   * @returns {string} 方块类型
   */
  getCellType(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      return this.cells[row][col];
    }
    return BlockType.EMPTY;
  }
  
  /**
   * 检查游戏是否结束（顶部溢出）
   * @returns {boolean} 是否游戏结束
   */
  checkGameOver() {
    // 检查顶部几行是否有方块
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.isEmpty(row, col)) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
   * 获取网格中所有方块的位置
   * @returns {Array<Object>} 方块位置数组 [{row, col, type}, ...]
   */
  getAllBlocks() {
    const blocks = [];
    
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.isEmpty(row, col)) {
          blocks.push({
            row,
            col,
            type: this.cells[row][col]
          });
        }
      }
    }
    
    return blocks;
  }
  
  /**
   * 获取消行前的网格快照（用于动画效果）
   * @param {Array<number>} lines - 要消除的行
   * @returns {Array<Array<string>>} 快照网格
   */
  getSnapshotBeforeClearing(lines) {
    const snapshot = this.getGridCopy();
    
    // 标记要消除的行
    for (const line of lines) {
      if (line >= 0 && line < this.height) {
        for (let col = 0; col < this.width; col++) {
          snapshot[line][col] = 'MARKED';
        }
      }
    }
    
    return snapshot;
  }
}