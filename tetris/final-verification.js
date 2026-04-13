/**
 * 俄罗斯方块游戏最终验证脚本
 * 用于验证项目完整性和功能可用性
 */

console.log('🧊 俄罗斯方块游戏 - 最终验证开始\n');

// 检测运行环境
console.log('=== 环境检测 ===');
console.log(`浏览器: ${navigator.userAgent}`);
console.log(`当前时间: ${new Date().toLocaleString()}`);

// 游戏模块验证
const testResults = {
    files: {
        passed: 0,
        failed: 0,
        total: 0
    },
    modules: {
        passed: 0,
        failed: 0,
        total: 0
    },
    features: {
        passed: 0,
        failed: 0,
        total: 0
    }
};

// 文件存在性检查
function checkFileExists(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => response.ok)
        .catch(() => false);
}

// 文件大小检查
async function checkFileSize(url) {
    try {
        const response = await fetch(url);
        const content = await response.text();
        return content.length > 0;
    } catch (error) {
        return false;
    }
}

// 验证HTML文件
async function verifyHTML() {
    console.log('\n=== HTML文件验证 ===');
    
    const htmlFiles = [
        { name: 'index.html', path: 'index.html' },
        { name: 'test-game.html', path: 'test-game.html' },
        { name: 'quick-test.html', path: 'quick-test.html' }
    ];
    
    for (const file of htmlFiles) {
        testResults.files.total++;
        try {
            const exists = await checkFileExists(file.path);
            if (exists) {
                console.log(`✅ ${file.name} - 存在`);
                testResults.files.passed++;
            } else {
                console.log(`❌ ${file.name} - 不存在`);
                testResults.files.failed++;
            }
        } catch (error) {
            console.log(`❌ ${file.name} - 检查失败: ${error.message}`);
            testResults.files.failed++;
        }
    }
}

// 验证CSS文件
async function verifyCSS() {
    console.log('\n=== CSS文件验证 ===');
    
    testResults.files.total++;
    try {
        const exists = await checkFileExists('style.css');
        const hasContent = await checkFileSize('style.css');
        
        if (exists && hasContent) {
            console.log(`✅ style.css - 存在且有内容 (${(await fetch('style.css')).text().then(t => t.length)} 字节)`);
            testResults.files.passed++;
        } else if (exists) {
            console.log('⚠️ style.css - 存在但内容可能为空');
            testResults.files.passed++;
        } else {
            console.log('❌ style.css - 不存在');
            testResults.files.failed++;
        }
    } catch (error) {
        console.log(`❌ style.css - 检查失败: ${error.message}`);
        testResults.files.failed++;
    }
}

// 验证JavaScript模块
async function verifyJavaScriptModules() {
    console.log('\n=== JavaScript模块验证 ===');
    
    const modules = [
        { name: '配置模块', path: 'src/config.js' },
        { name: '主入口模块', path: 'src/main.js' },
        { name: '方块模块', path: 'src/block/block.js' },
        { name: '游戏引擎模块', path: 'src/game/game.js' },
        { name: '网格模块', path: 'src/game/grid.js' },
        { name: '分数模块', path: 'src/game/score.js' },
        { name: '渲染器模块', path: 'src/render/canvas-renderer.js' },
        { name: 'UI控制模块', path: 'src/ui/ui-controller.js' }
    ];
    
    for (const module of modules) {
        testResults.modules.total++;
        testResults.files.total++;
        
        try {
            const exists = await checkFileExists(module.path);
            const hasContent = await checkFileSize(module.path);
            
            if (exists && hasContent) {
                console.log(`✅ ${module.name} (${module.path}) - 正常`);
                testResults.modules.passed++;
                testResults.files.passed++;
                
                // 尝试加载模块语法检查
                try {
                    const response = await fetch(module.path);
                    const code = await response.text();
                    if (code.includes('export') || code.includes('import')) {
                        console.log(`   ↳ 使用ES6模块语法`);
                    }
                } catch (e) {
                    // 忽略语法检查错误
                }
            } else if (exists) {
                console.log(`⚠️ ${module.name} - 存在但内容可能为空`);
                testResults.modules.passed++;
                testResults.files.passed++;
            } else {
                console.log(`❌ ${module.name} - 不存在`);
                testResults.modules.failed++;
                testResults.files.failed++;
            }
        } catch (error) {
            console.log(`❌ ${module.name} - 检查失败: ${error.message}`);
            testResults.modules.failed++;
            testResults.files.failed++;
        }
    }
}

// 验证游戏功能特性
async function verifyFeatures() {
    console.log('\n=== 游戏功能特性验证 ===');
    
    const features = [
        { name: 'Canvas支持', test: () => testCanvasSupport() },
        { name: '本地存储支持', test: () => testLocalStorage() },
        { name: '游戏配置加载', test: () => testGameConfig() },
        { name: '方块生成', test: () => testBlockGeneration() },
        { name: '游戏状态管理', test: () => testGameState() }
    ];
    
    for (const feature of features) {
        testResults.features.total++;
        try {
            const result = await feature.test();
            if (result.success) {
                console.log(`✅ ${feature.name} - ${result.message}`);
                testResults.features.passed++;
            } else {
                console.log(`❌ ${feature.name} - ${result.message}`);
                testResults.features.failed++;
            }
        } catch (error) {
            console.log(`❌ ${feature.name} - 测试失败: ${error.message}`);
            testResults.features.failed++;
        }
    }
}

// Canvas支持测试
function testCanvasSupport() {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas');
            const hasCanvas = !!canvas.getContext;
            const has2DContext = hasCanvas && !!canvas.getContext('2d');
            
            resolve({
                success: hasCanvas && has2DContext,
                message: hasCanvas ? 
                    (has2DContext ? '支持Canvas 2D' : '支持Canvas但不支持2D') : 
                    '不支持Canvas'
            });
        } catch (error) {
            resolve({
                success: false,
                message: `测试出错: ${error.message}`
            });
        }
    });
}

// 本地存储测试
function testLocalStorage() {
    return new Promise((resolve) => {
        try {
            const testKey = 'tetris_test_' + Date.now();
            localStorage.setItem(testKey, 'test_value');
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            resolve({
                success: retrieved === 'test_value',
                message: retrieved === 'test_value' ? 
                    '本地存储功能正常' : 
                    '本地存储功能异常'
            });
        } catch (error) {
            resolve({
                success: false,
                message: `本地存储不支持或已禁用: ${error.message}`
            });
        }
    });
}

// 游戏配置测试
async function testGameConfig() {
    try {
        const response = await fetch('src/config.js');
        const configText = await response.text();
        
        const hasGameConfig = configText.includes('GameConfig');
        const hasBlockTypes = configText.includes('BLOCK_COLORS');
        const hasGridConfig = configText.includes('GRID_WIDTH') && configText.includes('GRID_HEIGHT');
        
        return {
            success: hasGameConfig && hasBlockTypes && hasGridConfig,
            message: hasGameConfig ? 
                (hasBlockTypes ? 
                    (hasGridConfig ? '配置完整' : '缺少网格配置') : 
                    '缺少方块配置') : 
                '缺少GameConfig定义'
        };
    } catch (error) {
        return {
            success: false,
            message: `无法读取配置文件: ${error.message}`
        };
    }
}

// 方块生成测试
async function testBlockGeneration() {
    try {
        // 动态导入方块模块
        const blockModule = await import('./src/block/block.js');
        
        if (!blockModule.BlockFactory || !blockModule.Block) {
            return {
                success: false,
                message: '方块模块结构不完整'
            };
        }
        
        const factory = new blockModule.BlockFactory();
        const block = factory.createNextBlock();
        
        if (!block || !block.type || !block.getShape) {
            return {
                success: false,
                message: '方块对象创建失败'
            };
        }
        
        return {
            success: true,
            message: `方块类型: ${block.type}, 位置: (${block.x}, ${block.y})`
        };
    } catch (error) {
        return {
            success: false,
            message: `方块生成测试失败: ${error.message}`
        };
    }
}

// 游戏状态测试
async function testGameState() {
    try {
        const gameModule = await import('./src/game/game.js');
        
        if (!gameModule.GameEngine) {
            return {
                success: false,
                message: '游戏引擎模块不完整'
            };
        }
        
        const engine = new gameModule.GameEngine();
        const gameState = engine.getGameState();
        
        const hasState = gameState && typeof gameState.state === 'string';
        const hasScore = gameState && typeof gameState.score === 'number';
        
        return {
            success: hasState && hasScore,
            message: hasState ? 
                (hasScore ? `游戏状态: ${gameState.state}, 分数: ${gameState.score}` : '缺少分数信息') : 
                '缺少游戏状态信息'
        };
    } catch (error) {
        return {
            success: false,
            message: `游戏状态测试失败: ${error.message}`
        };
    }
}

// 汇总验证结果
function summarizeResults() {
    console.log('\n=== 验证结果汇总 ===');
    
    const totalFiles = testResults.files.total;
    const passedFiles = testResults.files.passed;
    const filePassRate = totalFiles > 0 ? (passedFiles / totalFiles * 100).toFixed(1) : 0;
    
    const totalModules = testResults.modules.total;
    const passedModules = testResults.modules.passed;
    const modulePassRate = totalModules > 0 ? (passedModules / totalModules * 100).toFixed(1) : 0;
    
    const totalFeatures = testResults.features.total;
    const passedFeatures = testResults.features.passed;
    const featurePassRate = totalFeatures > 0 ? (passedFeatures / totalFeatures * 100).toFixed(1) : 0;
    
    console.log(`📁 文件检查: ${passedFiles}/${totalFiles} (${filePassRate}%)`);
    console.log(`⚙️  模块检查: ${passedModules}/${totalModules} (${modulePassRate}%)`);
    console.log(`🎮 功能检查: ${passedFeatures}/${totalFeatures} (${featurePassRate}%)`);
    
    const overallPassRate = (
        (passedFiles + passedModules + passedFeatures) / 
        (totalFiles + totalModules + totalFeatures) * 100
    ).toFixed(1);
    
    console.log(`\n📊 总体通过率: ${overallPassRate}%`);
    
    if (overallPassRate >= 90) {
        console.log('🎉 验证通过！俄罗斯方块游戏准备就绪！');
    } else if (overallPassRate >= 70) {
        console.log('⚠️  验证警告：存在一些问题需要修复');
    } else {
        console.log('❌ 验证失败：需要重大修复');
    }
    
    // 提供下一步建议
    console.log('\n=== 下一步建议 ===');
    if (overallPassRate >= 90) {
        console.log('1. 打开 index.html 开始游戏');
        console.log('2. 运行 test-game.html 进行功能测试');
        console.log('3. 部署到Web服务器或GitHub Pages');
    } else {
        console.log('1. 修复验证失败的项目');
        console.log('2. 重新运行此验证脚本');
        console.log('3. 使用 debug-test.html 进行调试');
    }
}

// 主验证函数
async function runFinalVerification() {
    console.log('🧊 俄罗斯方块游戏最终验证\n');
    console.log('项目路径: ' + window.location.pathname);
    console.log('验证时间: ' + new Date().toISOString());
    
    try {
        await verifyHTML();
        await verifyCSS();
        await verifyJavaScriptModules();
        await verifyFeatures();
        summarizeResults();
    } catch (error) {
        console.error('\n❌ 验证过程中出现错误:', error);
        console.log('\n💡 建议:');
        console.log('1. 确保在Web服务器环境下运行此验证');
        console.log('2. 检查文件路径是否正确');
        console.log('3. 使用浏览器开发者工具查看详细错误');
    }
}

// 如果是浏览器环境，自动运行验证
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // 添加运行按钮到页面
        const runButton = document.createElement('button');
        runButton.textContent = '运行最终验证';
        runButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        runButton.onclick = runFinalVerification;
        document.body.appendChild(runButton);
        
        console.log('✅ 验证脚本已加载，点击右上角按钮运行验证');
    });
}

// 导出验证函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runFinalVerification };
}

console.log('✅ 最终验证脚本加载完成');