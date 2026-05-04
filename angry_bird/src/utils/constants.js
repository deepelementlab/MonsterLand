// 游戏常量

// Airbnb风格配色
// 核心颜色：primary=#ff385c, background=#ffffff, text=#222222
const AIRBNB_COLORS = {
    PRIMARY: 0xFF385C,    // #ff385c - Airbnb标志性粉红色
    PRIMARY_LIGHT: 0xFF6B8B,  // 浅粉色
    BACKGROUND: 0xFFFFFF,    // 白色背景
    TEXT_DARK: 0x222222,    // 深灰色文字
    TEXT_MEDIUM: 0x717171,  // 中灰色
    TEXT_LIGHT: 0xB0B0B0,   // 浅灰色
    SUCCESS: 0x00A699,      // 青绿色
    WARNING: 0xFFB400,      // 琥珀色
    DANGER: 0xFF5A5F,       // 珊瑚红色
    SURFACE: 0xF7F7F7,      // 浅灰色表面
    SURFACE_DARK: 0xDDDDDD, // 深灰色表面
};

// 颜色常量
export const COLORS = {
    // Airbnb风格UI颜色
    ...AIRBNB_COLORS,
    
    // 角色
    BIRD_RED: 0xFF385C,    // 使用Airbnb主色
    BIRD_YELLOW: 0xFFB400, // 使用Airbnb琥珀色
    BIRD_BLUE: 0x00A699,   // 使用Airbnb青绿色
    PIG: 0x90EE90,         // 保持绿色猪
    
    // 材质
    WOOD: 0x8B4513,
    STONE: 0x708090,
    GLASS: 0xADD8E6,
    
    // 环境
    SKY_TOP: 0x87CEEB,
    SKY_BOTTOM: 0xB0E0E6,
    GROUND: 0x228B22,
    GRASS: 0x32CD32,
    
    // UI (旧颜色 - 保持向后兼容)
    UI_PRIMARY: 0xFF385C,    // Airbnb主色
    UI_DANGER: 0xFF5A5F,     // Airbnb危险色
    UI_ACCENT: 0xFFB400,     // Airbnb强调色
    UI_TEXT: 0x222222,       // Airbnb深灰文字
    UI_WHITE: 0xFFFFFF
};

// Airbnb风格阴影定义
const AIRBNB_SHADOWS = {
    // 多层轻微阴影，符合rounded_soft风格
    SOFT: {
        shadowColor: 0x000000,
        shadowAlpha: 0.1,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 6
    },
    MEDIUM: {
        shadowColor: 0x000000,
        shadowAlpha: 0.15,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 8
    },
    ELEVATED: {
        shadowColor: 0x000000,
        shadowAlpha: 0.2,
        shadowOffsetX: 0,
        shadowOffsetY: 8,
        shadowBlur: 16
    }
};

// 位置常量
export const POSITIONS = {
    // 游戏区域
    SLINGSHOT_X: 200,
    SLINGSHOT_Y: 550,
    
    // 小鸟队列起始位置
    BIRD_START_X: 100,
    BIRD_START_Y: 600,  // 在地面(640)上方，避免创建时碰撞
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
    PIG_DAMAGE_THRESHOLD: 8,        // 提高阈值，防止轻微碰撞触发伤害
    BLOCK_DAMAGE_THRESHOLD: 6,      // 提高阈值
    PIG_DAMAGE_MULTIPLIER: 5,       // 降低乘数，让伤害更合理
    BLOCK_DAMAGE_MULTIPLIER: 3,     // 降低乘数
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
    READY: 'ready',       // 等待发射，不处理碰撞伤害
    PLAYING: 'playing',   // 小鸟已发射，正常碰撞
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

// Airbnb风格文本样式常量
export const TEXT_STYLES = {
    // 主标题 - 温暖邀请风格
    MAIN_TITLE: { 
        fontSize: '64px', 
        fontFamily: 'Arial Black', 
        color: '#FF385C',
        stroke: '#FFFFFF',
        strokeThickness: 8,
        shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 2, blur: 4 }
    },
    
    // 副标题
    SUBTITLE: { 
        fontSize: '32px', 
        fontFamily: 'Arial', 
        color: '#222222',
        shadow: { color: '#000000', fill: true, offsetX: 1, offsetY: 1, blur: 2 }
    },
    
    // 暂停按钮
    PAUSE_BUTTON: { 
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        backgroundColor: '#FF385C',
        borderRadius: 20,
        padding: { x: 15, y: 8 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 6 }
    },
    
    // 关卡标题
    LEVEL_TITLE: { 
        fontSize: '28px', 
        fontFamily: 'Arial', 
        color: '#222222',
        backgroundColor: '#F7F7F7',
        borderRadius: 16,
        padding: { x: 12, y: 6 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 4 }
    },
    
    // 得分显示
    SCORE: { 
        fontSize: '28px', 
        fontFamily: 'Arial', 
        color: '#222222',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: { x: 12, y: 6 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 6 }
    },
    
    // 小鸟队列
    BIRD_QUEUE: { 
        fontSize: '24px', 
        fontFamily: 'Arial', 
        color: '#222222',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: { x: 10, y: 5 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 4 }
    },
    
    // 结果标题
    RESULT_TITLE: { 
        fontSize: '48px', 
        fontFamily: 'Arial Black',
        color: '#FFFFFF',
        stroke: '#FF385C',
        strokeThickness: 6,
        shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
    },
    
    // 结果得分
    RESULT_SCORE: { 
        fontSize: '32px', 
        fontFamily: 'Arial', 
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: { x: 20, y: 10 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 4, blur: 8 }
    },
    
    // 结果星级
    RESULT_STARS: { 
        fontSize: '40px',
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 4 }
    },
    
    // 结果按钮
    RESULT_BUTTON: { 
        fontSize: '24px', 
        fontFamily: 'Arial', 
        color: '#FFFFFF',
        backgroundColor: '#FF385C',
        borderRadius: 20,
        padding: { x: 24, y: 12 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 4, blur: 8 }
    },
    
    // 得分弹窗
    SCORE_POPUP: { 
        fontSize: '24px', 
        fontFamily: 'Arial', 
        color: '#FFB400',
        stroke: '#222222', 
        strokeThickness: 3,
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 2, blur: 4 }
    },
    
    // 菜单按钮
    MENU_BUTTON: {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        backgroundColor: '#FF385C',
        borderRadius: 20,
        padding: { x: 30, y: 15 },
        shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 4, blur: 8 }
    }
};

// Airbnb风格按钮状态
export const BUTTON_STATES = {
    NORMAL: {
        backgroundColor: '#FF385C',
        color: '#FFFFFF',
        scale: 1,
        alpha: 1
    },
    HOVER: {
        backgroundColor: '#FF6B8B', // 浅粉色
        color: '#FFFFFF',
        scale: 1.05,
        alpha: 0.9
    },
    DOWN: {
        backgroundColor: '#D81E5B', // 深粉色
        color: '#FFFFFF',
        scale: 0.95,
        alpha: 1
    }
};
