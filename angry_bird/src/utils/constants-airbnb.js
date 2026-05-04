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
