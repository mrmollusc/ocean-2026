const { Engine, Bodies, Composite } = Matter;
const app = new PIXI.Application();

(async () => {
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xd2242,
    antialias: true,
    resizeTo: window,
  });

  // Append PixiJS v8's canvas to your HTML container
  document.getElementById("game").appendChild(app.canvas);

  const engine = Engine.create();
  engine.gravity.y = 1; // Real-world falling gravity

  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 20, window.innerWidth, 40, {
    isStatic: true,
    restitution: 0.5,
    friction: 0.1,
    frictionAir: 0.01,
    density: 0.05,
    slop: 0.05,
  });

  const box = Bodies.rectangle(window.innerWidth / 2, 80, 160, 160, {
    restitution: 0.5,
    friction: 0.1,
    frictionAir: 0.01,
    density: 0.05,
    slop: 0.05,
  });

  Composite.add(engine.world, [ground, box]);

//ground
  let groundGraphic;

  async function groundSprite() {
    const texture = await PIXI.Assets.load("act.jpg");
    groundGraphic = new PIXI.Sprite(texture);
    groundGraphic.width = window.innerWidth;
    groundGraphic.height = 40;
    groundGraphic.anchor.set(0.5); 
    groundGraphic.position.set(window.innerWidth / 2, window.innerHeight - 20);

    app.stage.addChild(groundGraphic);
  }
  groundSprite();
  
//box1
  let boxGraphic;

  async function playersprite() {
    const texture = await PIXI.Assets.load("ralsei.webp");
    boxGraphic = new PIXI.Sprite(texture);
    boxGraphic.width = 160;
    boxGraphic.height = 160;
    boxGraphic.anchor.set(0.5); 
    boxGraphic.position.set(100, 100);
    
    app.stage.addChild(boxGraphic);
  }
  playersprite();

  // UI Text
  const label = new PIXI.Text({
    text: "PixiJS v8 + Matter.js active",
    style: {
      fontSize: 20,
      fill: 0xffffff,
    }
  });

  label.position.set(20, 20);
  app.stage.addChild(label);

//key events
  let keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true; 
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  app.ticker.add((ticker) => {
    
    const delta = ticker.deltaTime;
    Matter.Engine.update(engine, delta * (1000 / 60));
    if (!boxGraphic) return;
  //controls
    let v1x = box.velocity.x;
    let v1y = box.velocity.y;

    //speeds
    const ACCEL = 1;      
    const MAX_SPEED = 10;

    //left right
    if (keys['KeyD']) v1x = Math.min(v1x + ACCEL, MAX_SPEED);
    else if (keys['KeyA']) v1x = Math.max(v1x - ACCEL, -MAX_SPEED);
    else v1x = v1x;
    //up down
    if (keys['KeyS']) v1y = Math.min(v1y + ACCEL, MAX_SPEED); 
    else if (keys['KeyW']) v1y = Math.max(v1y - ACCEL, -MAX_SPEED);
    else v1y = v1y;

    Matter.Body.setVelocity(box, { x: v1x, y: v1y });
    boxGraphic.position.set(box.position.x, box.position.y);
    boxGraphic.rotation = box.angle;


    groundGraphic.position.set(ground.position.x, ground.position.y);
  });
})();
