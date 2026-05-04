/**
 * 物理系统模块
 * 处理所有物理引擎逻辑，包括Matter.js物理世界初始化、碰撞检测、物体创建和轨迹计算
 */
export class PhysicsSystem {
    constructor(scene) {
        this.scene = scene;
        this.matter = scene.matter;
        this.world = scene.matter.world;
        this.engine = scene.matter.world.engine;
        this.collisionCallbacks = [];
        this._collisionSetup = false;
        this._collisionHandler = null;
        this.config = {
            gravity: { x: 0, y: 1 },
            launchPower: 0.15,
            materials: {
                wood: { health: 100, density: 0.001, friction: 0.5, restitution: 0.3 },
                stone: { health: 300, density: 0.003, friction: 0.8, restitution: 0.1 },
                glass: { health: 50, density: 0.001, friction: 0.2, restitution: 0.5 }
            }
        };
        this.setupCollisions();
    }

    calculateImpactForce(bodyA, bodyB) {
        const velocityA = bodyA.velocity;
        const velocityB = bodyB.velocity;
        const relativeVelocity = Math.sqrt(
            Math.pow(velocityA.x - velocityB.x, 2) + Math.pow(velocityA.y - velocityB.y, 2)
        );
        return relativeVelocity * (bodyA.mass + bodyB.mass) / 2;
    }

    onCollision(callback) {
        if (typeof callback === 'function') this.collisionCallbacks.push(callback);
    }

    setupCollisions() {
        if (this._collisionSetup) return;
        this._collisionSetup = true;
        this._collisionHandler = (event) => {
            event.pairs.forEach(pair => {
                const impactForce = this.calculateImpactForce(pair.bodyA, pair.bodyB);
                this.collisionCallbacks.forEach(cb => cb(pair.bodyA, pair.bodyB, impactForce));
            });
        };
        this.world.on('collisionstart', this._collisionHandler);
    }

    createBody(options) {
        const { type = 'rectangle', x, y, material = 'wood', isStatic = false, label = 'body' } = options;
        const mp = this.config.materials[material] || this.config.materials.wood;
        const bodyOpts = { isStatic, friction: mp.friction, restitution: mp.restitution, density: mp.density, label, material };
        let body;
        switch (type) {
            case 'circle': body = this.matter.add.circle(x, y, options.radius, bodyOpts); break;
            case 'polygon': body = this.matter.add.polygon(x, y, options.sides || 3, options.radius || 50, bodyOpts); break;
            default: body = this.matter.add.rectangle(x, y, options.width, options.height, bodyOpts);
        }
        body.material = material;
        body.health = mp.health;
        return body;
    }

    applyForce(body, force) {
        if (body && force) this.matter.body.applyForce(body, body.position, { x: force.x / body.mass, y: force.y / body.mass });
    }

    calculateTrajectory(startPos, velocity, steps = 10) {
        const points = [];
        const vx = velocity.x * this.config.launchPower;
        const vy = velocity.y * this.config.launchPower;
        for (let i = 0; i < steps; i++) {
            const t = i * 0.1;
            const x = startPos.x + vx * t * 60;
            const y = startPos.y + vy * t * 60 + 0.5 * this.config.gravity.y * t * t * 3600;
            if (y > 720) break;
            points.push({ x, y });
        }
        return points;
    }

    destroyBody(body) { if (body && this.world) this.matter.world.remove(body); }
    getMaterialConfig(name) { return this.config.materials[name] || this.config.materials.wood; }
    setGravity(x, y) { this.world.setGravity(x, y); this.config.gravity = { x, y }; }
    getGravity() { return this.config.gravity; }
    getAllBodies() { return this.engine.world.bodies; }
    isAllSleeping(threshold = 0.5) { return this.getAllBodies().every(b => b.isStatic || b.speed < threshold); }

    cleanup() {
        // 移除碰撞事件监听，防止场景销毁后内存泄漏
        if (this._collisionHandler && this.world) {
            this.world.off('collisionstart', this._collisionHandler);
        }
        this._collisionSetup = false;
        this._collisionHandler = null;
        this.collisionCallbacks = [];
        // 销毁非静态物体
        this.getAllBodies().forEach(b => {
            if (!b.isStatic || b.label !== 'ground') this.destroyBody(b);
        });
    }
}
