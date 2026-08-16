
export class bullet {
    constructor(texture, x, y, vx, vy, world) {
        this.sprite = new PIXI.Sprite(texture);
        this.x = x;
        this.y = y;
        
        this.body = Matter.Bodies.rectangle(x, y, 20, 20, { isSensor: true });
        Matter.World.add(world, this.body);
        this.sprite.anchor.set(0.5);

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.dead = false;
    }

    update(dt) {
        Matter.Body.setVelocity(this.body, { x: this.vx, y: this.vy });
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }

    destroy(world, stage) {
        Matter.World.remove(world, this.body);
        stage.removeChild(this.sprite);
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
        super(texture, x, y, vx, vy, world);
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
        super(texture, x, y, vx, vy, world);

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