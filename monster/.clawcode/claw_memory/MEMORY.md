Project: monster - HTML5 Canvas side-scrolling platformer game (怪兽冒险 Monster Quest). 
- Files: index.html, styles.css, game.js, docs/PRD-monster-game.md
- game.js ~1148 lines. Classes: SoundManager, Player, Monster (base), PatrolMonster, ChaserMonster, JumperMonster, Game
- 3 levels: 绿野森林, 熔岩洞穴, 天空之城
- Uses Web Audio API for synthesized sound effects
- Chinese UI text throughout
- Completed: all core gameplay, sound, bg decorations, particles, HUD, screen management
§
## Project: monster - HTML5 Canvas 横版闯关游戏

### 项目路径: test/monster
### 结构: index.html + styles.css + game.js (纯前端)

### 2025-session: 游戏开发完成
- 原始 game.js 约55%完成度，draw()方法截断，Game类控制流方法全部缺失
- 补全了所有缺失代码，游戏现已可运行

### game.js 架构 (1148行):
1. **SoundManager** (L12-119) - Web Audio API 合成音效系统（跳跃/金币/钥匙/攻击/受伤/击杀/通关/游戏结束/胜利）
2. **CONFIG** - 游戏常量（900x600画布、重力0.6、速度5、跳跃力-14）
3. **LEVELS[3]** - 3关数据：绿野森林/熔岩洞穴/天空之城
4. **Player** - 移动、跳跃、攻击(X键)、无敌帧、碰撞检测
5. **Monster基类** + PatrolMonster(红圆形巡逻)/ChaserMonster(紫方形追踪)/JumperMonster(绿菱形跳跃)
6. **Game主类** - 完整游戏循环、屏幕管理、HUD、关卡切换、背景装饰（树木/云/钟乳石/火焰/星星）
7. 背景装饰按关卡主题绘制，金币有旋转动画，钥匙有浮动发光效果

### 关键设计决策:
- `_savedLives`/`_savedScore` 跨关卡保持进度
- loadLevel() 通过这些字段恢复状态
- 音效使用 Web Audio API oscillator 合成，无需外部资源
- drawPlatform() 根据关卡索引切换主题样式（草地/熔岩/云石）
- 使用 `const sound = new SoundManager()` 全局单例
§
## Monster Quest Game Project
- Canvas-based 2D platformer game (HTML5 + JS + CSS)
- 3 levels: 绿野森林, 熔岩洞穴, 天空之城
- 3 monster types: patrol (red circle), chaser (purple square), jumper (green diamond)
- Project root: ..\test\monster
- Files: index.html, styles.css, game.js, README.md, docs/PRD-monster-game.md
- Key classes: CONFIG, GameState, SoundManager, Player, Monster (base), PatrolMonster, ChaserMonster, JumperMonster, Game
- SoundManager uses Web Audio API synthesis (no external files)
- Game state flow: MENU → PLAYING → PAUSED/LEVEL_COMPLETE/GAME_OVER/VICTORY
- Background decorations per level theme (trees/clouds, stalactites/flames, stars/clouds)
- Progress persistence between levels via _savedLives/_savedScore