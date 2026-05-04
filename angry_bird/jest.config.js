/** @type {import('jest').Config} */
export default {
  preset: 'jest-puppeteer',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^phaser$': '<rootDir>/tests/mocks/phaser.js',
    '^matter-js$': '<rootDir>/tests/mocks/matter.js'
  },
  
  // 测试匹配模式
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],
  
  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  
  // 忽略的路径
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/performance/'
  ],
  
  // 转换器
  transform: {},
  
  // 扩展名处理
  moduleFileExtensions: ['js', 'json'],
  
  // 测试报告
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Angry Birds 单元测试报告',
      outputPath: './test-reports/unit-test-report.html'
    }]
  ]
};