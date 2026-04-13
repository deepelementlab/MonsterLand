/**
 * 修复俄罗斯方块游戏的主文件问题
 * 这个文件替代原来的src/main.js，提供更简单的初始化
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化游戏...');
    
    // 获取DOM元素
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
        timeValue: document.getElementById('timeValue')
    };
    
    console.log('获取到的元素:', elements);
    
    // 检查元素是否存在
    if (!elements.gameCanvas) {
        console.error('❌ 错误: 找不到gameCanvas元素');
        alert('错误: 找不到游戏Canvas元素。请检查HTML结构。');
        return;
    }
    
    if (!elements.startButton) {
        console.error('❌ 错误: 找不到startButton元素');
        alert('错误: 找不到开始按钮。请检查HTML结构。');
        return;
    }
    
    // 游戏状态
    let gameEngine = null;
    let renderer = null;
    let isInitialized = false;
    
    // 初始化游戏
    async function initializeGame() {
        try {
            console.log('开始初始化游戏模块...');
            
            // 动态导入所有模块
            console.log('导入 config.js...');
            const configModule = await import('./src/config.js');
            console.log('✅ config.js 导入成功');
            
            console.log('导入 block/block.js...');
            const blockModule = await import('./src/block/block.js');
            console.log('✅ block/block.js 导入成功');
            
            console.log('导入 game/grid.js...');
            const gridModule = await import('./src/game/grid.js');
            console.log('✅ game/grid.js 导入成功');
            
            console.log('导入 game/score.js...');
            const scoreModule = await import('./src/game/score.js');
            console.log('✅ game/score.js 导入成功');
            
            console.log('导入 game/game.js...');
            const gameModule = await import('./src/game/game.js');
            console.log('✅ game/game.js 导入成功');
            
            console.log('导入 render/canvas-renderer.js...');
            const renderModule = await import('./src/render/canvas-renderer.js');
            console.log('✅ render/canvas-renderer.js 导入成功');
            
            console.log('导入 ui/ui-controller.js...');
            const uiModule = await import('./src/ui/ui-controller.js');
            console.log('✅ ui/ui-controller.js 导入成功');
            
            // 创建游戏实例
            console.log('创建游戏引擎...');
            gameEngine = new gameModule.GameEngine();
            
            // 创建渲染器
            console.log('创建Canvas渲染器...');
            renderer = new renderModule.CanvasRenderer(elements.gameCanvas);
            
            // 创建UI控制器
            console.log('创建UI控制器...');
            const uiController = new uiModule.UIController(elements, gameEngine, renderer);
            
            // 设置游戏状态回调
            gameEngine.setOnStateChange((state) => {
                console.log('游戏状态改变:', state);
                updateGameStateDisplay(state);
                
                // 根据状态更新渲染
                const gameState = gameEngine.getGameState();
                renderer.render(gameState);
                
                if (state === 'game_over') {
                    renderer.drawGameOverEffect();
                } else if (state === 'paused') {
                    renderer.drawPauseEffect();
                }
            });
            
            gameEngine.setOnScoreUpdate((score, highScore) => {
                updateScoreDisplay(score, highScore);
            });
            
            // 初始渲染
            const initialGameState = gameEngine.getGameState();
            renderer.render(initialGameState);
            
            // 绑定按钮事件
            bindButtonEvents(uiController);
            
            isInitialized = true;
            console.log('🎉 游戏初始化完成！');
            
            // 显示欢迎消息
            showMessage('游戏加载完成！点击"开始游戏"按钮开始。');
            
        } catch (error) {
            console.error('❌ 游戏初始化失败:', error);
            console.error('错误堆栈:', error.stack);
            showMessage(`游戏初始化失败: ${error.message}`, 5000);
            
            // 提供更详细的错误信息
            if (error.message.includes('Cannot find module') || error.message.includes('Failed to fetch')) {
                console.error('\n可能的解决方案:');
                console.error('1. 通过本地服务器运行（如Live Server）');
                console.error('2. 检查文件路径是否正确');
                console.error('3. 检查所有.js文件是否存在');
            }
        }
    }
    
    // 更新游戏状态显示
    function updateGameStateDisplay(state) {
        if (elements.gameStateText) {
            const stateText = {
                'initial': '准备开始',
                'playing': '进行中',
                'paused': '已暂停',
                'game_over': '游戏结束'
            };
            elements.gameStateText.textContent = stateText[state] || state;
        }
    }
    
    // 更新分数显示
    function updateScoreDisplay(score, highScore) {
        if (elements.scoreValue) {
            elements.scoreValue.textContent = score.toString().padStart(6, '0');
        }
        if (elements.highScoreValue) {
            elements.highScoreValue.textContent = highScore.toString().padStart(6, '0');
        }
    }
    
    // 绑定按钮事件
    function bindButtonEvents(uiController) {
        // 开始按钮
        elements.startButton.addEventListener('click', () => {
            console.log('开始按钮点击');
            if (gameEngine) {
                gameEngine.start();
            }
        });
        
        // 暂停按钮
        elements.pauseButton.addEventListener('click', () => {
            console.log('暂停按钮点击');
            if (gameEngine) {
                gameEngine.togglePause();
            }
        });
        
        // 重新开始按钮
        elements.restartButton.addEventListener('click', () => {
            console.log('重新开始按钮点击');
            if (gameEngine) {
                gameEngine.reset();
                gameEngine.start();
            }
        });
    }
    
    // 显示消息
    function showMessage(message, duration = 3000) {
        console.log('消息:', message);
        // 可以在这里添加UI消息显示逻辑
        alert(message); // 暂时用alert，实际项目中应该用更优雅的方式
    }
    
    // 键盘控制
    document.addEventListener('keydown', (event) => {
        if (!gameEngine) return;
        
        // 防止空格键滚动页面
        if (event.code === 'Space') {
            event.preventDefault();
        }
        
        const key = event.key.toLowerCase();
        console.log('按键:', event.key, 'code:', event.code);
        
        switch(event.code) {
            case 'ArrowLeft':
                gameEngine.moveCurrentBlock(-1, 0);
                break;
            case 'ArrowRight':
                gameEngine.moveCurrentBlock(1, 0);
                break;
            case 'ArrowUp':
                gameEngine.rotateCurrentBlock(1);
                break;
            case 'ArrowDown':
                gameEngine.softDrop();
                break;
            case 'Space':
                gameEngine.hardDrop();
                break;
            case 'KeyP':
                gameEngine.togglePause();
                break;
            case 'KeyR':
                gameEngine.reset();
                gameEngine.start();
                break;
            case 'Enter':
                if (gameEngine.state === 'initial' || gameEngine.state === 'game_over') {
                    gameEngine.start();
                }
                break;
        }
        
        // 更新渲染
        if (renderer && gameEngine) {
            const gameState = gameEngine.getGameState();
            renderer.render(gameState);
        }
    });
    
    // 开始初始化
    console.log('开始游戏初始化流程...');
    initializeGame();
});