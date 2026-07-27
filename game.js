  const { Engine, Bodies, Composite, Body } = Matter;
  const app = new PIXI.Application();
  //general stuff i think
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const player = {
    acceleration: 2,
    max_speed: 10,
    canDash: true,
    isDashing: false,
    health: 100
  };


  (async () => {
    await app.init({
      width: 1600,
      height: 900,
      backgroundColor: 0x111111,
      antialias: true,
    });

    document.getElementById("game").appendChild(app.canvas);

    const engine = Engine.create();
    engine.gravity.y = 0;

  //player healthbar sprite
    let healthbar_graphic;

  //box graphic
    let boxGraphic;
    const box = Bodies.rectangle(100, 100, 160, 160, {
      restitution: 0.0,
      friction: 0.1,
      frictionAir: 0.1,
      density: 0.05,
      slop: 0.05,
      inertia: Infinity
    });

  //box number 1
    const ralseiTexture = await PIXI.Assets.load("ralsei.webp");

  //room manager
    let currentRoom = 'room_1';
    let activeWalls = [];          
    let activeWallGraphics = [];  
    let activeDoors = [];    
    let activeDoorGraphics = [];       
    
    let canTransition = true; 
    const roomData = {
    //btw room x and y pos measured from their center
      room_1: {
        walls: [
        { x: 800, y: 20, w: 1600, h: 40 },
        { x: 800, y: 880, w: 1600, h: 40 },
        { x: 20, y: 450, w: 40, h: 900},
        { x: 1580, y: 450, w: 40, h: 900}
        ],
        doors: [
          { x: 20, y: 450, w: 50, h: 120, target_room: 'room_3', target_x: 1480, target_y: 450},
          { x: 1580, y: 450, w: 50, h: 120, target_room: 'room_2', target_x: 120, target_y: 450}
        ]
      },
      room_2: {
        walls: [
        { x: 800, y: 20, w: 1600, h: 40 },
        { x: 800, y: 880, w: 1600, h: 40 },
        { x: 20, y: 450, w: 40, h: 900},
        { x: 1580, y: 450, w: 40, h: 900}
        ],
        doors: [
          { x: 20, y: 450, w: 50, h: 120, target_room: 'room_1', target_x: 1480, target_y: 450}
        ]
      },
      room_3: {
        walls: [
        { x: 800, y: 20, w: 1600, h: 40 },
        { x: 800, y: 880, w: 1600, h: 40 },
        { x: 20, y: 450, w: 40, h: 900},
        { x: 1580, y: 450, w: 40, h: 900}
        ],
        doors: [
          { x: 1580, y: 450, w: 50, h: 120, target_room: 'room_1', target_x: 120, target_y: 450}
        ]
    }
    };

  //room spawn
    function loadRoom(roomKey, spawnX, spawnY) {
      currentRoom = roomKey;
      canTransition = false;
      canDash = false;

      activeWallGraphics.forEach(g => app.stage.removeChild(g));
      activeWalls.forEach(w => Composite.remove(engine.world, w));
      activeWallGraphics = [];
      activeWalls = [];

      activeDoorGraphics.forEach(g => app.stage.removeChild(g));
      activeDoors.forEach(d => Composite.remove(engine.world, d));
      activeDoorGraphics = [];
      activeDoors = [];

      Body.setPosition(box, { x: spawnX, y: spawnY });
      Body.setVelocity(box, { x: 0, y: 0 });

      const data = roomData[roomKey];

      data.walls.forEach(wall => {
        const wallBody = Bodies.rectangle(wall.x, wall.y, wall.w, wall.h, { isStatic: true });
        
        const wallGraphic = new PIXI.Graphics()
          .rect(-wall.w / 2, -wall.h / 2, wall.w, wall.h)
          .fill(0x333333);
        
        wallGraphic.position.set(wall.x, wall.y);
        app.stage.addChild(wallGraphic);

        activeWalls.push(wallBody);
        activeWallGraphics.push(wallGraphic);
        Composite.add(engine.world, wallBody);
      });

      data.doors.forEach(door => {
        const doorBody = Bodies.rectangle(door.x, door.y, door.w, door.h, { isStatic: true, isSensor: true });

        doorBody.target_room = door.target_room;
        doorBody.target_x = door.target_x;
        doorBody.target_y = door.target_y;

        const doorGraphic = new PIXI.Graphics()
          .rect(-door.w / 2, -door.h / 2, door.w, door.h)
          .fill({ color: 0xFF0000, alpha: 0.2 }); 
        
        doorGraphic.position.set(door.x, door.y);
        app.stage.addChild(doorGraphic);

        activeDoors.push(doorBody);
        activeDoorGraphics.push(doorGraphic);
        Composite.add(engine.world, doorBody);
      });

      setTimeout(() => {
        canTransition = true;
        canDash = true;
      }, 300);
    }

  //healthbar sprite
    async function healthbar_sprite() {
      healthbar_graphic = new PIXI.Graphics();
      healthbar_graphic.rect(50,50,player.health*5,10).fill(0xff0000);
      healthbar_graphic.zIndex = 10;
      app.stage.addChild(healthbar_graphic)
    }
    await healthbar_sprite();

  //healthbar updater
    function healthbar_updater() {
      healthbar_graphic.clear();
      healthbar_graphic.rect(50,50,player.health*5,10).fill(0xff0000);
      healthbar_graphic.zIndex = 10;
    }


  //player sprite
    async function createPlayerSprite() {
      boxGraphic = new PIXI.Sprite(ralseiTexture);
      boxGraphic.width = 160;
      boxGraphic.height = 160;
      boxGraphic.anchor.set(0.5); 
      app.stage.addChild(boxGraphic);
      
      Composite.add(engine.world, [box]);
      loadRoom('room_1', 200, window.innerHeight / 2);
    }
    await createPlayerSprite();

  //text
    const label = new PIXI.Text({
      text: "PixiJS v8 + Matter.js Room Engine Active (WASD to move)",
      style: { fontSize: 20, fill: 0xffffff }
    });
    label.position.set(20, 20);
    app.stage.addChild(label);

    function checkSensorCollision(playerBody, sensorBody) {
    const boundsA = playerBody.bounds;
    const boundsB = sensorBody.bounds;

    return boundsA.min.x < boundsB.max.x &&
          boundsA.max.x > boundsB.min.x &&
          boundsA.min.y < boundsB.max.y &&
          boundsA.max.y > boundsB.min.y;
  }

    // Key Event Hooks
    let keys = {};
    let e;
    window.addEventListener('keydown', (event) => { keys[event.code] = true; e = event; });
    window.addEventListener('keyup', (event) => { keys[event.code] = false; });




  //important start or main game loop
    app.ticker.add(async (ticker) => {
      const delta = ticker.deltaTime;
      Matter.Engine.update(engine, delta * (1000 / 60));
      
      if (!boxGraphic) return;

      let v1x = box.velocity.x;
      let v1y = box.velocity.y;

      //slow
      if (keys['ShiftLeft'] || keys['ShiftRight']) {
        player.max_speed = 5;
      } 
      else {
        player.max_speed = 10;
      }

      //dash
      
      //WASD
      if (keys['KeyD']) v1x = Math.min(v1x + player.acceleration, player.max_speed);
      else if (keys['KeyA']) v1x = Math.max(v1x - player.acceleration, -player.max_speed);
      else v1x = v1x * 0.8; 
      
      if (keys['KeyS']) v1y = Math.min(v1y + player.acceleration, player.max_speed); 
      else if (keys['KeyW']) v1y = Math.max(v1y - player.acceleration, -player.max_speed);
      else v1y = v1y * 0.8; 
      Matter.Body.setVelocity(box, { x: v1x, y: v1y });

      boxGraphic.position.set(box.position.x, box.position.y);
      boxGraphic.rotation = box.angle;

      //healthbar update
      healthbar_updater();














      for (let i = 0; i < activeWalls.length; i++) {
        activeWallGraphics[i].position.set(activeWalls[i].position.x, activeWalls[i].position.y);
      }

      if (canTransition) {
        const playerBounds = { 
          x: box.position.x - 80, 
          y: box.position.y - 80, 
          w: 160, 
          h: 160 
        };

        if (canTransition) {
        for (let doorBody of activeDoors) {
          if (checkSensorCollision(box, doorBody)) {
            activeDoors = []; 
            loadRoom(doorBody.target_room, doorBody.target_x, doorBody.target_y);
            break;
          }
        }
      }
      }
    });
  })();
