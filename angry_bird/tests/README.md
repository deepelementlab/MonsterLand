# 愤怒的小鸟 - 测试目录结构

## 目录结构

```
tests/
├── setup/
│   ├── jest.setup.js          # Jest全局设置
│   └── playwright.setup.js    # Playwright全局设置
│
├── unit/
│   ├── objects/
│   │   ├── Bird.test.js       # Bird类单元测试
│   │   ├── Pig.test.js        # Pig类单元测试
│   │   ├── Block.test.js      # Block类单元测试
│   │   └── Slingshot.test.js  # Slingshot类单元测试
│   │
│   ├── systems/
│   │   ├── PhysicsSystem.test.js  # 物理系统测试
│   │   └── UISystem.test.js       # UI系统测试
│   │
│   ├── scenes/
│   │   ├── GameScene.test.js      # 游戏场景测试
│   │   ├── MenuScene.test.js      # 菜单场景测试
│   │   └── PreloadScene.test.js   # 预加载场景测试
│   │
│   └── utils/
│       ├── constants.test.js      # 常量测试
│       └── helpers.test.js        # 工具函数测试
│
├── integration/
│   ├── physics-integration.test.js    # 物理引擎集成测试
│   ├── ui-integration.test.js         # UI系统集成测试
│   ├── game-flow.test.js              # 游戏流程集成测试
│   └── input-handling.test.js         # 输入处理集成测试
│
├── e2e/
│   ├── game-flow.spec.js              # 游戏流程E2E测试
│   ├── user-interaction.spec.js       # 用户交互E2E测试
│   ├── level-complete.spec.js         # 关卡完成E2E测试
│   └── cross-browser.spec.js          # 跨浏览器E2E测试
│
├── performance/
│   ├── physics-performance.test.js    # 物理性能测试
│   ├── rendering-performance.test.js   # 渲染性能测试
│   └── load-performance.test.js       # 加载性能测试
│
├── fixtures/                          # 测试数据夹具
│   ├── game-states.json
│   ├── level-data.json
│   └── physics-scenarios.json
│
└── mocks/
    ├── phaser.js                      # Phaser模拟
    ├── matter.js                      # Matter.js模拟
    └── browser-mocks.js               # 浏览器API模拟
```

## 测试执行命令

### 单元测试
```bash
# 运行所有单元测试
npm test

# 运行指定测试
npm test -- Bird.test.js

# 运行覆盖率报告
npm test -- --coverage
```

### 集成测试
```bash
# 运行集成测试
npm run test:integration
```

### E2E测试
```bash
# 运行所有E2E测试
npm run test:e2e

# 运行指定浏览器的测试
npm run test:e2e -- --project=chromium

# 运行UI模式
npm run test:e2e:ui
```

### 性能测试
```bash
# 运行性能测试
npm run test:performance
```

### 所有测试
```bash
# 运行完整测试套件
npm run test:all
```

## 测试环境设置

### 依赖安装
```bash
# 测试相关依赖
npm install --save-dev jest jest-puppeteer jest-html-reporter
npm install --save-dev @jest/globals
npm install --save-dev @playwright/test
npm install --save-dev lighthouse
```

### 环境变量
创建 `.env.test` 文件：
```
TEST_ENV=testing
NODE_ENV=test
PORT=5173
```

## 测试报告

测试报告生成在以下位置：
- 单元测试报告：`test-reports/unit-test-report.html`
- E2E测试报告：`test-reports/e2e-report/index.html`
- 性能报告：`test-reports/performance-report.html`
- 覆盖率报告：`coverage/lcov-report/index.html`