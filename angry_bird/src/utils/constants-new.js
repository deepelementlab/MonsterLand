// 游戏常量

// 颜色常量
export const COLORS = {
    // 角色
    BIRD_RED: 0xFF0000,
    BIRD_YELLOW: 0xFFD700,
    BIRD_BLUE: 0x1E90FF,
    PIG: 0x90EE90,
    
    // 材质
    WOOD: 0x8B4513,
    STONE: 0x708090,
    GLASS: 0xADD8E6,
    
    // 环境
    SKY_TOP: 0x87CEEB,
    SKY_BOTTOM: 0xB0E0E6,
    GROUND: 0x228B22,
    GRASS: 0x32CD32,
    
    // UI
    UI_PRIMARY: 0x4CAF50,
    UI_DANGER: 0xF44336,
    UI_ACCENT: 0xFFC107,
    UI_TEXT: 0x333333,
    UI_WHITE: 0xFFFFFF
};

// 位置常量
export const POSITIONS = {
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
    RESULT_BUTTON_SPACING: 60
};

// 尺寸常量
export const SIZES = {
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
    MAX_DRAG_DISTANCE: 150
};

// 视觉效果常量
export const VISUAL = {
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
    POPUP_MOVE_DISTANCE: 50
};

// 碰撞阈值常量
export const COLLISION = {
    PIG_DAMAGE_THRESHOLD: 3,
    BLOCK_DAMAGE_THRESHOLD: 2,
    PIG_DAMAGE_MULTIPLIER: 10,
    BLOCK_DAMAGE_MULTIPLIER: 5,
    BIRD_DAMAGE_THRESHOLD: 10,
    BIRD_DESTROY_THRESHOLD: 50,
    SLEEP_SPEED_THRESHOLD: 0.5
};

export const TIMING = {
    // 游戏逻辑
    ROUND_END_CHECK_DELAY: 500,  // 毫秒
    NEXT_BIRD_DELAY: 3000,        // 发射后等待检查
    
    // 动画
    FADE_DURATION: 800
};

// 碰撞分类
export const COLLISION_CATEGORIES = {
    BIRD: 0x0001,
    PIG: 0x0002,
    BLOCK: 0x0004,
    GROUND: 0x0008,
    SLINGSHOT: 0x0010
};

// 游戏状态
export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    WIN: 'win',
    LOSE: 'lose'
};

// 小鸟类型
export const BIRD_TYPES = {
    RED: 'red',
    YELLOW: 'yellow',
    BLUE: 'blue'
};

// 材质类型
export const MATERIAL_TYPES = {
    WOOD: 'wood',
    STONE: 'stone',
    GLASS: 'glass'
};

// 场景键名
export const SCENE_KEYS = {
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    MENU: 'MenuScene',
    LEVEL_SELECT: 'LevelSelectScene',
    GAME: 'GameScene',
    RESULT: 'ResultScene'
};

// 文本样式常量
