/**
 * Canvas渲染器
 * 负责在Canvas上渲染游戏界面
 */

import { GameConfig, BlockType } from '../config.js';

export class CanvasRenderer {
  /**
   * 构造函数
   * @param {HTMLCanvasElement} canvas - Canvas元素
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    this.canvas.width = GameConfig.UI.CANVAS_WIDTH;
    this.canvas.height = GameConfig.UI.CANVAS_HEIGHT;
    
    // 渲染缓存
    this.cache = {
      gridBackground: null,
      cellCache: new Map()
    };
    
    // 动画状态
    this.animationState = {
      lineClearAnimation: null,
      dropAnimation: null,
      gameOverAnimation: null
    };
    
    // 初始化渲染
    this.initialize();
  }
  
  /**
   * 初始化渲染器
   */
  initialize() {
    this.clear();
    this.drawGridBackground();
  }
  
  /**
   * 清除Canvas
   */
  clear() {
    this.ctx.fillStyle = GameConfig.UI.BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * 绘制网格背景
   */
  drawGridBackground() {
    const cellSize = GameConfig.CELL_SIZE;
    const width = GameConfig.GRID_WIDTH;
    const height = GameConfig.GRID_HEIGHT;
    
    // 绘制边框
    this.ctx.strokeStyle = GameConfig.UI.BORDER_COLOR;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      0,
      0,
      width * cellSize,
      height * cellSize
    );
    
    // 绘制网格线
    this.ctx.strokeStyle = GameConfig.UI.GRID_COLOR;
    this.ctx.lineWidth = 0.5;
    
    // 垂直网格线
    for (let col = 1; col < width; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * cellSize, 0);
      this.ctx.lineTo(col * cellSize, height * cellSize);
      this.ctx.stroke();
    }
    
    // 水平网格线
    for (let row = 1; row < height; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, row * cellSize);
      this.ctx.lineTo(width * cellSize, row * cellSize);
      this.ctx.stroke();
    }
    
    // 缓存背景
    this.cache.gridBackground = this.ctx.getImageData(
      0, 0,
      width * cellSize,
      height * cellSize
    );
  }
  
  /**
   * 渲染游戏状态
   * @param {Object} gameState - 游戏状态对象
   */
  render(gameState) {
    // 清除Canvas
    this.clear();
    
    // 恢复网格背景
    if (this.cache.gridBackground) {
      this.ctx.putImageData(this.cache.gridBackground, 0, 0);
    } else {
      this.drawGridBackground();
    }
    
    // 绘制已固定的方块
    this.drawFixedBlocks(gameState.grid);
    
    // 绘制当前方块
    if (gameState.currentBlock) {
      this.drawCurrentBlock(gameState.currentBlock);
      
      // 绘制阴影（预测位置）
      this.drawBlockShadow(gameState.currentBlock, gameState.grid);
    }
    
    // 执行动画
    this.updateAnimations();
  }
  
  /**
   * 绘制已固定的方块
   * @param {Array<Array<string>>} grid - 游戏网格
   */
  drawFixedBlocks(grid) {
    const cellSize = GameConfig.CELL_SIZE;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const blockType = grid[row][col];
        
        if (blockType !== BlockType.EMPTY) {
          this.drawBlockCell(col, row, blockType);
        }
      }
    }
  }
  
  /**
   * 绘制当前方块
   * @param {Block} block - 当前方块
   */
  drawCurrentBlock(block) {
    const cells = block.getCells();
    const color = block.getColor();
    
    for (const cell of cells) {
      // 只绘制在游戏区域内的部分
      if (cell.row >= 0 && cell.row < GameConfig.GRID_HEIGHT &&
          cell.col >= 0 && cell.col < GameConfig.GRID_WIDTH) {
        this.drawBlockCell(cell.col, cell.row, block.type, color, true);
      }
    }
  }
  
  /**
   * 绘制方块阴影（预测位置）
   * @param {Block} block - 当前方块
   * @param {Array<Array<string>>} grid - 游戏网格
   */
  drawBlockShadow(block, grid) {
    const shadowBlock = block.clone();
    
    // 下落直到碰撞
    while (true) {
      const testBlock = shadowBlock.clone();
      testBlock.move(0, 1);
      
      // 创建测试网格来检查碰撞
      const testGrid = grid.map(row => [...row]);
      
      // 检查是否可以下落
      let canDrop = true;
      const cells = testBlock.getCells();
      
      for (const cell of cells) {
        if (cell.row >= GameConfig.GRID_HEIGHT) {
          canDrop = false;
          break;
        }
        if (cell.row >= 0 && testGrid[cell.row][cell.col] !== BlockType.EMPTY) {
          canDrop = false;
          break;
        }
      }
      
      if (!canDrop) {
        break;
      }
      
      shadowBlock.move(0, 1);
    }
    
    // 绘制阴影
    const shadowCells = shadowBlock.getCells();
    const shadowColor = 'rgba(255, 255, 255, 0.2)';
    
    for (const cell of shadowCells) {
      if (cell.row >= 0 && cell.row < GameConfig.GRID_HEIGHT &&
          cell.col >= 0 && cell.col < GameConfig.GRID_WIDTH) {
        this.drawShadowCell(cell.col, cell.row, shadowColor);
      }
    }
  }
  
  /**
   * 绘制单个方块单元格
   * @param {number} col - 列
   * @param {number} row - 行
   * @param {string} blockType - 方块类型
   * @param {string} color - 颜色（可选）
   * @param {boolean} isCurrent - 是否是当前方块
   */
  drawBlockCell(col, row, blockType, color = null, isCurrent = false) {
    const cellSize = GameConfig.CELL_SIZE;
    const blockColor = color || GameConfig.BLOCK_COLORS[blockType];
    
    const x = col * cellSize;
    const y = row * cellSize;
    
    // 绘制主体
    this.ctx.fillStyle = blockColor;
    this.ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    
    // 绘制高光效果
    if (isCurrent) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.fillRect(x + 1, y + 1, cellSize - 2, 2);
      this.ctx.fillRect(x + 1, y + 1, 2, cellSize - 2);
    }
    
    // 绘制内阴影
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(x + 1, y + cellSize - 3, cellSize - 2, 2);
    this.ctx.fillRect(x + cellSize - 3, y + 1, 2, cellSize - 2);
  }
  
  /**
   * 绘制阴影单元格
   * @param {number} col - 列
   * @param {number} row - 行
   * @param {string} color - 阴影颜色
   */
  drawShadowCell(col, row, color) {
    const cellSize = GameConfig.CELL_SIZE;
    const x = col * cellSize;
    const y = row * cellSize;
    
    // 绘制半透明边框
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
    
    // 绘制内部填充
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);
  }
  
  /**
   * 绘制下一个方块预览
   * @param {HTMLElement} container - 预览容器
   * @param {Block} nextBlock - 下一个方块
   */
  renderNextBlockPreview(container, nextBlock) {
    if (!nextBlock) return;
    
    // 创建或获取预览Canvas
    let previewCanvas = container.querySelector('canvas');
    if (!previewCanvas) {
      previewCanvas = document.createElement('canvas');
      previewCanvas.width = GameConfig.UI.PREVIEW_SIZE;
      previewCanvas.height = GameConfig.UI.PREVIEW_SIZE;
      container.innerHTML = '';
      container.appendChild(previewCanvas);
    }
    
    const ctx = previewCanvas.getContext('2d');
    const blockSize = GameConfig.UI.PREVIEW_SIZE / 4;
    
    // 清除背景
    ctx.fillStyle = GameConfig.UI.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // 获取方块形状
    const shape = nextBlock.getShape();
    const color = nextBlock.getColor();
    
    // 计算居中位置
    const bounds = nextBlock.getBounds();
    const offsetX = (4 - bounds.width) / 2;
    const offsetY = (4 - bounds.height) / 2;
    
    // 绘制方块
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shape[row][col]) {
          const x = (col + offsetX) * blockSize;
          const y = (row + offsetY) * blockSize;
          
          // 绘制方块单元格
          ctx.fillStyle = color;
          ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);
          
          // 绘制高光
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x + 1, y + 1, blockSize - 2, 2);
          ctx.fillRect(x + 1, y + 1, 2, blockSize - 2);
          
          // 绘制内阴影
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(x + 1, y + blockSize - 3, blockSize - 2, 2);
          ctx.fillRect(x + blockSize - 3, y + 1, 2, blockSize - 2);
        }
      }
    }
  }
  
  /**
   * 开始消行动画
   * @param {Array<number>} lines - 要消除的行号
   * @param {Function} onComplete - 完成回调
   */
  startLineClearAnimation(lines, onComplete) {
    this.animationState.lineClearAnimation = {
      lines: lines,
      frame: 0,
      totalFrames: 30, // 30帧动画
      onComplete: onComplete
    };
  }
  
  /**
   * 更新动画
   */
  updateAnimations() {
    // 消行动画
    if (this.animationState.lineClearAnimation) {
      this.drawLineClearAnimation();
    }
  }
  
  /**
   * 绘制消行动画
   */
  drawLineClearAnimation() {
    const animation = this.animationState.lineClearAnimation;
    const cellSize = GameConfig.CELL_SIZE;
    
    // 计算动画进度 (0到1)
    const progress = animation.frame / animation.totalFrames;
    
    // 绘制消行的闪烁效果
    for (const line of animation.lines) {
      const y = line * cellSize;
      
      if (animation.frame < 15) {
        // 前半段：白色闪烁
        const alpha = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      } else {
        // 后半段：渐隐
        const alpha = 1 - (progress - 0.5) * 2;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }
      
      this.ctx.fillRect(0, y, GameConfig.GRID_WIDTH * cellSize, cellSize);
    }
    
    // 更新帧计数
    animation.frame++;
    
    // 检查动画是否完成
    if (animation.frame >= animation.totalFrames) {
      if (animation.onComplete) {
        animation.onComplete();
      }
      this.animationState.lineClearAnimation = null;
    }
  }
  
  /**
   * 绘制游戏结束效果
   */
  drawGameOverEffect() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // 半透明黑色遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, width, height);
    
    // 游戏结束文字
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 40px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GAME OVER', width / 2, height / 2 - 30);
    
    this.ctx.font = '20px "Press Start 2P", monospace';
    this.ctx.fillText('按 R 重新开始', width / 2, height / 2 + 30);
  }
  
  /**
   * 绘制暂停效果
   */
  drawPauseEffect() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // 半透明遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, width, height);
    
    // 暂停文字
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 40px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('PAUSED', width / 2, height / 2);
  }
}