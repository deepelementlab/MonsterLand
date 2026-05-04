# 愤怒的小鸟 🐦

一款使用 Phaser 3 和 Matter.js 构建的 HTML5 物理弹射游戏。

## 🎮 游戏特性

- **物理引擎**: 基于 Matter.js 的真实物理模拟
- **弹弓发射**: 拖拽瞄准，预测轨迹，释放发射
- **多种材质**: 木头、石头、玻璃，各有不同物理属性
- **关卡系统**: 3个精心设计的关卡
- **得分系统**: 消灭猪和破坏方块获得分数
- **星级评价**: 根据得分获得1-3星评价

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 开始游戏

### 构建生产版本

```bash
npm run build
```

## 🎯 游戏玩法

1. **瞄准**: 点击并拖拽小鸟，拉伸弹弓
2. **发射**: 松开鼠标/手指，小鸟沿抛物线飞行
3. **消灭**: 击中猪或通过连锁反应消灭所有猪
4. **获胜**: 消灭所有猪即可通关

## 📁 项目结构

```
angry_bird/
├── docs/                   # 项目文档
│   ├── product-requirements.md  # 产品需求文档
│   ├── architecture.md          # 技术架构文档
│   └── ui-ux-design.md          # UI/UX设计文档
│
├── src/                    # 源代码
│   ├── main.js             # 应用入口
│   ├── config/             # 配置文件
│   │   └── game.config.js  # 游戏配置和关卡数据
│   ├── scenes/             # 游戏场景
│   │   ├── BootScene.js    # 启动场景
│   │   ├── PreloadScene.js # 资源加载
│   │   ├── MenuScene.js    # 主菜单
│   │   └── GameScene.js    # 游戏主场景
│   ├── objects/            # 游戏对象
│   │   ├── Bird.js         # 小鸟
│   │   ├── Pig.js          # 猪
│   │   ├── Block.js        # 方块
│   │   └── Slingshot.js    # 弹弓
│   └── utils/              # 工具函数
│       └── constants.js    # 常量定义
│
├── index.html              # 入口HTML
├── package.json            # 项目配置
└── vite.config.js          # Vite配置
```

## 🛠️ 技术栈

- **游戏框架**: Phaser 3.70+
- **物理引擎**: Matter.js
- **构建工具**: Vite 5.0+
- **编程语言**: JavaScript ES6+

## 🎨 游戏对象

### 小鸟 🐦
- 红鸟: 标准小鸟
- 黄鸟: 速度型（可扩展）
- 蓝鸟: 分裂型（可扩展）

### 猪 🐷
- 绿色圆形目标
- 被撞击后受伤，生命值归零后消灭

### 方块 🧱
- **木头**: 中等强度，棕色
- **石头**: 高强度，灰色
- **玻璃**: 低强度，浅蓝色

## 📊 得分规则

| 目标 | 分数 |
|------|------|
| 消灭猪 | 5,000 |
| 破坏木块 | 500 |
| 破坏石块 | 1,000 |
| 破坏玻璃块 | 300 |
| 剩余小鸟奖励 | 10,000/只 |

## 🌟 星级评价

每个关卡有3个星级分数阈值：
- ⭐: 完成关卡
- ⭐⭐: 达到中等分数
- ⭐⭐⭐: 达到高分目标

## 📝 开发文档

详细的设计文档位于 `docs/` 目录：

- [产品需求文档](docs/product-requirements.md)
- [技术架构文档](docs/architecture.md)
- [UI/UX设计文档](docs/ui-ux-design.md)

## 🔧 扩展功能 (TODO)

- [ ] 多种小鸟特殊能力
- [ ] 更多关卡
- [ ] 音效系统
- [ ] 本地存储进度
- [ ] 关卡选择界面
- [ ] 排行榜

## 📄 许可证

MIT License

## 🙏 致谢

- [Phaser 3](https://phaser.io/)
- [Matter.js](https://brm.io/matter-js/)
- 原版《愤怒的小鸟》游戏灵感
