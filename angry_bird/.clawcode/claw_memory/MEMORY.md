## 轨迹线极短且垂直向下 (已修复 2025-07)
- **根因**: Bird.js frictionAir=0.01 太大
  - 每帧速度衰减到 1-0.01*16.67=83.3%，10帧后仅16%
  - 最大拖拽150px只飞约112px就开始垂直下落
- **修复**: Bird.js frictionAir 0.01→0.001
  - 新衰减: 98.3%/帧; 满拽→1175px, 中拽→909px
- 轨迹模拟从body.frictionAir读取，无需额外修改
§
## InputSystem showTrajectory 轨迹修复 (2025-07, 第二次修复)
- **根因**: frictionAir计算错误，差16.667倍
  - 错误: `frictionAirFactor = 1 - frictionAir * deltaTime` (乘了整个delta=16.667)
  - 正确: `frictionAirFactor = 1 - frictionAir * (deltaTime / Common._baseDelta)` (归一化后=1)
- 修复: 完全复现Matter.js Body.update Verlet积分
  - gravity/mass项正确(gravAccel * dt² = force.y/mass * dt²)
  - frictionAir需要除以baseDelta(=1000/60=16.667)
- 验证: Python数值模拟60帧后误差=0.000000px (完美匹配)
- 文件: src/systems/InputSystem.js showTrajectory()
§
## InputSystem.js 轨迹线精确匹配修复 (2025-07)
- **根因**: showTrajectory()的frictionAir因子计算错误
  - 旧代码: `frictionAirFactor = 1 - body.frictionAir * deltaTime` → 0.983 (错误)
  - Matter.js实际: `frictionAirFactor = 1 - body.frictionAir * (deltaTime / baseDelta)` → 0.999 (正确)
  - 差16.667倍！60帧后轨迹偏差达112px
- **修复**: 完全复现Matter.js Body.update的Verlet积分
  1. frictionAir = 1 - body.frictionAir * (deltaTime / baseDelta) ← 关键修正
  2. 使用position+positionPrev追踪(而非简单velocity变量)
  3. setVelocity效果: positionPrev = position - velocity * timeScale
  4. 每帧: velPrev=(pos-prev)*correction; newVel=velPrev*frictionAir+grav*dt2; prev=pos; pos+=newVel
- 数学验证: 修复后与Matter.js Body.update完全一致，60帧误差=0.0px
- 文件: src/systems/InputSystem.js showTrajectory()
- 关键参考: phaser.js L163268 Body.update, L163059 Body.setVelocity, L167787 Engine重力