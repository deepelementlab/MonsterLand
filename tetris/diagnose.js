/**
 * 俄罗斯方块游戏诊断脚本
 * 用于定位和解决问题
 */

async function diagnose() {
    console.log('=== 俄罗斯方块游戏诊断开始 ===');
    
    try {
        // 1. 测试配置文件
        console.log('1. 测试配置文件...');
        const config = await import('./src/config.js');
        console.log('✅ 配置文件导入成功');
        console.log('   GameConfig:', Object.keys(config.GameConfig));
        console.log('   BlockType:', config.BlockType);
        
        // 2. 测试方块模块
        console.log('2. 测试方块模块...');
        const blockModule = await import('./src/block/block.js');
        console.log('✅ 方块模块导入成功');
        
        const factory = new blockModule.BlockFactory();
        const block = factory.createNextBlock();
        console.log(`   ✅ 方块生成: ${block.type} (${block.x}, ${block.y})`);
        
        // 3. 测试游戏网格
        console.log('3. 测试游戏网格...');
        const gridModule = await import('./src/game/grid.js');
        console.log('✅ 游戏网格导入成功');
        
        const grid = new gridModule.GameGrid();
        console.log(`   ✅ 网格创建: ${grid.width}x${grid.height}`);
        
        // 4. 测试游戏引擎
        console.log('4. 测试游戏引擎...');
        const gameModule = await import('./src/game/game.js');
        console.log('✅ 游戏引擎导入成功');
        
        const engine = new gameModule.GameEngine();
        console.log(`   ✅ 引擎状态: ${engine.state}`);
        
        // 5. 测试分数模块
        console.log('5. 测试分数模块...');
        const scoreModule = await import('./src/game/score.js');
        console.log('✅ 分数模块导入成功');
        
        const scoreManager = new scoreModule.ScoreManager();
        console.log(`   ✅ 初始分数: ${scoreManager.getCurrentScore()}`);
        
        // 6. 测试渲染器模块
        console.log('6. 测试渲染器模块...');
        const renderModule = await import('./src/render/canvas-renderer.js');
        console.log('✅ 渲染器模块导入成功');
        
        // 创建测试Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 800;
        
        try {
            const renderer = new renderModule.CanvasRenderer(canvas);
            console.log('   ✅ Canvas渲染器创建成功');
        } catch (error) {
            console.error('   ❌ Canvas渲染器创建失败:', error.message);
        }
        
        // 7. 测试UI控制器
        console.log('7. 测试UI控制器...');
        const uiModule = await import('./src/ui/ui-controller.js');
        console.log('✅ UI控制器模块导入成功');
        
        // 8. 测试主入口模块
        console.log('8. 测试主入口模块...');
        try {
            const mainModule = await import('./src/main.js');
            console.log('✅ 主入口模块导入成功');
        } catch (error) {
            console.error('❌ 主入口模块导入失败:', error.message);
        }
        
        console.log('=== 诊断完成 ===');
        console.log('所有模块导入正常！');
        
        // 检查常见问题
        console.log('\n=== 常见问题检查 ===');
        
        // 检查DOM元素是否存在
        console.log('检查DOM元素...');
        const elements = {
            gameCanvas: document.getElementById('gameCanvas'),
            startButton: document.getElementById('startButton'),
            scoreValue: document.getElementById('scoreValue')
        };
        
        for (const [name, element] of Object.entries(elements)) {
            if (element) {
                console.log(`   ✅ ${name}: 存在`);
            } else {
                console.log(`   ❌ ${name}: 不存在`);
            }
        }
        
        // 检查localStorage
        console.log('检查localStorage支持...');
        try {
            localStorage.setItem('test_diagnose', 'ok');
            const value = localStorage.getItem('test_diagnose');
            localStorage.removeItem('test_diagnose');
            console.log(`   ✅ localStorage: 正常 (${value})`);
        } catch (error) {
            console.log('   ❌ localStorage: 不支持或禁用');
        }
        
        // 检查模块导入路径
        console.log('检查模块导入路径...');
        const paths = [
            'src/config.js',
            'src/block/block.js',
            'src/game/game.js',
            'src/game/grid.js',
            'src/game/score.js',
            'src/render/canvas-renderer.js',
            'src/ui/ui-controller.js',
            'src/main.js'
        ];
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                console.log(`   ✅ ${path}: ${response.ok ? '正常' : '失败'}`);
            } catch (error) {
                console.log(`   ❌ ${path}: 无法访问`);
            }
        }
        
    } catch (error) {
        console.error('诊断过程中出错:', error);
        console.error('错误堆栈:', error.stack);
        
        // 提供具体建议
        console.log('\n=== 问题分析 ===');
        if (error.message.includes('Cannot find module')) {
            console.log('问题: 模块文件缺失或路径错误');
            console.log('建议: 检查文件路径和文件名是否正确');
        } else if (error.message.includes('Unexpected token')) {
            console.log('问题: JavaScript语法错误');
            console.log('建议: 检查代码语法，特别是ES6模块语法');
        } else if (error.message.includes('is not a constructor')) {
            console.log('问题: 类构造函数调用错误');
            console.log('建议: 检查类的导出和导入方式');
        } else {
            console.log(`问题类型: ${error.message}`);
        }
    }
}

// 如果直接从控制台运行
if (typeof window !== 'undefined') {
    window.diagnose = diagnose;
    console.log('诊断脚本已加载，运行 diagnose() 开始诊断');
}

export { diagnose };