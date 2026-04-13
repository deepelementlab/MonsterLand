// 俄罗斯方块游戏验证脚本
console.log('俄罗斯方块游戏验证开始...\n');

// 1. 检查文件结构
console.log('=== 文件结构检查 ===');
const fs = require('fs');
const path = require('path');

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

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
}

console.log('\n=== 文件内容检查 ===');

// 2. 检查index.html基本结构
try {
  const indexContent = fs.readFileSync('index.html', 'utf8');
  
  // 检查关键元素
  const checks = {
    'Canvas元素': indexContent.includes('<canvas id="gameCanvas"'),
    '开始按钮': indexContent.includes('id="startButton"'),
    '分数显示': indexContent.includes('id="scoreValue"'),
    'JavaScript模块': indexContent.includes('<script type="module" src="src/main.js"'),
    'CSS样式': indexContent.includes('<link rel="stylesheet" href="style.css"')
  };
  
  for (const [checkName, result] of Object.entries(checks)) {
    console.log(`${result ? '✅' : '❌'} ${checkName}`);
  }
  
} catch (error) {
  console.log(`❌ index.html 读取失败: ${error.message}`);
}

// 3. 检查配置文件
try {
  const configContent = fs.readFileSync('src/config.js', 'utf8');
  
  const configChecks = {
    'GameConfig导出': configContent.includes('export const GameConfig'),
    '方块类型': configContent.includes('BLOCK_TYPES:') || configContent.includes('BlockType:'),
    '网格尺寸': configContent.includes('GRID_WIDTH:') && configContent.includes('GRID_HEIGHT:'),
    '方块颜色': configContent.includes('BLOCK_COLORS:'),
    '控制配置': configContent.includes('CONTROLS:')
  };
  
  console.log('\n配置文件检查:');
  for (const [checkName, result] of Object.entries(configChecks)) {
    console.log(`${result ? '✅' : '❌'} ${checkName}`);
  }
  
} catch (error) {
  console.log(`❌ config.js 读取失败: ${error.message}`);
}

// 4. 检查JavaScript模块
console.log('\n=== JavaScript模块检查 ===');

const modules = [
  { name: 'config.js', path: 'src/config.js', minSize: 2000 },
  { name: 'main.js', path: 'src/main.js', minSize: 1000 },
  { name: 'block.js', path: 'src/block/block.js', minSize: 3000 },
  { name: 'game.js', path: 'src/game/game.js', minSize: 5000 },
  { name: 'grid.js', path: 'src/game/grid.js', minSize: 3000 },
  { name: 'score.js', path: 'src/game/score.js', minSize: 2000 },
  { name: 'canvas-renderer.js', path: 'src/render/canvas-renderer.js', minSize: 5000 },
  { name: 'ui-controller.js', path: 'src/ui/ui-controller.js', minSize: 4000 }
];

for (const module of modules) {
  try {
    const stats = fs.statSync(module.path);
    const content = fs.readFileSync(module.path, 'utf8');
    const hasExport = content.includes('export') || content.includes('module.exports');
    const sizeOk = stats.size >= module.minSize;
    
    console.log(`${stats.size >= module.minSize && hasExport ? '✅' : '⚠️'} ${module.name} - ${stats.size}字节 ${hasExport ? '有导出' : '无导出'}`);
    
  } catch (error) {
    console.log(`❌ ${module.name} - ${error.message}`);
  }
}

// 5. 检查CSS样式
try {
  const cssContent = fs.readFileSync('style.css', 'utf8');
  const cssSize = fs.statSync('style.css').size;
  
  console.log(`\n=== CSS样式检查 ===`);
  console.log(`${cssSize > 5000 ? '✅' : '⚠️'} style.css - ${cssSize}字节`);
  
  // 检查关键样式
  const cssChecks = {
    '游戏容器': cssContent.includes('.game-container'),
    'Canvas样式': cssContent.includes('#gameCanvas'),
    '按钮样式': cssContent.includes('.btn'),
    '响应式设计': cssContent.includes('@media')
  };
  
  for (const [checkName, result] of Object.entries(cssChecks)) {
    console.log(`${result ? '✅' : '❌'} ${checkName}`);
  }
  
} catch (error) {
  console.log(`❌ style.css 读取失败: ${error.message}`);
}

// 6. 总结
console.log('\n=== 验证总结 ===');
console.log(`项目文件完整性: ${allFilesExist ? '✅ 完整' : '⚠️ 不完整'}`);
console.log('游戏验证完成！');

if (allFilesExist) {
  console.log('\n✅ 游戏基本结构完整，可以运行测试页面进行功能验证。');
  console.log('运行方式:');
  console.log('1. 直接打开 index.html 文件');
  console.log('2. 或打开 test-game.html 进行功能测试');
  console.log('3. 或打开 quick-test.html 进行快速验证');
} else {
  console.log('\n⚠️ 部分文件缺失，请检查项目完整性。');
}