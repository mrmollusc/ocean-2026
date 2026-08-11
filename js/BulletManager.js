
export class bullet {
    constructor(texture, x, y, vx, vy, world) {
        this.sprite = new PIXI.Sprite(texture);
        this.x = x;
        this.y = y;
        
        this.body = Matter.Bodies.rectangle(x, y, 10, { isSensor: true });
        Matter.World.add(world, this.body);
        this.sprite.anchor.set(0.5);

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
        const speed = 3;
        const vx = speed * Math.cos(Math.PI / 4); // Example angle
        const vy = speed * Math.sin(Math.PI / 4); // Example angle
        super(texture, x, y, vx, vy, world);
    }

    update(dt) {
        super.update(dt);
        this.sprite.rotation += 0.05; // Rotate the bullet sprite for visual effect
    }
}
export class bossTurtleBullet extends bullet {
    constructor(texture, x, y, world) {
        const speed = 3;
        const vx = speed * Math.cos(Math.PI / 4); // Example angle
        const vy = speed * Math.sin(Math.PI / 4); // Example angle
        super(texture, x, y, vx, vy, world);

        this.damage = 20; // Set the damage value for the boss turtle bullet
    }

    update(dt) {
        super.update(dt);
        this.sprite.rotation += 0.02; // Rotate the bullet sprite for visual effect
    }
}

export class bulletManager {
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