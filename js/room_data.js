//room data
import { dialogues } from "./Dialogue.js";
let room_data = {
  //default room example template
  /* 
  "room X":{
      walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
      ],
      sand_bars: [],
      trashes: [],
      doors: [],
      hearts: [],
      snails: [],
      jellys: [],
      force_blocks:[],
      bullet_boxes:[],
      text_boxes:[],
      spawnpoint:{},
      labels:[]
  }*/
  //btw room x and y pos measured from their center
  room_1: {
    label: "room 1",
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
    ],
    sand_bars: [],
    trashes: [{ x: 800, y: 450, w: 100, h: 100 }],
    doors: [
      {
        x: 20,
        y: 450,
        w: 50,
        h: 120,
        target_room: "room_3",
        target_x: 1420,
        target_y: 450,
      },
      {
        x: 1580,
        y: 450,
        w: 50,
        h: 120,
        target_room: "room_2",
        target_x: 180,
        target_y: 450,
      },
    ],
    hearts: [{ x: 50, y: 50 }],
    snails: [],
    jellys: [],
    force_blocks: [
      { x: 600, y: 300, w: 64, h: 64, velocity: { x: 7, y: 0 }, texture: "right" },
      { x: 900, y: 300, w: 64, h: 64, velocity: { x: 0, y: 7 }, texture: "down" },
      { x: 900, y: 600, w: 64, h: 64, velocity: { x: -7, y: 0 }, texture: "left" },
      { x: 600, y: 600, w: 64, h: 64, velocity: { x: 0, y: -7 }, texture: "up" }
    ],
    bullets: [
      { id: 'b1', type: 'snailBullet', x: 10, y: 10 }, 
      { id: 'b2', type: 'anemone', x: 20, y: 50 }
    ]
  },

  room_2: {
    label: "room 2",
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },

      { x: 400, y: 600, w: 120, h: 600 },
      { x: 900, y: 360, w: 960, h: 120 },
      { x: 1380, y: 500, w: 120, h: 400 }
    ],
    sand_bars: [],
    trashes: [],
    doors: [
      {
        x: 20,
        y: 450,
        w: 50,
        h: 120,
        target_room: "room_1",
        target_x: 1420,
        target_y: 450,
      },
      {
        x: 800,
        y: 880,
        w: 120,
        h: 50,
        target_room: "room_4",
        target_x: 800,
        target_y: 180,
      },
    ],
    sand_bars: [],
    hearts: [],
    snails: [
      { x: Math.random() * 1500, y: Math.random() * 700, x_vel: Math.random() * 5, y_vel: Math.random() * 5 },
      { x: Math.random() * 1500, y: Math.random() * 700, x_vel: Math.random() * 5, y_vel: Math.random() * 5 },
      { x: Math.random() * 1500, y: Math.random() * 700, x_vel: Math.random() * 5, y_vel: Math.random() * 5 },
    ],
    jellys: [{ x: 100, y: 100 }],
    force_blocks: [],
    text_boxes: [],
    spawnpoint: { x: 120, y: 800 },
    labels: [], 
    bullets: []
  },

  room_3: {
    label: "room 3",
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
    ],
    trashes: [{ x: 800, y: 600, w: 50, h: 50 }],
    doors: [
      {
        x: 1580,
        y: 450,
        w: 50,
        h: 120,
        target_room: "room_1",
        target_x: 180,
        target_y: 450,
      },
    ],
    sand_bars: [{ x: 300, y: 400, w: 50, h: 100 }],
    hearts: [
      { x: 50, y: 50 },
      { x: 100, y: 50 },
      { x: 150, y: 50 },
      { x: 200, y: 50 },
      { x: 250, y: 50 },
      { x: 50, y: 100 },
      { x: 50, y: 150 },
      { x: 50, y: 200 },
      { x: 50, y: 250 },
    ],
    snails: [],
    jellys: [],
    force_blocks: [],
    text_boxes: [],
    spawnpoint: { x: 120, y: 800 },
    labels: [], 
    bullets: []
  },

  room_4: {
    label: "room 4",
    sand_bars: [],
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
    ],
    trashes: [],
    doors: [
      {
        x: 800,
        y: 20,
        w: 120,
        h: 50,
        target_room: "room_2",
        target_x: 800,
        target_y: 720,
      }
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    text_boxes: [],
    spawnpoint: { x: 120, y: 800 },
    labels: [], 
    bullets: []
  }
};

export { room_data };