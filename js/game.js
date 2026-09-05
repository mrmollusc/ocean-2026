///////////////////////////////////////
//INITIAL SETUP
////////////////////////////////////////

const { Engine, Bodies, Composite, Body } = Matter;
const app = new PIXI.Application();

const engine = Engine.create();
engine.gravity.y = 0;
const physicsWorld = engine.world;

////////////////////////////////////////////
//imports of bullets and manager
////////////////////////////////////////////
import {
  BulletManager,
  anemoneBullet,
  anemone,
  bossFishBullet,
  bossFishPattern,
  bossTurtleBullet,
  defaultBullet,
  bossTurtlePattern,
  bossRGBFishPattern, 
  snailBullet
} from './BulletManager.js';

import { get_toggle_flag, get_mute_flag } from "../startscripts.js";

//import room data
import { room_data } from "./room_data.js";

//import text
import {
  typeDialogueLogic,
  getDialogueLines
} from "./Dialogue.js";

//////////////////////////////////////////////
// for all bullet manager and bullet graphics, scroll down
const fishTexture = PIXI.Texture.WHITE;
const anemoneTexture = PIXI.Texture.WHITE;
const turtleTexture = PIXI.Texture.WHITE;
let lastNematocystSpawnTime = 0;
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
const PLAYER_MAX_SPEED = 5;
const PLAYER_HEAL_SPEED = 1;

//player body size
const PLAYER_DIMENSIONS = 32;

//player health and damage
const PLAYER_MAX_HEALTH = 100;
const PLAYER_IFRAME_DURATION = 100;

//player rotate smooth stuff
const rotationSpeed = 0.1;

//damage
const TRASH_DAMAGE = 5;

//dash mechanic
const DASH_SPEED = 30;
const DASH_ACCEL = 10;
const DASH_DURATION = 150;
const DASH_COOLDOWN = 1500;

//zap
const ZAP_DURATION = 1500;
const ZAP_COOLDOWN = 2000;
const ZAP_RADIUS = 200;

//regen
const HEAL_DURATION = 2000;
const HEAL_COOLDOWN = 5000;

//app settings
const APP_WIDTH = 800;
const APP_HEIGHT = 450;
const APP_BG_COLOR = "#003a5f"; //

//map
const mapData = window.TileMaps[("room_2", "room_1")];

//map height, width, tile data
const {
  width: mapWidth,
  height: mapHeight,
  tilewidth: tileWidth,
  tileheight: tileHeight,
} = mapData;

//dialogue
const dialogueBg = new PIXI.Graphics()
  .rect(100, APP_HEIGHT - 200, APP_WIDTH - 200, 150)
  .fill(0x000000);
dialogueBg.alpha = 0.7;
dialogueBg.visible = false;
dialogueBg.zIndex = 20;
app.stage.addChild(dialogueBg);

const dialogue_text = new PIXI.Text({
  text: "",
  style: { fontSize: 28, fill: 0xffffff, wordWrap: true, wordWrapWidth: APP_WIDTH - 240 }
});
dialogue_text.position.set(120, APP_HEIGHT - 180);
dialogue_text.visible = false;
dialogue_text.zIndex = 21;
app.stage.addChild(dialogue_text);

//////////////////////////////////////////
// global stuff
/////////////////////////////////////////

///////////////////////////////////////////
//PLAYER DATA
////////////////////////////////////////////

let player = {
  state: "",
  chapter: 1,
  dealt_nuts: false,

  can_move: true,

  acceleration: PLAYER_ACCEL,
  max_speed: PLAYER_MAX_SPEED,

  health: 100,
  iframe: false,

  can_dash: true,
  is_dashing: false,

  can_zap: true,
  is_zapping: false,

  can_heal: true,
  is_healing: false,

  is_skill_restored: false,
  was_on_sand: false
};

// save mechanic
let saved_room = 'room_1';//localStorage.getItem("current_room")
let x = 100;//parseInt(localStorage.getItem("player_x"))
let y = 225;//parseInt(localStorage.getItem("player_y"))
let player_data = player;//parseInt(localStorage.getItem("temp_player_data"))
let save_data = room_data;//localStorage.getItem("room_data")
let health_data = 100;//parseInt(localStorage.getItem("health"))

/*const unmodified_room_data = JSON.parse(JSON.stringify(room_data));
if (save_data && save_data !== "null" && save_data !== "[object Object]") {
    try {
        const parsedSave = JSON.parse(save_data);
        for (const roomKey in room_data) {
            if (parsedSave[roomKey]) {
                Object.assign(room_data[roomKey], parsedSave[roomKey]);
                if (unmodified_room_data[roomKey] && unmodified_room_data[roomKey].bullets) {
                    room_data[roomKey].bullets = unmodified_room_data[roomKey].bullets;
                }
            }
        }
    } catch (e) {
        console.error("error reading data", e);
    }
}
if (player_data && player_data !== "null" && player_data !== "[object Object]") {
  Object.assign(player, JSON.parse(player_data));
}
*/
let temp_room_data = room_data;
let temp_player_data = player;
temp_player_data.health = health_data;

//rest of the things
let current_dialogue = null;
let dialogue_index = 0;
let dialogueActive = false;

let world;
let boxGraphic;
let skillGraphic;
let skillGraphicBack;
let playerEffectGraphic;
let shieldWasActive = false;
let shieldVisibleUntil = 0;
let activeSkill = null;
let anchorX = 0.5;
let anchorY = 0.5;

let current_room = "room_1";

let playerState;
let is_animation_locked = false;

let currently_playing = -1;
let inconspicuous_variable_that_counts_how_long_between_snail_movement_has_elapsed_uwu_that_isnt_used = 'mrmollusc';
let did_you_know_that_the_t1_line_in_sydney_rail_used_to_own_half_the_cityrail_network_but_is_now_nerfed_without_epping_question_mark = 't1'
let enter_pressed = false;

let is_alt_keybind = get_toggle_flag();
let is_mute = get_mute_flag();
let keybinds = {
  up: 'KeyW',
  left: 'KeyA',
  down: 'KeyS',
  right: 'KeyD',
  dash: 'Space',
  zap: 'KeyK',
  rejuv: 'KeyO'
}
if (is_alt_keybind == false) {
  keybinds = {
    up: 'ArrowUp',
    left: 'ArrowLeft',
    down: 'ArrowDown',
    right: 'ArrowRight',
    dash: 'Space',
    zap: 'KeyE',
    rejuv: 'KeyF',
    dialogue: 'KeyC'
  }
}
else {
  keybinds = {
    up: 'KeyW',
    left: 'KeyA',
    down: 'KeyS',
    right: 'KeyD',
    dash: 'Space',
    zap: 'KeyK',
    rejuv: 'KeyO',
    dialogue: 'Enter'
  }
}

//TEXTURES
PIXI.TextureSource.defaultOptions.scaleMode = 'nearest';
const crimson_texture = await PIXI.Assets.load("assets/crimson.png");
const heart_texture = await PIXI.Assets.load("assets/heart.png");
const sand_texture = await PIXI.Assets.load("assets/sand.png")
const up_arrow_texture = await PIXI.Assets.load("assets/up_dir_anim.png");
const right_arrow_texture = await PIXI.Assets.load("assets/right_dir_anim.png");
const left_arrow_texture = await PIXI.Assets.load("assets/left_dir_anim.png");
const down_arrow_texture = await PIXI.Assets.load("assets/down_dir_anim.png");
const arrow_textures = {
  up: up_arrow_texture,
  right: right_arrow_texture,
  left: left_arrow_texture,
  down: down_arrow_texture
}
await PIXI.Assets.load({
  alias: 'Indie Flower',
  src: './assets/label.ttf',
  data: {
    family: 'Indie Flower'
  }
});

//PIXI MUSIC
PIXI.sound.add('bgm', 'assets/loop2.mp3');

addEventListener('click', () => {
    if (!PIXI.sound.isPlaying('bgm')) {
        PIXI.sound.play('bgm', { 
            loop: true, 
            volume: 2 
        });
        console.log('BGM started');
    }
});


//PIXI ANIMATION FRAMES (CRIMSON)
const playerFrameWidth = 32;
const playerFrameHeight = 32;
const fullFrameWidth = 128;
//const fullFrameHeight = 128;
const totalFrames = 5;

const frames = [];
const skillFramesFront = [];
const skillFramesBack = [];
const shieldFrames = Array.from({ length: 3 }, (_, index) => new PIXI.Texture({
  source: crimson_texture,
  frame: new PIXI.Rectangle(index * playerFrameWidth, 64, playerFrameWidth, playerFrameHeight)
}));

function loadPlayerAnimation(animation) {
  frames.length = 0;
  for (let i = 0; i < totalFrames; i++) {
    const frameX = i * fullFrameWidth;
    const frameY = animation * playerFrameHeight;

    const rect = new PIXI.Rectangle(frameX, frameY, playerFrameWidth, playerFrameHeight);

    const texture = new PIXI.Texture({
      source: crimson_texture,
      frame: rect
    });
    frames.push(texture);
  };
};

//force block animations
const force_anim_frames = 16;
const force_frames = {
  up: [],
  right: [],
  down: [],
  left: []
};


function load_force_animation(key) {
  force_frames[key].length = 0;

  for (let i = 0; i < force_anim_frames; i++) {
    const x = i * 32;
    const y = 0;

    const rect = new PIXI.Rectangle(x, y, 32, 32);

    const texture = new PIXI.Texture({
      source: arrow_textures[key].source,
      frame: rect
    });

    force_frames[key].push(texture);
  }

}

load_force_animation('up');
load_force_animation('right');
load_force_animation('down');
load_force_animation('left');



function loadSkillAnimation(skill) {
  skillFramesFront.length = 0;
  skillFramesBack.length = 0;
  for (let i = 0; i < totalFrames; i++) {
    let skillFrameX, skillFrameY, skillFrameWidth, skillFrameHeight = 32;
    switch (skill) {
          case 0: 
            skillFrameX = i * fullFrameWidth + 38; // swap this to spark
            skillFrameY = 48;
            skillFrameWidth = 52;
            skillFrameHeight = 48;
            anchorX = 0.5;
            anchorY = 0.5;
            break;
          case 1:
            skillFrameX = i * fullFrameWidth + 38;
            skillFrameY = 0;
            skillFrameWidth = 52;
            skillFrameHeight = 48;
            anchorX = 0.5;
            anchorY = 0.5;
            break;
          case 2:
            skillFrameX = i * fullFrameWidth + 96;
            skillFrameY = 40;
            skillFrameWidth = 32;
            skillFrameHeight = 40;
            anchorX = 0.5;
            anchorY = 0.5;
            break;
          default:
            skillFrameX = i * fullFrameWidth + offset;
            skillFrameY = (skill) * skillFrameHeight;
            skillFrameWidth = 32;
            skillFrameHeight = 32;
            anchorX = 0.5;
            anchorY = 0.5;
            break;
        }
    const skillRect = new PIXI.Rectangle(skillFrameX, skillFrameY, skillFrameWidth, skillFrameHeight);
    const skillRectBack = new PIXI.Rectangle(skillFrameX, skillFrameY - 40, skillFrameWidth, skillFrameHeight);
    const skillTextureFront = new PIXI.Texture({
      source: crimson_texture,
      frame: skillRect
    });
    skillFramesFront.push(skillTextureFront);
    if (skill === 2) {
      const skillTextureBack = new PIXI.Texture({
        source: crimson_texture,
        frame: skillRectBack
      });
      skillFramesBack.push(skillTextureBack);
    }
  }
}
function showSkillAnimation(skill) {
  if (activeSkill === skill && skillGraphic.visible) return;

  loadSkillAnimation(skill);

  skillGraphic.anchor.set(anchorX, anchorY);
  skillGraphicBack.anchor.set(anchorX, anchorY);

  skillGraphic.textures = skillFramesFront;

  if (skill != 0) {
      skillGraphic.loop = true;
      skillGraphicBack.loop = true;
  }

  skillGraphic.gotoAndPlay(0);
  skillGraphic.visible = true;
  activeSkill = skill;
  
  if (temp_player_data.is_healing) {
    skillGraphicBack.textures = skillFramesBack;
    skillGraphicBack.gotoAndPlay(0);
    skillGraphicBack.visible = true;
  }
}

loadPlayerAnimation(0);

function changeAnimation(row, loopMode = true, animationSpeed = 0.1, forcedLock = false) {
  //if anim locked then reject
  if (is_animation_locked && !forcedLock) {
    return;
  }

  //if same anim is playing then reject
  if (currently_playing === row && boxGraphic.animationSpeed === animationSpeed) return;
  currently_playing = row;

  //will lock if special ability
  if (forcedLock) {
    is_animation_locked = true;
  }

  loadPlayerAnimation(row);
  boxGraphic.textures = frames;
  boxGraphic.loop = loopMode;
  boxGraphic.animationSpeed = animationSpeed;
  boxGraphic.gotoAndPlay(0);
  console.log(`${animationSpeed}`)
}

///////////////////////////////////////////////////////////////////////////
//swap anims - for player animations
//////////////////////////////////////////////////////////////////////////

function updatePlayerAnimation() {
  if (is_animation_locked) return;

  if (temp_player_data.is_zapping) {
    showSkillAnimation(1);
    return;
  }
  if (temp_player_data.is_healing) {
    showSkillAnimation(2);
    return;
  }

  if (temp_player_data.is_skill_restored) {
    showSkillAnimation(0);
    return;
  }

  skillGraphic.visible = false;
  skillGraphicBack.visible = false;
  activeSkill = null;

  if (temp_player_data.state === "moving") {
    changeAnimation(0, true, 0.2);
  } else if (playerState === "idle") {
    changeAnimation(0, true, 0.1);
  }
}

//when dash, lock anim until dash anim is done
function triggerDash() {
  if (is_animation_locked) return;

  playerState = "dashing";
  changeAnimation(1, false, 0.2, true);

  boxGraphic.onComplete = () => {
    is_animation_locked = false;
    boxGraphic.onComplete = null;
    currently_playing = -1;



    if (temp_player_data.state === "moving") {
      playerState = "moving";
    } else {
      playerState = "idle";
    }

    updatePlayerAnimation();
  };
}

////////////////////////////////////////
//PIXI INIT + WORLD CONTAINER
////////////////////////////////////////

(async () => {
  await app.init({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: APP_BG_COLOR,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  world = new PIXI.Container();
  app.stage.addChild(world);
  world.scale.set(CAMERA_ZOOM);

  const bulletManager = new BulletManager(physicsWorld, world, engine);

  const canvas = app.canvas;

  canvas.style.imageRendering = "pixelated";

  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.objectFit = "contain";

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
  ///////////////////////////////////////////////////////////
  //dialogue - textures and stuff
  //listeners for skipping dialogue is in ticker, will be below world/cam follow at bottom
  ////////////////////////////////////////////////////////////
  function startDialogue(npc) {
    current_dialogue = getDialogueLines(npc);
    dialogue_index = 0;

    dialogueBg.visible = true;
    dialogue_text.visible = true;
    temp_player_data.can_move = false;

    show_next_dialogue_line();
  }
  function show_next_dialogue_line() {
    if (!current_dialogue || dialogue_index >= current_dialogue.length) {
      endDialogue();
      return;
    }

    const line = current_dialogue[dialogue_index];
    const fullText = `${line.speaker}: ${line.text}`;

    dialogue_text._typingInterval = typeDialogueLogic(
      fullText,
      25, // typing speed
      (text) => dialogue_text.text = text, // update callback
      () => dialogue_text._typingInterval = null // finish callback
    );
  }
  function endDialogue() {
    dialogueBg.visible = false;
    dialogue_text.visible = false;
    temp_player_data.can_move = true;

    current_dialogue = null;
    dialogue_index = 0;
  }
  ///////////////////////////////////////////////////////
  //bullet texture
  ////////////////////////////////////////////

  //player healthbar sprite
  let healthbar_graphic = new PIXI.Graphics();
  let healthbar_bg_graphic = new PIXI.Graphics();

  //box graphic
  const targetWidth = PLAYER_DIMENSIONS * 2 / 3;
  const targetHeight = PLAYER_DIMENSIONS * 2 / 3;

  const baselineRadius = PLAYER_DIMENSIONS / 2;
  const box = Bodies.circle(100, 100, baselineRadius, {
    restitution: 0.0,
    friction: 0.0,
    frictionAir: 0.0,
    density: 0.05,
    slop: 0.05,
    inertia: Infinity,
  });
  box.isPlayer = true;

  const scaleX = targetWidth / (baselineRadius * 2);
  const scaleY = targetHeight / (baselineRadius * 2);

  Matter.Body.scale(box, scaleX, scaleY)
  Matter.Body.setInertia(box, Infinity)

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

  let jellys = [];
  let jelly_graphics = [];

  let forces = [];
  let force_graphics = [];

  let bullets = [];

  let text_boxes = [];
  let text_box_graphics = [];

  let sand_bars = [];
  let sand_bar_graphics = [];

  let kelps = [];
  let kelp_graphics = [];

  let labels = [];

  let room_label = new PIXI.Text({
    text: "room_1",
    style: { fontSize: 20, fill: 0xffffff },
  });
  room_label.zIndex = 11;
  room_label.position.set(APP_WIDTH - 100, APP_HEIGHT / 12);
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
        sprite.animationSpeed = 0.1;
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
    canTransition = false;
    //clear bullets from prev room
    bulletManager.clearAll();

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

    jelly_graphics.forEach((g) => world.removeChild(g));
    jellys.forEach((t) => Composite.remove(engine.world, t));
    jelly_graphics = [];
    jellys = [];

    force_graphics.forEach((g) => world.removeChild(g));
    forces.forEach((t) => Composite.remove(engine.world, t));
    force_graphics = [];
    forces = [];

    sand_bar_graphics.forEach((g) => world.removeChild(g));
    sand_bars.forEach((t) => Composite.remove(engine.world, t));
    sand_bar_graphics = [];
    sand_bars = [];

    kelp_graphics.forEach((g) => world.removeChild(g));
    kelps.forEach((t) => Composite.remove(engine.world, t));
    kelp_graphics = [];
    kelps = [];

    bulletManager.active.forEach((bullet) => {
      bullet.dead = true;
      bullet.sprite.visible = false;
      bullet.bulletId = null;
      Matter.Body.setPosition(bullet.body, { x: -9999, y: -9999 });
      Matter.Body.setVelocity(bullet.body, { x: 0, y: 0 });
    });
    bulletManager.active = [];

    text_box_graphics.forEach((g) => world.removeChild(g));
    text_boxes.forEach((t) => Composite.remove(engine.world, t));
    text_box_graphics = [];
    text_boxes = [];

    labels.forEach((g) => world.removeChild(g));
    labels = [];

    Matter.Body.setPosition(box, { x: spawnX, y: spawnY });
    Matter.Body.setVelocity(box, { x: 0, y: 0 });

    const data = temp_room_data[roomKey];

    data.walls.forEach((wall) => {
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
      wallGraphic.zIndex = 6;
      walls.push(wallBody);
      wall_graphics.push(wallGraphic);
      Composite.add(engine.world, wallBody);
    });

    data.doors.forEach((door) => {
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
      doorGraphic.zIndex = 6;
      doors.push(doorBody);
      door_graphics.push(doorGraphic);
      Composite.add(engine.world, doorBody);
    });

    data.trashes.forEach((trash_obj) => {
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
      trash_graphic.zIndex = 5;
      trashes.push(trash_body);
      trash_graphics.push(trash_graphic);
      Composite.add(engine.world, trash_body);
    });

    data.hearts.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 24, 24, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.Sprite(heart_texture);
      heart_graphic.width = 32;
      heart_graphic.height = 32;
      heart_graphic.anchor.set(0.5);

      heart_graphic.position.set(heart_obj.x, heart_obj.y);
      world.addChild(heart_graphic);

      hearts.push(heart_body);
      heart_graphics.push(heart_graphic);
      Composite.add(engine.world, heart_body);
    });

    data.force_blocks.forEach((force_obj) => {
      const force_body = Bodies.rectangle(
        force_obj.x,
        force_obj.y,
        force_obj.w,
        force_obj.h,
        { isStatic: true, collisionFilter: { group: -1, mask: 0 } }
      );
      const force_graphic = new PIXI.AnimatedSprite(force_frames[force_obj.texture]);
      force_graphic.width = force_obj.w;
      force_graphic.height = force_obj.h;
      force_graphic.anchor.set(0.5);
      force_graphic.zIndex = 7;

      force_graphic.textures = force_frames[force_obj.texture];
      force_graphic.loop = true;
      force_graphic.animationSpeed = 0.6;
      force_graphic.gotoAndPlay(0);

      force_graphic.position.set(force_obj.x, force_obj.y);
      world.addChild(force_graphic);

      forces.push(force_body);
      force_graphics.push(force_graphic);
      Composite.add(engine.world, force_body);
    });

    data.sand_bars.forEach((bar) => {
      const bar_body = Bodies.rectangle(bar.x, bar.y, bar.w, bar.h, { isStatic: true, collisionFilter: { group: -1, mask: 0 } })

      const bar_graphic = new PIXI.TilingSprite({
        texture: sand_texture,
        width: bar.w,
        height: bar.h
      })
      bar_graphic.tileScale.set(bar.w / 32*1, bar.w / 32*1)
      bar_graphic.anchor.set(0.5);
      bar_graphic.position.set(bar.x, bar.y);
      world.addChild(bar_graphic);

      sand_bars.push(bar_body);
      sand_bar_graphics.push(bar_graphic);
      Composite.add(engine.world, bar_body);
    });

    data.kelps?.forEach((kelp) => {
      const kelp_body = Bodies.rectangle(kelp.x, kelp.y, kelp.w, kelp.h, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 }
      });

      const kelp_graphic = new PIXI.Graphics()
        .rect(-kelp.w / 2, -kelp.h / 2, kelp.w, kelp.h)
        .fill(0x164a2b);

      kelp_graphic.position.set(kelp.x, kelp.y);
      kelp_graphic.zIndex = 4;
      world.addChild(kelp_graphic);

      kelps.push(kelp_body);
      kelp_graphics.push(kelp_graphic);
      Composite.add(engine.world, kelp_body);
    });

    let currentTime = performance.now();
    data.bullets?.forEach((b) => {
      let bullet = bulletManager.active.find(item => item.bulletId === b.id);
      if (!bullet) {
        switch (b.type) {
          case 'snail':
            bullet = bulletManager.spawnSnailBullet(b.x, b.y);
            console.log('foundsnail')
            break;

          case 'anemone':
            anemone.initialize(b.x, b.y, world);

            console.log(`found anemone ${b.x}, ${b.y}`);
            break;

          default:
            bullet = defaultBullet.spawn(bulletManager, PIXI.Texture.WHITE, b.x, b.y, b.vx || 0, b.vy || 0);
            console.log(`found default bullet with id ${b.id}`);
            break;
        }

        if (bullet) {
          bullet.bulletId = b.id;
          bullet.sprite.name = b.type;
          bullet.x = b.x;
          bullet.y = b.y;
          bullet.vx = b.vx || 0;
          bullet.vy = b.vy || 0;
        }
      }
      
      if (bullet && !bullet.dead) {
        
        bullet.vx = b.x_vel || 0;
        bullet.vy = b.y_vel || 0;

        if (!bullet.frozen) {
          Matter.Body.setVelocity(bullet.body, { x: bullet.vx, y: bullet.vy});
        }

        bullet.sprite.x = bullet.body.position.x;
        bullet.sprite.y = bullet.body.position.y;
      }
      /*bullet_box_obj._nextShotAt = 0;
      bullet_box_obj.bullets.forEach((bullet_obj) => {
        const speed = Number(bullet_box_obj.bullet_speed ?? 1);
        const bullet = new defaultBullet(
          bullet_box_obj.x,
          bullet_box_obj.y,
          Number(bullet_obj.vx) * speed,
          Number(bullet_obj.vy) * speed,
          engine.world,
          world
        );
        bullet.sprite.zIndex = 6;
        bullets.push(bullet);
        bullet_graphics.push(bullet.sprite);
        
      });*/
    });

    for (let i = bulletManager.active.length - 1; i >= 0; i--) {
      const activeBullet = bulletManager.active[i];
      if (!activeBullet || !activeBullet.bulletId) continue;

      // Use optional chaining inside the checker to prevent server room loading breaks
      const existsOnServer = data.bullets?.some(b => b.id === activeBullet.bulletId);
      
      if (!existsOnServer) {
        activeBullet.dead = true;
        activeBullet.sprite.visible = false;
        activeBullet.bulletId = null;
        
        Matter.Body.setPosition(activeBullet.body, { x: -9999, y: -9999 });
        Matter.Body.setVelocity(activeBullet.body, { x: 0, y: 0 });
      }
    }

    data.jellys.forEach((jelly_obj) => {
      const jelly_body = Bodies.rectangle(jelly_obj.x, jelly_obj.y, 50, 50, {
        isStatic: false,
        restitution: 1,
        friction: 0,
        collisionFilter: {
          category: 0,
          mask: 0
        },
      });

      const jelly_graphic = new PIXI.Graphics()
        .rect(-25, -25, 50, 50)
        .fill(0xf0a0f0);

      jelly_graphic.position.set(jelly_obj.x, jelly_obj.y);
      world.addChild(jelly_graphic);

      jellys.push(jelly_body);
      jelly_graphics.push(jelly_graphic);
      Composite.add(engine.world, jelly_body);
    });

    // Load snails from room data
    data.snails.forEach((snail_obj) => {
      const snail_bullet = bulletManager.spawnSnailBullet(snail_obj.x, snail_obj.y);
      if (snail_bullet) {
        snail_bullet.vx = snail_obj.x_vel || 0;
        snail_bullet.vy = snail_obj.y_vel || 0;
        Matter.Body.setVelocity(snail_bullet.body, { x: snail_bullet.vx, y: snail_bullet.vy });
      }
    });


    data.labels.forEach((label) => {
      const label_graphic = new PIXI.Text({
        text: label.text,
        style: label.style,
        resolution: 3,
        roundPixels: true
      })
      label_graphic.position.set(label.x, label.y);
      label_graphic.zIndex = 100;
      world.addChild(label_graphic);
      labels.push(label_graphic)
    });


    //end of loading objects

    room_label.text = "";
    room_label.text = data.label;

    setTimeout(() => {
      canTransition = true;
    }, 300);
  }
  //loss function 
  function lose(current_room, roomKey) {
    temp_player_data.health = 100;
    const data = temp_room_data[roomKey];
    let spawn_point = data.spawnpoint;
    load_rooms(current_room ?? 'room_2', spawn_point.x ?? 200, spawn_point.y ?? 450)
  }
  //edit hearts on touching
  function update_hearts(roomKey) {
    heart_graphics.forEach((g) => world.removeChild(g));
    hearts.forEach((t) => Composite.remove(engine.world, t));
    heart_graphics = [];
    hearts = [];

    const data = temp_room_data[roomKey];

    data.hearts.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 1, 1, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.Sprite(heart_texture);
      heart_graphic.width = 32;
      heart_graphic.height = 32;
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

  healthbar_bg_graphic.rect(APP_HEIGHT / 10, APP_HEIGHT / 10, PLAYER_MAX_HEALTH * 2, 10).fill(0xff00A0);
  healthbar_bg_graphic.zIndex = 9;
  app.stage.addChild(healthbar_bg_graphic);

  //healthbar updater
  function update_healthbar() {
    if (temp_player_data.health > 100) temp_player_data.health = 100;
    if (temp_player_data.health < 0) {
      temp_player_data.health = 0;
      lose(current_room, current_room);

    }
    healthbar_graphic.clear();
    healthbar_graphic.rect(APP_HEIGHT / 10, APP_HEIGHT / 10, temp_player_data.health * 2, 10).fill(0xa090ff);
  }

  function update_jelly(roomKey) {
    const data = temp_room_data[roomKey];

    data.jellys.forEach((jelly_obj, index) => {
      const jelly_body = jellys[index];
      const jelly_graphic = jelly_graphics[index];

      const dx = box.position.x - jelly_body.position.x;
      const dy = box.position.y - jelly_body.position.y;
      const angle = Math.atan2(dy, dx);

      const speed = Math.sqrt(distance_between(box, jelly_body)) / 10;
      const move_x = Math.cos(angle) * speed;
      const move_y = Math.sin(angle) * speed;

      Matter.Body.setVelocity(jelly_body, { x: move_x, y: move_y });

      jelly_obj.x = jelly_body.position.x;
      jelly_obj.y = jelly_body.position.y;
      jelly_graphic.position.set(jelly_body.position.x, jelly_body.position.y);
    });
  }

  function would_collide_with_wall(x, y) {
    const half_size = (/*PLAYER_DIMENSIONS*/2 * 0.5) - 2;
    const new_l = x - half_size;
    const new_r = x + half_size;
    const new_t = y - half_size;
    const new_b = y + half_size;

    return walls.some((wall) => {
      const wall_bounds = wall.bounds;
      return (
        new_r > wall_bounds.min.x &&
        new_l < wall_bounds.max.x &&
        new_b > wall_bounds.min.y &&
        new_t < wall_bounds.max.y
      );
    });
  }
  function would_collide_with_trash(x, y) {
    const half_size = (/*PLAYER_DIMENSIONS*/2 * 0.5) - 2;
    const new_l = x - half_size;
    const new_r = x + half_size;
    const new_t = y - half_size;
    const new_b = y + half_size;

    return trashes.some((trash) => {
      const trash_bounds = trash.bounds;
      return (
        new_r > trash_bounds.min.x &&
        new_l < trash_bounds.max.x &&
        new_b > trash_bounds.min.y &&
        new_t < trash_bounds.max.y
      );
    });
  }

  function would_collide_with_kelp(x, y) {
    const half_size = (/*PLAYER_DIMENSIONS*/2 * 0.5) - 2;
    const new_l = x - half_size;
    const new_r = x + half_size;
    const new_t = y - half_size;
    const new_b = y + half_size;

    return kelps.some((kelp) => {
      const kelp_bounds = kelp.bounds;
      return (
        new_r > kelp_bounds.min.x &&
        new_l < kelp_bounds.max.x &&
        new_b > kelp_bounds.min.y &&
        new_t < kelp_bounds.max.y
      );
    });
  }

  //player sprite
  async function create_player() {
    //boxGraphic = new PIXI.Sprite(ralsei_texture);
    boxGraphic = new PIXI.AnimatedSprite(frames);
    boxGraphic.animationSpeed = 0.1;
    boxGraphic.play();
    boxGraphic.zIndex = "8";
    boxGraphic.width = PLAYER_DIMENSIONS;
    boxGraphic.height = PLAYER_DIMENSIONS;
    boxGraphic.anchor.set(0.5, 0.5);
    world.addChild(boxGraphic);

    skillGraphic = new PIXI.AnimatedSprite([PIXI.Texture.WHITE]);
    skillGraphic.animationSpeed = 0.2;
    skillGraphic.loop = true;
    skillGraphic.anchor.set(0.5, 0.5);
    skillGraphic.zIndex = "9";
    skillGraphic.visible = false;

    skillGraphicBack = new PIXI.AnimatedSprite([PIXI.Texture.WHITE]);
    skillGraphicBack.animationSpeed = 0.2;
    skillGraphicBack.loop = true;
    skillGraphicBack.anchor.set(0.5, 0.5);
    skillGraphicBack.zIndex = "7";
    skillGraphicBack.visible = false;

    world.addChild(skillGraphicBack);
    world.addChild(skillGraphic);

    playerEffectGraphic = new PIXI.AnimatedSprite(shieldFrames);
    playerEffectGraphic.animationSpeed = 0.15;
    playerEffectGraphic.loop = true;
    playerEffectGraphic.width = PLAYER_DIMENSIONS;
    playerEffectGraphic.height = PLAYER_DIMENSIONS;
    playerEffectGraphic.anchor.set(0.5);
    playerEffectGraphic.zIndex = "10";
    playerEffectGraphic.visible = false;
    world.addChild(playerEffectGraphic);

    Composite.add(engine.world, [box]);
    load_rooms(saved_room, x, y);
  }
  await create_player();

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
  let debugKeyWasDown = false;
  let e;
  window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
    e = event;
  });
  window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  const test_body = Bodies.rectangle(300, 200, 50, 50, {
    isStatic: true,
    isSensor: true
  });
  test_body.id = "test_box";
  const text_graphic = new PIXI.Graphics()
    .rect(-25, -25, 50, 50)
    .fill(0x000000); // green box so you can see it

  text_graphic.position.set(300, 200);
  text_graphic.zIndex = 5;
  world.addChild(text_graphic);

  text_boxes.push(test_body);
  Composite.add(engine.world, test_body);
  //important start or main game loop

  app.ticker.add((ticker) => {
    console.log(`FPS: ${Math.round(app.ticker.FPS)}`);
    console.log(`{player.x: ${box.position.x}, player.y: ${box.position.y}}`);
    bulletManager.update(ticker);

    let currentTime = performance.now();
    anemone.update(currentTime, bulletManager, anemoneTexture, anemone.x, anemone.y);

    if (!boxGraphic) return;

    let v1x = box.velocity.x;
    let v1y = box.velocity.y;

    //WASD
    let is_moving_x;
    let is_moving_y;
    let is_moving;

    if (keys[keybinds.right] && temp_player_data.can_move == true) {
      v1x = Math.min(v1x + temp_player_data.acceleration, temp_player_data.max_speed);
      is_moving_x = true;
    }
    else if (keys[keybinds.left] && temp_player_data.can_move == true) {
      v1x = Math.max(v1x - temp_player_data.acceleration, -temp_player_data.max_speed);
      is_moving_x = true;
    }

    if (keys[keybinds.down] && temp_player_data.can_move == true) {
      v1y = Math.min(v1y + temp_player_data.acceleration, temp_player_data.max_speed);
      is_moving_y = true;
    }

    else if (keys[keybinds.up] && temp_player_data.can_move == true) {
      v1y = Math.max(v1y - temp_player_data.acceleration, -temp_player_data.max_speed);
      is_moving_y = true;
    }

    if (is_moving_x || is_moving_y) {
      is_moving = true;
    }
    temp_player_data.state = is_moving ? "moving" : "idle";
    if (!is_moving_x) {
      v1x *= 0.9;
    }
    if (!is_moving_y) {
      v1y *= 0.9;
    }

    const rotationVelocityX = v1x;
    const rotationVelocityY = v1y;

    const nextX = box.position.x + v1x;
    const nextY = box.position.y + v1y;

    if (!temp_player_data.is_dashing && would_collide_with_kelp(nextX, box.position.y)) {
      v1x = 0;
    }

    if (!temp_player_data.is_dashing && would_collide_with_kelp(box.position.x, nextY)) {
      v1y = 0;
    }

    if (would_collide_with_wall(nextX, box.position.y) || would_collide_with_trash(nextX, box.position.y)) {
      v1x = 0;
    }

    if (would_collide_with_wall(box.position.x, nextY) || would_collide_with_trash(box.position.x, nextY)) {
      v1y = 0;
    }

    Matter.Body.setVelocity(box, { x: v1x, y: v1y });
    Matter.Engine.update(engine, 1000 / 60);
    bulletManager.syncSprites();

    //dash mechanic
    if (keys[keybinds.dash] &&
      temp_player_data.can_dash &&
      !temp_player_data.is_healing &&
      !temp_player_data.is_dashing &&
      !temp_player_data.is_zapping) {
        temp_player_data.can_heal = false;
        temp_player_data.state = "dashing";
        temp_player_data.max_speed = DASH_SPEED;
        temp_player_data.acceleration = DASH_ACCEL;
        temp_player_data.can_dash = false;
        temp_player_data.is_dashing = true;

        setTimeout(() => {
          temp_player_data.max_speed = PLAYER_MAX_SPEED;
          temp_player_data.acceleration = PLAYER_ACCEL;
          temp_player_data.is_dashing = false;
          temp_player_data.can_heal = true;
        }, DASH_DURATION);

        setTimeout(() => {
          temp_player_data.state = "idle";
          temp_player_data.can_dash = true;
        }, DASH_COOLDOWN);
    }

    //bullet freeze
    else if (keys[keybinds.zap] &&
      temp_player_data.can_zap &&
      !temp_player_data.is_healing &&
      !temp_player_data.is_dashing &&
      !temp_player_data.is_zapping) {
        temp_player_data.can_zap = false;
        temp_player_data.is_zapping = true;

        bulletManager.setFrozen(true, box.position, ZAP_RADIUS);
        bulletManager.shockSnails(box.position, ZAP_RADIUS, ZAP_DURATION);
        showSkillAnimation(1); // skill 1 = shock/zap
        
        setTimeout(() => {
          temp_player_data.is_zapping = false;
          bulletManager.setFrozen(false);
        }, ZAP_DURATION);

        setTimeout(() => {
          temp_player_data.can_zap = true;
          
          temp_player_data.is_skill_restored = true;
          updatePlayerAnimation(); 
          
          skillGraphic.loop = false;
          skillGraphic.onComplete = () => {
              temp_player_data.is_skill_restored = false;
              skillGraphic.onComplete = null; 
              requestAnimationFrame(() => {
                  updatePlayerAnimation();
              });
          };
        }, ZAP_COOLDOWN);
    }

    //regenerate health
    else if (keys[keybinds.rejuv] &&
      temp_player_data.can_heal &&
      !temp_player_data.is_healing &&
      !temp_player_data.is_dashing &&
      !temp_player_data.is_zapping) {
        temp_player_data.can_dash = false;
        temp_player_data.can_heal = false;
        temp_player_data.is_healing = true;
        temp_player_data.max_speed = PLAYER_HEAL_SPEED;

        const heal_interval = setInterval(() => {
          if (temp_player_data.is_healing) {
            temp_player_data.health += Math.min(15 / temp_player_data.health, 1.5);
          }
          else {
            clearInterval(heal_interval)
          }
        }, 10);

        setTimeout(() => {
          clearInterval(heal_interval);
          temp_player_data.can_dash = true;
          temp_player_data.max_speed = PLAYER_MAX_SPEED;
          temp_player_data.is_healing = false;
        }, HEAL_DURATION);

        setTimeout(() => {
          temp_player_data.can_heal = true;
        }, HEAL_COOLDOWN);
    }

    if (keys["KeyB"] && !debugKeyWasDown) {
      bulletManager.spawnSnailBullet(
        box.position.x,
        box.position.y
      );
      bossFishPattern(bulletManager, fishTexture, world); // blue fish
      bossRGBFishPattern(bulletManager, world); // RGB fish pattern
      console.log("Spawned pooled bullet");
      setTimeout(() => {
        bossTurtlePattern(bulletManager, turtleTexture, world); // green turtle
      }, 3000);
    }
    debugKeyWasDown = keys["KeyB"];
    //healthbar update
    update_healthbar();
    //bullet stuff
    for (let b of bulletManager.active) {
      if (b.dead) continue;

      // collision check
      if (bulletManager.collidesWith(b.body, box)) {
        //harmless bullets never deal damage
        if (b.harmless) {
          if (!b.persistent) {
            b.dead = true;
            b.sprite.visible = false;
            Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
          }
          continue;
        }
        //bullets that ignore i‑frames always deal damage
        if (b.ignoreIframes) {
          temp_player_data.health -= b.damage;

          if (!b.pierce && !b.persistent) {
            b.dead = true;
            b.sprite.visible = false;
            Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
          }
          continue;
        }

        //normal bullets respect i‑frames
        if (!temp_player_data.iframe && b.damage > 0) {
          temp_player_data.health -= b.damage;

          temp_player_data.iframe = true;
          setTimeout(() => {
            temp_player_data.iframe = false;
          }, PLAYER_IFRAME_DURATION);

          if (!b.pierce && !b.persistent) {
            b.dead = true;
            b.sprite.visible = false;
            Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
          }
        }

        if (!b.persistent) {
          b.dead = true;
          b.sprite.visible = false;
          Matter.Body.setPosition(b.body, { x: -9999, y: -9999 });
        }
      }
    }

    //jelly moves
    update_jelly(current_room)

    //register damage and activate iframes
    trashes.forEach((trash_body) => {
      if (temp_player_data.iframe == false && check_collision(box, trash_body)) {
        temp_player_data.health -= TRASH_DAMAGE;
        temp_player_data.iframe = true;
        setTimeout(() => {
          temp_player_data.iframe = false;
        }, PLAYER_IFRAME_DURATION);
      }
    });

    sand_bars.forEach((sand_body) => {
      if (temp_player_data.iframe == false && check_collision(box, sand_body)) {
        temp_player_data.health -= 0.1;
        temp_player_data.iframe = true;
        setTimeout(() => {
          temp_player_data.iframe = false;
        }, PLAYER_IFRAME_DURATION);
      }
    });
    
    const is_on_sand = sand_bars.some((bar) => check_collision(box, bar));

    if (is_on_sand) {
      temp_player_data.max_speed = 1;
      temp_player_data.was_on_sand = true;

    } else if (temp_player_data.was_on_sand) {
      temp_player_data.max_speed = PLAYER_MAX_SPEED;
      temp_player_data.was_on_sand = false;
    }

    forces.forEach((e, index) => {
      if (check_collision(box, e)) {
        let applied_x = temp_room_data[current_room].force_blocks[index].velocity.x;
        let applied_y = temp_room_data[current_room].force_blocks[index].velocity.y;

        v1x += applied_x;
        v1y += applied_y;
      }
    });

    //heal code of heart collectibles
    for (let e of hearts) {
      if (check_collision(box, e)) {
        const heartIndex = hearts.findIndex((e) => check_collision(box, e));

        if (heartIndex !== -1) {
          temp_player_data.health += 10;
          hearts.splice(heartIndex, 1);
          temp_room_data[current_room].hearts.splice(heartIndex, 1);
          update_hearts(current_room);
        }
      }
    }

    Matter.Body.setVelocity(box, { x: v1x, y: v1y });
    boxGraphic.position.set(box.position.x, box.position.y);
    boxGraphic.angle = box.angle;

    const speed = Math.sqrt(rotationVelocityX * rotationVelocityX + rotationVelocityY * rotationVelocityY);
    if (speed > 0.1) {
      const targetAngle = Math.atan2(rotationVelocityY, rotationVelocityX);
      let angleDiff = targetAngle - box.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      Matter.Body.setAngle(box, box.angle + angleDiff * rotationSpeed);
    }
    boxGraphic.position.set(box.position.x, box.position.y);
    boxGraphic.rotation = box.angle + Math.PI / 2;
    skillGraphic.position.set(box.position.x, box.position.y);
    skillGraphicBack.position.set(box.position.x, box.position.y + 1);
    if (temp_player_data.is_healing) {
      skillGraphic.rotation = 0;
      skillGraphicBack.rotation = 0;
    }
    playerEffectGraphic.position.set(box.position.x, box.position.y);
    playerEffectGraphic.rotation = box.angle + Math.PI / 2;
    const now = performance.now();
    if (temp_player_data.iframe && !shieldWasActive) {
      playerEffectGraphic.gotoAndPlay(0);
      shieldVisibleUntil = now + 500;
    }
    if (now >= shieldVisibleUntil) playerEffectGraphic.stop();
    playerEffectGraphic.visible = now < shieldVisibleUntil;
    shieldWasActive = temp_player_data.iframe;
    //PLAYERSTATE

    //PLAYERSTATE LOGIC
    if (!is_animation_locked) {
      if (temp_player_data.state > 0.1) {
        playerState = "moving";
      } else {
        playerState = "idle";
      }

      updatePlayerAnimation();
    }


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
    /////////////////////////////////////////////////////////////////////////////
    //collide into test text box maker
    ///////////////////////////////////////////////////////////////
    text_boxes.forEach((tb) => {
      if (!dialogueActive && check_collision(box, tb)) {
        if (tb.id == "test_box") {
          dialogueActive = true;
          startDialogue("name_1");
        }
      }
    });
    /////////////////////////////////////////////////////////////////////////////
    //for dialogue checker (skip)
    /////////////////////////////////////////////////////////////////////////////////
    if (keys[keybinds.dialogue]) {

      if (!enter_pressed) {
        enter_pressed = true;

        if (dialogue_text._typingInterval) {
          clearInterval(dialogue_text._typingInterval);
          dialogue_text._typingInterval = null;

          const line = current_dialogue[dialogue_index];
          dialogue_text.text = `${line.speaker}: ${line.text}`;
        } else {
          dialogue_index++;
          show_next_dialogue_line();
        }
      }

    } else {
      // reset when key is released
      enter_pressed = false;
    }

    world.children.forEach((child) => {
      if (child.label && child.label.startsWith("parallax_")) {
        const parallax_amt = parseFloat(child.label.split("_")[1]);

        child.x = world.pivot.x * (1 - 1 / parallax_amt);
        child.y = world.pivot.y * (1 - 1 / parallax_amt);
      }
    });

    for (let i = 0; i < walls.length; i++) {
      wall_graphics[i].position.set(walls[i].position.x, walls[i].position.y);
    }
      if (canTransition) {
        for (let doorBody of doors) {
          if (check_collision(box, doorBody)) {
            // SAVE bullets from current room
            temp_room_data[current_room].savedBullets =
              bulletManager.active.map(b => bulletManager.serializeBullet(b));

            // CLEAR bullets from screen
            bulletManager.clearAll();

            // LOAD new room
            doors = [];
            load_rooms(
              doorBody.target_room,
              doorBody.target_x,
              doorBody.target_y,
            );

            // RESTORE bullets for new room
            bulletManager.restoreBullets(
              temp_room_data[doorBody.target_room].savedBullets,
              PIXI.Texture.WHITE // or bullet-specific texture
            );

            // Update current room
            current_room = doorBody.target_room;

            break;
          }
        }
      
    }
  });
  setInterval(() => {
    localStorage.setItem("current_room", current_room); //room
    localStorage.setItem("player_x", Math.trunc(box.position.x)); //x
    localStorage.setItem("player_y", Math.trunc(box.position.y)); //y
    localStorage.setItem("room_data", JSON.stringify(room_data)); //room data
    localStorage.setItem("player_data", JSON.stringify(player)); //player data
    localStorage.setItem("health", Math.trunc(temp_player_data.health)); //health

    console.log(temp_player_data.health, current_room, Math.trunc(box.position.x), Math.trunc(box.position.y), room_data);
  }, 1000);

})();
