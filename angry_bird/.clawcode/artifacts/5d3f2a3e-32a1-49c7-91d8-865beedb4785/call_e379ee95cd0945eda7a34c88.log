// 游戏配置
export const GameConfig = {
    // 游戏尺寸
    width: 1280,
    height: 720,
    
    // 物理配置
    physics: {
        gravity: { x: 0, y: 1 },
        debug: false
    },
    
    // 弹弓配置
    slingshot: {
        x: 200,
        y: 550,
        maxDragDistance: 150,
        minDragDistance: 30,
        launchPower: 0.15
    },
    
    // 得分配置
    scores: {
        pig: 5000,
        wood: 500,
        stone: 1000,
        glass: 300,
        birdBonus: 10000
    },
    
    // 材质属性
    materials: {
        wood: {
            health: 100,
            density: 0.001,
            friction: 0.5,
            restitution: 0.3
        },
        stone: {
            health: 300,
            density: 0.003,
            friction: 0.8,
            restitution: 0.1
        },
        glass: {
            health: 50,
            density: 0.001,
            friction: 0.2,
            restitution: 0.5
        }
    }
};

// 关卡配置
// 坐标说明：游戏画面1280x720，地面顶部y=640
// 方块的y坐标是方块中心点，高40方块放地面上 → y=620
// 猪的y坐标是猪中心点，半径25的猪放地面上 → y=615
// 重要：猪和方块不能放在相同坐标，否则物理体互相穿透

export const LevelsConfig = [
    // ===== 关卡 1 - 简单入门 =====
    {
        id: 1,
        name: "第一课",
        description: "消灭所有小猪！",
        starScores: [5000, 15000, 30000],
        birds: ['red', 'red', 'red'],
        structures: [
            // 地面平台
            { type: 'block', material: 'wood', x: 800, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'wood', x: 880, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'wood', x: 960, y: 620, width: 80, height: 40 },
            // 垂直支撑柱（左右各一根）
            { type: 'block', material: 'wood', x: 810, y: 555, width: 25, height: 90 },
            { type: 'block', material: 'wood', x: 950, y: 555, width: 25, height: 90 },
            // 屋顶横梁
            { type: 'block', material: 'wood', x: 880, y: 505, width: 180, height: 20 },
            // 猪 - 在平台上面（平台顶面y=600，猪半径25，中心y=575）
            { type: 'pig', x: 880, y: 575, radius: 25 }
        ]
    },

    // ===== 关卡 2 - 双重打击 =====
    {
        id: 2,
        name: "双重打击",
        description: "三座堡垒，三只小猪！",
        starScores: [10000, 25000, 50000],
        birds: ['red', 'red', 'red', 'red'],
        structures: [
            // --- 左侧木屋 ---
            { type: 'block', material: 'wood', x: 650, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'wood', x: 625, y: 560, width: 20, height: 80 },
            { type: 'block', material: 'wood', x: 675, y: 560, width: 20, height: 80 },
            { type: 'block', material: 'wood', x: 650, y: 510, width: 80, height: 20 },
            { type: 'pig', x: 650, y: 572, radius: 20 },

            // --- 中间石塔 ---
            { type: 'block', material: 'stone', x: 850, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'stone', x: 825, y: 560, width: 25, height: 80 },
            { type: 'block', material: 'stone', x: 875, y: 560, width: 25, height: 80 },
            { type: 'block', material: 'wood', x: 850, y: 510, width: 100, height: 20 },
            { type: 'pig', x: 850, y: 572, radius: 22 },

            // --- 右侧玻璃房 ---
            { type: 'block', material: 'glass', x: 1060, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'glass', x: 1035, y: 560, width: 20, height: 80 },
            { type: 'block', material: 'glass', x: 1085, y: 560, width: 20, height: 80 },
            { type: 'block', material: 'glass', x: 1060, y: 510, width: 80, height: 20 },
            { type: 'pig', x: 1060, y: 572, radius: 20 }
        ]
    },

    // ===== 关卡 3 - 石头堡垒 =====
    {
        id: 3,
        name: "石头堡垒",
        description: "坚固的石头城堡！",
        starScores: [15000, 40000, 70000],
        birds: ['red', 'red', 'red', 'red', 'red'],
        structures: [
            // --- 底层平台 ---
            { type: 'block', material: 'stone', x: 850, y: 620, width: 80, height: 40 },
            { type: 'block', material: 'stone', x: 920, y: 620, width: 60, height: 40 },
            { type: 'block', material: 'stone', x: 990, y: 620, width: 60, height: 40 },
            { type: 'block', material: 'stone', x: 1060, y: 620, width: 80, height: 40 },

            // --- 底层猪 ---
            { type: 'pig', x: 955, y: 575, radius: 20 },

            // --- 一层墙壁 ---
            { type: 'block', material: 'stone', x: 855, y: 560, width: 30, height: 80 },
            { type: 'block', material: 'stone', x: 1055, y: 560, width: 30, height: 80 },
            // 中间木柱（弱点！）
            { type: 'block', material: 'wood', x: 955, y: 560, width: 25, height: 80 },

            // --- 二层平台 ---
            { type: 'block', material: 'wood', x: 955, y: 510, width: 250, height: 20 },

            // --- 二层猪 ---
            { type: 'pig', x: 910, y: 472, radius: 18 },
            { type: 'pig', x: 1000, y: 472, radius: 18 },

            // --- 顶部装饰 ---
            { type: 'block', material: 'glass', x: 955, y: 445, width: 60, height: 30 },
            { type: 'block', material: 'glass', x: 930, y: 415, width: 30, height: 30 },
            { type: 'block', material: 'glass', x: 980, y: 415, width: 30, height: 30 }
        ]
    },

    // ===== 关卡 4 - 高塔危机 =====
    {
        id: 4,
        name: "高塔危机",
        description: "层层设防的高塔！",
        starScores: [20000, 50000, 85000],
        birds: ['red', 'red', 'red', 'red', 'red'],
        structures: [
            // --- 底层 ---
            { type: 'block', material: 'stone', x: 900, y: 620, width: 120, height: 40 },
            { type: 'block', material: 'stone', x: 850, y: 570, width: 25, height: 60 },
            { type: 'block', material: 'stone', x: 950, y: 570, width: 25, height: 60 },
            { type: 'pig', x: 900, y: 580, radius: 18 },

            // --- 二层 ---
            { type: 'block', material: 'wood', x: 900, y: 530, width: 140, height: 20 },
            { type: 'block', material: 'wood', x: 845, y: 490, width: 20, height: 60 },
            { type: 'block', material: 'wood', x: 955, y: 490, width: 20, height: 60 },
            { type: 'pig', x: 900, y: 500, radius: 18 },

            // --- 三层 ---
            { type: 'block', material: 'glass', x: 900, y: 450, width: 140, height: 20 },
            { type: 'block', material: 'glass', x: 860, y: 415, width: 20, height: 50 },
            { type: 'block', material: 'glass', x: 940, y: 415, width: 20, height: 50 },
            { type: 'pig', x: 900, y: 425, radius: 18 },

            // --- 顶部 ---
            { type: 'block', material: 'wood', x: 900, y: 380, width: 100, height: 15 },
            { type: 'block', material: 'wood', x: 880, y: 360, width: 30, height: 25 },
            { type: 'block', material: 'wood', x: 920, y: 360, width: 30, height: 25 }
        ]
    },

    // ===== 关卡 5 - 最终决战 =====
    {
        id: 5,
        name: "最终决战",
        description: "摧毁猪王的城堡！",
        starScores: [25000, 60000, 100000],
        birds: ['red', 'red', 'red', 'red', 'red', 'red'],
        structures: [
            // --- 左翼 ---
            { type: 'block', material: 'wood', x: 780, y: 620, width: 100, height: 40 },
            { type: 'block', material: 'wood', x: 755, y: 565, width: 20, height: 70 },
            { type: 'block', material: 'wood', x: 805, y: 565, width: 20, height: 70 },
            { type: 'block', material: 'wood', x: 780, y: 520, width: 90, height: 20 },
            { type: 'pig', x: 780, y: 575, radius: 20 },

            // --- 中央城堡底层 ---
            { type: 'block', material: 'stone', x: 900, y: 620, width: 60, height: 40 },
            { type: 'block', material: 'stone', x: 960, y: 620, width: 60, height: 40 },
            { type: 'block', material: 'stone', x: 1020, y: 620, width: 60, height: 40 },

            // --- 中央城堡一层墙 ---
            { type: 'block', material: 'stone', x: 910, y: 560, width: 25, height: 80 },
            { type: 'block', material: 'stone', x: 1010, y: 560, width: 25, height: 80 },
            { type: 'block', material: 'glass', x: 960, y: 560, width: 30, height: 80 },

            // --- 中央猪王 ---
            { type: 'pig', x: 960, y: 575, radius: 28 },

            // --- central top ---
            { type: "block", material: "wood", x: 960, y: 510, width: 140, height: 20 },

            // --- right wing ---
            { type: "block", material: "wood", x: 1100, y: 620, width: 100, height: 40 },
            { type: "block", material: "wood", x: 1075, y: 565, width: 20, height: 70 },
            { type: "block", material: "wood", x: 1125, y: 565, width: 20, height: 70 },
            { type: "block", material: "wood", x: 1100, y: 520, width: 90, height: 20 },
            { type: "pig", x: 1100, y: 575, radius: 20 },

            // --- top pig ---
            { type: "pig", x: 960, y: 475, radius: 20 },

            // --- top deco ---
            { type: "block", material: "glass", x: 960, y: 445, width: 80, height: 20 },
            { type: "block", material: "stone", x: 930, y: 420, width: 25, height: 30 },
            { type: "block", material: "stone", x: 990, y: 420, width: 25, height: 30 },
            { type: "block", material: "wood", x: 960, y: 400, width: 60, height: 15 }
        ]
    }
];
