////////////////////////////////////////////
//imports of bullets and manager
////////////////////////////////////////////
import { 
  BulletManager,
  bossFishBullet, 
  bossTurtleBullet,
  defaultBullet,
  bossFishPattern,
  bossTurtlePattern
} from './BulletManager.js';

//import room data
import { room_data } from "./room_data.js";

//////////////////////////////////////////////
  // for all bullet manager and bullet graphics, scroll down
///////////////////////////////////////////
//constants
///////////////////////////////////////////

//camera and world stuff
const MAP_WIDTH_MIN = 0;
const MAP_HEIGHT_MIN = 0;
const MAP_WIDTH_MAX = 4000;
const MAP_HEIGHT_MAX = 4000;
const LERP_FACTOR = 0.1;
const CAMERA_ZOOM = 1;

//Player movement and physics
const PLAYER_ACCEL = 5;
const PLAYER_MAX_SPEED = 7;
const PLAYER_HEAL_SPEED = 1;

//player body size
const PLAYER_WIDTH = 120;
const PLAYER_HEIGHT = 120;

//player health and damage
const PLAYER_MAX_HEALTH = 100;
const PLAYER_IFRAME_DURATION = 100;

//damage
const TRASH_DAMAGE = 5;
const SNAIL_DAMAGE = 1;

//dash mechanic
const DASH_SPEED = 40;
const DASH_ACCEL = 10;
const DASH_DURATION = 150;
const DASH_COOLDOWN = 1500;

//zap
const ZAP_DURATION = 1500;
const ZAP_COOLDOWN = 3000;

//regen
const HEAL_DURATION = 2000;
const HEAL_COOLDOWN = 5000;

//room transition
const ROOM_TRANSITION_DELAY = 300;

//app settings
const APP_WIDTH = 1600;
const APP_HEIGHT = 900;
const APP_BG_COLOR = 0x111111;

//map
const mapData = window.TileMaps[("room_2", "room_1")];

//map height, width, tile data
const {
  width: mapWidth,
  height: mapHeight,
  tilewidth: tileWidth,
  tileheight: tileHeight,
} = mapData;

console.log(`Loaded a ${mapWidth}x${mapHeight} tilemap!`);

///////////////////////////////////////
//INITIAL SETUP
////////////////////////////////////////

const { Engine, Bodies, Composite, Body } = Matter;
const app = new PIXI.Application();

//////////////////////////////////////////
// global stuff
/////////////////////////////////////////
let world;
let boxGraphic;
let current_room = "room_2";
let current_room_id = "1";

///////////////////////////////////////////
//PLAYER DATA
////////////////////////////////////////////

const player = {
  chapter: 1,
  dealt_nuts: false,

  can_move: true,

  acceleration: PLAYER_ACCEL,
  max_speed: PLAYER_MAX_SPEED,

  health: PLAYER_MAX_HEALTH,
  iframe: false,

  can_dash: true,
  is_dashing: false,

  can_zap: true,
  is_zapping: false,

  can_heal: true,
  is_healing: false
};
  
//TEXTURES
  const ralsei_texture = await PIXI.Assets.load("ralsei.webp");
  const heart_texture = await PIXI.Assets.load("heart.png");

  const up_arrow_texture = await PIXI.Assets.load("up_dir.png");
  const right_arrow_texture = await PIXI.Assets.load("right_dir.png");
  const left_arrow_texture = await PIXI.Assets.load("left_dir.png");
  const down_arrow_texture =  await PIXI.Assets.load("down_dir.png");
  
  export {up_arrow_texture, right_arrow_texture, left_arrow_texture, down_arrow_texture};

////////////////////////////////////////
//PIXI INIT + WORLD CONTAINER
////////////////////////////////////////

(async () => {
  await app.init({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: APP_BG_COLOR,
    antialias: true,
  });

  world = new PIXI.Container();
  app.stage.addChild(world);
  world.scale.set(CAMERA_ZOOM);

  const canvas = app.canvas;

  canvas.style.imageRendering = "pixelated";

  canvas.style.width = "auto";
  canvas.style.height = "auto";

  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";

  document.body.appendChild(canvas);

  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";
  document.body.style.backgroundColor = "#000000";

  document.getElementById("game").appendChild(app.canvas);

  const engine = Engine.create();
  engine.gravity.y = 0;
  engine.friction = 0;
  engine.airResistance = 0;
  ///////////////////////////////////////////////////////
  //bullet texture
  ////////////////////////////////////////////

  //player healthbar sprite
  let healthbar_graphic = new PIXI.Graphics();
  let healthbar_bg_graphic = new PIXI.Graphics();

  //box graphic
  const box = Bodies.rectangle(100, 100, 120, 120, {
    restitution: 0.0,
    friction: 0.0,
    frictionAir: 0.0,
    density: 0.05,
    slop: 0.05,
    inertia: Infinity,
  });

  //room manager
  const baseTexture = await PIXI.Assets.load("js/levels/spritesheet.png");

  let walls = [];
  let wall_graphics = [];

  let doors = [];
  let door_graphics = [];

  let trashes = [];
  let trash_graphics = [];

  let hearts = [];
  let heart_graphics = [];

  let snails = [];
  let snail_graphics = [];

  let forces = [];
  let force_graphics = [];

  let bullet_boxes = [];
  let bullet_box_graphics = []; 

  let room_label = new PIXI.Text({
    text: "room_1",
    style: { fontSize: 20, fill: 0xffffff },
  });
  room_label.zIndex = 11;
  room_label.position.set(1420, 20);
  app.stage.addChild(room_label);

  let canTransition = true;

  mapData.layers.forEach((layer) => {
    if (layer.type == "tilelayer" && layer.visible) {
      //renderVisualLayer(layer, world)
    }

    if (layer.type == "objectgroup") {
      //buildPhysicsLayer(layer)
    }
  });

  function renderVisualLayer(layer, parentContainer) {
    if (!parentContainer) return;

    const tileData = layer.data;

    if (!tileData) return;

    const tileset = mapData.tilesets[0];
    const columns = tileset.columns;
    const firstgid = tileset.firstgid;

    const layerContainer = new PIXI.Container();
    layerContainer.alpha = layer.opacity;

    if (layer.parallaxx) {
      layerContainer.label = `parallax_${layer.parallaxx}`;
    }

    parentContainer.addChild(layerContainer);

    for (let i = 0; i < tileData.length; i++) {
      const gid = tileData[i];
      if (gid === 0) continue;

      const screenX = (i % mapWidth) * tileWidth;
      const screenY = Math.floor(i / mapWidth) * tileHeight;

      const localIdx = gid - firstgid;
      const sourceX = (localIdx % columns) * tileWidth;
      const sourceY = Math.floor(localIdx / columns) * tileHeight;

      const frame = new PIXI.Rectangle(sourceX, sourceY, tileWidth, tileHeight);
      let sprite;

      const tileMeta = tileset.tiles
        ? tileset.tiles.find((t) => t.id === localIdx)
        : null;

      if (tileMeta && tileMeta.animation) {
        //for every frame in the animation, create a texture and store it in an array
        const textures = tileMeta.animation.map((frameData) => {
          const fIdx = frameData.tileid;
          const fX = (fIdx % columns) * tileWidth;
          const fY = Math.floor(fIdx / columns) * tileHeight;
          const rect = new PIXI.Rectangle(fX, fY, tileWidth, tileHeight);
          return new PIXI.Texture({ source: baseTexture.source, frame: rect });
        });
        // non-static tile/sprite with animation
        sprite = new PIXI.AnimatedSprite(textures);
        sprite.animationSpeed = 0.15;
        sprite.play();
      } else {
        // static tile/sprite no animation
        const tileTexture = new PIXI.Texture({
          source: baseTexture.source,
          frame: frame,
        });
        sprite = new PIXI.Sprite(tileTexture);
      }

      sprite.x = screenX;
      sprite.y = screenY;

      layerContainer.addChild(sprite);
    }
  }

  function buildPhysicsLayer(layer) {
    if (!layer.objects) return;

    layer.objects.forEach((obj) => {
      // Skip pure position nodes or bullet marker points with zero volume
      if (obj.point && obj.name !== "") {
        console.log(`Marker registered: ${obj.name} at X:${obj.x}, Y:${obj.y}`);
        if (obj.name === "Player") {
          console.log(`spawn at (${obj.x}, ${obj.y})`);
        }
        return;
      }

      const w = obj.width;
      const h = obj.height;
      const centerX = obj.x + w / 2;
      const centerY = obj.y + h / 2;

      const targetRoom = obj.properties
        ? obj.properties.find((p) => p.name === "target_room")
        : null;

      const bodyOptions = {
        isStatic: true,
        label: targetRoom
          ? `door_to_${targetRoom.value}`
          : obj.name || "tiled_wall",
      };

      if (targetRoom) {
        bodyOptions.isSensor = true;
        bodyOptions.target_room = targetRoom.value;
      }

      const staticBody = Bodies.rectangle(centerX, centerY, w, h, {
        isStatic: true,
        label: obj.name || "tiled_wall",
      });
    });
  }

  //everything loader
  function load_rooms(roomKey, spawnX, spawnY) {
    current_room = roomKey;
    current_room_id = Number(current_room.replaceAll(/[rom_]/gi, "")) - 1; //regex yummy
    canTransition = false;

    wall_graphics.forEach((g) => world.removeChild(g));
    walls.forEach((w) => Composite.remove(engine.world, w));
    wall_graphics = [];
    walls = [];

    door_graphics.forEach((g) => world.removeChild(g));
    doors.forEach((d) => Composite.remove(engine.world, d));
    door_graphics = [];
    doors = [];

    trash_graphics.forEach((g) => world.removeChild(g));
    trashes.forEach((t) => Composite.remove(engine.world, t));
    trash_graphics = [];
    trashes = [];

    heart_graphics.forEach((g) => world.removeChild(g));
    hearts.forEach((t) => Composite.remove(engine.world, t));
    heart_graphics = [];
    hearts = [];

    snail_graphics.forEach((g) => world.removeChild(g));
    snails.forEach((t) => Composite.remove(engine.world, t));
    snail_graphics = [];
    snails = [];

    force_graphics.forEach((g) => world.removeChild(g));
    forces.forEach((t) => Composite.remove(engine.world, t));
    force_graphics = [];
    forces = [];

    bullet_box_graphics.forEach((g) => world.removeChild(g));
    bullet_boxes.forEach((t) => Composite.remove(engine.world, t));
    bullet_box_graphics = [];
    bullet_boxes = [];

    Matter.Body.setPosition(box, { x: spawnX, y: spawnY });
    Matter.Body.setVelocity(box, { x: 0, y: 0 });

    const data = room_data[roomKey];

    data.walls?.forEach((wall) => {
      const wallBody = Bodies.rectangle(wall.x, wall.y, wall.w, wall.h, {
        isStatic: true,
        restitution: 1,
        friction: 0,
      });

      const wallGraphic = new PIXI.Graphics()
        .rect(-wall.w / 2, -wall.h / 2, wall.w, wall.h)
        .fill(0x333333);

      wallGraphic.position.set(wall.x, wall.y);
      world.addChild(wallGraphic);

      walls.push(wallBody);
      wall_graphics.push(wallGraphic);
      Composite.add(engine.world, wallBody);
    });

    data.doors?.forEach((door) => {
      const doorBody = Bodies.rectangle(door.x, door.y, door.w, door.h, {
        isStatic: true,
        isSensor: true,
      });

      doorBody.target_room = door.target_room;
      doorBody.target_x = door.target_x;
      doorBody.target_y = door.target_y;

      const doorGraphic = new PIXI.Graphics()
        .rect(-door.w / 2, -door.h / 2, door.w, door.h)
        .fill({ color: 0xff0000, alpha: 0.2 });

      doorGraphic.position.set(door.x, door.y);
      world.addChild(doorGraphic);

      doors.push(doorBody);
      door_graphics.push(doorGraphic);
      Composite.add(engine.world, doorBody);
    });

    data.trashes?.forEach((trash_obj) => {
      const trash_body = Bodies.rectangle(
        trash_obj.x,
        trash_obj.y,
        trash_obj.w,
        trash_obj.h,
        { isStatic: true },
      );

      const trash_graphic = new PIXI.Graphics()
        .rect(-trash_obj.w / 2, -trash_obj.h / 2, trash_obj.w, trash_obj.h)
        .fill(0xaaaa00);

      trash_graphic.position.set(trash_obj.x, trash_obj.y);
      world.addChild(trash_graphic);

      trashes.push(trash_body);
      trash_graphics.push(trash_graphic);
      Composite.add(engine.world, trash_body);
    });

    data.hearts?.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 1, 1, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.Sprite(heart_texture);
      heart_graphic.width = 50;
      heart_graphic.height = 50;
      heart_graphic.anchor.set(0.5);

      heart_graphic.position.set(heart_obj.x, heart_obj.y);
      world.addChild(heart_graphic);

      hearts.push(heart_body);
      heart_graphics.push(heart_graphic);
      Composite.add(engine.world, heart_body);
    });

    data.snails?.forEach((snail_obj) => {
      const snail_body = Bodies.rectangle(snail_obj.x, snail_obj.y, 50, 50, {
        isStatic: false,
        restitution: 1,
        friction: 0,
        collisionFilter: { group: -1, mask: 0 },
      });

      const snail_graphic = new PIXI.Graphics()
        .rect(-25, -25, 50, 50)
        .fill(0xf000f0);

      snail_graphic.position.set(snail_obj.x, snail_obj.y);
      world.addChild(snail_graphic);

      snails.push(snail_body);
      snail_graphics.push(snail_graphic);
      Composite.add(engine.world, snail_body);
      Matter.Body.setVelocity(snail_body, {
        x: snail_obj.x_vel,
        y: snail_obj.y_vel,
      });
    });

    data.force_blocks?.forEach((force_obj) => {
      const force_body = Bodies.rectangle(
        force_obj.x,
        force_obj.y,
        force_obj.w,
        force_obj.h,
        { isStatic: true , collisionFilter: { group: -1, mask: 0 }}
      );
      const force_graphic = new PIXI.Sprite(force_obj.texture);
      force_graphic.width = force_obj.w;
      force_graphic.height = force_obj.h;
      force_graphic.anchor.set(0.5);
      force_graphic.zIndex = "7";

      force_graphic.position.set(force_obj.x, force_obj.y);
      world.addChild(force_graphic);

      forces.push(force_body);
      force_graphics.push(force_graphic);
      Composite.add(engine.world, force_body);
    });

    data.bullet_boxes?.forEach((bullet_box_obj) => {
      const bullet_box_body = Bodies.rectangle(
        bullet_box_obj.x,
        bullet_box_obj.y,
        bullet_box_obj.w,
        bullet_box_obj.h,
        { isStatic: true , collisionFilter: { group: -1, mask: 0 }}
      );

      const bullet_box_graphic = new PIXI.Graphics()
        .rect(-25, -25, 50, 50)
        .fill(0xAAAAAA);

      bullet_box_graphic.position.set(bullet_box_obj.x, bullet_box_obj.y);
      world.addChild(bullet_box_graphic);

      bullet_boxes.push(bullet_box_body);
      bullet_box_graphics.push(bullet_box_graphic);
      Composite.add(engine.world, bullet_box_body);
      Matter.Body.setVelocity(bullet_box_body, {
        x: bullet_box_obj.x_vel,
        y: bullet_box_obj.y_vel,
      });
    });



    //end of loading objects

    room_label.text = "";
    room_label.text = data.label;

    setTimeout(() => {
      canTransition = true;
    }, 300);
  }

  //edit hearts on touching
  function update_hearts(roomKey) {
    heart_graphics.forEach((g) => world.removeChild(g));
    hearts.forEach((t) => Composite.remove(engine.world, t));
    heart_graphics = [];
    hearts = [];

    const data = room_data[roomKey];

    data.hearts.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 1, 1, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.Sprite(heart_texture);
      heart_graphic.width = 50;
      heart_graphic.height = 50;
      heart_graphic.anchor.set(0.5);

      heart_graphic.position.set(heart_obj.x, heart_obj.y);
      world.addChild(heart_graphic);

      hearts.push(heart_body);
      heart_graphics.push(heart_graphic);
      Composite.add(engine.world, heart_body);
    });
  }

  //healthbar sprite
  healthbar_graphic.zIndex = 10;
  app.stage.addChild(healthbar_graphic);

  healthbar_bg_graphic.rect(50, 50, 500, 10).fill(0xff0000);
  healthbar_bg_graphic.zIndex = 9;
  app.stage.addChild(healthbar_bg_graphic);

  //healthbar updater
  function update_healthbar() {
    if (player.health > 100) player.health = 100;
    if (player.health < 0) player.health = 0;
    healthbar_graphic.clear();
    healthbar_graphic.rect(50, 50, player.health * 5, 10).fill(0xa090ff);
  }

  //snail movement
  function update_snail(roomKey) {
    const data = room_data[roomKey];

    data.snails.forEach((snail_obj, index) => {
      const snail_body = snails[index];
      const snail_graphic = snail_graphics[index];

      if (!snail_body || !snail_graphic) return;

      if (snail_obj.x <= 60) {
        snail_obj.x_vel = Math.abs(snail_obj.x_vel);
      }
      if (snail_obj.x >= 1540) {
        snail_obj.x_vel = -Math.abs(snail_obj.x_vel); 
      }
      if (snail_obj.y >= 840) {
        snail_obj.y_vel = -Math.abs(snail_obj.y_vel); 
      }
      if (snail_obj.y <= 60) {
        snail_obj.y_vel = Math.abs(snail_obj.y_vel); 
      }

      Matter.Body.setVelocity(snail_body, {
        x: snail_obj.x_vel,
        y: snail_obj.y_vel,
      });

      snail_obj.x = snail_body.position.x;
      snail_obj.y = snail_body.position.y;
      snail_graphic.position.set(snail_obj.x, snail_obj.y);
    });
  }

  function snail_movement() {
    update_snail(current_room);
  }

  //player sprite
  async function createPlayerSprite() {
    boxGraphic = new PIXI.Sprite(ralsei_texture);
    boxGraphic.zIndex = "8";
    boxGraphic.width = PLAYER_WIDTH;
    boxGraphic.height = PLAYER_HEIGHT;
    boxGraphic.anchor.set(0.5);
    world.addChild(boxGraphic);

    Composite.add(engine.world, [box]);
    load_rooms("room_2", 200, window.innerHeight / 2);
  }
  await createPlayerSprite();

  //collisiion checker
  function check_collision(player, object) {
    const boundsA = player.bounds;
    const boundsB = object.bounds;

    return (
      boundsA.min.x < boundsB.max.x &&
      boundsA.max.x > boundsB.min.x &&
      boundsA.min.y < boundsB.max.y &&
      boundsA.max.y > boundsB.min.y
    );
  }

  //distance checker
  function distance_between(player, object) {
    const dx = player.position.x - object.position.x;
    const dy = player.position.y - object.position.y;
    if (isNaN(object.position.x) || isNaN(object.position.y) || isNaN(dx) || isNaN(dy)) return 0;
    return Math.round(Math.hypot(dx, dy));
  }


  let keys = {};
  let e;
  window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
    e = event;
  });
  window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  
  //important start or main game loop
  app.ticker.add((ticker) => {

    if (!boxGraphic) return;

    let v1x = box.velocity.x;
    let v1y = box.velocity.y;

    //WASD
    if (keys["KeyD"] && player.can_move == true)
      v1x = Math.min(v1x + player.acceleration, player.max_speed);
    else if (keys["KeyA"] && player.can_move == true)
      v1x = Math.max(v1x - player.acceleration, -player.max_speed);
    else v1x = v1x * 0.9;

    if (keys["KeyS"] && player.can_move == true)
      v1y = Math.min(v1y + player.acceleration, player.max_speed);
    else if (keys["KeyW"] && player.can_move == true)
      v1y = Math.max(v1y - player.acceleration, -player.max_speed);
    else v1y = v1y * 0.9;

    Matter.Engine.update(engine, 1000 / 60);

    //dash mechanic
    if (keys["Space"]) {
      if (player.can_dash) {
        if (player.is_dashing) return;

        player.can_heal = false;

        player.max_speed = DASH_SPEED;
        player.acceleration = DASH_ACCEL;
        player.can_dash = false;
        player.is_dashing = true;

        setTimeout(() => {
          player.max_speed = PLAYER_MAX_SPEED;
          player.acceleration = PLAYER_ACCEL;
          player.is_dashing = false;
          player.can_heal = true;
        }, DASH_DURATION);

        setTimeout(() => {
          player.can_dash = true;
        }, DASH_COOLDOWN);
      }
    }

    //bullet freeze
    if (keys["KeyK"]) {
      if (player.can_zap && !player.is_zapping) {
        player.can_zap = false;
        player.is_zapping = true;
        
        const frozen_snails = [];

        snails.forEach((snail_body, index) => {
          if (distance_between(box, snail_body) < 150) {
            console.log('true')
            const snail_obj = room_data[current_room].snails[index];

            frozen_snails.push({
              index: index,
              x_vel: snail_obj.x_vel,
              y_vel: snail_obj.y_vel
            });

            snail_obj.x_vel = 0;
            snail_obj.y_vel = 0;
          }
        });
        setTimeout(() => {
          player.is_zapping = false;

          //reapply stored movement data to snails
          frozen_snails.forEach(({ index, x_vel, y_vel }) => {
            const snail_obj = room_data[current_room].snails[index];
            if (snail_obj) {
              snail_obj.x_vel = x_vel;
              snail_obj.y_vel = y_vel;
            }
          });
        }, ZAP_DURATION);

        setTimeout(() => {
          player.can_zap = true;
        }, ZAP_COOLDOWN);
      }
    }

    //regenerate health
    if (keys["KeyL"]) {
      if (player.can_heal) {
        if (player.is_healing) return;

        player.can_dash = false;
        player.can_heal = false;
        player.is_healing = true;
        player.max_speed = PLAYER_HEAL_SPEED;
        
        const heal_interval = setInterval(() => {
          if(player.is_healing){
            player.health += Math.min(15/player.health, 1.5);
          }
        }, 10);

        setTimeout(() => {
          clearInterval(heal_interval);
          player.can_dash = true;
          player.max_speed = PLAYER_MAX_SPEED;
          player.is_healing = false;
        }, HEAL_DURATION);

        setTimeout(() => {
          player.can_heal = true;
        }, HEAL_COOLDOWN);
      }     
    }

    //healthbar update
    update_healthbar();

    //snail moves
    snail_movement();

    //register damage and activate iframes
    trashes.forEach((trash_body) => {
      if (player.iframe == false && check_collision(box, trash_body)) {
        player.health -= TRASH_DAMAGE;
        player.iframe = true;
        setTimeout(() => {
          player.iframe = false;
        }, PLAYER_IFRAME_DURATION);
      }
    });

    snails.forEach((snail_body) => {
      if (player.iframe == false && check_collision(box, snail_body)) {
        player.health -= SNAIL_DAMAGE;
        player.iframe = true;
        setTimeout(() => {
          player.iframe = false;
        }, PLAYER_IFRAME_DURATION);
      }
    });

    forces.forEach((e, index) => {
      if (check_collision(box, e)) {
        let applied_x = room_data[current_room].force_blocks[index].velocity.x;
        let applied_y = room_data[current_room].force_blocks[index].velocity.y;
      
        v1x += applied_x;
        v1y += applied_y;
      }
    });

    //heal code of heart collectibles
    for (let e of hearts) {
      if (check_collision(box, e)) {
        const heartIndex = hearts.findIndex((e) => check_collision(box, e));

        if (heartIndex !== -1) {
          player.health += 10;
          hearts.splice(heartIndex, 1);
          room_data[current_room].hearts.splice(heartIndex, 1);
          update_hearts(current_room);
        }
      }
    }


    
    Matter.Body.setVelocity(box, { x: v1x, y: v1y });
    boxGraphic.position.set(box.position.x, box.position.y);
    boxGraphic.rotation = box.angle;

    /////////////////////////////////////////
    //CAMERA FOLLOW SYSTEM
    /////////////////////////////////////////
    const halfW = app.screen.width / 2;
    const halfH = app.screen.height / 2;

    const targetX = Math.max(
      MAP_WIDTH_MIN,
      Math.min(MAP_WIDTH_MAX - halfW, box.position.x),
    );
    const targetY = Math.max(
      MAP_HEIGHT_MIN,
      Math.min(MAP_HEIGHT_MAX - halfH, box.position.y),
    );

    world.pivot.x += (targetX - world.pivot.x) * LERP_FACTOR;
    world.pivot.y += (targetY - world.pivot.y) * LERP_FACTOR;

    world.x = halfW;
    world.y = halfH;

    world.children.forEach((child) => {
      if (child.label && child.label.startsWith("parallax_")) {
        //get the parallax factor from the label, e.g., "parallax_1.5" would give a factor of 1.5
        const parallaxFactor = parseFloat(child.label.split("_")[1]);

        //scroll the parallax layer based on the camera's pivot and the parallax factor
        child.x = world.pivot.x * (1 - 1 / parallaxFactor);
        child.y = world.pivot.y * (1 - 1 / parallaxFactor);
      }
    });

    for (let i = 0; i < walls.length; i++) {
      wall_graphics[i].position.set(walls[i].position.x, walls[i].position.y);
    }

    if (canTransition) {
      const playerBounds = {
        x: box.position.x - 80,
        y: box.position.y - 80,
        w: 160,
        h: 160,
      };

      if (canTransition) {
        for (let doorBody of doors) {
          if (check_collision(box, doorBody)) {
            doors = [];
            load_rooms(
              doorBody.target_room,
              doorBody.target_x,
              doorBody.target_y,
            );
            break;
          }
        }
      }
    }
  });
})();
