/**
 * 调试测试文件 - 直接运行以检查模块问题
 */

console.log('开始调试俄罗斯方块游戏...');

try {
  // 测试导入模块
  console.log('尝试导入 config.js...');
  const configModule = await import('./src/config.js');
  console.log('✅ config.js 导入成功');
  console.log('GameConfig:', configModule.GameConfig);
  console.log('GameState:', configModule.GameState);
  
  console.log('尝试导入 block/block.js...');
  const blockModule = await import('./src/block/block.js');
  console.log('✅ block/block.js 导入成功');
  console.log('Block:', blockModule.Block);
  console.log('BlockFactory:', blockModule.BlockFactory);
  
  console.log('尝试导入 game/game.js...');
  const gameModule = await import('./src/game/game.js');
  console.log('✅ game/game.js 导入成功');
  console.log('GameEngine:', gameModule.GameEngine);
  
  console.log('尝试导入 game/grid.js...');
  const gridModule = await import('./src/game/grid.js');
  console.log('✅ game/grid.js 导入成功');
  console.log('GameGrid:', gridModule.GameGrid);
  
  console.log('尝试导入 game/score.js...');
  const scoreModule = await import('./src/game/score.js');
  console.log('✅ game/score.js 导入成功');
  console.log('ScoreManager:', scoreModule.ScoreManager);
  
  console.log('尝试导入 render/canvas-renderer.js...');
  const renderModule = await import('./src/render/canvas-renderer.js');
  console.log('✅ render/canvas-renderer.js 导入成功');
  console.log('CanvasRenderer:', renderModule.CanvasRenderer);
  
  console.log('尝试导入 ui/ui-controller.js...');
  const uiModule = await import('./src/ui/ui-controller.js');
  console.log('✅ ui/ui-controller.js 导入成功');
  console.log('UIController:', uiModule.UIController);
  
  console.log('所有模块导入成功！');
  
  // 测试实例化
  console.log('\n测试实例化游戏引擎...');
  const gameEngine = new gameModule.GameEngine();
  console.log('✅ GameEngine 实例化成功');
  console.log('初始状态:', gameEngine.state);
  
  // 测试方块工厂
  console.log('\n测试方块工厂...');
  const blockFactory = new blockModule.BlockFactory();
  const block = blockFactory.createNextBlock();
  console.log('✅ 方块创建成功');
  console.log('方块类型:', block.type);
  console.log('方块位置:', block.x, block.y);
  
  // 测试游戏网格
  console.log('\n测试游戏网格...');
  const gameGrid = new gridModule.GameGrid();
  console.log('✅ GameGrid 实例化成功');
  console.log('网格尺寸:', gameGrid.width, 'x', gameGrid.height);
  
  // 测试分数管理器
  console.log('\n测试分数管理器...');
  const scoreManager = new scoreModule.ScoreManager();
  console.log('✅ ScoreManager 实例化成功');
  console.log('初始分数:', scoreManager.getCurrentScore());
  
  console.log('\n🎉 所有核心模块测试通过！游戏应该可以正常运行。');
  
} catch (error) {
  console.error('❌ 调试过程中出错:', error);
  console.error('错误堆栈:', error.stack);
  
  // 提供更详细的错误信息
  if (error.message.includes('Cannot find module') || error.message.includes('Failed to fetch')) {
    console.error('\n可能的原因:');
    console.error('1. 文件路径不正确');
    console.error('2. 文件不存在');
    console.error('3. 服务器不允许加载本地文件');
    console.error('4. ES模块导入语句有错误');
  }
}