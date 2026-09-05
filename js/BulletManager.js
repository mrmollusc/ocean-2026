const spriteSheet = await PIXI.Assets.load("assets/sprites v0.2.png");

function createSpriteFrames(x, y, width, height) {
    return Array.from({ length: 5 }, (_, index) => new PIXI.Texture({
        source: spriteSheet.source,
        frame: new PIXI.Rectangle(index * 128 + x, y, width, height)
    }));
}

const snailChargingFrames = createSpriteFrames(0, 80, 60, 38);
const snailBeginChargingFrames = createSpriteFrames(0, 0, 60, 38);
const snailStunnedFrames = createSpriteFrames(0, 40, 56, 38);
const nematocystFrames = createSpriteFrames(96, 0, 15, 32);
const bossFishFrames = createSpriteFrames(96, 96, 32, 32);
const bossTurtleFrames = createSpriteFrames(96, 32, 32, 32);
const anemoneFrames = createSpriteFrames(64, 10, 32, 22);

// RGB fish - single static textures (not animated)
const redFishTexture = new PIXI.Texture({
    source: spriteSheet.source,
    frame: new PIXI.Rectangle(64, 64, 32, 32)
});
const greenFishTexture = new PIXI.Texture({
    source: spriteSheet.source,
    frame: new PIXI.Rectangle(96, 64, 32, 32)
});
const blueFishTexture = new PIXI.Texture({
    source: spriteSheet.source,
    frame: new PIXI.Rectangle(64, 96, 32, 32)
});


export class BulletManager {
    constructor(physicsWorld, stage, engine) {
        this.physicsWorld = physicsWorld;
        this.stage = stage;

        this.pool = [];
        this.active = [];
        this.bulletsFrozen = false;
        this.freezeCenter = null;
        this.freezeRadius = Infinity;

        Matter.Events.on(engine, "collisionStart", ({ pairs }) => {
            for (const pair of pairs) this.handleCollision(pair);
        });

        for (let i = 0; i < 300; i++) {
            const body = Matter.Bodies.circle(-9999, -9999, 10, {
                isSensor: false,
                frictionAir: 0,
                inertia: Infinity,
                collisionFilter: {
                    category: 0x0002,
                    mask: 0x0000
                }
            });
            const sprite = new PIXI.AnimatedSprite([PIXI.Texture.WHITE]);
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
                pierce: false, //bullet can hit multiple times
                bounce: false,
                frozen: false,
                bounceCount: 0,
                bounceLimit: 0,
                bounceStoppedUntil: 0,
                chargingUntil: 0,
                spriteOffsetY: 0,
                hitboxScaleX: 1,
                hitboxScaleY: 1,
                isSnail: false,
                isAnemone: false,
                snailHealth: 3,
                isShocked: false,
                shockUntil: 0,
                isDizzyAnimating: false,
                isBossFish: false,
                isBossTurtle: false
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
        b.bounce = false;
        b.isSnail = false;
        b.isAnemone = false;
        b.snailHealth = 3; //snail health for debugging
        b.isShocked = false;
        b.shockUntil = 0;
        b.isDizzyAnimating = false;
        b.isBossFish = false;
        b.isBossTurtle = false;
        if (b.hitboxScaleX !== 1 || b.hitboxScaleY !== 1) {
            Matter.Body.scale(b.body, 1 / b.hitboxScaleX, 1 / b.hitboxScaleY);
            b.hitboxScaleX = 1;
            b.hitboxScaleY = 1;
        }
        b.frozen = this.bulletsFrozen && this.isInsideFreezeRadius(x, y);
        b.bounceCount = 0;
        b.bounceLimit = 0;
        b.bounceStoppedUntil = 0;
        b.chargingUntil = 0;
        b.isShocked = false;
        b.shockUntil = 0;
        b.isDizzyAnimating = false;
        b.snailHealth = 3; //reset snail health
        b.body.restitution = 0;
        b.body.friction = 0;
        for (const part of b.body.parts) {
            part.collisionFilter.category = 0x0002;
            part.collisionFilter.mask = 0x0000;
        }
        b.snailHitAt = new Map();

        b.sprite.texture = texture;
        b.sprite.visible = false;
        b.sprite.rotation = 0;
        b.sprite.width = 20;
        b.sprite.height = 20;
        b.sprite.tint = 0xFFFFFF; //reset tint to white

        Matter.Body.setPosition(b.body, { x, y });

        b.sprite.position.set(x, y);
        b.sprite.visible = true;

        this.active.push(b);
        return b;
    }
    spawnSnailBullets(snails, targetBody) {
        for (const snailBody of snails) {
            if (!snailBody || snailBody.is_dead) continue;

            const dx = targetBody.position.x - snailBody.position.x;
            const dy = targetBody.position.y - snailBody.position.y;
            const distance = Math.hypot(dx, dy) || 1;

            const bullet = snailBullet.spawn(
                this,
                snailBody.position.x,
                snailBody.position.y,
                (dx / distance) * snailBullet.speed,
                (dy / distance) * snailBullet.speed
            );

            if (bullet) {
                this.setSnailAnimation(bullet, snailChargingFrames);
                this.setSnailHitbox(bullet);
                bullet.bounce = true;
                bullet.body.restitution = 0;
                bullet.body.friction = 0;
            }
        }
    }
    spawnSnailBullet(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const spawnDistance = 30;

        const bullet = snailBullet.spawn(
            this,
            x + Math.cos(angle) * spawnDistance,
            y + Math.sin(angle) * spawnDistance,
            Math.cos(angle) * snailBullet.speed,
            Math.sin(angle) * snailBullet.speed
        );

        if (bullet) {
            this.setSnailAnimation(bullet, snailChargingFrames);
        }
        return bullet;
    }
    collidesWith(bulletBody, targetBody) {
        return bulletBody.parts.some((part) =>
            Matter.Bounds.overlaps(part.bounds, targetBody.bounds)
        );
    }
    isInsideFreezeRadius(x, y) {
        if (!this.freezeCenter) return true;

        return Math.hypot(
            x - this.freezeCenter.x,
            y - this.freezeCenter.y
        ) <= this.freezeRadius;
    }
    setFrozen(frozen, center = null, radius = Infinity) {
        this.bulletsFrozen = frozen;
        this.freezeCenter = frozen && center
            ? { x: center.x, y: center.y }
            : null;
        this.freezeRadius = frozen ? radius : Infinity;

        for (const b of this.active) {
            if (!b || b.dead) continue;

            b.frozen = frozen && this.isInsideFreezeRadius(
                b.body.position.x,
                b.body.position.y
            );
            if (frozen) {
                if (b.frozen) {
                    Matter.Body.setVelocity(b.body, { x: 0, y: 0 });
                }
            } else {
                Matter.Body.setVelocity(b.body, { x: b.vx, y: b.vy });
            }
        }
    }
    update(dt) {
        for (let b of this.active) {
            if (!b || !b.body) continue;
            if (b.dead) {
                b.sprite.visible = false;
                b.sprite.visible = false;
                continue;
            }

            if (b.frozen) {
                Matter.Body.setVelocity(b.body, { x: 0, y: 0 });
                continue;
            }

            // Handle shocked snails
            if (b.isShocked && b.shockUntil > performance.now()) {
                Matter.Body.setVelocity(b.body, { x: 0, y: 0 });
                // Show dizzy animation (play stunned frames at faster speed)
                if (!b.isDizzyAnimating) {
                    b.isDizzyAnimating = true;
                    this.setSnailAnimation(b, snailStunnedFrames);
                    b.sprite.animationSpeed = 0.3; // Faster animation for dizzy effect
                }
                continue;
            } else if (b.isShocked) {
                b.isShocked = false;
                b.isDizzyAnimating = false;
                // Resume normal animation after shock
                this.setSnailAnimation(b, snailChargingFrames);
            }

            if (b.bounceStoppedUntil > performance.now()) {
                Matter.Body.setVelocity(b.body, { x: 0, y: 0 });
                continue;
            }

            if (b.bounceStoppedUntil) {
                b.bounceStoppedUntil = 0;
                b.bounceCount = 0;
                this.setSnailAnimation(b, snailBeginChargingFrames);
                b.chargingUntil = performance.now() + 500;
            }

            if (b.chargingUntil && performance.now() >= b.chargingUntil) {
                b.chargingUntil = 0;
                this.setSnailAnimation(b, snailChargingFrames);
            }

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
    handleCollision(pair) {
        const bullet = this.active.find(({ body }) =>
            body === pair.bodyA || body.parts.includes(pair.bodyA) ||
            body === pair.bodyB || body.parts.includes(pair.bodyB)
        );
        if (!bullet || !bullet.bounce || bullet.dead) return;

        const bulletPart = bullet.body === pair.bodyA || bullet.body.parts.includes(pair.bodyA)
            ? pair.bodyA
            : pair.bodyB;
        const otherBody = bulletPart === pair.bodyA ? pair.bodyB : pair.bodyA;
        if (bullet.isSnail && otherBody.isPlayer) {
            const pushX = otherBody.position.x - bullet.body.position.x;
            const pushY = otherBody.position.y - bullet.body.position.y;
            const distance = Math.hypot(pushX, pushY) || 1;
            const pushStrength = 3;

            Matter.Body.setVelocity(otherBody, {
                x: otherBody.velocity.x + (pushX / distance) * pushStrength,
                y: otherBody.velocity.y + (pushY / distance) * pushStrength
            });
            return;
        }

        let normal = pair.collision.normal;
        const velocityAlongNormal = bullet.vx * normal.x + bullet.vy * normal.y;

        if (velocityAlongNormal > 0) {
            normal = { x: -normal.x, y: -normal.y };
        }

        const incomingSpeed = bullet.vx * normal.x + bullet.vy * normal.y;
        bullet.vx -= 2 * incomingSpeed * normal.x;
        bullet.vy -= 2 * incomingSpeed * normal.y;
        if (normal.x !== 0) {
            bullet.sprite.scale.x = bullet.vx < 0 ? -1 : 1;
        }
        bullet.bounceCount += 1;

        if (bullet.bounceCount >= bullet.bounceLimit) {
            bullet.bounceStoppedUntil = performance.now() + 3000;
            this.setSnailAnimation(bullet, snailStunnedFrames);
        }

        Matter.Body.setVelocity(bullet.body, { x: bullet.vx, y: bullet.vy });
    }
    syncSprites() {
        for (const b of this.active) {
            if (!b || !b.body || b.dead) continue;

            b.sprite.position.set(
                b.body.position.x + b.vx,
                b.body.position.y + b.vy + b.spriteOffsetY
            );
            b.sprite.position.set(b.sprite.position.x, b.sprite.position.y);
            
            // Rotate anemone bullets and fish/turtle bosses, but not snails
            if (b.isAnemone) {
                b.sprite.rotation = Math.atan2(b.vy, b.vx) + Math.PI / 2;
            }

            if (b.isBossFish || b.isBossTurtle) {
                b.sprite.rotation = Math.atan2(b.vy, b.vx);
            }

            if (b.isBossRGBFish) {
                b.sprite.rotation = Math.atan2(b.vy, b.vx) + Math.PI;
            }
            
            // Update health bar position if it exists
            if (b.healthBarGraphic) {
                b.healthBarGraphic.position.set(
                    b.body.position.x - 15, // barWidth / 2
                    b.body.position.y - 40
                );
            }
        }
    }
    setSnailAnimation(bullet, frames, loop = true) {
        bullet.sprite.textures = frames;
        bullet.sprite.loop = loop;
        bullet.sprite.animationSpeed = 0.12;
        bullet.sprite.gotoAndPlay(0);
        bullet.sprite.width = frames === snailStunnedFrames ? 56 : 60;
        bullet.sprite.height = 38;
        bullet.spriteOffsetY = frames === snailChargingFrames ? -2 : 0;
        bullet.sprite.scale.x = bullet.vx < 0 ? -1 : 1;
    }
    setSnailHitbox(bullet) {
        const scaleX = 3;
        const scaleY = 1.9;

        Matter.Body.scale(bullet.body, scaleX, scaleY);
        bullet.hitboxScaleX = scaleX;
        bullet.hitboxScaleY = scaleY;
        for (const part of bullet.body.parts) {
            part.collisionFilter.category = 0x0002;
            part.collisionFilter.mask = 0xFFFF;
        }
    }
    damageSnail(bullet) {
        if (!bullet.isSnail) return false;
        
        bullet.snailHealth--;
        
        // Show health bar for debugging
        if (bullet.healthBarGraphic) {
            this.stage.removeChild(bullet.healthBarGraphic);
        }
        
        const healthPercent = Math.max(0, bullet.snailHealth / 3);
        const barWidth = 30;
        const barHeight = 4;
        
        bullet.healthBarGraphic = new PIXI.Graphics();
        bullet.healthBarGraphic.rect(0, 0, barWidth * healthPercent, barHeight).fill(0x00ff00);
        bullet.healthBarGraphic.rect(0, 0, barWidth, barHeight).stroke({ color: 0x000000, width: 1 });
        bullet.healthBarGraphic.position.set(
            bullet.body.position.x - barWidth / 2,
            bullet.body.position.y - 40
        );
        this.stage.addChild(bullet.healthBarGraphic);
        
        if (bullet.snailHealth <= 0) {
            bullet.dead = true;
            bullet.sprite.visible = false;
            if (bullet.healthBarGraphic) {
                this.stage.removeChild(bullet.healthBarGraphic);
            }
            return true;
        }
        
        return false;
    }
    setSpriteAnimation(bullet) {
        bullet.sprite.textures = nematocystFrames;
        bullet.sprite.loop = true;
        bullet.sprite.animationSpeed = 0.12;
        bullet.sprite.width = 15;
        bullet.sprite.height = 32;
        bullet.sprite.rotation = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
        bullet.sprite.visible = true;
        bullet.sprite.play();
    }
    shockSnails(center, radius, duration = 1500) {
        const now = performance.now();
        for (const b of this.active) {
            if (!b || b.dead || !b.isSnail) continue;
            
            const dx = b.body.position.x - center.x;
            const dy = b.body.position.y - center.y;
            const distance = Math.hypot(dx, dy);
            
            if (distance <= radius) {
                b.isShocked = true;
                b.shockUntil = now + duration;
                this.damageSnail(b);
            }
        }
    }
    serializeBullet(b) {
        const now = performance.now();
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
            frozen: b.frozen,
            isSnail: b.isSnail,
            bounceCount: b.bounceCount,
            bounceLimit: b.bounceLimit,
            bounceStoppedRemaining: Math.max(0, b.bounceStoppedUntil - now),
            chargingRemaining: Math.max(0, b.chargingUntil - now),
            snailHealth: b.snailHealth,
            tint: b.sprite.tint //SAVE TEMP COLOR (temporary color tint to replace actual textures for now)
        };
    }
    clearAll() {
        for (let b of this.active) {
            b.dead = true;
            b.sprite.visible = false;
            b.sprite.visible = false;
            Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
        }
        this.active = [];
    }
    restoreBullets(savedBullets, texture) {
        if (!savedBullets) return;

        for (let data of savedBullets) {
            const bullet = this.spawnFromPool(
                data.isSnail ? snailChargingFrames[0] : texture,
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
                    b.frozen = data.frozen ?? false;

                    b.sprite.tint = data.tint ?? 0xFFFFFF; //if no tint, set to white as default
                }
            );

            if (bullet?.isSnail || data.isSnail) {
                bullet.isSnail = true;
                bullet.bounce = true;
                bullet.pierce = true;
                bullet.snailHealth = data.snailHealth ?? 3;
                this.setSnailHitbox(bullet);
                bullet.body.restitution = 0;
                bullet.body.friction = 0;
                bullet.body.collisionFilter.mask = 0xFFFF;
                bullet.bounceCount = data.bounceCount ?? 0;
                bullet.bounceLimit = data.bounceLimit ?? 2;

                if (data.bounceStoppedRemaining > 0) {
                    bullet.bounceStoppedUntil = performance.now() + data.bounceStoppedRemaining;
                    this.setSnailAnimation(bullet, snailStunnedFrames);
                } else if (data.chargingRemaining > 0) {
                    bullet.chargingUntil = performance.now() + data.chargingRemaining;
                    this.setSnailAnimation(bullet, snailBeginChargingFrames);
                } else {
                    this.setSnailAnimation(bullet, snailChargingFrames);
                }
            }
            if (bullet && data.isAnemone) {
                bullet.isAnemone = true;
                bullet.sprite.visible = false;
                this.setNematocystAnimation(bullet);
            }
        }
    }
}
export class defaultBullet {
    static spawn(manager, texture, x, y, vx, vy) {
        const txt = texture || PIXI.Texture.WHITE;
        return manager.spawnFromPool(txt, x, y, vx, vy);
    }
}
export class Bullet{
    
}
export class snailBullet {
    static speed = 4;
    static damage = 1;

    static spawn(manager, x, y, vx, vy) {
        const bullet = manager.spawnFromPool(snailChargingFrames[0], x, y, vx, vy, (b) => {
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = true;
            b.bounce = true;
            b.pierce = true;
            b.isSnail = true;
            b.bounceLimit = Math.floor(Math.random() * 2) + 2;
        });

        if (bullet) {
            bullet.sprite.tint = 0xFFFFFF;
            bullet.persistent = true;
            bullet.pierce = true;
            bullet.bounce = true;
            manager.setSnailHitbox(bullet);
            bullet.body.restitution = 0;
            bullet.body.friction = 0;
            bullet.body.collisionFilter.mask = 0xFFFF;
        }

        return bullet;
    }
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

            const bullet = manager.spawnFromPool(texture, x, y, vx, vy, (b) => {
                b.sprite.width = 15;
                b.sprite.height = 32;
                b.sprite.tint = 0xFFFFFF; // white - no color tint
                b.damage = this.damage;
                b.harmless = false;
                b.persistent = false;
            });

            if (bullet) {
                bullet.isAnemone = true;
                bullet.sprite.visible = false;
                manager.setSpriteAnimation(bullet);
            }
        }
    }
}
export class anemone {
    static lastspawnTime = 0;
    static x = 0;
    static y = 0;
    static initialize(x, y, stage) {
        anemone.x = x;
        anemone.y = y;
        const graphic = new PIXI.AnimatedSprite(anemoneFrames);
        stage.addChild(graphic);
        graphic.position.set(x, y);
        graphic.play();
        graphic.visible = true;
        graphic.animationSpeed = 0.12;
        graphic.scale.set(2, 2);
        graphic.anchor.set(0.5, 0.5);
    }
    static update(currentTime, manager, texture, x, y) {
        if (currentTime - anemone.lastspawnTime >= 1000) {
            anemoneBullet.spawnSemicircle(manager, texture, x, y);
            anemone.lastspawnTime = currentTime;
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

        manager.spawnFromPool(bossFishFrames[0], x, y, vx, vy, (b) => {
            b.sprite.width = 32;
            b.sprite.height = 32;
            b.sprite.animationSpeed = 0; // No animation
            b.isBossFish = true;
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

        manager.spawnFromPool(bossTurtleFrames[0], x, y, vx, vy, (b) => {
            b.sprite.width = 32;
            b.sprite.height = 32;
            b.sprite.animationSpeed = 0; // No animation
            b.isBossTurtle = true;
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = false;
        });
    }
}
export class bossRedFishBullet {
    static speed = 5;
    static damage = 25;

    static spawn(manager, texture, x, y) {
        const vx = -this.speed;
        const vy = 0;

        manager.spawnFromPool(redFishTexture, x, y, vx, vy, (b) => {
            b.sprite.width = 32;
            b.sprite.height = 32;
            b.sprite.animationSpeed = 0; // No animation
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = false;
            b.isBossRGBFish = true;
        });
    }
}
export class bossGreenFishBullet {
    static speed = 5;
    static damage = 25;

    static spawn(manager, texture, x, y) {
        const vx = -this.speed;
        const vy = 0;

        manager.spawnFromPool(greenFishTexture, x, y, vx, vy, (b) => {
            b.sprite.width = 32;
            b.sprite.height = 32;
            b.sprite.animationSpeed = 0; // No animation
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = false;
            b.isBossRGBFish = true;
        });
    }
}
export class bossBlueFishBullet {
    static speed = 5;
    static damage = 25;

    static spawn(manager, texture, x, y) {
        const vx = -this.speed;
        const vy = 0;

        manager.spawnFromPool(blueFishTexture, x, y, vx, vy, (b) => {
            b.sprite.width = 32;
            b.sprite.height = 32;
            b.sprite.animationSpeed = 0; // No animation
            b.damage = this.damage;
            b.harmless = false;
            b.persistent = false;
            b.isBossRGBFish = true;
        });
    }
}
export function bossFishPattern(manager, texture, world) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            bossFishBullet.spawn(manager, texture, 80 + i * 200, 400);
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

export function bossRGBFishPattern(manager, world) {
    // Lanes from top to bottom: 0, 120, 180 (y-coords: 200, 320, 380)
    // top: blue, middle: green, bottom: red
    const lanes = [
        { y: 0, fish: bossBlueFishBullet },      // top
        { y: 120, fish: bossGreenFishBullet },   // middle
        { y: 180, fish: bossRedFishBullet }      // bottom
    ];
    
    // Spawn each color in its assigned lane
    lanes.forEach(lane => {
        lane.fish.spawn(manager, null, 1600, 200 + lane.y);
    });
}