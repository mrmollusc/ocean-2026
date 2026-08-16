
export class bullet {
    constructor(x, y, vx, vy, world, stage, texture = PIXI.Texture.WHITE) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = 20;
        this.sprite.height = 20;
        this.sprite.position.set(x, y);

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.dead = false;

        this.body = Matter.Bodies.rectangle(x, y, 20, 20, { isSensor: true });

        if (world) {
            Matter.World.add(world, this.body);
        }

        if (stage && stage.addChild) {
            stage.addChild(this.sprite);
        } else if (world && world.addChild) {
            world.addChild(this.sprite);
        }
    }

    update(dt) {
        Matter.Body.setVelocity(this.body, { x: this.vx, y: this.vy });
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }

    destroy(world, stage) {
        if (world) {
            Matter.World.remove(world, this.body);
        }
        if (stage && stage.removeChild) {
            stage.removeChild(this.sprite);
        } else if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.dead = true;
    }
}
export class defaultBullet extends bullet {

}
export class Bullet extends bullet {
    
}
export class bossRockBullet extends bullet {
    
}
export class bossFishBullet extends bullet {
    constructor(texture, x, y, world) {
        const speed = 5;
        const vx = speed * Math.cos(-Math.PI / 4);
        const vy = speed * Math.sin(-Math.PI / 4);
        super(x, y, vx, vy, world, world, texture);
    }

    update(dt) {
        super.update(dt);
        this.sprite.rotation += 0.05; // Rotate the bullet sprite for visual effect
    }   
}
export class bossTurtleBullet extends bullet {
    constructor(texture, x, y, world) {
        const speed = 10;
        const vx = speed * Math.cos(-Math.PI / 4);
        const vy = speed * Math.sin(-Math.PI / 4);
        super(x, y, vx, vy, world, world, texture);

        this.damage = 20;
    }

    update(dt) {
        super.update(dt);
        this.sprite.rotation += 0.02; // Rotate the bullet sprite for visual effect
    }
}

export class BulletManager {
    constructor(world, stage) {
        this.world = world;
        this.stage = stage;
        this.bullets = [];
    }

    spawn(bullet) {
        this.bullets.push(bullet);
        this.stage.addChild(bullet.sprite);
    }

    update(dt) {
        for (let b of this.bullets) {
            if (!b.dead) b.update(dt);
        }

        this.bullets = this.bullets.filter(b => !b.dead);
    }
}

export function bossFishPattern(manager, texture, world) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            manager.spawn(new bossFishBullet(texture, i * 40, 200, world));
        }, i * 500); // Spawn bullets with a delay of 500ms between each
    }
}

export function bossTurtlePattern(manager, texture, world) {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            manager.spawn(new bossTurtleBullet(texture, i * 40, 200, world));
        }, i * 0); // Spawn bullets with a delay of 500ms between each
    }
}