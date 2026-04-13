/**
 * 俄罗斯方块游戏主入口文件（修复版）
 */

console.log('俄罗斯方块游戏开始加载...');

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM加载完成，开始初始化游戏...');
  
  try {
    // 1. 导入所有模块
    console.log('导入 config.js...');
    const configModule = await import('./config.js');
    const GameState = configModule.GameState;
    console.log('✅ config.js 导入成功');
    
    console.log('导入 game/game.js...');
    const gameModule = await import('./game/game.js');
    const GameEngine = gameModule.GameEngine;
    console.log('✅ game/game.js 导入成功');
    
    console.log('导入 render/canvas-renderer.js...');
    const renderModule = await import('./render/canvas-renderer.js');
    const CanvasRenderer = renderModule.CanvasRenderer;
    console.log('✅ canvas-renderer.js 导入成功');
    
    console.log('导入 ui/ui-controller.js...');
    const uiModule = await import('./ui/ui-controller.js');
    const UIController = uiModule.UIController;
    console.log('✅ ui-controller.js 导入成功');
    
    // 2. 获取DOM元素
    console.log('获取DOM元素...');
    const elements = {
      gameCanvas: document.getElementById('gameCanvas'),
      startButton: document.getElementById('startButton'),
      pauseButton: document.getElementById('pauseButton'),
      restartButton: document.getElementById('restartButton'),
      nextBlockPreview: document.getElementById('nextBlockPreview'),
      scoreValue: document.getElementById('scoreValue'),
      highScoreValue: document.getElementById('highScoreValue'),
      linesValue: document.getElementById('linesValue'),
      levelValue: document.getElementById('levelValue'),
      gameStateText: document.getElementById('gameStateText'),
      speedValue: document.getElementById('speedValue'),
      timeValue: document.getElementById('timeValue'),
      instructions: document.getElementById('instructions'),
      messageElement: document.getElementById('messagePopup'),
      gameOverlay: document.getElementById('gameOverlay'),
      statusMessage: document.getElementById('statusMessage')
    };
    
    // 检查必要元素是否存在
    if (!elements.gameCanvas) {
      throw new Error('找不到gameCanvas元素');
    }
    if (!elements.startButton) {
      throw new Error('找不到startButton元素');
    }
    
    console.log('✅ 所有DOM元素获取成功');
    
    // 3. 初始化游戏组件
    console.log('初始化游戏引擎...');
    const gameEngine = new GameEngine();
    
    console.log('初始化Canvas渲染器...');
    const renderer = new CanvasRenderer(elements.gameCanvas);
    
    console.log('初始化UI控制器...');
    const uiController = new UIController(elements, gameEngine, renderer);
    
    // 4. 启动游戏循环
    console.log('启动游戏循环...');
    uiController.startGameLoop();
    
    // 5. 初始化UI
    console.log('初始化UI...');
    uiController.updateUI();
    uiController.updateControlInstructions();
    
    // 6. 显示欢迎消息
    setTimeout(() => {
      uiController.showMessage('欢迎来到俄罗斯方块！按Enter开始游戏');
    }, 500);
    
    // 7. 游戏时间计时器
    let gameStartTime = 0;
    let gameTimer = null;
    
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
    
    // 8. 监听游戏状态变化
    gameEngine.setOnStateChange((state) => {
      console.log('游戏状态改变:', state);
      
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
    
    // 9. 设置窗口事件
    window.addEventListener('blur', () => {
      if (gameEngine.state === GameState.PLAYING) {
        gameEngine.togglePause();
      }
    });
    
    // 10. 防止页面滚动
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
      }
    });
    
    // 11. 触摸设备支持
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTime = 0;
    
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
              gameEngine.moveCurrentBlock(1, 0);
            } else {
              gameEngine.moveCurrentBlock(-1, 0);
            }
          }
        } else {
          // 垂直滑动
          if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
              gameEngine.softDrop();
            } else {
              gameEngine.rotateCurrentBlock(1);
            }
          }
        }
        
        // 双击硬降
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        
        if (tapLength < 300 && tapLength > 0) {
          gameEngine.hardDrop();
        }
        
        lastTapTime = currentTime;
      }
    });
    
    // 12. 调试信息和全局访问
    console.log('🎉 俄罗斯方块游戏初始化完成！');
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
    
  } catch (error) {
    console.error('❌ 游戏初始化失败:', error);
    console.error('错误堆栈:', error.stack);
    
    // 显示用户友好的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(239, 68, 68, 0.9);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      z-index: 10000;
      max-width: 500px;
    `;
    
    errorDiv.innerHTML = `
      <h2>游戏加载失败</h2>
      <p><strong>错误:</strong> ${error.message}</p>
      <p>请检查以下可能的原因:</p>
      <ul style="text-align: left; margin: 15px 0;">
        <li>1. 通过本地服务器运行（如Live Server）而不是直接打开文件</li>
        <li>2. 检查浏览器控制台获取详细错误信息</li>
        <li>3. 确保所有.js文件都存在</li>
        <li>4. 尝试刷新页面</li>
      </ul>
      <p>打开浏览器开发者工具（按F12）查看控制台错误。</p>
    `;
    
    document.body.appendChild(errorDiv);
  }
});