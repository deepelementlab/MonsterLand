// 验证方块位置计算
import { Block } from './src/block/block.js';
import { GameGrid } from './src/game/grid.js';
import { GameConfig } from './src/config.js';

console.log('=== 验证方块位置计算 ===');

// 测试所有方块类型
const blockTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const grid = new GameGrid();

console.log(`网格尺寸: ${grid.width}x${grid.height}`);
console.log('');

for (const type of blockTypes) {
    console.log(`测试方块 ${type}:`);
    
    // 创建方块
    const block = new Block(type);
    
    console.log(`  计算位置: x=${block.x}, y=${block.y}`);
    
    // 获取所有单元格
    const cells = block.getCells();
    console.log(`  单元格数: ${cells.length}`);
    
    // 检查每个单元格
    let invalidCells = [];
    for (const cell of cells) {
        const rowInBounds = cell.row >= -3 && cell.row < grid.height; // 允许部分在顶部之外
        const colInBounds = cell.col >= 0 && cell.col < grid.width;
        
        if (!rowInBounds || !colInBounds) {
            invalidCells.push({
                cell,
                rowInBounds,
                colInBounds
            });
        }
    }
    
    if (invalidCells.length > 0) {
        console.log(`  ❌ 有 ${invalidCells.length} 个单元格无效:`);
        for (const invalid of invalidCells) {
            console.log(`    单元格(${invalid.cell.row},${invalid.cell.col}): 行边界=${invalid.rowInBounds}, 列边界=${invalid.colInBounds}`);
        }
    } else {
        console.log(`  ✅ 所有单元格都在有效范围内`);
    }
    
    // 检查网格能否放置
    const canPlace = grid.canPlaceBlock(block);
    console.log(`  网格能否放置: ${canPlace}`);
    
    // 检查方块自己的isValidPosition方法
    const isValid = block.isValidPosition();
    console.log(`  方块是否有效位置: ${isValid}`);
    
    // 检查差异
    if (canPlace !== isValid) {
        console.log(`  ⚠️ 警告: 两个方法返回不同结果!`);
        console.log(`    网格canPlaceBlock: ${canPlace}`);
        console.log(`    方块isValidPosition: ${isValid}`);
        
        // 分析原因
        console.log(`    分析: 可能是网格方法对顶部之外的处理不同`);
    }
    
    console.log('');
}

// 特别测试I方块的问题
console.log('=== 特别测试I方块 ===');
const iBlock = new Block('I');
console.log(`I方块位置: x=${iBlock.x}, y=${iBlock.y}`);
console.log(`I方块形状矩阵:`);
const shape = iBlock.getShape();
for (let row = 0; row < 4; row++) {
    console.log(`  ${shape[row].join(' ')}`);
}
console.log(`I方块单元格:`, iBlock.getCells().map(c => `(${c.row},${c.col})`).join(', '));

// 检查网格方法对新方块的处理
console.log('\n=== 测试网格canPlaceBlock方法 ===');
const testBlock = new Block('I');
console.log(`测试方块: ${testBlock.type} (${testBlock.x}, ${testBlock.y})`);
const cells = testBlock.getCells();

console.log('网格检查每个单元格:');
for (const cell of cells) {
    const isEmpty = grid.isEmpty(cell.row, cell.col);
    console.log(`  单元格(${cell.row},${cell.col}): isEmpty=${isEmpty}`);
    
    // 网格isEmpty方法的检查
    if (cell.row < 0 || cell.row >= grid.height || cell.col < 0 || cell.col >= grid.width) {
        console.log(`    注意: 单元格${cell.row < 0 ? '在顶部之上' : cell.col < 0 ? '在左边界之外' : cell.col >= grid.width ? '在右边界之外' : '在底部之下'}`);
    }
}

const finalCanPlace = grid.canPlaceBlock(testBlock);
console.log(`最终canPlaceBlock结果: ${finalCanPlace}`);

// 检查游戏启动时会发生什么
console.log('\n=== 模拟游戏启动 ===');
console.log('当游戏启动时，spawnNewBlock()会检查当前方块能否放置');
console.log('如果不能放置，游戏立即结束（gameOver()）');
console.log('这意味着玩家看不到任何方块，游戏就结束了。');

// 建议修复
console.log('\n=== 建议修复 ===');
console.log('1. 确保方块初始位置计算正确');
console.log('2. 修改网格的canPlaceBlock方法，允许新方块部分在顶部之外');
console.log('3. 修改网格的isEmpty方法，对row<0的情况返回true（允许放置）');
console.log('4. 或者修改spawnNewBlock逻辑，不立即检查游戏结束');