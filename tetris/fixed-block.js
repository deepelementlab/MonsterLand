/**
 * 修复后的方块类
 * 主要修复：方块初始位置计算
 */

import { GameConfig, BlockType } from '../config.js';

export class Block {
  /**
   * 构造函数
   * @param {string} type - 方块类型 (I, O, T, S, Z, J, L)
   * @param {number} x - 初始x坐标（可选，使用智能默认值）
   * @param {number} y - 初始y坐标
   */
  constructor(type, x = null, y = 0) {
    this.type = type;
    
    // 使用智能的默认x位置
    if (x === null) {
      x = this.calculateDefaultX();
    }
    
    this.x = x;
    this.y = y;
    this.rotation = 0; // 当前旋转状态 (0-3)
    this.shape = GameConfig.BLOCK_SHAPES[type][this.rotation];
    this.color = GameConfig.BLOCK_COLORS[type];
  }
  
  /**
   * 计算默认的x位置，确保方块在网格内
   * @returns {number} 默认x坐标
   */
  calculateDefaultX() {
    const shape = GameConfig.BLOCK_SHAPES[this.type][0]; // 获取第一个旋转状态
    let minCol = 4;
    let maxCol = 0;
    
    // 找到形状中最小和最大的列
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shape[row][col]) {
          minCol = Math.min(minCol, col);
          maxCol = Math.max(maxCol, col);
        }
      }
    }
    
    const blockWidth = maxCol - minCol + 1;
    const gridCenter = Math.floor(GameConfig.GRID_WIDTH / 2);
    
    // 计算居中位置：网格中心 - 方块宽度/2 - minCol偏移
    // 但需要确保在边界内
    let x = gridCenter - Math.floor(blockWidth / 2) - minCol;
    
    // 确保不超出左边界
    if (x < 0) {
      x = 0;
    }
    
    // 确保不超出右边界
    const testMaxCol = x + maxCol;
    if (testMaxCol >= GameConfig.GRID_WIDTH) {
      x = GameConfig.GRID_WIDTH - 1 - maxCol;
    }
    
    // 对于长条形(I)方块，特殊处理
    if (this.type === 'I') {
      x = Math.floor(GameConfig.GRID_WIDTH / 2) - 1;
    }
    
    return x;
  }
  
  /**
   * 获取当前方块的形状矩阵
   * @returns {Array<Array<number>>} 形状矩阵
   */
  getShape() {
    return this.shape;
  }
  
  /**
   * 获取方块的颜色
   * @returns {string} 颜色值
   */
  getColor() {
    return this.color;
  }
  
  /**
   * 移动方块
   * @param {number} dx - x方向移动量
   * @param {number} dy - y方向移动量
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  
  /**
   * 旋转方块
   * @param {number} direction - 旋转方向 (1: 顺时针, -1: 逆时针)
   * @returns {Array<Array<number>>} 旋转后的形状
   */
  rotate(direction = 1) {
    // 计算新的旋转状态
    this.rotation = (this.rotation + direction + 4) % 4;
    this.shape = GameConfig.BLOCK_SHAPES[this.type][this.rotation];
    return this.shape;
  }
  
  /**
   * 获取旋转测试的形状（用于碰撞检测）
   * @param {number} direction - 旋转方向
   * @returns {Array<Array<number>>} 测试形状
   */
  getRotationTestShape(direction = 1) {
    const testRotation = (this.rotation + direction + 4) % 4;
    return GameConfig.BLOCK_SHAPES[this.type][testRotation];
  }
  
  /**
   * 获取方块的边界（最小/最大行列位置）
   * @returns {Object} 边界对象
   */
  getBounds() {
    const shape = this.shape;
    let minRow = 4, maxRow = 0;
    let minCol = 4, maxCol = 0;
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shape[row][col]) {
          minRow = Math.min(minRow, row);
          maxRow = Math.max(maxRow, row);
          minCol = Math.min(minCol, col);
          maxCol = Math.max(maxCol, col);
        }
      }
    }
    
    return {
      minRow: this.y + minRow,
      maxRow: this.y + maxRow,
      minCol: this.x + minCol,
      maxCol: this.x + maxCol,
      width: maxCol - minCol + 1,
      height: maxRow - minRow + 1
    };
  }
  
  /**
   * 获取方块在网格中的所有单元格位置
   * @returns {Array<Object>} 单元格位置数组 [{row, col}, ...]
   */
  getCells() {
    const cells = [];
    const shape = this.shape;
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shape[row][col]) {
          cells.push({
            row: this.y + row,
            col: this.x + col
          });
        }
      }
    }
    
    return cells;
  }
  
  /**
   * 检查方块是否在游戏区域内
   * @returns {boolean} 是否有效位置
   */
  isValidPosition() {
    const cells = this.getCells();
    
    for (const cell of cells) {
      if (cell.col < 0 || cell.col >= GameConfig.GRID_WIDTH) {
        return false;
      }
      if (cell.row >= GameConfig.GRID_HEIGHT) {
        return false;
      }
      // 允许部分超出顶部（新方块生成时）
      if (cell.row < 0 && cell.row >= -3) {
        continue;
      }
    }
    
    return true;
  }
  
  /**
   * 克隆当前方块
   * @returns {Block} 新的方块实例
   */
  clone() {
    const newBlock = new Block(this.type, this.x, this.y);
    newBlock.rotation = this.rotation;
    newBlock.shape = this.shape;
    return newBlock;
  }
  
  /**
   * 重置方块到顶部中间位置
   */
  reset() {
    this.x = this.calculateDefaultX();
    this.y = 0;
    this.rotation = 0;
    this.shape = GameConfig.BLOCK_SHAPES[this.type][this.rotation];
  }
}

/**
 * 方块工厂类
 * 负责创建和管理方块
 */
export class BlockFactory {
  /**
   * 构造函数
   */
  constructor() {
    this.blockTypes = Object.keys(BlockType).filter(type => type !== 'EMPTY');
    this.bag = [];
    this.refillBag();
  }
  
  /**
   * 填充方块袋
   */
  refillBag() {
    // Fisher-Yates洗牌算法
    const shuffled = [...this.blockTypes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.bag = [...this.bag, ...shuffled];
  }
  
  /**
   * 创建下一个方块
   * @returns {Block} 新的方块实例
   */
  createNextBlock() {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    
    const type = this.bag.shift();
    return new Block(type);
  }
  
  /**
   * 预览下一个方块
   * @returns {string} 下一个方块类型
   */
  peekNextBlock() {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag[0];
  }
  
  /**
   * 重置方块工厂
   */
  reset() {
    this.bag = [];
    this.refillBag();
  }
}