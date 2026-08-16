//room data

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
        trashes: [],
        doors: [],
        hearts: [],
        snails: [],
        force_blocks:[],
        bullet_boxes:[]
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
      force_blocks: [
        {x: 600, y: 300, w: 100, h: 100, velocity: {x: 7, y: 0}, textureKey: "right"},
        {x: 900, y: 300, w: 100, h: 100, velocity: {x: 0, y: 7}, textureKey: "down"},
        {x: 900, y: 600, w: 100, h: 100, velocity: {x: -7, y: 0}, textureKey: "left"},
        {x: 600, y: 600, w: 100, h: 100, velocity: {x: 0, y: -7}, textureKey: "up"}
      ],
      bullet_boxes:[{
        x: 200,
        y: 200,
        w: 20,
        h: 20,
        interval: 100,
        bullet_speed: 4,
        colour: 0xffffff,
        bullets: [{vx: 1, vy: 0}, {vx: -1, vy: 0}, {vx: 0, vy: 1}, {vx: 0, vy: -1}]
      }]
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
      hearts: [],
      snails: [
        {x: Math.random()*1500, y: Math.random()*700, x_vel: Math.random()*5, y_vel: Math.random()*5},
        {x: Math.random()*1500, y: Math.random()*700, x_vel: Math.random()*5, y_vel: Math.random()*5},
        {x: Math.random()*1500, y: Math.random()*700, x_vel: Math.random()*5, y_vel: Math.random()*5},
      ],
      force_blocks:[],
      bullet_boxes:[{
        x: 500,
        y: 500,
        w: 40,
        h: 40,
        interval: 1000,
        bullet_speed: 1,
        colour: 0xffffff,
        bullets: [
          { vx: 1, vy: 0 },
          { vx: -1, vy: 0 },
          { vx: 0, vy: 1 },
          { vx: 0, vy: -1 }
        ]
      }]
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
      force_blocks:[],
      bullet_boxes:[]
    },

    room_4: {
      label: "room 4",
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
      force_blocks:[],
      bullet_boxes:[]
    }
  };

  export { room_data };