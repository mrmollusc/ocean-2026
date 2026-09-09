///////////////////////////////////////
//INITIAL SETUP
////////////////////////////////////////

const { Engine, Bodies, Composite, Body } = Matter;
const app = new PIXI.Application();

const engine = Engine.create({
    positionIterations: 60, 
    velocityIterations: 60
});
engine.gravity.y = 0;
const physicsWorld = engine.world;

////////////////////////////////////////////
//imports of bullets and manager
////////////////////////////////////////////
import {
  BulletManager,
  anemoneBullet,
  anemone, 
  anemoneFrames, 
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
const ZAP_COOLDOWN = 5000;
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
//background
const bgTexture = await PIXI.Assets.load('assets/BackGround.png');
const background = new PIXI.Sprite(bgTexture);

app.stage.addChildAt(background, 0); 

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
  style: { fontFamily: 'Indie Flower', fontSize: 28, fill: 0xffffff, wordWrap: true, wordWrapWidth: APP_WIDTH - 240, padding: 10 }
});
dialogue_text.position.set(120, APP_HEIGHT - 180);
dialogue_text.visible = false;
dialogue_text.zIndex = 21;
app.stage.addChild(dialogue_text);

const pauseMenu = new PIXI.Graphics()
  .rect(0, 0, APP_WIDTH, APP_HEIGHT)
  .fill(0x000000);
pauseMenu.alpha = 0.7;
pauseMenu.visible = false;
pauseMenu.zIndex = 22;
app.stage.addChild(pauseMenu);

const pauseMenuTimerWidth = 100;
const pauseMenuTimerHeight = 5;
const pauseMenuTimerOffsetX = 60;// from centre
const pauseMenuTimerOffsetY = 100;// from top

const pauseMenuLeftTimer = new PIXI.Graphics()
  .rect(0, 0, pauseMenuTimerWidth, pauseMenuTimerHeight)
  .fill(0xffffff);

pauseMenuLeftTimer.pivot.set(pauseMenuTimerWidth, pauseMenuTimerHeight / 2);
pauseMenuLeftTimer.position.set(APP_WIDTH / 2 - pauseMenuTimerOffsetX, pauseMenuTimerOffsetY);

pauseMenuLeftTimer.alpha = 1;
pauseMenuLeftTimer.visible = false;
pauseMenuLeftTimer.zIndex = 23;
app.stage.addChild(pauseMenuLeftTimer);

const pauseMenuRightTimer = new PIXI.Graphics()
  .rect(0, 0, pauseMenuTimerWidth, pauseMenuTimerHeight)
  .fill(0xffffff);

pauseMenuRightTimer.pivot.set(0, pauseMenuTimerHeight / 2);
pauseMenuRightTimer.position.set(APP_WIDTH / 2 + pauseMenuTimerOffsetX, pauseMenuTimerOffsetY);

pauseMenuRightTimer.alpha = 1;
pauseMenuRightTimer.visible = false;
pauseMenuRightTimer.zIndex = 23;
app.stage.addChild(pauseMenuRightTimer);

const pauseMenu_text = new PIXI.Text({ 
    text: "PAUSED", 
    style: { 
        fontFamily: 'Sans Serif', 
        fontSize: 28, 
        fill: 0xffffff, 
        wordWrap: true, 
        wordWrapWidth: APP_WIDTH - 240, 
        padding: 10 
    } 
});

pauseMenu_text.anchor.set(0.5);

pauseMenu_text.position.set(APP_WIDTH / 2, 100); 

pauseMenu_text.zIndex = 24;
pauseMenu_text.alpha = 0;
app.stage.addChild(pauseMenu_text);

//////////////////////////////////////////
// global stuff
/////////////////////////////////////////

///////////////////////////////////////////
//PLAYER DATA
////////////////////////////////////////////

let player = {
  state: "",
  chapter: 0,
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
localStorage.setItem("room_data", room_data);
let saved_room = localStorage.getItem("current_room") || 'room_1';
let x = parseInt(localStorage.getItem("player_x")) || 100;
let y = parseInt(localStorage.getItem("player_y")) || 225;
let player_data = localStorage.getItem("temp_player_data") || player;
let save_data = localStorage.getItem("room_data") || room_data;
let health_data = parseInt(localStorage.getItem("health")) || 100;
let chapter_data = parseInt(localStorage.getItem("chapter")) || 0;

const unmodified_room_data = JSON.parse(JSON.stringify(room_data));

if (save_data && save_data !== "null" && save_data !== "[object Object]") {
    try {
        const parsedSave = JSON.parse(save_data);
        for (const roomKey in room_data) {
            if (parsedSave[roomKey]) {
                Object.assign(room_data[roomKey], parsedSave[roomKey]);
                
                if (parsedSave[roomKey].savedBullets) {
                    room_data[roomKey].savedBullets = parsedSave[roomKey].savedBullets;
                } else if (unmodified_room_data[roomKey] && unmodified_room_data[roomKey].bullets) {
                    room_data[roomKey].bullets = unmodified_room_data[roomKey].bullets;
                }
            }
        }
    } catch (e) {
        console.error("Error parsing save_data from localStorage:", e);
    }
}

if (player_data&& player_data !== "null" && player_data !== "[object Object]") {
    try {
        Object.assign(player, player_data);
    } catch (e) {
        console.error("Error parsing player_data from localStorage:", e);
    }
}

let temp_room_data = room_data;
let temp_player_data = player;
temp_player_data.health = health_data;
temp_player_data.chapter = chapter_data 

//rest of the things
let current_dialogue = null;
let dialogue_index = 0;
let dialogueActive = false;
let last_touched_box = null; 
let text_box_talk_counts = {}; 

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
let keybinds = {
  up: 'KeyW',
  left: 'KeyA',
  down: 'KeyS',
  right: 'KeyD',
  dash: 'Space',
  zap: 'KeyK',
  rejuv: 'KeyO',
  dialogue: 'Enter',
  pause: 'Escape'
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
    dialogue: 'KeyC',
    pause: 'KeyP'
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
    dialogue: 'Enter', 
    pause: 'Escape'
  }
}

//TEXTURES
PIXI.TextureSource.defaultOptions.scaleMode = 'nearest';
const door_texture = await PIXI.Assets.load("assets/door.png");
const sign_texture = await PIXI.Assets.load("assets/sign.png");
const wall_texture = await PIXI.Assets.load("assets/wall.png");
const trash_texture = await PIXI.Assets.load("assets/trash.png");
const kelp_texture = await PIXI.Assets.load("assets/kelp.png");
const crimson_texture = await PIXI.Assets.load("assets/crimson.png");
const heart_texture = await PIXI.Assets.load("assets/yums.png");
const sand_texture = await PIXI.Assets.load("assets/sand.png")
const sprites_textures = await PIXI.Assets.load("assets/sprites v0.2.png");
sprites_textures.source.scaleMode = 'nearest';
const error_texture = await PIXI.Assets.load('assets/errorTexture.png')
error_texture.source.scaleMode = 'nearest';
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

PIXI.sound.add('game-bgm', 'assets/loop2.mp3');
function start_game_music() {
  const isMuted = get_mute_flag();
  PIXI.sound.muted = isMuted;

  if (!isMuted && !PIXI.sound.isPlaying('game-bgm')) {
    PIXI.sound.play('game-bgm', {
      loop: true,
      volume: 1
    });
  }
}

if (document.readyState === 'complete') {
  start_game_music();
} else {
  window.addEventListener('load', start_game_music, { once: true });
}

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

//game animations
const kelp_anim_frames = 5;
const heal_anim_frames = 4;
const force_anim_frames = 16;
const force_frames = {
  up: [],
  right: [],
  down: [],
  left: []
};
let heal_frames = [];
let kelp_frames = [];


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

function load_heals_animation() {
  heal_frames.length = 0;

  for (let i = 0; i < heal_anim_frames; i++) {
    const x = i * 32;
    const y = 0;

    const rect = new PIXI.Rectangle(x, y, 32, 32);

      const texture = new PIXI.Texture({
        source: heart_texture.source,
      frame: rect
    });

    heal_frames.push(texture);
  }

}
function load_kelp_animation() {
  kelp_frames.length = 0;

  for (let i = 0; i < kelp_anim_frames; i++) {
    const x = i * 32;
    const y = 0;

    const rect = new PIXI.Rectangle(x, y, 32, 32);

      const texture = new PIXI.Texture({
        source: kelp_texture.source,
      frame: rect
    });

    kelp_frames.push(texture);
  }

}
load_kelp_animation();
load_heals_animation();
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
  } else {
    skillGraphic.loop = false;
    skillGraphicBack.loop = false;
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

//chrysaory animation
let ChrysaoryFrames = [];
let errorFrames = [];
function loadSpriteAnimation(frames = errorFrames, source = error_texture, fullFrameWidth = 0, offsetX = 0, offsetY = 0, width = 32, height = 32, totalFrames = 5) {
  frames = frames || errorFrames;
  frames.length = 0; // name of frames array (please make sure it already exists)

  for (let i = 0; i < (totalFrames || 5); i++) {
    const x = i * (fullFrameWidth || 0) + (offsetX || 0);
    const y = (offsetY || 0);

    const rect = new PIXI.Rectangle(x, y, (width || 0), (height || 0));

    const texture = new PIXI.Texture({
      source: source || error_texture, 
      frame: rect
    });
    frames.push(texture);
  }
}
loadSpriteAnimation();
loadSpriteAnimation(ChrysaoryFrames, sprites_textures, 128, 64, 32.6, 22, 32);

////////////////////////////////////////
//PIXI INIT + WORLD CONTAINER
////////////////////////////////////////

(async () => {
  await app.init({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: APP_BG_COLOR,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  world = new PIXI.Container();
  world.sortableChildren = true;
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
    if (dialogue_text._typingInterval) {
      clearInterval(dialogue_text._typingInterval);
      dialogue_text._typingInterval = null;
    }
    if (!current_dialogue || dialogue_index >= current_dialogue.length) {
      endDialogue();
      return;
    }
    dialogue_text.text = ""; 

    const line = current_dialogue[dialogue_index];
    const fullText = `${line.speaker}: ${line.text}`;

    dialogue_text._typingInterval = typeDialogueLogic(
      fullText,
      25, 
      (text) => dialogue_text.text = text, 
      () => dialogue_text._typingInterval = null 
    );
  }
   function endDialogue() {
    dialogueBg.visible = false;
    dialogue_text.visible = false;
    
    if (typeof temp_player_data !== "undefined") {
      temp_player_data.can_move = true;
    }

    current_dialogue = null;
    dialogue_index = 0;
    dialogueActive = false; 
    last_touched_box = null; 
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

  let anemone_graphics = [];

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
    
    anemone_graphics.forEach((g) => world.removeChild(g));
    anemone_graphics = [];

    text_box_graphics.forEach((g) => world.removeChild(g));
    text_boxes.forEach((t) => Composite.remove(engine.world, t));
    text_box_graphics = [];
    text_boxes = [];

    last_touched_box = null;

    labels.forEach((g) => world.removeChild(g));
    labels = [];

    Matter.Body.setPosition(box, { x: spawnX, y: spawnY });
    Matter.Body.setVelocity(box, { x: 0, y: 0 });

    const data = temp_room_data[roomKey];

    data.walls?.forEach((wall_obj) => {
      const wall_body = Bodies.rectangle(wall_obj.x, wall_obj.y, wall_obj.w, wall_obj.h, {
        isStatic: true,
        collisionFilter: { category: 0x0001, mask: 0x0002 }
      })

      const wall_graphic = new PIXI.TilingSprite({
        texture: wall_texture,
        width: wall_obj.w,
        height: wall_obj.h
      })
      wall_graphic.tileScale.set(2, 2);
      wall_graphic.anchor.set(0.5,0.5);
      wall_graphic.position.set(wall_obj.x, wall_obj.y);
      world.addChild(wall_graphic);

      walls.push(wall_body);
      wall_graphics.push(wall_graphic);
      Composite.add(engine.world, wall_body);
    });

    data.doors?.forEach((door) => {
      const doorGraphic = new PIXI.Sprite(door_texture);
      const doorBody = Bodies.rectangle(door.x, door.y, door.w+10, door.h+10, {
        isStatic: true,
        isSensor: true,
      });

      doorBody.target_room = door.target_room;
      doorBody.target_x = door.target_x;
      doorBody.target_y = door.target_y;
      doorGraphic.anchor.set(0.5, 0.5);
      doorGraphic.width = 40;
      doorGraphic.height = 40;
      doorGraphic.position.set(door.graphic_x ?? door.x, door.graphic_y ?? door.y);
      doorGraphic.roundPixels = true;
      world.addChild(doorGraphic);
      doorGraphic.zIndex = 6;
      doors.push(doorBody);
      door_graphics.push(doorGraphic);
      Composite.add(engine.world, doorBody);
    });

    data.text_boxes?.forEach((text_box) => {
      const text_box_body = Bodies.rectangle(text_box.x, text_box.y, text_box.w ?? 64,text_box.h ?? 64, {
        isStatic: true,
        isSensor: true,
      });

      text_box_body.text_id = text_box.id;
      text_boxes.push(text_box_body);
      Composite.add(engine.world, text_box_body);

      const default_graphic = new PIXI.Sprite(sign_texture);
      const chrysaory_graphic = new PIXI.AnimatedSprite(ChrysaoryFrames)
      if (text_box.id.includes('chrysaory') || text_box.id.includes('Chrysaory')) {
      chrysaory_graphic.anchor.set(0.5);
      chrysaory_graphic.textures = ChrysaoryFrames;
      chrysaory_graphic.loop = true;
      chrysaory_graphic.animationSpeed = 0.12;
      chrysaory_graphic.gotoAndPlay(0);
      chrysaory_graphic.visible = true;
      chrysaory_graphic.scale.set(2, 2);
      chrysaory_graphic.roundPixels = true;
      chrysaory_graphic.position.set(text_box.x, text_box.y);
      world.addChild(chrysaory_graphic);
      chrysaory_graphic.zIndex = 6;

      text_box_graphics.push(chrysaory_graphic);
      }
      else {
      default_graphic.anchor.set(0.5);
      default_graphic.scale.set(2, 2);
      default_graphic.roundPixels = true;
      default_graphic.position.set(text_box.x, text_box.y);
      world.addChild(default_graphic);
      default_graphic.zIndex = 6;
      text_box_graphics.push(default_graphic);
      }
    });

    data.trashes?.forEach((trash_obj) => {
      const trash_body = Bodies.rectangle(trash_obj.x, trash_obj.y, trash_obj.w, trash_obj.h, { isStatic: true, collisionFilter: { group: -1, mask: 0 } });

      const trash_graphic = new PIXI.TilingSprite({
        texture: trash_texture,
        width: trash_obj.w,
        height: trash_obj.h
      });
      trash_graphic.tileScale.set(trash_obj.w / 32, trash_obj.h / 32);
      trash_graphic.anchor.set(0.5);
      trash_graphic.position.set(trash_obj.x, trash_obj.y);
      world.addChild(trash_graphic);

      trashes.push(trash_body);
      trash_graphics.push(trash_graphic);
      Composite.add(engine.world, trash_body);
    });

    data.hearts?.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 24, 24, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.AnimatedSprite(heal_frames);
      heart_graphic.width = 64;
      heart_graphic.height = 64;
      heart_graphic.anchor.set(0.5);

      heart_graphic.textures = heal_frames;
      heart_graphic.loop = true;
      heart_graphic.animationSpeed = 0.1;
      heart_graphic.gotoAndPlay(0);

      heart_graphic.position.set(heart_obj.x, heart_obj.y);
      world.addChild(heart_graphic);

      hearts.push(heart_body);
      heart_graphics.push(heart_graphic);
      Composite.add(engine.world, heart_body);
    });

    data.force_blocks?.forEach((force_obj) => {
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

    data.sand_bars?.forEach((bar) => {
      const bar_body = Bodies.rectangle(bar.x, bar.y, bar.w, bar.h, { isStatic: true, collisionFilter: { group: -1, mask: 0 } })

      const bar_graphic = new PIXI.TilingSprite({
        texture: sand_texture,
        width: bar.w,
        height: bar.h
      })
      bar_graphic.tileScale.set(2, 2)
      bar_graphic.anchor.set(0.5);
      bar_graphic.position.set(bar.x, bar.y);
      world.addChild(bar_graphic);
      bar_graphic.zIndex = 4;

      sand_bars.push(bar_body);
      sand_bar_graphics.push(bar_graphic);
      Composite.add(engine.world, bar_body);
    });

    data.kelps?.forEach((kelp) => {
      const kelp_body = Bodies.rectangle(kelp.x, kelp.y, kelp.w, kelp.h, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 }
      });

      const kelp_graphic = new PIXI.AnimatedSprite(kelp_frames);
      kelp_graphic.width = kelp.w;
      kelp_graphic.height = kelp.h;
      kelp_graphic.anchor.set(0.5);
      kelp_graphic.zIndex = 7;

      kelp_graphic.textures = kelp_frames;
      kelp_graphic.loop = true;
      kelp_graphic.animationSpeed = 0.05;
      kelp_graphic.gotoAndPlay(0);
      kelp_graphic.position.set(kelp.x, kelp.y);
      world.addChild(kelp_graphic);

      kelps.push(kelp_body);
      kelp_graphics.push(kelp_graphic);
      Composite.add(engine.world, kelp_body);
    });

    data.bullets?.forEach((b) => {
      let bullet = bulletManager.active.find(item => item.bulletId === b.id);
      if (!bullet) {
        switch (b.type) {
          case 'snail':
            bulletManager.spawnSnailBullet(b.x, b.y);
            break;

          case 'anemone':
            const graphic = anemone.initialize(b.x, b.y, world, b.dir);
            anemone_graphics.push(graphic);
            b.updatable = true;
            break;

          default:
            bullet = defaultBullet.spawn(bulletManager, PIXI.Texture.WHITE, b.x, b.y, b.vx || 0, b.vy || 0);
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

    data.jellys?.forEach((jelly_obj) => {
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

    data.snails?.forEach((snail_obj) => {
      const snail_bullet = bulletManager.spawnSnailBullet(snail_obj.x, snail_obj.y);
      if (snail_bullet) {
        snail_bullet.vx = snail_obj.x_vel || 0;
        snail_bullet.vy = snail_obj.y_vel || 0;
        Matter.Body.setVelocity(snail_bullet.body, { x: snail_bullet.vx, y: snail_bullet.vy });
      }
    });

    data.labels?.forEach((label) => {
      const label_graphic = new PIXI.Text({
        text: label.text,
        style: label.style,
        resolution: 3,
        roundPixels: true
      })
      label_graphic.position.set(label.x, label.y);
      label_graphic.zIndex = 10000;
      world.addChild(label_graphic);
      labels.push(label_graphic)
    });


    //end of loading objects

    room_label.text = "";
    room_label.text = data?.label ?? '';

    setTimeout(() => {
      canTransition = true;
    }, 300);
  }

  //loss function 
  function lose(current_room, roomKey) {
    temp_player_data.health = 100;
    const data = temp_room_data[roomKey];
    let spawn_point = data.spawnpoint;
    load_rooms(current_room, spawn_point.x, spawn_point.y)
  }

  //edit hearts on touching
  function update_hearts(roomKey) {
    heart_graphics.forEach((g) => world.removeChild(g));
    hearts.forEach((t) => Composite.remove(engine.world, t));
    heart_graphics = [];
    hearts = [];

    const data = temp_room_data[roomKey];

    data.hearts?.forEach((heart_obj) => {
      const heart_body = Bodies.rectangle(heart_obj.x, heart_obj.y, 1, 1, {
        isStatic: true,
        collisionFilter: { group: -1, mask: 0 },
      });

      const heart_graphic = new PIXI.Sprite(heart_texture);
      heart_graphic.width = 32;
      heart_graphic.height = 32;
      heart_graphic.anchor.set(0.5);
      heart_graphic.zIndex = 10;

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
    if (temp_player_data.health <= 0) {
      temp_player_data.health = 0;
      lose(current_room, current_room);

    }
    healthbar_graphic.clear();
    healthbar_graphic.rect(APP_HEIGHT / 10, APP_HEIGHT / 10, temp_player_data.health * 2, 10).fill(0xa090ff);
  }

  function update_jelly(roomKey) {
    const data = temp_room_data[roomKey];

    data.jellys?.forEach((jelly_obj, index) => {
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

//movement
  let keys = {};
  let pauseKeyWasDown = false;
  let e;
  window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
    e = event;
  });
  window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
  });

  //important start or main game loop

  let paused = false;
  let gamePaused = false;
  
  app.ticker.add((ticker) => {
    // this is what happens when its paused
    if (keys[keybinds.pause] && !pauseKeyWasDown && paused == gamePaused) { // if you want to be able to pause during coundown then delete paused == gamePaused
      paused = !paused;
      pauseMenuLeftTimer.visible = true;
      pauseMenuRightTimer.visible = true;
      pauseMenuLeftTimer.scale.x = 1;
      pauseMenuRightTimer.scale.x = 1;
      pauseMenu_text.text = "PAUSED";
      pauseMenu_text.alpha = 1;
      gamePaused = true;
    }

    // this makes the pauseMenu still show when timer counts down
    pauseKeyWasDown = keys[keybinds.pause];
    pauseMenu.visible = gamePaused;

    // this is where the timer counts down
    if (!paused) {
      if ((pauseMenuLeftTimer.scale.x || pauseMenuRightTimer.scale.x) > 0) {
        pauseMenuLeftTimer.scale.x -= 0.01;
        pauseMenuRightTimer.scale.x -= 0.01;
      } else {
        gamePaused = false;
      }

      const scale = pauseMenuLeftTimer.scale.x;
      if (scale > 2 / 3)      pauseMenu_text.text = "3";
      else if (scale > 1 / 3)  pauseMenu_text.text = "2";
      else if (scale > 0) pauseMenu_text.text = "1";
      else pauseMenu_text.text = "Resumed";

      // this is the whole game
      if (!gamePaused) {
        if (pauseMenu_text.alpha > 0) {
          pauseMenu_text.alpha -= 0.03;
        }
        bulletManager.update(ticker);
        if(current_room == "room_3") temp_player_data.chapter = 1;
        if(current_room == "snails_room") temp_player_data.chapter = 2;
        if(current_room == "sand_room") temp_player_data.chapter = 3;
        
        let currentTime = performance.now();

        const activeRoomData = temp_room_data[current_room];
        if (activeRoomData && activeRoomData.bullets) {
            const activeAnemones = activeRoomData.bullets.filter(b => b.type === 'anemone');
            
            activeAnemones.forEach((bulletData) => {
                anemone.update(
                    currentTime, 
                    bulletManager, 
                    anemoneFrames[0],
                    bulletData.x, 
                    bulletData.y, 
                    bulletData.dir, 
                    bulletData.id
                );
            });
        }

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
          !temp_player_data.is_zapping &&
          temp_player_data.chapter >= 1
        ) {
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
          !temp_player_data.is_zapping &&
          temp_player_data.chapter >= 2) {
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
          !temp_player_data.is_zapping &&
          temp_player_data.chapter >= 3) {
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
            temp_player_data.health += 50;
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
      let touchingAnyBox = false;

      text_boxes.forEach((tb) => {
        const isColliding = Matter.Query.collides(box, [tb]).length > 0;

        if (isColliding) {
          touchingAnyBox = true;

          if (!dialogueActive && last_touched_box !== tb && temp_player_data.can_move) {
            
            if (text_box_talk_counts[tb.text_id] === undefined) {
              text_box_talk_counts[tb.text_id] = 0;
            }

            const currentTimesTalked = text_box_talk_counts[tb.text_id];

            last_touched_box = tb; 
            let shouldPlayDialogue = false;
            
            if (tb.text_id === "Welcome" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "Chrysaory_dash_kelp" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "Chrysaory_end" && currentTimesTalked < 2) shouldPlayDialogue = true;
            else if (tb.text_id === "Chrysaory_sand" && currentTimesTalked < 2) shouldPlayDialogue = true;
            else if (tb.text_id === "heal" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "zap_Chrysaory" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "maze_room_2" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "room_6" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "treasure" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "Chrysaory_room_2" && currentTimesTalked === 0) shouldPlayDialogue = true;
            else if (tb.text_id === "Chrysaory_Dash") shouldPlayDialogue = true; 
            else if (tb.text_id === "Chrysaory_Shock") shouldPlayDialogue = true; 

            if (shouldPlayDialogue) {
              dialogueActive = true;

              switch (tb.text_id) {
                case "Welcome":
                  startDialogue("Welcome");
                  break;

                case "Chrysaory_dash_kelp":
                  startDialogue("dash_kelp");
                  break;
                
                case "Chrysaory_end":
                  if (currentTimesTalked === 0) startDialogue("Chrysaory_end");
                  else if (currentTimesTalked === 1) startDialogue("Chrysaory_end_repeat_1");
                  break;

                case "Chrysaory_sand":
                  if (currentTimesTalked === 0) startDialogue("Chrysaory_sand");
                  else if (currentTimesTalked === 1) startDialogue("Chrysaory_sand_repeat_1");
                  break;

                case "heal":
                  startDialogue("heal");
                  break;

                case "zap_Chrysaory":
                  startDialogue("zap_Chrysaory");
                  break;

                case "maze_room_2":
                  startDialogue("maze_room_2");
                  break;

                case "room_6":
                  startDialogue("room_6");
                  break;

                case "treasure":
                  startDialogue("treasure");
                  break;

                case "Chrysaory_room_2":
                  startDialogue("Chrysaory_room_2");
                  break;

                case "Chrysaory_Dash":
                  if (currentTimesTalked === 0) startDialogue("Chrysaory_Dash"); 
                  else if (currentTimesTalked === 1) startDialogue("Chrysaory_Dash_repeat_1");
                  else if (currentTimesTalked === 2) startDialogue("Chrysaory_Dash_repeat_2");
                  else startDialogue("Chrysaory_Dash_repeat");
                  break;

                case "Chrysaory_Shock":
                  if (currentTimesTalked === 0) startDialogue("Chrysaory_Shock"); 
                  else if (currentTimesTalked === 1) startDialogue("Chrysaory_Shock_repeat_1");
                  else startDialogue("Chrysaory_Shock_repeat");
                  break;

                default:
                  startDialogue("dialogueMissing");
                  break;
              }


              text_box_talk_counts[tb.text_id]++;
            }
          }
        }
      });
      if (!touchingAnyBox) {
        last_touched_box = null;
      }
      
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
      } else {
        
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
    localStorage.setItem("chapter", temp_player_data.chapter); //chapter

    console.log(temp_player_data.chapter, temp_player_data.health, current_room, Math.trunc(box.position.x), Math.trunc(box.position.y), room_data);
  }, 1000);

})();
