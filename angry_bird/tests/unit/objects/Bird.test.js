import { Bird } from '../../../src/objects/Bird.js';
import { BIRD_TYPES, COLORS } from '../../../src/utils/constants.js';

// 模拟Phaser场景
const mockScene = {
  add: {
    graphics: jest.fn(() => ({
      fillStyle: jest.fn(),
      fillCircle: jest.fn(),
      fillTriangle: jest.fn(),
      lineStyle: jest.fn(),
      lineBetween: jest.fn(),
      setPosition: jest.fn(),
      destroy: jest.fn(),
      rotation: 0
    }))
  },
  matter: {
    add: {
      circle: jest.fn(() => ({
        position: { x: 0, y: 0 },
        angle: 0,
        gameObject: null
      }))
    },
    body: {
      setStatic: jest.fn(),
      setPosition: jest.fn(),
      setVelocity: jest.fn(),
      setAngularVelocity: jest.fn()
    },
    world: {
      remove: jest.fn()
    }
  }
};

describe('Bird类单元测试', () => {
  let bird;

  beforeEach(() => {
    jest.clearAllMocks();
    bird = new Bird(mockScene, 100, 200, BIRD_TYPES.RED);
  });

  describe('初始化测试', () => {
    test('Bird创建时位置和类型正确', () => {
      expect(bird.x).toBe(100);
      expect(bird.y).toBe(200);
      expect(bird.type).toBe(BIRD_TYPES.RED);
      expect(bird.radius).toBe(25);
      expect(bird.launched).toBe(false);
      expect(bird.aiming).toBe(false);
      expect(bird.destroyed).toBe(false);
    });

    test('不同类型的Bird获取正确颜色', () => {
      // 测试红色小鸟
      const redBird = new Bird(mockScene, 0, 0, BIRD_TYPES.RED);
      expect(redBird.getColor()).toBe(COLORS.BIRD_RED);

      // 测试黄色小鸟
      const yellowBird = new Bird(mockScene, 0, 0, BIRD_TYPES.YELLOW);
      expect(yellowBird.getColor()).toBe(COLORS.BIRD_YELLOW);

      // 测试蓝色小鸟
      const blueBird = new Bird(mockScene, 0, 0, BIRD_TYPES.BLUE);
      expect(blueBird.getColor()).toBe(COLORS.BIRD_BLUE);

      // 测试默认类型
      const defaultBird = new Bird(mockScene, 0, 0, 'unknown');
      expect(defaultBird.getColor()).toBe(COLORS.BIRD_RED);
    });
  });

  describe('位置和移动测试', () => {
    test('moveToSlingshot正确设置位置', () => {
      bird.moveToSlingshot(300, 400);
      
      expect(bird.x).toBe(300);
      expect(bird.y).toBe(400);
      expect(bird.graphics.setPosition).toHaveBeenCalledWith(300, 400);
      expect(mockScene.matter.body.setPosition).toHaveBeenCalledWith(
        bird.body,
        { x: 300, y: 400 }
      );
      expect(mockScene.matter.body.setStatic).toHaveBeenCalledWith(bird.body, true);
    });

    test('setPosition正确更新位置', () => {
      bird.setPosition(150, 250);
      
      expect(bird.x).toBe(150);
      expect(bird.y).toBe(250);
      expect(bird.graphics.setPosition).toHaveBeenCalledWith(150, 250);
      expect(mockScene.matter.body.setPosition).toHaveBeenCalledWith(
        bird.body,
        { x: 150, y: 250 }
      );
    });
  });

  describe('发射功能测试', () => {
    test('startAiming正确设置状态', () => {
      bird.startAiming();
      expect(bird.aiming).toBe(true);
    });

    test('launch正确设置发射状态', () => {
      bird.launch(50, -100);
      
      expect(bird.launched).toBe(true);
      expect(bird.aiming).toBe(false);
      expect(mockScene.matter.body.setStatic).toHaveBeenCalledWith(bird.body, false);
      expect(mockScene.matter.body.setVelocity).toHaveBeenCalledWith(
        bird.body,
        { x: 50, y: -100 }
      );
      expect(mockScene.matter.body.setAngularVelocity).toHaveBeenCalledWith(bird.body, 0.1);
    });
  });

  describe('更新和碰撞测试', () => {
    test('update方法正确更新位置和旋转', () => {
      // 设置已发射状态
      bird.launched = true;
      bird.destroyed = false;
      bird.body.position = { x: 200, y: 300 };
      bird.body.angle = 0.5;
      
      bird.update();
      
      expect(bird.graphics.setPosition).toHaveBeenCalledWith(200, 300);
      expect(bird.x).toBe(200);
      expect(bird.y).toBe(300);
      expect(bird.graphics.rotation).toBe(0.5);
    });

    test('未发射的小鸟update不更新位置', () => {
      bird.launched = false;
      bird.update();
      expect(bird.graphics.setPosition).not.toHaveBeenCalled();
    });

    test('已销毁的小鸟update不执行', () => {
      bird.launched = true;
      bird.destroyed = true;
      bird.update();
      expect(bird.graphics.setPosition).not.toHaveBeenCalled();
    });

    test('onCollision处理碰撞伤害', () => {
      // 低碰撞力不造成伤害
      bird.takeDamage = jest.fn();
      bird.onCollision(5);
      expect(bird.takeDamage).not.toHaveBeenCalled();

      // 高碰撞力造成伤害
      bird.onCollision(15);
      expect(bird.takeDamage).toHaveBeenCalledWith(15);
    });

    test('takeDamage和destroy逻辑', () => {
      // 低伤害不销毁
      bird.takeDamage(30);
      expect(bird.destroyed).toBe(false);

      // 高伤害销毁
      bird.takeDamage(60);
      expect(bird.destroyed).toBe(true);
      expect(bird.graphics.destroy).toHaveBeenCalled();
      expect(mockScene.matter.world.remove).toHaveBeenCalledWith(bird.body);
    });

    test('重复销毁不重复执行', () => {
      bird.destroyed = true;
      bird.destroy();
      expect(bird.graphics.destroy).not.toHaveBeenCalled();
    });
  });

  describe('边界条件测试', () => {
    test('创建时图形绘制方法被调用', () => {
      expect(mockScene.add.graphics).toHaveBeenCalled();
      const graphics = bird.graphics;
      
      // 验证图形绘制方法被调用
      expect(graphics.fillStyle).toHaveBeenCalled();
      expect(graphics.fillCircle).toHaveBeenCalled();
      expect(graphics.lineStyle).toHaveBeenCalled();
      expect(graphics.fillTriangle).toHaveBeenCalled();
    });

    test('物理体创建正确', () => {
      expect(mockScene.matter.add.circle).toHaveBeenCalledWith(
        100, 200, 25,
        expect.objectContaining({
          label: 'bird',
          mass: 5,
          restitution: 0.6,
          friction: 0.3,
          frictionAir: 0.01
        })
      );
    });
  });
});