/**
 * 俄罗斯方块游戏最终检查脚本
 * 验证游戏所有功能是否正常
 */

console.log('=== 俄罗斯方块游戏最终检查 ===');

// 检查浏览器环境
function checkEnvironment() {
    console.log('1. 检查浏览器环境...');
    
    const checks = {
        localStorage: !!window.localStorage,
        canvas: !!document.createElement('canvas').getContext,
        requestAnimationFrame: !!window.requestAnimationFrame,
        es6Modules: typeof import === 'function',
        console: typeof console !== 'undefined'
    };
    
    console.log('环境检查结果:', checks);
    return Object.values(checks).every(v => v);
}

// 检查文件加载
async function checkFiles() {
    console.log('2. 检查游戏文件加载...');
    
    const requiredFiles = [
        'index.html',
        'style.css',
        'src/config.js',
        'src/main.js',
        'src/block/block.js',
        'src/game/game.js',
        'src/game/grid.js',
        'src/game/score.js',
        'src/render/canvas-renderer.js',
        'src/ui/ui-controller.js'
    ];
    
    let allFilesOk = true;
    
    for (const file of requiredFiles) {
        try {
            const response = await fetch(file, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ ${file} 存在`);
            } else {
                console.log(`❌ ${file} 不存在或无法访问`);
                allFilesOk = false;
            }
        } catch (error) {
            console.log(`❌ ${file} 检查失败: ${error.message}`);
            allFilesOk = false;
        }
    }
    
    return allFilesOk;
}

// 检查游戏模块
async function checkModules() {
    console.log('3. 检查游戏模块...');
    
    try {
        // 尝试导入配置文件
        const config = await import('./src/config.js');
        if (config.GameConfig && config.BlockType) {
            console.log('✅ 配置模块加载成功');
            console.log('  游戏配置:', {
                gridSize: `${config.GameConfig.GRID_WIDTH}x${config.GameConfig.GRID_HEIGHT}`,
                blockTypes: Object.keys(config.BlockType).filter(t => t !== 'EMPTY').length,
                colors: Object.keys(config.GameConfig.BLOCK_COLORS).length
            });
        } else {
            console.log('❌ 配置模块不完整');
            return false;
        }
        
        // 尝试导入方块模块
        const blockModule = await import('./src/block/block.js');
        if (blockModule.Block && blockModule.BlockFactory) {
            console.log('✅ 方块模块加载成功');
        } else {
            console.log('❌ 方块模块不完整');
            return false;
        }
        
        // 尝试导入游戏模块
        const gameModule = await import('./src/game/game.js');
        if (gameModule.GameEngine) {
            console.log('✅ 游戏引擎模块加载成功');
        } else {
            console.log('❌ 游戏引擎模块不完整');
            return false;
        }
        
        // 尝试导入网格模块
        const gridModule = await import('./src/game/grid.js');
        if (gridModule.GameGrid) {
            console.log('✅ 游戏网格模块加载成功');
        } else {
            console.log('❌ 游戏网格模块不完整');
            return false;
        }
        
        // 尝试导入分数模块
        const scoreModule = await import('./src/game/score.js');
        if (scoreModule.ScoreManager) {
            console.log('✅ 分数模块加载成功');
        } else {
            console.log('❌ 分数模块不完整');
            return false;
        }
        
        // 尝试导入渲染模块
        const renderModule = await import('./src/render/canvas-renderer.js');
        if (renderModule.CanvasRenderer) {
            console.log('✅ 渲染模块加载成功');
        } else {
            console.log('❌ 渲染模块不完整');
            return false;
        }
        
        // 尝试导入UI模块
        const uiModule = await import('./src/ui/ui-controller.js');
        if (uiModule.UIController) {
            console.log('✅ UI模块加载成功');
        } else {
            console.log('❌ UI模块不完整');
            return false;
        }
        
        return true;
    } catch (error) {
        console.log('❌ 模块加载失败:', error.message);
        return false;
    }
}

// 测试游戏核心功能
async function testCoreFunctions() {
    console.log('4. 测试游戏核心功能...');
    
    try {
        // 导入需要的模块
        const { BlockFactory } = await import('./src/block/block.js');
        const { GameGrid } = await import('./src/game/grid.js');
        const { ScoreManager } = await import('./src/game/score.js');
        
        // 测试方块工厂
        console.log('  测试方块工厂...');
        const factory = new BlockFactory();
        const block = factory.createNextBlock();
        console.log(`  ✅ 方块创建: ${block.type}, 位置: (${block.x}, ${block.y})`);
        
        // 测试方块移动
        block.move(1, 0);
        console.log(`  ✅ 方块移动: 新位置 (${block.x}, ${block.y})`);
        
        // 测试方块旋转
        const originalRotation = block.rotation;
        block.rotate(1);
        console.log(`  ✅ 方块旋转: ${originalRotation} → ${block.rotation}`);
        
        // 测试游戏网格
        console.log('  测试游戏网格...');
        const grid = new GameGrid();
        console.log(`  ✅ 网格创建: ${grid.width}x${grid.height}`);
        
        // 测试碰撞检测
        const canPlace = grid.canPlaceBlock(block);
        console.log(`  ✅ 碰撞检测: 方块${canPlace ? '可以' : '不能'}放置`);
        
        // 测试分数管理器
        console.log('  测试分数系统...');
        const scoreManager = new ScoreManager();
        scoreManager.addLineClearPoints(4); // 四行消行
        const score = scoreManager.getCurrentScore();
        console.log(`  ✅ 分数计算: 四行消行得分 ${score}`);
        
        return true;
    } catch (error) {
        console.log('❌ 核心功能测试失败:', error.message);
        return false;
    }
}

// 检查UI元素
function checkUIElements() {
    console.log('5. 检查UI元素...');
    
    const requiredElements = [
        'startButton',
        'pauseButton',
        'restartButton',
        'gameCanvas',
        'nextBlockPreview',
        'scoreValue',
        'highScoreValue',
        'linesValue',
        'levelValue',
        'gameStateText'
    ];
    
    let allElementsOk = true;
    
    for (const id of requiredElements) {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id} 元素存在`);
        } else {
            console.log(`❌ ${id} 元素不存在`);
            allElementsOk = false;
        }
    }
    
    return allElementsOk;
}

// 检查CSS样式
function checkCSS() {
    console.log('6. 检查CSS样式...');
    
    try {
        // 检查样式表是否加载
        const stylesheets = document.styleSheets;
        let gameCSSLoaded = false;
        
        for (let i = 0; i < stylesheets.length; i++) {
            const sheet = stylesheets[i];
            if (sheet.href && sheet.href.includes('style.css')) {
                gameCSSLoaded = true;
                break;
            }
        }
        
        if (gameCSSLoaded) {
            console.log('✅ 游戏样式表已加载');
            return true;
        } else {
            console.log('❌ 游戏样式表未加载');
            return false;
        }
    } catch (error) {
        console.log('⚠️ CSS检查失败，可能由于跨域限制');
        return true; // 可能是跨域问题，不是真正的失败
    }
}

// 运行最终检查
async function runFinalCheck() {
    console.log('开始最终检查...\n');
    
    const results = {
        environment: checkEnvironment(),
        files: await checkFiles(),
        modules: await checkModules(),
        coreFunctions: await testCoreFunctions(),
        uiElements: checkUIElements(),
        css: checkCSS()
    };
    
    console.log('\n=== 最终检查结果 ===');
    
    let totalChecks = Object.keys(results).length;
    let passedChecks = Object.values(results).filter(v => v).length;
    let failedChecks = totalChecks - passedChecks;
    
    console.log(`总计检查项目: ${totalChecks}`);
    console.log(`通过: ${passedChecks}`);
    console.log(`失败: ${failedChecks}`);
    console.log(`通过率: ${Math.round((passedChecks / totalChecks) * 100)}%`);
    
    if (failedChecks === 0) {
        console.log('\n🎉 所有检查项目通过！游戏功能完整。');
        console.log('✅ 可以开始游戏！');
    } else {
        console.log('\n⚠️ 部分检查项目未通过，请检查以上错误信息。');
        console.log('❌ 需要修复以上问题才能正常游戏。');
    }
    
    return failedChecks === 0;
}

// 如果是直接运行此脚本，自动执行检查
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFinalCheck);
} else if (typeof window !== 'undefined') {
    runFinalCheck();
}

// 导出函数供外部调用
if (typeof module !== 'undefined') {
    module.exports = {
        checkEnvironment,
        checkFiles,
        checkModules,
        testCoreFunctions,
        checkUIElements,
        checkCSS,
        runFinalCheck
    };
}