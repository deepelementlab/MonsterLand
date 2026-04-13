/**
 * UI控制器
 * 负责管理游戏界面和用户交互
 */

import { GameConfig, GameState } from '../config.js';

export class UIController {
  /**
   * 构造函数
   * @param {Object} elements - UI元素集合
   * @param {GameEngine} gameEngine - 游戏引擎实例
   * @param {CanvasRenderer} renderer - 渲染器实例
   */
  constructor(elements, gameEngine, renderer) {
    console.log('UIController 构造函数被调用');
    console.log('传入的elements:', elements);
    
    this.elements = elements;
    this.gameEngine = gameEngine;
    this.renderer = renderer;
    
    // 检查按钮元素是否存在
    console.log('检查按钮元素是否存在:', {
      startButton: !!this.elements.startButton,
      pauseButton: !!this.elements.pauseButton,
      restartButton: !!this.elements.restartButton
    });
    
    // 检查按钮初始状态
    console.log('按钮初始状态:', {
      startButtonDisabled: this.elements.startButton?.disabled,
      pauseButtonDisabled: this.elements.pauseButton?.disabled,
      restartButtonDisabled: this.elements.restartButton?.disabled
    });
    
    // 绑定事件处理
    this.bindEvents();
    
    // 初始化UI状态
    this.updateUI();
  }
  
  /**
   * 绑定事件处理
   */
  bindEvents() {
    console.log('开始绑定UI事件');
    console.log('按钮元素:', {
      startButton: this.elements.startButton,
      pauseButton: this.elements.pauseButton,
      restartButton: this.elements.restartButton
    });
    
    // 按钮点击事件
    this.elements.startButton.addEventListener('click', () => {
      console.log('开始按钮被点击，当前游戏状态:', this.gameEngine.state);
      
      const state = this.gameEngine.state;
      if (state === GameState.PAUSED) {
        // 暂停状态下点击开始按钮 -> 继续游戏
        console.log('暂停状态，调用 togglePause() 继续游戏');
        this.gameEngine.togglePause();
      } else {
        // 初始状态或游戏结束时 -> 开始游戏
        console.log('非暂停状态，调用 start()');
        this.gameEngine.start();
      }
    });
    
    this.elements.pauseButton.addEventListener('click', () => {
      console.log('暂停按钮被点击，当前游戏状态:', this.gameEngine.state);
      this.gameEngine.togglePause();
    });
    
    this.elements.restartButton.addEventListener('click', () => {
      console.log('重新开始按钮被点击');
      this.gameEngine.reset();
      // 重置后自动开始游戏
      setTimeout(() => {
        this.gameEngine.start();
      }, 100);
    });
    
    // 键盘控制
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
    
    // 游戏状态变化回调
    this.gameEngine.setOnStateChange((state) => {
      this.updateGameStateUI(state);
    });
    
    // 分数更新回调
    this.gameEngine.setOnScoreUpdate((score, highScore) => {
      this.updateScoreUI(score, highScore);
    });
    
    // 消行回调
    this.gameEngine.setOnLinesCleared((lines) => {
      this.updateLinesUI(lines);
    });
    
    // 等级变化回调
    this.gameEngine.setOnLevelChange((level, speed) => {
      this.updateLevelUI(level, speed);
    });
  }
  
  /**
   * 处理键盘按下事件
   * @param {KeyboardEvent} event - 键盘事件
   */
  handleKeyDown(event) {
    // 防止默认行为（如空格键滚动页面）
    if (GameConfig.CONTROLS.HARD_DROP.includes(event.code)) {
      event.preventDefault();
    }
    
    const controls = GameConfig.CONTROLS;
    
    // 移动控制
    if (controls.MOVE_LEFT.includes(event.code)) {
      this.gameEngine.moveCurrentBlock(-1, 0);
    } else if (controls.MOVE_RIGHT.includes(event.code)) {
      this.gameEngine.moveCurrentBlock(1, 0);
    } else if (controls.ROTATE.includes(event.code)) {
      this.gameEngine.rotateCurrentBlock(1);
    } else if (controls.SOFT_DROP.includes(event.code)) {
      this.gameEngine.softDrop();
    } else if (controls.HARD_DROP.includes(event.code)) {
      this.gameEngine.hardDrop();
    }
    
    // 游戏控制
    else if (controls.PAUSE.includes(event.code)) {
      this.gameEngine.togglePause();
    } else if (controls.RESTART.includes(event.code)) {
      this.gameEngine.reset();
      this.gameEngine.start();
    }
    
    // 游戏状态控制
    else if (event.code === 'Enter' || event.code === 'Space') {
      const state = this.gameEngine.getGameState().state;
      if (state === GameState.INITIAL || state === GameState.GAME_OVER) {
        this.gameEngine.start();
      }
    }
  }
  
  /**
   * 更新游戏状态UI
   * @param {string} state - 游戏状态
   */
  updateGameStateUI(state) {
    // 更新状态显示
    this.elements.gameStateText.textContent = this.getStateText(state);
    
    // 更新按钮状态
    this.updateButtonStates(state);
    
    // 根据状态执行特殊渲染
    const gameState = this.gameEngine.getGameState();
    
    if (state === GameState.GAME_OVER) {
      this.renderer.drawGameOverEffect();
    } else if (state === GameState.PAUSED) {
      this.renderer.drawPauseEffect();
    } else {
      // 正常渲染游戏
      this.renderer.render(gameState);
      
      // 更新下一个方块预览
      if (gameState.nextBlock) {
        this.renderer.renderNextBlockPreview(this.elements.nextBlockPreview, gameState.nextBlock);
      }
    }
  }
  
  /**
   * 获取状态文本
   * @param {string} state - 游戏状态
   * @returns {string} 状态文本
   */
  getStateText(state) {
    switch (state) {
      case GameState.INITIAL:
        return '准备开始';
      case GameState.PLAYING:
        return '进行中';
      case GameState.PAUSED:
        return '已暂停';
      case GameState.GAME_OVER:
        return '游戏结束';
      default:
        return '未知状态';
    }
  }
  
  /**
   * 更新按钮状态
   * @param {string} state - 游戏状态
   */
  updateButtonStates(state) {
    const isInitial = state === GameState.INITIAL;
    const isPlaying = state === GameState.PLAYING;
    const isPaused = state === GameState.PAUSED;
    const isGameOver = state === GameState.GAME_OVER;
    
    console.log('更新按钮状态:', state, {
      isInitial, isPlaying, isPaused, isGameOver
    });
    
    // 开始按钮
    this.elements.startButton.disabled = isPlaying || isPaused;
    this.elements.startButton.textContent = isPaused ? '继续' : '开始';
    
    // 暂停按钮 - 修改为只在游戏结束时禁用
    const pauseDisabled = isGameOver;
    this.elements.pauseButton.disabled = pauseDisabled;
    this.elements.pauseButton.textContent = isPaused ? '继续' : '暂停';
    
    console.log('暂停按钮状态:', {
      disabled: pauseDisabled,
      text: this.elements.pauseButton.textContent,
      elementExists: !!this.elements.pauseButton
    });
    
    // 重新开始按钮
    this.elements.restartButton.disabled = false;
  }
  
  /**
   * 更新分数UI
   * @param {number} score - 当前分数
   * @param {number} highScore - 最高分
   */
  updateScoreUI(score, highScore) {
    this.elements.scoreValue.textContent = this.formatNumber(score, 6);
    this.elements.highScoreValue.textContent = this.formatNumber(highScore, 6);
  }
  
  /**
   * 更新消行UI
   * @param {number} lines - 已消行数
   */
  updateLinesUI(lines) {
    this.elements.linesValue.textContent = this.formatNumber(lines, 3);
  }
  
  /**
   * 更新等级UI
   * @param {number} level - 当前等级
   * @param {number} speed - 下落速度
   */
  updateLevelUI(level, speed) {
    this.elements.levelValue.textContent = this.formatNumber(level, 2);
    this.elements.speedValue.textContent = `${Math.round(1000 / speed)}/秒`;
  }
  
  /**
   * 格式化数字（补零）
   * @param {number} number - 要格式化的数字
   * @param {number} digits - 位数
   * @returns {string} 格式化后的字符串
   */
  formatNumber(number, digits) {
    return number.toString().padStart(digits, '0');
  }
  
  /**
   * 更新整个UI
   */
  updateUI() {
    const gameState = this.gameEngine.getGameState();
    
    // 更新所有UI元素
    this.updateGameStateUI(gameState.state);
    this.updateScoreUI(gameState.score, gameState.highScore);
    this.updateLinesUI(gameState.linesCleared);
    this.updateLevelUI(gameState.level, this.gameEngine.dropInterval);
    
    // 更新下一个方块预览
    if (gameState.nextBlock) {
      this.renderer.renderNextBlockPreview(this.elements.nextBlockPreview, gameState.nextBlock);
    }
  }
  
  /**
   * 显示消息
   * @param {string} message - 消息内容
   * @param {number} duration - 显示时间（毫秒）
   */
  showMessage(message, duration = 2000) {
    if (this.elements.messageElement) {
      this.elements.messageElement.textContent = message;
      this.elements.messageElement.style.display = 'block';
      
      setTimeout(() => {
        this.elements.messageElement.style.display = 'none';
      }, duration);
    }
  }
  
  /**
   * 更新控制说明
   */
  updateControlInstructions() {
    const controls = GameConfig.CONTROLS;
    
    const instructions = [
      `← → : 左右移动`,
      `↑    : 旋转方块`,
      `↓    : 加速下落`,
      `空格 : 立即下落`,
      `P    : 暂停/继续`,
      `R    : 重新开始`,
      `Enter: 开始游戏`
    ];
    
    if (this.elements.instructionsElement) {
      this.elements.instructionsElement.innerHTML = instructions
        .map(line => `<div>${line}</div>`)
        .join('');
    }
  }
  
  /**
   * 开始游戏循环
   */
  startGameLoop() {
    const renderLoop = () => {
      const gameState = this.gameEngine.getGameState();
      
      // 只在游戏进行中或暂停时渲染
      if (gameState.state === GameState.PLAYING || gameState.state === GameState.PAUSED) {
        if (gameState.state === GameState.PLAYING) {
          this.renderer.render(gameState);
        } else if (gameState.state === GameState.PAUSED) {
          this.renderer.render(gameState);
          this.renderer.drawPauseEffect();
        }
        
        // 更新下一个方块预览
        if (gameState.nextBlock) {
          this.renderer.renderNextBlockPreview(this.elements.nextBlockPreview, gameState.nextBlock);
        }
      }
      
      requestAnimationFrame(renderLoop);
    };
    
    requestAnimationFrame(renderLoop);
  }
}