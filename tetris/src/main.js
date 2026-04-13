/**
 * 俄罗斯方块游戏主入口文件
 * 初始化游戏并启动
 */

import { GameEngine } from './game/game.js';
import { CanvasRenderer } from './render/canvas-renderer.js';
import { UIController } from './ui/ui-controller.js';
import { GameState } from './config.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const elements = {
    // Canvas相关
    gameCanvas: document.getElementById('gameCanvas'),
    
    // 按钮
    startButton: document.getElementById('startButton'),
    pauseButton: document.getElementById('pauseButton'),
    restartButton: document.getElementById('restartButton'),
    
    // 显示元素
    nextBlockPreview: document.getElementById('nextBlockPreview'),
    scoreValue: document.getElementById('scoreValue'),
    highScoreValue: document.getElementById('highScoreValue'),
    linesValue: document.getElementById('linesValue'),
    levelValue: document.getElementById('levelValue'),
    gameStateText: document.getElementById('gameStateText'),
    speedValue: document.getElementById('speedValue'),
    timeValue: document.getElementById('timeValue'),
    
    // 其他UI元素
    instructions: document.getElementById('instructions'),
    messageElement: document.getElementById('messagePopup'),
    gameOverlay: document.getElementById('gameOverlay'),
    statusMessage: document.getElementById('statusMessage')
  };
  
  // 初始化游戏组件
  const gameEngine = new GameEngine();
  const renderer = new CanvasRenderer(elements.gameCanvas);
  const uiController = new UIController(elements, gameEngine, renderer);
  
  // 启动游戏渲染循环
  uiController.startGameLoop();
  
  // 初始化UI
  uiController.updateUI();
  uiController.updateControlInstructions();
  
  // 显示欢迎消息
  setTimeout(() => {
    uiController.showMessage('欢迎来到俄罗斯方块！按Enter开始游戏');
  }, 500);
  
  // 游戏时间计时器
  let gameStartTime = 0;
  let gameTimer = null;
  
  // 更新游戏时间显示
  function updateGameTime() {
    if (gameEngine.state === GameState.PLAYING) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - gameStartTime) / 1000);
      
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = elapsedTime % 60;
      
      elements.timeValue.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  // 监听游戏状态变化来启动/停止计时器
  gameEngine.setOnStateChange((state) => {
    if (state === GameState.PLAYING) {
      // 游戏开始，启动计时器
      gameStartTime = Date.now();
      if (gameTimer) clearInterval(gameTimer);
      gameTimer = setInterval(updateGameTime, 1000);
    } else if (state === GameState.GAME_OVER || state === GameState.PAUSED) {
      // 游戏结束或暂停，停止计时器
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
    }
    
    // 更新状态消息显示
    if (state === GameState.GAME_OVER) {
      elements.statusMessage.textContent = '游戏结束！';
      elements.gameOverlay.style.display = 'flex';
    } else if (state === GameState.PAUSED) {
      elements.statusMessage.textContent = '游戏暂停';
      elements.gameOverlay.style.display = 'flex';
    } else {
      elements.gameOverlay.style.display = 'none';
    }
  });
  
  // 设置游戏窗口失去焦点时自动暂停
  window.addEventListener('blur', () => {
    if (gameEngine.state === GameState.PLAYING) {
      gameEngine.togglePause();
    }
  });
  
  // 设置游戏窗口获得焦点时恢复（如果之前是暂停状态）
  window.addEventListener('focus', () => {
    // 可选：可以在这里添加恢复逻辑
  });
  
  // 防止页面滚动（当使用空格键时）
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  });
  
  // 触摸设备支持（移动端）
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }
  });
  
  document.addEventListener('touchend', (event) => {
    if (event.changedTouches.length === 1) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 30;
      
      // 检测滑动方向
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // 向右滑动
            gameEngine.moveCurrentBlock(1, 0);
          } else {
            // 向左滑动
            gameEngine.moveCurrentBlock(-1, 0);
          }
        }
      } else {
        // 垂直滑动
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            // 向下滑动
            gameEngine.softDrop();
          } else {
            // 向上滑动（旋转）
            gameEngine.rotateCurrentBlock(1);
          }
        }
      }
    }
  });
  
  // 双击硬降
  let lastTapTime = 0;
  document.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      // 双击
      gameEngine.hardDrop();
    }
    
    lastTapTime = currentTime;
  });
  
  // 调试信息（开发阶段）
  console.log('俄罗斯方块游戏已加载完成！');
  console.log('游戏组件:', {
    gameEngine: !!gameEngine,
    renderer: !!renderer,
    uiController: !!uiController
  });
  
  // 公开到全局对象以便调试
  window.tetris = {
    gameEngine,
    renderer,
    uiController
  };
});