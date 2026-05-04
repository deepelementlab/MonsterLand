// 扩展的游戏常量 - 用于替换GameScene中的魔法数字

// 位置常量
export const GAME_POSITIONS = {
    // 游戏区域
    SLINGSHOT_X: 200,
    SLINGSHOT_Y: 550,
    
    // 小鸟队列起始位置
    BIRD_START_X: 100,
    BIRD_START_Y: 650,
    BIRD_SPACING: 40,  // 小鸟之间的间距
    
    // UI位置
    PAUSE_BUTTON_X: 50,
    PAUSE_BUTTON_Y: 30,
    LEVEL_TEXT_X: 640,  // 屏幕中心(1280/2)
    LEVEL_TEXT_Y: 30,
    SCORE_TEXT_X: 1230, // 1280-50
    SCORE_TEXT_Y: 30,
    BIRD_QUEUE_X: 50,
    BIRD_QUEUE_Y: 680,
    
    // 结果界面
    RESULT_TITLE_Y_OFFSET: -100,
    RESULT_SCORE_Y_OFFSET: -20,
    RESULT_STARS_Y_OFFSET: 30,
    RESULT_BUTTON_Y_START: 100,
    RESULT_BUTTON_SPACING: 60,
    
    // 地面
    GROUND_Y_OFFSET: 40,  // 地面中心距屏幕底部的距离
    GROUND_BOTTOM_OFFSET: 80  // 地面底部距屏幕底部的距离
};

// 尺寸常量
export const GAME_SIZES = {
    // 游戏区域
    GROUND_HEIGHT: 80,
    GRASS_HEIGHT: 15,
    
    // 物理体
    GROUND_WIDTH_PADDING: 0,  // 地面宽度会动态计算为屏幕宽度
    
    // 背景元素
    HILL_HEIGHT_REDUCTION: 150,  // 山丘比地面高多少
    CLOUD_RADIUS_SMALL: 25,
    CLOUD_RADIUS_LARGE: 35,
    CLOUD_SPACING: 20,
    
    // 交互区域
    SLINGSHOT_ACTIVE_RADIUS: 80,
    MIN_DRAG_DISTANCE: 30,
    MAX_DRAG_DISTANCE: 150,
    
    // 小鸟
    BIRD_RADIUS: 25
};

// 视觉效果常量
export const GAME_VISUAL = {
    // 云朵
    CLOUD_COUNT: 4,
    CLOUD_MIN_X: 100,
    CLOUD_MAX_X: 1100,
    CLOUD_MIN_Y: 50,
    CLOUD_MAX_Y: 200,
    CLOUD_ALPHA: 0.8,
    
    // 山丘
    HILL_ALPHA: 0.5,
    HILL_COLOR: 0x6B8E23,
    
    // 弹道预测
    TRAJECTORY_POINTS: 10,
    TRAJECTORY_STEP: 0.1,  // 时间步长
    TRAJECTORY_DOT_RADIUS: 4,
    TRAJECTORY_DOT_ALPHA: 0.5,
    
    // 得分弹出
    POPUP_ANIMATION_DURATION: 800,
    POPUP_MOVE_DISTANCE: 50,
    
    // 山丘顶点
    HILL1_POINTS: [0, 500, 300, 350, 600, 500],
    HILL2_POINTS: [400, 500, 700, 300, 1000, 500]
};

// 时间常量
export const GAME_TIMING = {
    // 游戏逻辑
    ROUND_END_CHECK_DELAY: 500,  // 毫秒
    NEXT_BIRD_DELAY: 3000,        // 发射后等待检查
    PHYSICS_SLEEP_THRESHOLD: 0.5, // 物理体休眠速度阈值
    
    // 动画
    FADE_DURATION: 800
};

// 文本样式常量
export const GAME_TEXT_STYLES = {
    PAUSE_BUTTON: { fontSize: '32px' },
    LEVEL_TITLE: { fontSize: '28px', fontFamily: 'Arial', color: '#333333' },
    SCORE: { fontSize: '28px', fontFamily: 'Arial', color: '#333333' },
    BIRD_QUEUE: { fontSize: '24px', fontFamily: 'Arial', color: '#333333' },
    RESULT_TITLE: { fontSize: '48px', fontFamily: 'Arial' },
    RESULT_SCORE: { fontSize: '32px', fontFamily: 'Arial', color: '#FFFFFF' },
    RESULT_STARS: { fontSize: '40px' },
    RESULT_BUTTON: { fontSize: '24px', fontFamily: 'Arial', color: '#FFFFFF', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 } },
    SCORE_POPUP: { fontSize: '24px', fontFamily: 'Arial', color: '#FFD700', stroke: '#000000', strokeThickness: 3 }
};
