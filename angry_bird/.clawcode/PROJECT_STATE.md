# 愤怒的小鸟项目 - 当前状态

## 当前状态 (可正常运行)
- 项目完成度: 100%
- 构建状态: ✅ vite build 成功 (22 modules, ~6s)
- 运行状态: ✅ 游戏场景链路完整，无JS错误

## 最近修复 (2025-07)

### Bug: 引导轨迹线与真实飞行路径偏差大 (第三次修复 - 最终精确匹配)
- **根因**: `showTrajectory()` 的 frictionAir 因子计算错误
  - 旧代码: `frictionAirFactor = 1 - body.frictionAir * deltaTime` = 0.983
  - Matter.js实际: `frictionAirFactor = 1 - body.frictionAir * (deltaTime / baseDelta)` = 0.999
  - 差16.667倍！60帧后轨迹偏差达112px
- **修复**: 完全复现Matter.js Body.update的Verlet积分
  1. frictionAir = 1 - body.frictionAir * (deltaTime / baseDelta)  ← 关键修正
  2. 使用 position + positionPrev 追踪（而非简单velocity变量）
  3. 完全模拟 setVelocity 效果: positionPrev = position - velocity * timeScale
  4. 每帧: velPrev=(pos-prev)*correction; newVel=velPrev*frictionAir+grav*dt²; prev=pos; pos+=newVel
- **验证**: Python数值模拟60帧误差=0.0px（完美匹配）
- **文件**: `src/systems/InputSystem.js` showTrajectory()

### 历史 Bug1: 小鸟发射后不自动装填新鸟 (已修复)
- **修复**: `InputSystem.js` 接受 'playing' 和 'ready' 两种状态

### 历史 Bug2: Bird.js frictionAir太大导致轨迹极短 (已修复)
- **修复**: frictionAir 0.01→0.001

## 文件清单 (全部正常)
| 文件 | 行数 | 状态 |
|------|------|------|
| src/main.js | 34 | 入口 |
| src/config/game.config.js | 232 | 5个关卡配置 |
| src/utils/constants.js | 356 | 常量定义 |
| src/scenes/BootScene.js | 19 | 启动场景 |
| src/scenes/PreloadScene.js | 42 | 加载场景 |
| src/scenes/MenuScene.js | ~305 | 主菜单 |
| src/scenes/GameScene.js | 231 | 游戏主场景 |
| src/objects/Bird.js | 145 | 小鸟对象 |
| src/objects/Pig.js | 131 | 猪对象 |
| src/objects/Block.js | 175 | 方块对象 |
| src/objects/Slingshot.js | 86 | 弹弓对象 |
| src/systems/PhysicsSystem.js | 104 | 物理系统 |
| src/systems/InputSystem.js | ~220 | 输入系统(已精确修复轨迹) |
| src/systems/UISystem.js | 375 | UI系统 |
| src/systems/EntityManager.js | 167 | 实体管理 |
| src/systems/GameStateSystem.js | 198 | 状态管理 |

## 技术栈
- Phaser 3.90.0 (WebGL)
- Matter.js 物理引擎 (内置于Phaser)
- Vite 5.4.21
