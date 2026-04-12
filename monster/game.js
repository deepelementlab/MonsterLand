// ==================== 游戏配置 ====================
const CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 600,
    GRAVITY: 0.6,
    PLAYER_SPEED: 5,
    JUMP_FORCE: -14,
    TILE_SIZE: 40
};

// ==================== 简易音效系统 ====================
class SoundManager {
    constructor() {
        this.enabled = true;
        this.ctx = null;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            this.enabled = false;
        }
    }

    _ensureCtx() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 播放合成音效
    play(type) {
        if (!this.enabled || !this.ctx) return;
        this._ensureCtx();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        switch(type) {
            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            case 'coin':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(1100, now + 0.05);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.15);
                osc.start(now); osc.stop(now + 0.15);
                break;
            case 'key':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
                break;
            case 'attack':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.12);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.12);
                osc.start(now); osc.stop(now + 0.12);
                break;
            case 'hit':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(60, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now); osc.stop(now + 0.3);
                break;
            case 'kill':
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now); osc.stop(now + 0.2);
                break;
            case 'levelComplete':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.15);
                osc.frequency.setValueAtTime(784, now + 0.3);
                osc.frequency.setValueAtTime(1047, now + 0.45);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now); osc.stop(now + 0.6);
                break;
            case 'gameOver':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.5);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);
                osc.start(now); osc.stop(now + 0.6);
                break;
            case 'victory':
                osc.type = 'sine';
                const notes = [523, 659, 784, 1047, 784, 1047, 1318];
                notes.forEach((freq, i) => {
                    osc.frequency.setValueAtTime(freq, now + i * 0.12);
                });
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.9);
                osc.start(now); osc.stop(now + 0.9);
                break;
        }
    }
}

const sound = new SoundManager();

// ==================== 游戏状态 ====================
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

// ==================== 关卡数据 ====================
const LEVELS = [
    // 关卡 1 - 入门
    {
        name: "绿野森林",
        platforms: [
            {x: 0, y: 560, w: 900, h: 40},
            {x: 200, y: 460, w: 120, h: 20},
            {x: 400, y: 380, w: 120, h: 20},
            {x: 600, y: 300, w: 120, h: 20},
            {x: 750, y: 220, w: 100, h: 20}
        ],
        coins: [
            {x: 250, y: 420}, {x: 450, y: 340}, {x: 650, y: 260},
            {x: 100, y: 520}, {x: 350, y: 520}
        ],
        key: {x: 800, y: 180},
        flag: {x: 850, y: 510},
        playerStart: {x: 50, y: 500},
        monsters: [
            {type: 'patrol', x: 300, y: 520, range: 150},
            {type: 'patrol', x: 500, y: 520, range: 100}
        ],
        background: '#1a472a'
    },
    // 关卡 2 - 进阶
    {
        name: "熔岩洞穴",
        platforms: [
            {x: 0, y: 560, w: 200, h: 40},
            {x: 250, y: 560, w: 150, h: 40},
            {x: 450, y: 560, w: 150, h: 40},
            {x: 650, y: 560, w: 250, h: 40},
            {x: 100, y: 450, w: 100, h: 20},
            {x: 280, y: 380, w: 100, h: 20},
            {x: 450, y: 300, w: 100, h: 20},
            {x: 600, y: 230, w: 150, h: 20},
            {x: 750, y: 150, w: 100, h: 20}
        ],
        coins: [
            {x: 130, y: 410}, {x: 310, y: 340}, {x: 480, y: 260},
            {x: 650, y: 190}, {x: 200, y: 520}, {x: 500, y: 520},
            {x: 700, y: 520}
        ],
        key: {x: 800, y: 110},
        flag: {x: 830, y: 510},
        playerStart: {x: 50, y: 500},
        monsters: [
            {type: 'patrol', x: 100, y: 520, range: 80},
            {type: 'chaser', x: 500, y: 520, range: 200},
            {type: 'jumper', x: 300, y: 340, range: 80}
        ],
        background: '#4a1c1c'
    },
    // 关卡 3 - 挑战
    {
        name: "天空之城",
        platforms: [
            {x: 0, y: 560, w: 150, h: 40},
            {x: 50, y: 450, w: 80, h: 20},
            {x: 180, y: 380, w: 80, h: 20},
            {x: 300, y: 450, w: 80, h: 20},
            {x: 420, y: 380, w: 80, h: 20},
            {x: 550, y: 300, w: 100, h: 20},
            {x: 700, y: 220, w: 80, h: 20},
            {x: 800, y: 150, w: 80, h: 20},
            {x: 700, y: 80, w: 100, h: 20},
            {x: 500, y: 130, w: 80, h: 20},
            {x: 350, y: 200, w: 80, h: 20}
        ],
        coins: [
            {x: 80, y: 410}, {x: 210, y: 340}, {x: 330, y: 410},
            {x: 450, y: 340}, {x: 580, y: 260}, {x: 730, y: 180},
            {x: 830, y: 110}, {x: 740, y: 40}, {x: 530, y: 90}
        ],
        key: {x: 380, y: 160},
        flag: {x: 100, y: 510},
        playerStart: {x: 50, y: 500},
        monsters: [
            {type: 'chaser', x: 200, y: 340, range: 60},
            {type: 'jumper', x: 450, y: 340, range: 60},
            {type: 'chaser', x: 600, y: 260, range: 80},
            {type: 'patrol', x: 720, y: 180, range: 60}
        ],
        background: '#1a1a4a'
    }
];

// ==================== 玩家类 ====================
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER_SPEED;
        this.jumpForce = CONFIG.JUMP_FORCE;
        this.onGround = false;
        this.lives = 3;
        this.score = 0;
        this.hasKey = false;
        this.coinsCollected = 0;
        this.facingRight = true;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
    }

    update(keys, platforms) {
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.vx = -this.speed;
            this.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.vx = this.speed;
            this.facingRight = true;
        } else {
            this.vx = 0;
        }

        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && this.onGround) {
            this.vy = this.jumpForce;
            this.onGround = false;
            sound.play('jump');
        }

        if (keys['KeyX'] && !this.isAttacking) {
            this.isAttacking = true;
            this.attackTimer = 20;
            sound.play('attack');
        }

        if (this.isAttacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }

        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        this.vy += CONFIG.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.width;
        }

        this.onGround = false;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.vy > 0 && this.y + this.height - this.vy <= platform.y) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                } else if (this.vy < 0 && this.y - this.vy >= platform.y + platform.h) {
                    this.y = platform.y + platform.h;
                    this.vy = 0;
                } else {
                    if (this.vx > 0) {
                        this.x = platform.x - this.width;
                    } else if (this.vx < 0) {
                        this.x = platform.x + platform.w;
                    }
                }
            }
        }

        if (this.y > CONFIG.CANVAS_HEIGHT) {
            this.die();
        }
    }

    checkCollision(obj) {
        return this.x < obj.x + (obj.w || obj.width) &&
               this.x + this.width > obj.x &&
               this.y < obj.y + (obj.h || obj.height) &&
               this.y + this.height > obj.y;
    }

    getAttackBox() {
        if (!this.isAttacking) return null;
        const attackWidth = 30;
        const attackHeight = 30;
        if (this.facingRight) {
            return { x: this.x + this.width, y: this.y + 5, w: attackWidth, h: attackHeight };
        } else {
            return { x: this.x - attackWidth, y: this.y + 5, w: attackWidth, h: attackHeight };
        }
    }

    die() {
        if (!this.invincible) {
            this.lives--;
            return this.lives <= 0;
        }
        return false;
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.invincible = true;
        this.invincibleTimer = 120;
    }

    draw(ctx) {
        if (this.invincible && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#fff';
        const eyeOffset = this.facingRight ? 18 : 6;
        ctx.fillRect(this.x + eyeOffset, this.y + 8, 8, 8);
        
        ctx.fillStyle = '#000';
        const pupilOffset = this.facingRight ? 22 : 8;
        ctx.fillRect(this.x + pupilOffset, this.y + 10, 4, 4);

        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
            const attackBox = this.getAttackBox();
            if (attackBox) {
                ctx.fillRect(attackBox.x, attackBox.y, attackBox.w, attackBox.h);
            }
        }

        ctx.globalAlpha = 1;
    }
}

// ==================== 怪兽基类 ====================
class Monster {
    constructor(x, y, range, type) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 36;
        this.startX = x;
        this.range = range;
        this.type = type;
        this.vx = 1.5;
        this.vy = 0;
        this.alive = true;
        this.direction = 1;
    }

    update(player, platforms) {
        this.x += this.vx * this.direction;
        if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
            this.direction *= -1;
        }
        this.vy += CONFIG.GRAVITY;
        this.y += this.vy;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.vy > 0) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                }
            }
        }
    }

    checkCollision(obj) {
        return this.x < obj.x + (obj.w || obj.width) &&
               this.x + this.width > obj.x &&
               this.y < obj.y + (obj.h || obj.height) &&
               this.y + this.height > obj.y;
    }

    draw(ctx) {}
}

// ==================== 巡逻型怪兽 ====================
class PatrolMonster extends Monster {
    constructor(x, y, range) {
        super(x, y, range, 'patrol');
        this.color = '#e74c3c';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + 10, 8, 8);
        ctx.fillRect(this.x + 20, this.y + 10, 8, 8);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 10, this.y + 12, 4, 4);
        ctx.fillRect(this.x + 22, this.y + 12, 4, 4);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + 22, 8, 0, Math.PI);
        ctx.stroke();
    }
}

// ==================== 追踪型怪兽 ====================
class ChaserMonster extends Monster {
    constructor(x, y, range) {
        super(x, y, range, 'chaser');
        this.color = '#9b59b6';
        this.speed = 2;
    }

    update(player, platforms) {
        const dx = player.x - this.x;
        if (Math.abs(dx) < this.range * 2) {
            if (dx > 0) {
                this.x += this.speed;
                this.direction = 1;
            } else if (dx < 0) {
                this.x -= this.speed;
                this.direction = -1;
            }
        } else {
            this.x += this.vx * this.direction;
            if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
                this.direction *= -1;
            }
        }
        this.vy += CONFIG.GRAVITY;
        this.y += this.vy;
        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.vy > 0) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#ff0';
        ctx.fillRect(this.x + 6, this.y + 8, 10, 8);
        ctx.fillRect(this.x + 20, this.y + 8, 10, 8);
        
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x + 9, this.y + 10, 4, 4);
        ctx.fillRect(this.x + 23, this.y + 10, 4, 4);

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 28);
        ctx.lineTo(this.x + 14, this.y + 34);
        ctx.lineTo(this.x + 18, this.y + 28);
        ctx.lineTo(this.x + 22, this.y + 34);
        ctx.lineTo(this.x + 26, this.y + 28);
        ctx.fill();
    }
}

// ==================== 跳跃型怪兽 ====================
class JumperMonster extends Monster {
    constructor(x, y, range) {
        super(x, y, range, 'jumper');
        this.color = '#2ecc71';
        this.jumpTimer = 60;
    }

    update(player, platforms) {
        this.jumpTimer--;
        if (this.jumpTimer <= 0 && this.vy === 0) {
            this.vy = -12;
            this.jumpTimer = 90;
        }

        this.x += this.vx * this.direction;
        if (this.x > this.startX + this.range || this.x < this.startX - this.range) {
            this.direction *= -1;
        }

        this.vy += CONFIG.GRAVITY;
        this.y += this.vy;

        for (let platform of platforms) {
            if (this.checkCollision(platform)) {
                if (this.vy > 0) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                }
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height/2);
        ctx.lineTo(this.x + this.width/2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height/2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + 12, 6, 6);
        ctx.fillRect(this.x + 22, this.y + 12, 6, 6);

        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 10, this.y + 14, 3, 3);
        ctx.fillRect(this.x + 24, this.y + 14, 3, 3);
    }
}

// ==================== 游戏主类 ====================
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        this.state = GameState.MENU;
        this.currentLevel = 0;
        this.player = null;
        this.platforms = [];
        this.coins = [];
        this.key = null;
        this.flag = null;
        this.monsters = [];
        this.keys = {};
        this.particles = [];
        this.frameCount = 0;
        this.bgDecorations = []; // 背景装饰元素
        
        this.setupEventListeners();
        this.setupUIListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyP' && this.state === GameState.PLAYING) {
                this.pause();
            } else if (e.code === 'KeyP' && this.state === GameState.PAUSED) {
                this.resume();
            }
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    setupUIListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => {
            document.getElementById('instructions').classList.toggle('hidden');
        });
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.state === GameState.PLAYING) this.pause();
            else if (this.state === GameState.PAUSED) this.resume();
        });
        document.getElementById('resume-btn').addEventListener('click', () => this.resume());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());
        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('retry-btn').addEventListener('click', () => this.restart());
        document.getElementById('menu-btn').addEventListener('click', () => this.quitToMenu());
    }

    startGame() {
        this.currentLevel = 0;
        this._savedLives = 3;
        this._savedScore = 0;
        this.loadLevel(this.currentLevel);
        this.showScreen('game-screen');
        this.state = GameState.PLAYING;
    }

    loadLevel(levelIndex) {
        const level = LEVELS[levelIndex];
        this.player = new Player(level.playerStart.x, level.playerStart.y);
        this.player.lives = this._savedLives || 3;
        this.player.score = this._savedScore || 0;
        this.player.hasKey = false;
        this.player.coinsCollected = 0;
        
        this.platforms = level.platforms.map(p => ({...p}));
        this.coins = level.coins.map(c => ({x: c.x, y: c.y, width: 20, height: 20, collected: false}));
        this.key = {...level.key, width: 25, height: 25, collected: false};
        this.flag = {...level.flag, width: 30, height: 50};
        
        this.monsters = level.monsters.map(m => {
            if (m.type === 'patrol') return new PatrolMonster(m.x, m.y, m.range);
            if (m.type === 'chaser') return new ChaserMonster(m.x, m.y, m.range);
            if (m.type === 'jumper') return new JumperMonster(m.x, m.y, m.range);
            return new Monster(m.x, m.y, m.range, m.type);
        });

        // 生成背景装饰
        this.generateBgDecorations(levelIndex);
        
        this.updateHUD();
    }

    // 生成关卡主题装饰元素
    generateBgDecorations(levelIndex) {
        this.bgDecorations = [];
        const level = LEVELS[levelIndex];
        const seed = levelIndex * 1000;

        if (levelIndex === 0) {
            // 绿野森林 - 树木、草地、云朵
            for (let i = 0; i < 8; i++) {
                this.bgDecorations.push({
                    type: 'tree', x: (seed + i * 120) % 850 + 20, y: 520,
                    size: 20 + Math.random() * 15
                });
            }
            for (let i = 0; i < 4; i++) {
                this.bgDecorations.push({
                    type: 'cloud', x: (seed + i * 230) % 800 + 30, y: 50 + Math.random() * 80,
                    size: 30 + Math.random() * 20
                });
            }
        } else if (levelIndex === 1) {
            // 熔岩洞穴 - 钟乳石、火焰
            for (let i = 0; i < 6; i++) {
                this.bgDecorations.push({
                    type: 'stalactite', x: (seed + i * 160) % 850 + 20, y: 0,
                    size: 30 + Math.random() * 40
                });
            }
            for (let i = 0; i < 3; i++) {
                this.bgDecorations.push({
                    type: 'flame', x: (seed + i * 300) % 800 + 50, y: 540,
                    size: 8 + Math.random() * 6
                });
            }
        } else {
            // 天空之城 - 云朵、星星
            for (let i = 0; i < 6; i++) {
                this.bgDecorations.push({
                    type: 'cloud', x: (seed + i * 160) % 850 + 20, y: 30 + Math.random() * 100,
                    size: 25 + Math.random() * 20
                });
            }
            for (let i = 0; i < 15; i++) {
                this.bgDecorations.push({
                    type: 'star', x: Math.random() * 880 + 10, y: Math.random() * 400 + 10,
                    size: 1 + Math.random() * 2
                });
            }
        }
    }

    update() {
        if (this.state !== GameState.PLAYING) return;

        this.frameCount++;
        this.player.update(this.keys, this.platforms);

        // 更新怪兽
        for (let monster of this.monsters) {
            if (monster.alive) {
                monster.update(this.player, this.platforms);
            }
        }

        // 玩家与怪兽碰撞检测
        const attackBox = this.player.getAttackBox();
        for (let monster of this.monsters) {
            if (!monster.alive) continue;

            if (this.player.checkCollision(monster)) {
                if (this.player.invincible) continue;
                const dead = this.player.die();
                sound.play('hit');
                if (dead) {
                    this.gameOver(false);
                    return;
                } else {
                    this.player.respawn(LEVELS[this.currentLevel].playerStart.x, 
                                       LEVELS[this.currentLevel].playerStart.y);
                }
            }

            // 攻击检测
            if (attackBox && monster.alive) {
                const monsterObj = {x: monster.x, y: monster.y, w: monster.width, h: monster.height};
                if (attackBox.x < monsterObj.x + monsterObj.w &&
                    attackBox.x + attackBox.w > monsterObj.x &&
                    attackBox.y < monsterObj.y + monsterObj.h &&
                    attackBox.y + attackBox.h > monsterObj.y) {
                    monster.alive = false;
                    this.player.score += 50;
                    sound.play('kill');
                    this.createParticles(monster.x + monster.width/2, monster.y + monster.height/2, '#ff0', 10);
                }
            }
        }

        // 收集金币
        for (let coin of this.coins) {
            if (!coin.collected && this.player.checkCollision(coin)) {
                coin.collected = true;
                this.player.score += 10;
                this.player.coinsCollected++;
                sound.play('coin');
                this.createParticles(coin.x + 10, coin.y + 10, '#ffd700', 5);
            }
        }

        // 收集钥匙
        if (!this.key.collected && this.player.checkCollision(this.key)) {
            this.key.collected = true;
            this.player.hasKey = true;
            sound.play('key');
            this.createParticles(this.key.x + 12, this.key.y + 12, '#ff6b6b', 8);
        }

        // 到达终点
        if (this.player.checkCollision(this.flag) && this.player.hasKey) {
            this.levelComplete();
        }

        // 更新粒子
        this.updateParticles();

        this.updateHUD();
    }

    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                life: 30,
                color: color
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        const level = LEVELS[this.currentLevel];
        
        // 背景
        this.ctx.fillStyle = level.background;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        if (this.state === GameState.MENU) return;

        // 绘制背景装饰
        this.drawBgDecorations(level);

        // 绘制平台（根据关卡主题不同样式）
        for (let platform of this.platforms) {
            this.drawPlatform(platform, this.currentLevel);
        }

        // 绘制金币（旋转动画）
        for (let coin of this.coins) {
            if (!coin.collected) {
                const bob = Math.sin(this.frameCount * 0.08 + coin.x) * 2;
                const scaleX = Math.abs(Math.cos(this.frameCount * 0.06 + coin.x * 0.1));

                this.ctx.save();
                this.ctx.translate(coin.x + 10, coin.y + 10 + bob);
                this.ctx.scale(Math.max(0.2, scaleX), 1);

                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#ffeb3b';
                this.ctx.beginPath();
                this.ctx.arc(-2, -2, 4, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.restore();
            }
        }

        // 绘制钥匙（浮动+发光动画）
        if (!this.key.collected) {
            const keyBob = Math.sin(this.frameCount * 0.06) * 3;
            const glow = 0.3 + Math.sin(this.frameCount * 0.08) * 0.2;

            // 发光效果
            this.ctx.fillStyle = `rgba(255, 107, 107, ${glow})`;
            this.ctx.beginPath();
            this.ctx.arc(this.key.x + 12, this.key.y + 12 + keyBob, 16, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(this.key.x + 12, this.key.y + 8 + keyBob, 8, 0, Math.PI * 2);
            this.ctx.fill();

            // 钥匙柄
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.key.x + 12, this.key.y + 16 + keyBob);
            this.ctx.lineTo(this.key.x + 12, this.key.y + 25 + keyBob);
            this.ctx.stroke();

            // 钥匙齿
            this.ctx.beginPath();
            this.ctx.moveTo(this.key.x + 12, this.key.y + 22 + keyBob);
            this.ctx.lineTo(this.key.x + 18, this.key.y + 22 + keyBob);
            this.ctx.moveTo(this.key.x + 12, this.key.y + 25 + keyBob);
            this.ctx.lineTo(this.key.x + 16, this.key.y + 25 + keyBob);
            this.ctx.stroke();
        }

        // 绘制旗帜
        if (this.flag) {
            // 旗杆
            this.ctx.fillStyle = '#888';
            this.ctx.fillRect(this.flag.x + 5, this.flag.y, 4, this.flag.height);
            // 旗帜
            this.ctx.fillStyle = this.player.hasKey ? '#4caf50' : '#f44336';
            this.ctx.beginPath();
            this.ctx.moveTo(this.flag.x + 9, this.flag.y);
            this.ctx.lineTo(this.flag.x + 30, this.flag.y + 10);
            this.ctx.lineTo(this.flag.x + 9, this.flag.y + 20);
            this.ctx.closePath();
            this.ctx.fill();
            // 旗帜文字提示
            if (!this.player.hasKey) {
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '10px sans-serif';
                this.ctx.fillText('🔒', this.flag.x + 12, this.flag.y + 14);
            }
        }

        // 绘制怪兽
        for (let monster of this.monsters) {
            if (monster.alive) {
                monster.draw(this.ctx);
            }
        }

        // 绘制玩家
        if (this.player) {
            this.player.draw(this.ctx);
        }

        // 绘制粒子
        for (let p of this.particles) {
            this.ctx.globalAlpha = p.life / 30;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;

        // 绘制关卡名称
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.font = '14px sans-serif';
        this.ctx.fillText(level.name, 10, CONFIG.CANVAS_HEIGHT - 10);

        // 钥匙提示
        if (!this.player.hasKey) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('💡 找到钥匙才能通关！', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 10);
            this.ctx.textAlign = 'left';
        }
    }

    // ==================== 屏幕管理 ====================
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    }

    // ==================== HUD 更新 ====================
    updateHUD() {
        if (!this.player) return;
        document.getElementById('level-display').textContent = this.currentLevel + 1;
        document.getElementById('lives-display').textContent = this.player.lives;
        document.getElementById('score-display').textContent = this.player.score;
        document.getElementById('key-display').textContent = this.player.hasKey ? '1/1' : '0/1';
    }

    // ==================== 暂停/恢复 ====================
    pause() {
        this.state = GameState.PAUSED;
        this.showScreen('pause-screen');
    }

    resume() {
        this.state = GameState.PLAYING;
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
    }

    // ==================== 重新开始 ====================
    restart() {
        this.startGame();
    }

    // ==================== 返回主菜单 ====================
    quitToMenu() {
        this.state = GameState.MENU;
        this.showScreen('start-screen');
    }

    // ==================== 关卡完成 ====================
    levelComplete() {
        this.state = GameState.LEVEL_COMPLETE;
        this._savedLives = this.player.lives;
        this._savedScore = this.player.score;
        document.getElementById('level-score').textContent = this.player.score;
        document.getElementById('level-coins').textContent = this.player.coinsCollected;

        if (this.currentLevel >= LEVELS.length - 1) {
            // 所有关卡完成 - 胜利！
            sound.play('victory');
            this.gameOver(true);
            return;
        }

        sound.play('levelComplete');
        this.showScreen('level-complete');
    }

    // ==================== 下一关 ====================
    nextLevel() {
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
        this.showScreen('game-screen');
        this.state = GameState.PLAYING;
    }

    // ==================== 游戏结束 ====================
    gameOver(isVictory) {
        this.state = isVictory ? GameState.VICTORY : GameState.GAME_OVER;
        if (!isVictory) sound.play('gameOver');
        document.getElementById('gameover-title').textContent = isVictory ? '🏆 恭喜通关！' : '💀 游戏结束';
        document.getElementById('final-score').textContent = this.player.score;
        document.getElementById('final-level').textContent = this.currentLevel + 1;
        this.showScreen('game-over');
    }

    // ==================== 绘制平台（主题样式） ====================
    drawPlatform(platform, levelIndex) {
        const ctx = this.ctx;
        if (levelIndex === 0) {
            // 绿野森林 - 草地+泥土
            const g = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
            g.addColorStop(0, '#4a7c3f');
            g.addColorStop(0.3, '#5d4037');
            g.addColorStop(1, '#3e2723');
            ctx.fillStyle = g;
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
            // 草地顶部
            ctx.fillStyle = '#6abf4b';
            ctx.fillRect(platform.x, platform.y, platform.w, 4);
        } else if (levelIndex === 1) {
            // 熔岩洞穴 - 岩石+熔岩纹理
            const g = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
            g.addColorStop(0, '#5a3a3a');
            g.addColorStop(1, '#3d2020');
            ctx.fillStyle = g;
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
            // 熔岩边线
            ctx.strokeStyle = '#ff6b35';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.w, platform.h);
            // 熔岩裂隙效果
            if (platform.w > 60) {
                ctx.strokeStyle = 'rgba(255, 100, 50, 0.4)';
                ctx.lineWidth = 1;
                for (let i = 0; i < 2; i++) {
                    const cx = platform.x + 15 + i * (platform.w / 2);
                    ctx.beginPath();
                    ctx.moveTo(cx, platform.y + 2);
                    ctx.lineTo(cx + 5, platform.y + platform.h - 2);
                    ctx.stroke();
                }
            }
        } else {
            // 天空之城 - 白云石砖
            const g = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
            g.addColorStop(0, '#c0c8d8');
            g.addColorStop(1, '#8a95a8');
            ctx.fillStyle = g;
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
            // 石砖纹理
            ctx.strokeStyle = '#9aa5b8';
            ctx.lineWidth = 1;
            for (let bx = platform.x; bx < platform.x + platform.w; bx += 20) {
                ctx.strokeRect(bx, platform.y, Math.min(20, platform.x + platform.w - bx), platform.h);
            }
        }
    }

    // ==================== 绘制背景装饰 ====================
    drawBgDecorations(level) {
        const ctx = this.ctx;
        const t = this.frameCount;

        for (let dec of this.bgDecorations) {
            switch(dec.type) {
                case 'tree': {
                    // 树干
                    ctx.fillStyle = '#5d4037';
                    ctx.fillRect(dec.x + dec.size / 3, dec.y - dec.size, dec.size / 3, dec.size);
                    // 树冠
                    ctx.fillStyle = '#2e7d32';
                    ctx.beginPath();
                    ctx.arc(dec.x + dec.size / 2, dec.y - dec.size - dec.size / 2, dec.size / 2 + 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#388e3c';
                    ctx.beginPath();
                    ctx.arc(dec.x + dec.size / 2 - 4, dec.y - dec.size - dec.size / 2 + 3, dec.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
                case 'cloud': {
                    const offsetY = Math.sin(t * 0.02 + dec.x * 0.1) * 5;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.beginPath();
                    ctx.arc(dec.x, dec.y + offsetY, dec.size, 0, Math.PI * 2);
                    ctx.arc(dec.x + dec.size * 0.8, dec.y + offsetY - 5, dec.size * 0.7, 0, Math.PI * 2);
                    ctx.arc(dec.x - dec.size * 0.6, dec.y + offsetY + 3, dec.size * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
                case 'stalactite': {
                    ctx.fillStyle = 'rgba(100, 80, 80, 0.5)';
                    ctx.beginPath();
                    ctx.moveTo(dec.x, dec.y);
                    ctx.lineTo(dec.x - 8, dec.y);
                    ctx.lineTo(dec.x - 4, dec.y + dec.size);
                    ctx.lineTo(dec.x + 4, dec.y + dec.size);
                    ctx.lineTo(dec.x + 8, dec.y);
                    ctx.closePath();
                    ctx.fill();
                    break;
                }
                case 'flame': {
                    const flicker = Math.sin(t * 0.15 + dec.x) * 3;
                    ctx.fillStyle = 'rgba(255, 100, 20, 0.6)';
                    ctx.beginPath();
                    ctx.arc(dec.x, dec.y - dec.size + flicker, dec.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255, 200, 50, 0.4)';
                    ctx.beginPath();
                    ctx.arc(dec.x, dec.y - dec.size + 2 + flicker, dec.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
                case 'star': {
                    const twinkle = Math.sin(t * 0.05 + dec.x + dec.y) * 0.3 + 0.7;
                    ctx.fillStyle = `rgba(255, 255, 220, ${twinkle * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(dec.x, dec.y, dec.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
            }
        }
    }

    // ==================== 主循环 ====================
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ==================== 启动游戏 ====================
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
