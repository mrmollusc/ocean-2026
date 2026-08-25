const fishTexture = PIXI.Texture.WHITE;
export class BulletManager {
    constructor(physicsWorld, stage) {
        this.physicsWorld = physicsWorld;
        this.stage = stage;

        this.pool = [];
        this.active = [];

        for (let i = 0; i < 300; i++) {
            const body = Matter.Bodies.rectangle(-9999, -9999, 20, 20, {
                isSensor: false,
                frictionAir: 0,
                inertia: Infinity,
                collisionFilter: {
                    category: 0x0002,
                    mask: 0x0000
                }
            });

            const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
            sprite.anchor.set(0.5);
            sprite.visible = false;

            Matter.World.add(this.physicsWorld, body);

            this.stage.addChild(sprite);

            this.pool.push({ 
                body, 
                sprite, 
                vx: 0, 
                vy: 0, 
                dead: true, 
                updateFn: null, 
                damage: 10, //default damage
                ignoreIframes: false, //no immunity from this
                harmless: false, //no damage from this
                persistent: false, //bullet does NOT die on hit
                pierce: false //bullet can hit multiple times
            });
        }
    }

    spawnFromPool(texture, x, y, vx, vy, updateFn = null) {
        const b = this.pool.find(b => b.dead);
        if (!b) return;

        b.dead = false;
        b.vx = vx;
        b.vy = vy;
        b.updateFn = updateFn;

        b.sprite.texture = texture;
        b.sprite.visible = true;
        b.sprite.width = 20;
        b.sprite.height = 20;
        //b.sprite.tint = 0x00aaff; //default tint

        Matter.Body.setPosition(b.body, { x, y });

        b.sprite.position.set(x, y);

        this.active.push(b);
    }
    update(dt) {
        for (let b of this.active) {
            if (!b || !b.body) continue;
            if (b.dead) continue;

            // Bullet velocity
            Matter.Body.setVelocity(b.body, { x: b.vx, y: b.vy });

            // Custom update
            if (b.updateFn) b.updateFn(b, dt);

            const x = b.body.position.x;
            const y = b.body.position.y;

            // Cleanup if leave bounds
            if (x < -50 || x > 2000 || y < -50 || y > 1200) {
                b.dead = true;
                b.sprite.visible = false;
                Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
            }
        }

        this.active = this.active.filter(b => b && !b.dead);
    }
    syncSprites() {
        for (const b of this.active) {
            if (!b || !b.body || b.dead) continue;

            b.sprite.position.set(b.body.position.x + b.vx, b.body.position.y + b.vy);
        }
    }
    serializeBullet(b) {
        return {
            x: b.body.position.x,
            y: b.body.position.y,
            vx: b.vx,
            vy: b.vy,
            damage: b.damage,
            harmless: b.harmless,
            ignoreIframes: b.ignoreIframes,
            persistent: b.persistent,
            pierce: b.pierce,
            tint: b.sprite.tint //SAVE TEMP COLOR (temporary color tint to replace actual textures for now)
        };
    }
    clearAll() {
        for (let b of this.active) {
            b.dead = true;
            b.sprite.visible = false;
            Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
        }
        this.active = [];
    }
    restoreBullets(savedBullets, texture) {
        if (!savedBullets) return;

        for (let data of savedBullets) {
            this.spawnFromPool(
                texture,
                data.x,
                data.y,
                data.vx,
                data.vy,
                (b) => {
                    b.damage = data.damage;
                    b.harmless = data.harmless;
                    b.ignoreIframes = data.ignoreIframes;
                    b.persistent = data.persistent;
                    b.pierce = data.pierce;

                    b.sprite.tint = data.tint ?? 0xFFFFFF; //if no tint, set to white as default
                }
            );
        }
    }
}
export class defaultBullet {
    static spawn(manager, texture, x, y, vx, vy) {
        manager.spawnFromPool(texture, x, y, vx, vy);
    }
}
export class Bullet{
    
}
export class anemoneBullet {
    static speed = 1;
    static damage = 5;
    static spawnSemicircle(manager, texture, x, y, count = 12, speed = 6) {
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;

        for (let i = 0; i < count; i++) {
            const angle = startAngle + (i / (count - 1)) * (endAngle - startAngle);

            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            manager.spawnFromPool(texture, x, y, vx, vy, (b) => {
                b.sprite.width = 20;
                b.sprite.height = 20;
                b.sprite.tint = "#ea1498"; // optional color
                b.damage = this.damage;
                b.harmless = false;
                b.persistent = false;
            });
        }
    }
}
export class bossRockBullet{
    
}
export class bossFishBullet {
    static speed = 5;
    static damage = 0;

    static spawn(manager, texture, x, y) {
        const vx = this.speed * Math.cos(-Math.PI / 3);
        const vy = this.speed * Math.sin(-Math.PI / 3);

        manager.spawnFromPool(fishTexture, x, y, vx, vy, (b) => {
            b.sprite.width = 20;
            b.sprite.height = 20;
            b.sprite.tint = 0x00aaff; // optional color
            b.damage = this.damage;
            b.damage = 0;
            b.harmless = true;
            b.persistent = true;
        });
    }
}
export class bossTurtleBullet {
    static speed = 15;
    static damage = 20;

    static spawn(manager, texture, x, y) {
        const vx = this.speed * Math.cos(-Math.PI / 3);
        const vy = this.speed * Math.sin(-Math.PI / 3);

        manager.spawnFromPool(texture, x, y, vx, vy, (b) => {
            b.sprite.width = 20;
            b.sprite.height = 20;
            b.sprite.tint = '#31eb4a';
            b.sprite.rotation += 0.02;
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = false;
        });
    }
}
export function anemonePattern(manager, texture, x, y, count = 12, speed = 6) {
    const startAngle = Math.PI;      // 180°
    const endAngle = 2 * Math.PI;    // 360°

    for (let i = 0; i < count; i++) {
        const angle = startAngle + (i / (count - 1)) * (endAngle - startAngle);

        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        anemoneBullet.spawnSemicircle(manager, texture, x, y)
    }
}
export function bossFishPattern(manager, texture, world) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            bossFishBullet.spawn(manager, texture, i * 200, 400);
        }, i * 500); // Spawn bullets with a delay of 500ms between each
    }
}

export function bossTurtlePattern(manager, texture, world) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            bossTurtleBullet.spawn(manager, texture, i * 200, 400);
        }, i * 0); // Spawn bullets with a delay of 500ms between each
    }
}