  ///////////////////////////////////////////
  //constants
  ///////////////////////////////////////////
  
  //camera and world stuff
  const MAP_WIDTH = 4000;
  const MAP_HEIGHT = 4000;
  const LERP_FACTOR = 0.1;
  
  //Player movement and physics
  const PLAYER_ACCEL = 2;
  const PLAYER_MAX_SPEED = 10;
  const PLAYER_SLOW_SPEED = 5;

  //player body size
  const PLAYER_WIDTH = 160;
  const PLAYER_HEIGHT = 160;

  //player health and damage
  const PLAYER_MAX_HEALTH = 100;
  const PLAYER_IFRAME_DURATION = 0;

  //trash damage
  const TRASH_DAMAGE = 1;

  //dash mechanic
  const DASH_SPEED = 50;
  const DASH_ACCEL = 50;
  const DASH_DURATION = 100;
  const DASH_COOLDOWN = 2000;

  //room transition
  const ROOM_TRANSITION_DELAY = 300;

  //app settings
  const APP_WIDTH = 1600;
  const APP_HEIGHT = 900;
  const APP_BG_COLOR = 0x111111;
  
  ///////////////////////////////////////
  //INITIAL SETUP
  ////////////////////////////////////////
  
  const { Engine, Bodies, Composite, Body } = Matter;
  const app = new PIXI.Application();
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  ///////////////////////////////////////////
  //PLAYER DATA
  ////////////////////////////////////////////
  
  const player = {
    chapter: 1,
    dealt_nuts: false,

    acceleration: PLAYER_ACCEL,
    max_speed: PLAYER_MAX_SPEED,
    
    health: PLAYER_MAX_HEALTH,
    iframe: false,

    can_dash: true,
    is_dashing: false,
  };
  
  ////////////////////////////////////////
  //PIXI INIT + WORLD CONTAINER
  ////////////////////////////////////////
  let world;

  (async () => {
    await app.init({
      width: APP_WIDTH,
      height: APP_HEIGHT,
      backgroundColor: APP_BG_COLOR,
      antialias: true,
    });

    world = new PIXI.Container();
    app.stage.addChild(world);
    
  

  document.getElementById("game").appendChild(app.canvas);

    const engine = Engine.create();
    engine.gravity.y = 0;

  //player healthbar sprite
    let healthbar_graphic = new PIXI.Graphics();
    let healthbar_bg_graphic = new PIXI.Graphics();
  //trash graphic
    let trash = [];
    let trash_graphic = [];

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
    let current_room = 'room_1';

    let walls = [];          
    let wall_graphics = [];  

    let doors = [];    
    let door_graphics = [];      
    
    let trashes = [];
    let trash_graphics = [];

    let room_label = new PIXI.Text({
      text: 'room_1',
      style: { fontSize: 20, fill: 0xffffff }
    });
    room_label.zIndex = 11;
    room_label.position.set(1420, 20);
    app.stage.addChild(room_label);

    let canTransition = true; 
    const room_data = {

    //btw room x and y pos measured from their center
      room_1: {
        label: 'room 1',
        walls: [
          { x: 800, y: 20, w: 1600, h: 40 },
          { x: 800, y: 880, w: 1600, h: 40 },
          { x: 20, y: 450, w: 40, h: 900},
          { x: 1580, y: 450, w: 40, h: 900}
        ],
        trashes: [
          { x: 800, y: 450, w: 180, h: 180}
        ],
        doors: [
          { x: 20, y: 450, w: 50, h: 120, target_room: 'room_3', target_x: 1420, target_y: 450},
          { x: 1580, y: 450, w: 50, h: 120, target_room: 'room_2', target_x: 180, target_y: 450}
        ]
      },
      room_2: {
        label: 'room 2',
        walls: [
          { x: 800, y: 20, w: 1600, h: 40 },
          { x: 800, y: 880, w: 1600, h: 40 },
          { x: 20, y: 450, w: 40, h: 900},
          { x: 1580, y: 450, w: 40, h: 900}
        ],
        trashes: [
          {}
        ],
        doors: [
          { x: 20, y: 450, w: 50, h: 120, target_room: 'room_1', target_x: 1420, target_y: 450},
          { x: 800, y: 880, w: 120, h: 50, target_room: 'room_4', target_x: 800, target_y: 180}
        ]
      },
      room_3: {
        label: 'room 3',
        walls: [
          { x: 800, y: 20, w: 1600, h: 40 },
          { x: 800, y: 880, w: 1600, h: 40 },
          { x: 20, y: 450, w: 40, h: 900},
          { x: 1580, y: 450, w: 40, h: 900}
        ],
        trashes: [
          {}
        ],
        doors: [
          { x: 1580, y: 450, w: 50, h: 120, target_room: 'room_1', target_x: 180, target_y: 450}
        ]
    },
    room_4: {
        label: 'room 4',
        walls: [
          { x: 800, y: 20, w: 1600, h: 40 },
          { x: 800, y: 880, w: 1600, h: 40 },
          { x: 20, y: 450, w: 40, h: 900},
          { x: 1580, y: 450, w: 40, h: 900}
        ],
        trashes: [
          {}
        ],
        doors: [
          { x: 800, y: 20, w: 120, h: 50, target_room: 'room_2', target_x: 800, target_y: 720}
        ]
    }
    };

  //everything loader
    function load_rooms(roomKey, spawnX, spawnY) {
      current_room = roomKey;
      canTransition = false;
      canDash = false;

      wall_graphics.forEach(g => app.stage.removeChild(g));
      walls.forEach(w => Composite.remove(engine.world, w));
      wall_graphics = [];
      walls = [];

      door_graphics.forEach(g => app.stage.removeChild(g));
      doors.forEach(d => Composite.remove(engine.world, d));
      door_graphics = [];
      doors = [];

      trash_graphics.forEach(g => app.stage.removeChild(g));
      trashes.forEach(t => Composite.remove(engine.world, t));
      trash_graphics = [];
      trashes = [];

      Body.setPosition(box, { x: spawnX, y: spawnY });
      Body.setVelocity(box, { x: 0, y: 0 });

      const data = room_data[roomKey];

      data.walls.forEach(wall => {
        const wallBody = Bodies.rectangle(wall.x, wall.y, wall.w, wall.h, { isStatic: true });
        
        const wallGraphic = new PIXI.Graphics()
          .rect(-wall.w / 2, -wall.h / 2, wall.w, wall.h)
          .fill(0x333333);
        
        wallGraphic.position.set(wall.x, wall.y);
        world.addChild(wallGraphic);

        walls.push(wallBody);
        wall_graphics.push(wallGraphic);
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
        world.addChild(doorGraphic);

        doors.push(doorBody);
        door_graphics.push(doorGraphic);
        Composite.add(engine.world, doorBody);
      });

      room_label.text = '';
      room_label.text = data.label;
      load_trash(roomKey)

      setTimeout(() => {
        canTransition = true;
        canDash = true;
      }, 300);
    }

    function load_trash(roomKey) {
    const data = room_data[roomKey];
    if (!data.trashes) return; 

    data.trashes.forEach(trashObj => {
      // 1. Create the physics body
      const trash_body = Bodies.rectangle(trashObj.x, trashObj.y, trashObj.w, trashObj.h, { isStatic: true });
      
      // 2. Create the visual container
      const trash_graphic = new PIXI.Graphics()
        .rect(-trashObj.w / 2, -trashObj.h / 2, trashObj.w, trashObj.h)
        .fill(0xAAAA00);
      
      trash_graphic.position.set(trashObj.x, trashObj.y);
      world.addChild(trash_graphic);

      // 3. Push to your tracking arrays defined at the top of your script
      trashes.push(trash_body);
      trash_graphics.push(trash_graphic);
      Composite.add(engine.world, trash_body);
    });
  }

  //healthbar sprite
    healthbar_graphic.zIndex = 10;
    app.stage.addChild(healthbar_graphic);

    
    healthbar_bg_graphic.rect(50,50,500,10).fill(0xFF0000);
    healthbar_bg_graphic.zIndex = 9;
    app.stage.addChild(healthbar_bg_graphic);
    

  //healthbar updater
    function update_healthbar() {
      healthbar_graphic.clear();
      healthbar_graphic.rect(50,50,player.health*5,10).fill(0x3000F0);
    }


  //player sprite
    async function createPlayerSprite() {
      boxGraphic = new PIXI.Sprite(ralseiTexture);
      boxGraphic.width = PLAYER_WIDTH;
      boxGraphic.height = PLAYER_HEIGHT;
      boxGraphic.anchor.set(0.5);
      world.addChild(boxGraphic);

      Composite.add(engine.world, [box]);
      load_rooms('room_1', 200, window.innerHeight / 2);
    }
    await createPlayerSprite();

  //text
    const label = new PIXI.Text({
      text: "PixiJS v8 + Matter.js Room Engine Active (WASD to move)",
      style: { fontSize: 20, fill: 0xffffff }
    });
    label.position.set(20, 20);
    app.stage.addChild(label);

    function check_collision(playerBody, sensorBody) {
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

      //dash mechanic
      if(keys['Space']) {
        if(player.can_dash){

          if(player.is_dashing) return;

          player.max_speed = DASH_SPEED;
          player.acceleration = DASH_ACCEL;
          player.can_dash = false;
          player.is_dashing = true;

          setTimeout(() => {
          player.max_speed = PLAYER_MAX_SPEED;
          player.acceleration = PLAYER_ACCEL;
          player.is_dashing = false;
          }, DASH_DURATION);

          setTimeout(() => {
            player.can_dash = true;
          }, DASH_COOLDOWN)  
        }
      } 
      
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
      update_healthbar();

      //register damage and activate iframes
      trashes.forEach(trash_body => {
        if (player.iframe == false && check_collision(box, trash_body)) {
          player.health -= TRASH_DAMAGE;
          player.iframe = true;
          setTimeout(() => {
            player.iframe = false;
          }, PLAYER_IFRAME_DURATION);   
        }
      
      /////////////////////////////////////////
      //CAMERA FOLLOW SYSTEM
      /////////////////////////////////////////
      const halfW = app.screen.width / 2;
      const halfH = app.screen.height / 2;

      const targetX = Math.max(halfW, Math.min(MAP_WIDTH - halfW, box.position.x));
      const targetY = Math.max(halfH, Math.min(MAP_HEIGHT - halfH, box.position.y));

      world.pivot.x += (targetX - world.pivot.x) * LERP_FACTOR;
      world.pivot.y += (targetY - world.pivot.y) * LERP_FACTOR;

      world.x = halfW;
      world.y = halfH;
      
      });

      
      













      for (let i = 0; i < walls.length; i++) {
        wall_graphics[i].position.set(walls[i].position.x, walls[i].position.y);
      }

      if (canTransition) {
        const playerBounds = { 
          x: box.position.x - 80, 
          y: box.position.y - 80, 
          w: 160, 
          h: 160 
        };

        if (canTransition) {
        for (let doorBody of doors) {
          if (check_collision(box, doorBody)) {
            doors = []; 
            load_rooms(doorBody.target_room, doorBody.target_x, doorBody.target_y);
            break;
          }
        }
      }
      }
    });
  })();
