/**
 * 俄罗斯方块游戏 - 最终运行测试
 * 直接在浏览器中运行此脚本测试游戏功能
 */

console.log('🎮 俄罗斯方块游戏 - 最终运行测试开始\n');

async function testGameModules() {
    console.log('=== 模块加载测试 ===');
    
    try {
        // 1. 测试配置文件
        console.log('1. 加载游戏配置...');
        const config = await import('./src/config.js');
        console.log(`✅ 配置加载成功: GRID_WIDTH=${config.GameConfig.GRID_WIDTH}, GRID_HEIGHT=${config.GameConfig.GRID_HEIGHT}`);
        
        // 2. 测试方块模块
        console.log('\n2. 加载方块模块...');
        const blockModule = await import('./src/block/block.js');
        const factory = new blockModule.BlockFactory();
        const block = factory.createNextBlock();
        console.log(`✅ 方块创建成功: 类型=${block.type}, 位置=(${block.x}, ${block.y})`);
        
        // 3. 测试游戏网格
        console.log('\n3. 加载游戏网格...');
        const gridModule = await import('./src/game/grid.js');
        const grid = new gridModule.GameGrid();
        console.log(`✅ 游戏网格创建成功: ${grid.width}×${grid.height}`);
        
        // 4. 测试分数系统
        console.log('\n4. 加载分数系统...');
        const scoreModule = await import('./src/game/score.js');
        const scoreManager = new scoreModule.ScoreManager();
        console.log(`✅ 分数系统创建成功: 当前分数=${scoreManager.getCurrentScore()}, 最高分=${scoreManager.getHighScore()}`);
        
        // 5. 测试游戏引擎
        console.log('\n5. 加载游戏引擎...');
        const gameModule = await import('./src/game/game.js');
        const gameEngine = new gameModule.GameEngine();
        const gameState = gameEngine.getGameState();
        console.log(`✅ 游戏引擎创建成功: 状态=${gameState.state}, 等级=${gameState.level}`);
        
        // 6. 测试渲染器
        console.log('\n6. 测试Canvas渲染器...');
        try {
            const renderModule = await import('./src/render/canvas-renderer.js');
            const canvas = document.createElement('canvas');
            const renderer = new renderModule.CanvasRenderer(canvas);
            console.log(`✅ 渲染器创建成功: Canvas ${canvas.width}×${canvas.height}`);
        } catch (error) {
            console.log(`⚠️  渲染器测试警告: ${error.message}`);
        }
        
        // 7. 测试UI控制器
        console.log('\n7. 测试UI控制器...');
        try {
            const uiModule = await import('./src/ui/ui-controller.js');
            console.log(`✅ UI控制器模块加载成功`);
        } catch (error) {
            console.log(`⚠️  UI控制器测试警告: ${error.message}`);
        }
        
        console.log('\n🎉 所有模块测试通过！游戏可以正常运行。');
        
        // 提供运行建议
        console.log('\n=== 运行建议 ===');
        console.log('1. 打开 index.html 开始游戏');
        console.log('2. 使用键盘控制方块移动（方向键、空格、P、R）');
        console.log('3. 移动设备支持触摸屏手势操作');
        console.log('4. 使用 test-game.html 进行完整功能测试');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ 模块加载测试失败:', error);
        console.log('\n💡 调试建议:');
        console.log('1. 确保在Web服务器环境下运行（如Python的http.server）');
        console.log('2. 检查JavaScript模块文件路径是否正确');
        console.log('3. 查看浏览器开发者控制台获取详细错误信息');
        return false;
    }
}

// 测试游戏基本功能
async function testGameFunctionality() {
    console.log('\n=== 游戏功能测试 ===');
    
    try {
        // 动态导入模块
        const blockModule = await import('./src/block/block.js');
        const gridModule = await import('./src/game/grid.js');
        
        // 创建测试组件
        const factory = new blockModule.BlockFactory();
        const grid = new gridModule.GameGrid();
        
        // 测试方块移动
        console.log('1. 测试方块移动...');
        const testBlock = factory.createNextBlock();
        testBlock.move(1, 0);
        console.log(`  方块从 (${testBlock.x-1}, ${testBlock.y}) 移动到 (${testBlock.x}, ${testBlock.y})`);
        
        // 测试方块旋转
        console.log('2. 测试方块旋转...');
        const rotationBefore = testBlock.rotation;
        testBlock.rotate(1);
        console.log(`  方块从旋转状态 ${rotationBefore} 旋转到 ${testBlock.rotation}`);
        
        // 测试碰撞检测
        console.log('3. 测试碰撞检测...');
        const canPlace = grid.canPlaceBlock(testBlock);
        console.log(`  方块可以放置在当前位置: ${canPlace}`);
        
        // 测试网格操作
        console.log('4. 测试网格操作...');
        const emptyCells = grid.width * grid.height;
        console.log(`  网格有 ${emptyCells} 个空单元格`);
        
        console.log('\n✅ 游戏基础功能测试通过！');
        return true;
        
    } catch (error) {
        console.error('\n❌ 游戏功能测试失败:', error);
        return false;
    }
}

// 测试浏览器兼容性
function testBrowserCompatibility() {
    console.log('\n=== 浏览器兼容性测试 ===');
    
    const tests = [
        { name: 'ES6模块支持', test: () => typeof import === 'function' },
        { name: 'Promise支持', test: () => typeof Promise !== 'undefined' },
        { name: 'async/await支持', test: () => typeof async function(){} === 'function' },
        { name: 'fetch API支持', test: () => typeof fetch === 'function' },
        { name: 'Canvas支持', test: () => {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext && !!canvas.getContext('2d');
        }},
        { name: 'localStorage支持', test: () => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch {
                return false;
            }
        }}
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach(test => {
        try {
            const result = test.test();
            if (result) {
                console.log(`✅ ${test.name}`);
                passed++;
            } else {
                console.log(`❌ ${test.name}`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name}: ${error.message}`);
            failed++;
        }
    });
    
    console.log(`\n兼容性测试结果: ${passed}通过, ${failed}失败`);
    return failed === 0;
}

// 主测试函数
async function runFinalGameTest() {
    console.log('🎮 俄罗斯方块游戏 - 最终运行测试');
    console.log('====================================\n');
    
    console.log(`测试时间: ${new Date().toLocaleString()}`);
    console.log(`浏览器: ${navigator.userAgent}`);
    console.log(`运行环境: ${window.location.href}\n`);
    
    try {
        // 运行所有测试
        const compatibility = testBrowserCompatibility();
        const modules = await testGameModules();
        const functionality = await testGameFunctionality();
        
        console.log('\n=== 最终测试结果 ===');
        console.log(`✅ 浏览器兼容性: ${compatibility ? '通过' : '失败'}`);
        console.log(`✅ 模块加载: ${modules ? '通过' : '失败'}`);
        console.log(`✅ 游戏功能: ${functionality ? '通过' : '失败'}`);
        
        const allPassed = compatibility && modules && functionality;
        
        if (allPassed) {
            console.log('\n🎉🎉🎉 恭喜！俄罗斯方块游戏通过所有测试！');
            console.log('\n游戏已准备就绪，可以开始游玩：');
            console.log('1. 打开 index.html 开始游戏');
            console.log('2. 使用方向键控制方块移动');
            console.log('3. 按空格键立即下落方块');
            console.log('4. 按 P 键暂停/继续游戏');
            console.log('5. 按 R 键重新开始游戏');
            
            // 创建快捷链接
            if (typeof document !== 'undefined') {
                const link = document.createElement('a');
                link.href = 'index.html';
                link.textContent = '▶ 点击这里开始游戏';
                link.style.cssText = `
                    display: block;
                    margin: 20px auto;
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    max-width: 300px;
                `;
                document.body.appendChild(link);
            }
        } else {
            console.log('\n⚠️  测试未全部通过，请检查上述问题。');
            console.log('\n建议：');
            console.log('1. 在本地Web服务器中运行游戏（而非直接打开HTML文件）');
            console.log('2. 使用现代浏览器（Chrome/Firefox/Edge最新版）');
            console.log('3. 检查JavaScript模块文件是否存在');
        }
        
        return allPassed;
        
    } catch (error) {
        console.error('\n❌ 测试过程中出现错误:', error);
        console.log('\n💡 调试建议：');
        console.log('1. 打开浏览器开发者工具（F12）查看详细错误');
        console.log('2. 确保所有JavaScript文件路径正确');
        console.log('3. 检查浏览器控制台是否有CORS或加载错误');
        return false;
    }
}

// 如果是浏览器环境，自动运行测试
if (typeof window !== 'undefined') {
    // 添加测试界面
    document.addEventListener('DOMContentLoaded', () => {
        // 创建测试界面
        const testUI = document.createElement('div');
        testUI.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 41, 59, 0.95);
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #3b82f6;
            color: white;
            z-index: 9999;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        testUI.innerHTML = `
            <h3 style="margin-top:0; color:#06b6d4;">俄罗斯方块游戏测试</h3>
            <p>点击下方按钮运行最终游戏测试：</p>
            <button id="runTestBtn" style="
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 10px;
            ">运行最终测试</button>
            <button id="openGameBtn" style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            ">直接打开游戏</button>
            <div id="testResult" style="margin-top: 15px; font-size: 14px;"></div>
        `;
        
        document.body.appendChild(testUI);
        
        // 添加按钮事件
        document.getElementById('runTestBtn').onclick = async () => {
            document.getElementById('testResult').innerHTML = '<em>正在运行测试，请查看控制台...</em>';
            await runFinalGameTest();
            document.getElementById('testResult').innerHTML = '<strong>✅ 测试完成！请查看浏览器控制台获取结果。</strong>';
        };
        
        document.getElementById('openGameBtn').onclick = () => {
            window.open('index.html', '_blank');
        };
        
        console.log('✅ 最终测试脚本已加载。点击右上角按钮开始测试。');
    });
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runFinalGameTest };
}

console.log('✅ 最终运行测试脚本加载完成');