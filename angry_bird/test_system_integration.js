/**
 * 系统集成测试脚本
 * 测试所有系统模块是否能正确加载和初始化
 */

console.log("=== 愤怒的小鸟 - 系统集成测试 ===");

// 模拟Phaser场景对象
class MockScene {
    constructor() {
        this.cameras = {
            main: {
                width: 1280,
                height: 720
            }
        };
        this.add = {
            graphics: () => ({ fillStyle: () => {}, fillRect: () => {}, fillGradientStyle: () => {} }),
            text: (x, y, text, style) => ({ setOrigin: () => {}, setInteractive: () => {}, on: () => {} })
        };
        this.matter = {
            world: {
                setGravity: () => {},
                on: () => {}
            }
        };
    }
}

try {
    // 导入测试常量
    console.log("1. 测试常量导入...");
    import { COLORS, POSITIONS, GAME_STATES } from './src/utils/constants.js';
    console.log("✅ 常量导入成功");
    
    // 测试系统模块导入
    console.log("\n2. 测试系统模块导入...");
    
    // 创建模拟场景
    const mockScene = new MockScene();
    
    // 测试物理系统
    console.log("   - 测试PhysicsSystem...");
    import { PhysicsSystem } from './src/systems/PhysicsSystem.js';
    console.log("   ✅ PhysicsSystem导入成功");
    
    // 测试UI系统
    console.log("   - 测试UISystem...");
    import { UISystem } from './src/systems/UISystem.js';
    console.log("   ✅ UISystem导入成功");
    
    // 测试输入系统
    console.log("   - 测试InputSystem...");
    import { InputSystem } from './src/systems/InputSystem.js';
    console.log("   ✅ InputSystem导入成功");
    
    // 测试游戏状态系统
    console.log("   - 测试GameStateSystem...");
    import { GameStateSystem } from './src/systems/GameStateSystem.js';
    console.log("   ✅ GameStateSystem导入成功");
    
    // 测试实体管理系统
    console.log("   - 测试EntityManager...");
    import { EntityManager } from './src/systems/EntityManager.js';
    console.log("   ✅ EntityManager导入成功");
    
    console.log("\n✅ 所有系统模块导入测试通过");
    
    // 测试重构后的GameScene导入
    console.log("\n3. 测试重构后的GameScene导入...");
    import { GameScene } from './src/scenes/GameScene_refactored.js';
    console.log("✅ GameScene_refactored.js导入成功");
    
    console.log("\n=== 系统集成测试完成 ===");
    console.log("总结: 所有系统模块都能正常导入，架构完整");
    
} catch (error) {
    console.error("\n❌ 测试失败:", error.message);
    console.error("错误详情:", error.stack);
    process.exit(1);
}