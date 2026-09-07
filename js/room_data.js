import { dialogues } from "./Dialogue.js";
let room_data = {
  room_1: {
    label: "",
    walls: [
      { x: 400, y: 20, w: 800, h: 40 },
      { x: 405, y: 450, w: 810, h: 40 },
      { x: 20, y: 225, w: 40, h: 450 },
      { x: 790, y: 225, w: 40, h: 450 },
    ],
    sand_bars: [],
    kelps: [],
    trashes: [],
    doors: [
      {
        x: 790,
        y: 225,
        w: 50,
        h: 60,
        target_room: "room_2",
        target_x: 60,
        target_y: 225,
      },
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullet_boxes: [],
    text_boxes: [
      { id: "Welcome", x: 400, y: 230}
    ],
    spawnpoint: { x: 100, y: 225 },
  },

  room_2: {
    label: "",
    walls: [
      { x: 400, y: 20, w: 800, h: 40 },
      { x: 405, y: 450, w: 810, h: 40 },
      { x: 20, y: 225, w: 40, h: 450 },
      { x: 790, y: 225, w: 40, h: 450 },
      { x: 150, y: 300, w: 40, h: 300},
      { x: 300, y: 150, w: 40, h: 300},
      { x: 450, y: 300, w: 40, h: 300},
    ],
    sand_bars: [],
    trashes: [{
      x: 625, y: 250, w: 200, h: 200
    }],
    doors: [
      {
        x: 20,
        y: 225,
        w: 20,
        h: 20,
        target_room: "room_1",
        target_x: 740,
        target_y: 225,
      },
      {
        x: 700,
        y: 450,
        w: 60,
        h: 50,
        target_room: "room_3",
        target_x: 60,
        target_y: 60,
      }
    ],
    hearts: [],
    kelps: [], // Cleaned duplicate entry
    snails: [],
    jellys: [],
    force_blocks: [],
    bullet_boxes: [],
    text_boxes: [{
      id: "Chrysaory_room_2", x: 380, y: 230, w: 100
    }],
    spawnpoint: { x: 100, y: 225 },
  },

  room_3: {
    label: "",
    walls: [
      { x: 400, y: 20, w: 800, h: 40 },
      { x: 405, y: 450, w: 810, h: 40 },
      { x: 20, y: 225, w: 40, h: 450 },
      { x: 790, y: 225, w: 40, h: 450 },
      { x: 450, y: 100, w: 500, h: 200},
      { x: 450, y: 350, w: 500, h: 200}
    ],
    sand_bars: [],
    kelps: [],
    trashes: [{x: 100, y: 400, w: 200, h: 100}],
    doors: [
      {
        x: 60,
        y: 20,
        w: 20,
        h: 60,
        target_room: "room_2",
        target_x: 740,
        target_y: 390,
      },
      {
        x: 740,
        y: 20,
        w: 20,
        h: 60,
        target_room: "treasure_1",
        target_x: 200,
        target_y: 300,
      },
      {
        x: 740,
        y: 450,
        w: 50,
        h: 60,
        target_room: "room_4",
        target_x: 60,
        target_y: 60,
      },
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullet_boxes: [],
    text_boxes: [
      { id: "Chrysaory_Dash", x: 205, y: 225, w: 10, h: 50 },
    ],
    spawnpoint: { x: 100, y: 225 },
  },

  treasure_1: {
    label: "",
    walls: [
      { x: 200, y: 20, w: 400, h: 40 },
      { x: 200, y: 400, w: 400, h: 40 },
      { x: 0, y: 200, w: 40, h: 400 },
      { x: 400, y: 200, w: 40, h: 400 },
    ],
    sand_bars: [],
    kelps: [],
    doors: [
      {
        x: 200,
        y: 400,
        w: 60,
        h: 50,
        target_room: "room_3",
        target_x: 740,
        target_y: 60,
      },
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [{x: 200, y:200, w: 64, h: 64, velocity: { x: 0, y: -7 }, texture: "up" }],
    bullet_boxes: [],
    text_boxes: [
      { id: "treasure", x: 200, y: 50},
    ],
    spawnpoint: { x: 200, y: 200 },
  },

  room_4: {
    label: "",
    walls: [
      { x: 400, y: 20, w: 800, h: 40 },
      { x: 405, y: 450, w: 810, h: 40 },
      { x: 20, y: 225, w: 40, h: 450 },
      { x: 790, y: 225, w: 40, h: 450 },
    ],
    sand_bars: [],
    kelps: [],
    trashes: [
      { x: 150, y: 150, w: 60, h: 300 },
      { x: 300, y: 300, w: 60, h: 300 },
      { x: 490, y: 120, w: 440, h: 60 },
      { x: 600, y: 300, w: 400, h: 60 },
    ],
    doors: [
      {
        x: 60,
        y: 20,
        w: 20,
        h: 20,
        target_room: "room_3",
        target_x: 740,
        target_y: 390,
      },
      {
        x: 740,
        y: 430,
        graphic_y: 450,
        w: 20,
        h: 20,
        target_room: "room_5",
        target_x: 600,
        target_y: 70,
      }
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullet_boxes: [],
    text_boxes: [],
    spawnpoint: { x: 60, y: 60 },
  },

  room_5: {
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
      { x: 344, y: 122, w: 60, h: 164 },
      { x: 496, y: 122, w: 60, h: 164 },
      { x: 192, y: 450, w: 60, h: 164 },
      { x: 648, y: 450, w: 60, h: 164 },
      { x: 800, y: 450, w: 60, h: 164 },
      { x: 952, y: 450, w: 60, h: 164 },
      { x: 1256, y: 450, w: 60, h: 164 },
      { x: 1408, y: 450, w: 60, h: 164 },
      { x: 496, y: 614, w: 60, h: 164 },
      { x: 800, y: 614, w: 60, h: 164 },
      { x: 1256, y: 614, w: 60, h: 164 },
      { x: 116, y: 204, w: 152, h: 60 },
      { x: 724, y: 204, w: 152, h: 60 },
      { x: 876, y: 204, w: 152, h: 60 },
      { x: 1028, y: 204, w: 152, h: 60 },
      { x: 1180, y: 204, w: 152, h: 60 },
      { x: 1332, y: 204, w: 152, h: 60 },
      { x: 268, y: 368, w: 152, h: 60 },
      { x: 572, y: 368, w: 152, h: 60 },
      { x: 1332, y: 368, w: 152, h: 60 },
      { x: 1028, y: 696, w: 152, h: 60 },
      { x: 1180, y: 696, w: 152, h: 60 },
    ],
    sand_bars: [],
    trashes: [
      { x: 344, y: 286, w: 60, h: 164 },
      { x: 648, y: 286, w: 60, h: 164 },
      { x: 952, y: 286, w: 60, h: 164 },
      { x: 268, y: 532, w: 152, h: 60 },
      { x: 420, y: 532, w: 152, h: 60 },
      { x: 876, y: 532, w: 152, h: 60 },
      { x: 1028, y: 532, w: 152, h: 60 },
      { x: 116, y: 696, w: 152, h: 60 },
      { x: 268, y: 696, w: 152, h: 60 },
      { x: 572, y: 696, w: 152, h: 60 },
      { x: 724, y: 696, w: 152, h: 60 },
      { x: 1484, y: 696, w: 152, h: 60 },
      { x: 1180, y: 368, w: 152, h: 60 },
      { x: 952, y: 778, w: 60, h: 164 }
    ],
    doors: [
      {
        x: 600,
        y: 20,
        w: 60,
        h: 50,
        target_room: "room_4",
        target_x: 740,
        target_y: 390,
      },
      {
        x: 800,
        y: 880,
        w: 120,
        h: 50,
        target_room: "maze_room_2",
        target_x: 800,
        target_y: 60,
      }
    ],
    hearts: [{ x: 100, y: 100 }],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullets: [],
    text_boxes: [
      { id: "heal", x: 50, y: 200}
    ],
    spawnpoint: { x: 600, y: 70 },
  },

  maze_room_2: {
    walls: [
      { x: 800, y: 20, w: 1600, h: 40 },
      { x: 800, y: 880, w: 1600, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 1580, y: 450, w: 40, h: 900 },
      { x: 180, y: 202, w: 60, h: 124 },
      { x: 180, y: 450, w: 60, h: 124 },
      { x: 180, y: 698, w: 60, h: 124 },
      { x: 304, y: 78, w: 60, h: 124 },
      { x: 304, y: 202, w: 60, h: 124 },
      { x: 304, y: 326, w: 60, h: 124 },
      { x: 304, y: 574, w: 60, h: 124 },
      { x: 304, y: 698, w: 60, h: 124 },
      { x: 428, y: 450, w: 60, h: 124 },
      { x: 428, y: 698, w: 60, h: 124 },
      { x: 428, y: 822, w: 60, h: 124 },
      { x: 552, y: 326, w: 60, h: 124 },
      { x: 552, y: 450, w: 60, h: 124 },
      { x: 552, y: 574, w: 60, h: 124 },
      { x: 552, y: 698, w: 60, h: 124 },
      { x: 676, y: 450, w: 60, h: 124 },
      { x: 676, y: 822, w: 60, h: 124 },
      { x: 800, y: 202, w: 60, h: 124 },
      { x: 800, y: 326, w: 60, h: 124 },
      { x: 800, y: 574, w: 60, h: 124 },
      { x: 924, y: 450, w: 60, h: 124 },
      { x: 924, y: 574, w: 60, h: 124 },
      { x: 924, y: 698, w: 60, h: 124 },
      { x: 1048, y: 202, w: 60, h: 124 },
      { x: 1048, y: 326, w: 60, h: 124 },
      { x: 1048, y: 450, w: 60, h: 124 },
      { x: 1172, y: 78, w: 60, h: 124 },
      { x: 1172, y: 698, w: 60, h: 124 },
      { x: 1172, y: 822, w: 60, h: 124 },
      { x: 1296, y: 574, w: 60, h: 124 },
      { x: 1296, y: 698, w: 60, h: 124 },
      { x: 1420, y: 202, w: 60, h: 124 },
      { x: 1420, y: 698, w: 60, h: 124 },
      { x: 118, y: 140, w: 124, h: 60 },
      { x: 366, y: 140, w: 124, h: 60 },
      { x: 490, y: 140, w: 124, h: 60 },
      { x: 614, y: 140, w: 124, h: 60 },
      { x: 738, y: 140, w: 124, h: 60 },
      { x: 986, y: 140, w: 124, h: 60 },
      { x: 1234, y: 140, w: 124, h: 60 },
      { x: 490, y: 264, w: 124, h: 60 },
      { x: 614, y: 264, w: 124, h: 60 },
      { x: 862, y: 264, w: 124, h: 60 },
      { x: 1110, y: 264, w: 124, h: 60 },
      { x: 1234, y: 264, w: 124, h: 60 },
      { x: 1358, y: 264, w: 124, h: 60 },
      { x: 242, y: 388, w: 124, h: 60 },
      { x: 738, y: 388, w: 124, h: 60 },
      { x: 986, y: 388, w: 124, h: 60 },
      { x: 1234, y: 388, w: 124, h: 60 },
      { x: 1358, y: 388, w: 124, h: 60 },
      { x: 1482, y: 388, w: 124, h: 60 },
      { x: 242, y: 512, w: 124, h: 60 },
      { x: 366, y: 512, w: 124, h: 60 },
      { x: 862, y: 512, w: 124, h: 60 },
      { x: 1110, y: 512, w: 124, h: 60 },
      { x: 1234, y: 512, w: 124, h: 60 },
      { x: 1358, y: 512, w: 124, h: 60 },
      { x: 118, y: 636, w: 124, h: 60 },
      { x: 490, y: 636, w: 124, h: 60 },
      { x: 614, y: 636, w: 124, h: 60 },
      { x: 738, y: 636, w: 124, h: 60 },
      { x: 1110, y: 636, w: 124, h: 60 },
      { x: 1482, y: 636, w: 124, h: 60 },
      { x: 862, y: 760, w: 124, h: 60 },
      { x: 986, y: 760, w: 124, h: 60 }
    ],
    sand_bars: [],
    trashes: [],
    doors: [
      {
        x: 800,
        y: 20,
        w: 120,
        h: 50,
        target_room: "room_5",
        target_x: 800,
        target_y: 720,
      },
      {
        x: 800,
        y: 880,
        w: 120,
        h: 50,
        target_room: "room_6",
        target_x: 800,
        target_y: 60,
      }
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullets: [
      { id: "b1", type: "snail", x: 300, y: 800 },
      { id: "b2", type: "anemone", x: 1539, y: 765, dir: "left" },
      { id: "b3", type: "anemone", x: 231, y: 450, dir: "right" },
      { id: "b4", type: "anemone", x: 300, y: 839, dir: "up" },
      { id: "b5", type: "anemone", x: 400, y: 62, dir: "down" }
    ],
    text_boxes: [{ id: "maze_room_2", x: 800, y: 450 }],
    spawnpoint: { x: 800, y: 60 }
  },

  room_6: {
    walls: [
      { x: 450, y: 20, w: 900, h: 40 },
      { x: 450, y: 880, w: 900, h: 40 },
      { x: 20, y: 450, w: 40, h: 900 },
      { x: 900, y: 450, w: 40, h: 900 }
    ],
    sand_bars: [],
    trashes: [],
    doors: [
      {
        x: 600,
        y: 20,
        w: 60,
        h: 50,
        target_room: "maze_room_2",
        target_x: 740,
        target_y: 820
      },
      {
        x: 780,
        y: 880,
        w: 20,
        h: 20,
        target_room: "snails_room",
        target_x: 300,
        target_y: 60
      }
    ],
    hearts: [{ x: 100, y: 100 }],
    snails: [],
    jellys: [],
    force_blocks: [
      { x: 180, y: 140, w: 64, h: 64, velocity: { x: 15, y: 0 }, texture: "right" },
      { x: 300, y: 140, w: 64, h: 64, velocity: { x: 12, y: 0 }, texture: "right" },
      { x: 420, y: 140, w: 64, h: 64, velocity: { x: 9, y: 0 }, texture: "right" },
      { x: 540, y: 140, w: 64, h: 64, velocity: { x: 6, y: 0 }, texture: "right" },
      { x: 660, y: 140, w: 64, h: 64, velocity: { x: 3, y: 0 }, texture: "right" },
      { x: 780, y: 140, w: 64, h: 64, velocity: { x: 0, y: 15 }, texture: "down" },
      { x: 780, y: 260, w: 64, h: 64, velocity: { x: -15, y: 0 }, texture: "left" },
      { x: 660, y: 260, w: 64, h: 64, velocity: { x: -12, y: 0 }, texture: "left" },
      { x: 540, y: 260, w: 64, h: 64, velocity: { x: -9, y: 0 }, texture: "left" },
      { x: 420, y: 260, w: 64, h: 64, velocity: { x: -6, y: 0 }, texture: "left" },
      { x: 300, y: 260, w: 64, h: 64, velocity: { x: -3, y: 0 }, texture: "left" },
      { x: 180, y: 260, w: 64, h: 64, velocity: { x: 0, y: 15 }, texture: "down" },
      { x: 180, y: 380, w: 64, h: 64, velocity: { x: 15, y: 0 }, texture: "right" },
      { x: 300, y: 380, w: 64, h: 64, velocity: { x: 12, y: 0 }, texture: "right" },
      { x: 420, y: 380, w: 64, h: 64, velocity: { x: 9, y: 0 }, texture: "right" },
      { x: 540, y: 380, w: 64, h: 64, velocity: { x: 6, y: 0 }, texture: "right" },
      { x: 660, y: 380, w: 64, h: 64, velocity: { x: 3, y: 0 }, texture: "right" },
      { x: 780, y: 380, w: 64, h: 64, velocity: { x: 0, y: 15 }, texture: "down" },
      { x: 780, y: 500, w: 64, h: 64, velocity: { x: -15, y: 0 }, texture: "left" },
      { x: 660, y: 500, w: 64, h: 64, velocity: { x: -12, y: 0 }, texture: "left" },
      { x: 540, y: 500, w: 64, h: 64, velocity: { x: -9, y: 0 }, texture: "left" },
      { x: 420, y: 500, w: 64, h: 64, velocity: { x: -6, y: 0 }, texture: "left" },
      { x: 300, y: 500, w: 64, h: 64, velocity: { x: -3, y: 0 }, texture: "left" },
      { x: 180, y: 500, w: 64, h: 64, velocity: { x: 0, y: 15 }, texture: "down" },
      { x: 180, y: 620, w: 64, h: 64, velocity: { x: 15, y: 0 }, texture: "right" },
      { x: 300, y: 620, w: 64, h: 64, velocity: { x: 12, y: 0 }, texture: "right" },
      { x: 420, y: 620, w: 64, h: 64, velocity: { x: 9, y: 0 }, texture: "right" },
      { x: 540, y: 620, w: 64, h: 64, velocity: { x: 6, y: 0 }, texture: "right" },
      { x: 660, y: 620, w: 64, h: 64, velocity: { x: 3, y: 0 }, texture: "right" },
      { x: 780, y: 620, w: 64, h: 64, velocity: { x: 0, y: 15 }, texture: "down" }
    ],
    bullets: [],
    text_boxes: [
      { id: "room_6", x: 800, y: 450 },
      { id: "zap_Chrysaory", x: 500, y: 850 }
    ]
  },

  snails_room: {
    label: "",
    walls: [
      { x: 300, y: 20, w: 600, h: 40 },
      { x: 300, y: 380, w: 600, h: 40 },
      { x: 20, y: 200, w: 40, h: 360 },
      { x: 580, y: 200, w: 40, h: 360 }
    ],
    sand_bars: [],
    kelps: [],
    trashes: [],
    doors: [
      {
        x: 300,
        y: 20,
        w: 20,
        h: 20,
        target_room: "room_6",
        target_x: 780,
        target_y: 820
      },
      {
        x: 580,
        y: 200,
        w: 20,
        h: 20,
        target_room: "kelp_room",
        target_x: 60,
        target_y: 200
      }
    ],
    hearts: [],
    snails: [
      { x: 120, y: 80, x_vel: 2, y_vel: 0 },
      { x: 240, y: 80, x_vel: -3, y_vel: 0 },
      { x: 360, y: 80, x_vel: 0, y_vel: 2 },
      { x: 480, y: 80, x_vel: 0, y_vel: -3 },
      { x: 120, y: 160, x_vel: 4, y_vel: 0 },
      { x: 240, y: 160, x_vel: -2, y_vel: 0 },
      { x: 360, y: 160, x_vel: 0, y_vel: 3 },
      { x: 480, y: 160, x_vel: 0, y_vel: -4 },
      { x: 120, y: 240, x_vel: -3, y_vel: 0 },
      { x: 240, y: 240, x_vel: 5, y_vel: 0 },
      { x: 360, y: 240, x_vel: 0, y_vel: -2 },
      { x: 480, y: 240, x_vel: 0, y_vel: 4 },
      { x: 120, y: 320, x_vel: 2, y_vel: 0 },
      { x: 240, y: 320, x_vel: -4, y_vel: 0 },
      { x: 360, y: 320, x_vel: 0, y_vel: 2 },
      { x: 480, y: 320, x_vel: 0, y_vel: -3 }
    ],
    jellys: [],
    force_blocks: [],
    bullets: [],
    text_boxes: [],
    spawnpoint: { x: 300, y: 60 }
  },

  kelp_room: {
    label: "",
    walls: [
      { x: 500, y: 120, w: 1000, h: 40 },
      { x: 500, y: 280, w: 1000, h: 40 },
      { x: 20, y: 200, w: 40, h: 200 },
      { x: 980, y: 200, w: 40, h: 200 }
    ],
    sand_bars: [],
    kelps: [
      { x: 180, y: 200, w: 50, h: 100 },
      { x: 220, y: 200, w: 50, h: 100 },
      { x: 260, y: 200, w: 50, h: 100 },
      { x: 300, y: 200, w: 50, h: 100 },
      { x: 340, y: 200, w: 50, h: 100 },
      { x: 380, y: 200, w: 50, h: 100 },
      { x: 420, y: 200, w: 50, h: 100 },
      { x: 460, y: 200, w: 50, h: 100 },
      { x: 500, y: 200, w: 50, h: 100 },
      { x: 540, y: 200, w: 50, h: 100 },
      { x: 580, y: 200, w: 50, h: 100 },
      { x: 620, y: 200, w: 50, h: 100 },
      { x: 660, y: 200, w: 50, h: 100 },
      { x: 700, y: 200, w: 50, h: 100 },
      { x: 740, y: 200, w: 50, h: 100 },
      { x: 780, y: 200, w: 50, h: 100 },
      { x: 820, y: 200, w: 50, h: 100 },
      { x: 860, y: 200, w: 50, h: 100 },
      { x: 900, y: 200, w: 50, h: 100 }
    ],
    trashes: [
      { x: 500, y: 160, w: 1000, h: 40 },
      { x: 500, y: 250, w: 1000, h: 40 }
    ],
    doors: [
      {
        x: 20,
        y: 200,
        w: 20,
        h: 20,
        target_room: "snails_room",
        target_x: 520,
        target_y: 200
      },
      {
        x: 980,
        y: 200,
        w: 20,
        h: 20,
        target_room: "sand_room",
        target_x: 60,
        target_y: 200
      }
    ],
    hearts: [],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullets: [],
    text_boxes: [{ id: "Chrysaory_dash_kelp", x: 100, y: 200 }],
    spawnpoint: { x: 60, y: 200 }
  },

  sand_room: {
    label: "",
    walls: [
      { x: 300, y: 20, w: 600, h: 40 },
      { x: 300, y: 580, w: 600, h: 40 },
      { x: 20, y: 300, w: 40, h: 600 },
      { x: 580, y: 300, w: 40, h: 600 }
    ],
    sand_bars: [
      { x: 300, y: 300, w: 560, h: 560 }
    ],
    kelps: [],
    trashes: [],
    doors: [
      {
        x: 20,
        y: 300,
        w: 20,
        h: 20,
        target_room: "kelp_room",
        target_x: 920,
        target_y: 200
      },
      {
        x: 580,
        y: 300,
        w: 20,
        h: 20,
        target_room: "end_room",
        target_x: 60,
        target_y: 200
      }
    ],
    hearts: [{ x: 500, y: 500 }],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullets: [],
    text_boxes: [{ id: "Chrysaory_sand", x: 300, y: 300 }],
    spawnpoint: { x: 60, y: 300 }
  },

  end_room: {
    label: "",
    walls: [
      { x: 300, y: 20, w: 600, h: 40 },
      { x: 300, y: 580, w: 600, h: 40 },
      { x: 20, y: 300, w: 40, h: 600 },
      { x: 580, y: 300, w: 40, h: 600 }
    ],
    sand_bars: [],
    kelps: [],
    trashes: [],
    doors: [
      {
        x: 20,
        y: 300,
        w: 20,
        h: 20,
        target_room: "sand_room",
        target_x: 920,
        target_y: 200
      }
    ],
    hearts: [{ x: 500, y: 500 }],
    snails: [],
    jellys: [],
    force_blocks: [],
    bullets: [],
    text_boxes: [{ id: "Chrysaory_end", x: 300, y: 300 }],
    spawnpoint: { x: 60, y: 300 }
  }
};

export { room_data };