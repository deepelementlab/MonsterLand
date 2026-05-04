/**
 * 输入处理系统模块
 * 处理弹弓拖拽、小鸟发射和轨迹预测的所有输入逻辑
 */
import { GameConfig } from '../config/game.config.js';
import { SIZES, TIMING, VISUAL } from '../utils/constants.js';

export class InputSystem {
    constructor(scene) {
        this.scene = scene;
        this.isDragging = false;
        this.trajectoryPoints = [];
        this.enabled = false;
        
        // 回调函数
        this.onLaunch = null;
        this.onRoundEnd = null;
        this.onDragStart = null;
        this.onDragMove = null;
        this.onDragCancel = null;
        
        // 外部引用（通过init设置）
        this.getSlingshot = null;
        this.getCurrentBird = null;
        this.getGameState = null;
    }
    
    init(config = {}) {
        if (config.onLaunch) this.onLaunch = config.onLaunch;
        if (config.onRoundEnd) this.onRoundEnd = config.onRoundEnd;
        if (config.onDragStart) this.onDragStart = config.onDragStart;
        if (config.onDragMove) this.onDragMove = config.onDragMove;
        if (config.onDragCancel) this.onDragCancel = config.onDragCancel;
        if (config.getSlingshot) this.getSlingshot = config.getSlingshot;
        if (config.getCurrentBird) this.getCurrentBird = config.getCurrentBird;
        if (config.getGameState) this.getGameState = config.getGameState;
    }
    
    setup() {
        this.scene.input.on('pointerdown', (pointer) => this.handlePointerDown(pointer));
        this.scene.input.on('pointermove', (pointer) => this.handlePointerMove(pointer));
        this.scene.input.on('pointerup', () => this.handlePointerUp());
        this.enabled = true;
    }
    
    enable() { this.enabled = true; }
    disable() { this.enabled = false; this.isDragging = false; }
    
    _getLaunchPoint(slingshot) {
        return slingshot.launchPoint || { x: slingshot.x, y: slingshot.y };
    }
    
    handlePointerDown(pointer) {
        if (!this.enabled) return;
        const gameState = this.getGameState ? this.getGameState() : null;
        // 只在ready状态允许拖拽（playing状态表示鸟已发射）
        if (gameState !== 'ready') return;
        const slingshot = this.getSlingshot ? this.getSlingshot() : null;
        const currentBird = this.getCurrentBird ? this.getCurrentBird() : null;
        if (!slingshot || !currentBird || currentBird.launched) return;
        
        const lp = this._getLaunchPoint(slingshot);
        const distance = Phaser.Math.Distance.Between(
            pointer.x, pointer.y, lp.x, lp.y
        );
        if (distance < SIZES.SLINGSHOT_ACTIVE_RADIUS) {
            this.isDragging = true;
            currentBird.startAiming();
            if (this.onDragStart) this.onDragStart();
        }
    }
    
    handlePointerMove(pointer) {
        if (!this.isDragging) return;
        const slingshot = this.getSlingshot ? this.getSlingshot() : null;
        const currentBird = this.getCurrentBird ? this.getCurrentBird() : null;
        if (!slingshot || !currentBird) return;
        
        const lp = this._getLaunchPoint(slingshot);
        const dx = lp.x - pointer.x;
        const dy = lp.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = GameConfig.slingshot.maxDragDistance;
        
        let finalX, finalY;
        if (distance > maxDist) {
            const ratio = maxDist / distance;
            finalX = lp.x - dx * ratio;
            finalY = lp.y - dy * ratio;
        } else {
            finalX = pointer.x;
            finalY = pointer.y;
        }
        
        currentBird.setPosition(finalX, finalY);
        slingshot.updateBand(finalX, finalY);
        // 用鸟的实际位置计算发射向量，与handlePointerUp完全一致
        this.showTrajectory(lp.x - finalX, lp.y - finalY, finalX, finalY);
        if (this.onDragMove) this.onDragMove(finalX, finalY);
    }
    
    handlePointerUp() {
        if (!this.isDragging) return;
        const slingshot = this.getSlingshot ? this.getSlingshot() : null;
        const currentBird = this.getCurrentBird ? this.getCurrentBird() : null;
        if (!slingshot || !currentBird) return;
        
        this.isDragging = false;
        
        // 清除之前的回合结束定时器，防止并发
        if (this._roundEndTimer) {
            this._roundEndTimer.remove();
            this._roundEndTimer = null;
        }
        
        const lp = this._getLaunchPoint(slingshot);
        const dx = lp.x - currentBird.x;
        const dy = lp.y - currentBird.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < GameConfig.slingshot.minDragDistance) {
            currentBird.moveToSlingshot(lp.x, lp.y);
            slingshot.resetBand();
            this.hideTrajectory();
            if (this.onDragCancel) this.onDragCancel();
            return;
        }
        
        const power = GameConfig.slingshot.launchPower;
        currentBird.launch(dx * power, dy * power);
        slingshot.release();
        this.hideTrajectory();
        if (this.onLaunch) this.onLaunch(currentBird);
        
        this._roundEndTimer = this.scene.time.delayedCall(TIMING.NEXT_BIRD_DELAY, () => {
            this._roundEndTimer = null;
            if (this.onRoundEnd) this.onRoundEnd();
        });
    }
    
    /**
     * 显示轨迹预测
     * @param {number} dx - 发射向量x分量 (lp.x - birdX)
     * @param {number} dy - 发射向量y分量 (lp.y - birdY)
     * @param {number} startX - 起始位置x（拖拽时鸟的位置）
     * @param {number} startY - 起始位置y（拖拽时鸟的位置）
     */
    showTrajectory(dx, dy, startX, startY) {
        this.hideTrajectory();
        const currentBird = this.getCurrentBird ? this.getCurrentBird() : null;
        if (!currentBird) return;
        
        const power = GameConfig.slingshot.launchPower;
        const launchVx = dx * power;
        const launchVy = dy * power;
        
        // === 完全复现 Matter.js Body.update 的 Verlet 积分 ===
        const engine = this.scene.matter.world.engine;
        const body = currentBird.body;
        const mass = body.mass || 1;
        const frictionAirVal = body.frictionAir || 0.01;
        const gY = engine.gravity.y;
        const gScale = engine.gravity.scale || 0.001;
        const baseDelta = 1000 / 60; // Common._baseDelta
        const delta = (engine.timing && engine.timing.delta) || baseDelta;
        const bodyTimeScale = body.timeScale || 1;
        const deltaTime = delta * bodyTimeScale;
        const deltaTimeSquared = deltaTime * deltaTime;
        
        // Matter.js 实际的 frictionAir 因子: 1 - body.frictionAir * (deltaTime / baseDelta)
        // 当 deltaTime == baseDelta 时, 等价于 1 - body.frictionAir
        const frictionAirFactor = 1 - frictionAirVal * (deltaTime / baseDelta);
        
        // 重力力 = mass * gravity.y * gravity.scale (与 Engine._bodiesUpdate 一致)
        // 对速度的贡献 = (force / mass) * deltaTime^2 = gravity.y * gravity.scale * deltaTime^2
        const gravForcePerMass = gY * gScale;
        
        const MAX_FRAMES = 180;
        const DOT_INTERVAL = 4;
        const camWidth = this.scene.cameras.main.width;
        const camHeight = this.scene.cameras.main.height;
        
        // Verlet 积分: 用 position + positionPrev 追踪
        // setVelocity 的效果: positionPrev = position - velocity * timeScale
        const initTimeScale = (body.deltaTime || baseDelta) / baseDelta; // 通常 = 1
        let posX = startX !== undefined ? startX : currentBird.x;
        let posY = startY !== undefined ? startY : currentBird.y;
        let prevX = posX - launchVx * initTimeScale;
        let prevY = posY - launchVy * initTimeScale;
        
        for (let frame = 1; frame <= MAX_FRAMES; frame++) {
            // correction = deltaTime / (body.deltaTime || deltaTime), 首帧后 body.deltaTime == deltaTime
            const correction = deltaTime / deltaTime; // = 1 (稳定状态)
            
            // Verlet 速度 = (pos - prev) * correction
            const velPrevX = (posX - prevX) * correction;
            const velPrevY = (posY - prevY) * correction;
            
            // 新速度 = velPrev * frictionAir + force/mass * dt^2
            const velX = velPrevX * frictionAirFactor + 0; // 无水平力
            const velY = velPrevY * frictionAirFactor + gravForcePerMass * deltaTimeSquared;
            
            // 更新位置 (Verlet)
            prevX = posX;
            prevY = posY;
            posX += velX;
            posY += velY;
            
            if (posX > camWidth + 50 || posX < -50 || posY > camHeight + 20 || posY < -100) break;
            
            if (frame % DOT_INTERVAL === 0) {
                const dotIdx = frame / DOT_INTERVAL;
                const alpha = Math.max(0.25, 0.9 - dotIdx * 0.04);
                const dot = this.scene.add.circle(posX, posY, VISUAL.TRAJECTORY_DOT_RADIUS, 0xFFFFFF, alpha);
                dot.setDepth(50);
                this.trajectoryPoints.push(dot);
            }
        }
    }
    
    hideTrajectory() {
        this.trajectoryPoints.forEach(dot => dot.destroy());
        this.trajectoryPoints = [];
    }
    
    destroy() {
        this.hideTrajectory();
        this.scene.input.off('pointerdown');
        this.scene.input.off('pointermove');
        this.scene.input.off('pointerup');
        this.enabled = false;
    }
}
