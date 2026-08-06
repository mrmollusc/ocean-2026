(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("room_2",
{ "compressionlevel":-1,
 "editorsettings":
    {
     "export":
        {
         "format":"js",
         "target":"UR TEST WORLD.js"
        }
    },
 "height":3,
 "infinite":false,
 "layers":[
        {
         "data":[1, 1, 1,
            1, 1, 1,
            1, 1, 1],
         "height":3,
         "id":1,
         "name":"Ground",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":3,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":3,
         "name":"Collisions",
         "objects":[
                {
                 "height":16,
                 "id":1,
                 "name":"",
                 "opacity":1,
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":16,
                 "x":16,
                 "y":16
                }, 
                {
                 "height":0,
                 "id":3,
                 "name":"bulletSpawn",
                 "opacity":1,
                 "point":true,
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":48,
                 "y":48
                }],
         "opacity":1,
         "parallaxx":1,
         "properties":[
                {
                 "name":"damage",
                 "type":"float",
                 "value":10
                }],
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":4,
         "name":"Positions",
         "objects":[
                {
                 "height":0,
                 "id":2,
                 "name":"",
                 "opacity":1,
                 "point":true,
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":0,
                 "x":0,
                 "y":0
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        },
    
        {
         "data":[0, 0, 0,
            0, 5, 2,
            0, 0, 0],
         "height":3,
         "id":2,
         "name":"Objects",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":3,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0,
            0, 0, 0,
            13, 15, 16],
         "height":3,
         "id":5,
         "name":"parallax",
         "opacity":1,
         "parallaxx":1.5,
         "type":"tilelayer",
         "visible":true,
         "width":3,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":4,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.12.2",
 "tileheight":16,
 "tilesets":[
        {
         "columns":4,
         "firstgid":1,
         "image":"OneDrive\/Documents\/spritesheet test.png",
         "imageheight":64,
         "imagewidth":64,
         "margin":0,
         "name":"spritesheet test",
         "spacing":0,
         "tilecount":16,
         "tileheight":16,
         "tiles":[
                {
                 "animation":[
                        {
                         "duration":100,
                         "tileid":12
                        }, 
                        {
                         "duration":100,
                         "tileid":13
                        }, 
                        {
                         "duration":100,
                         "tileid":14
                        },
                    
                        {
                         "duration":100,
                         "tileid":15
                        }],
                 "id":12
                }, 
                {
                 "animation":[
                        {
                         "duration":100,
                         "tileid":13
                        }, 
                        {
                         "duration":100,
                         "tileid":14
                        }, 
                        {
                         "duration":100,
                         "tileid":15
                        },
                    
                        {
                         "duration":100,
                         "tileid":12
                        }],
                 "id":13
                }, 
                {
                 "animation":[
                        {
                         "duration":100,
                         "tileid":14
                        }, 
                        {
                         "duration":100,
                         "tileid":15
                        }, 
                        {
                         "duration":100,
                         "tileid":12
                        },
                    
                        {
                         "duration":100,
                         "tileid":13
                        }],
                 "id":14
                },
            
                {
                 "animation":[
                        {
                         "duration":100,
                         "tileid":15
                        }, 
                        {
                         "duration":100,
                         "tileid":12
                        }, 
                        {
                         "duration":100,
                         "tileid":13
                        },
                    
                        {
                         "duration":100,
                         "tileid":14
                        }],
                 "id":15
                }],
         "tilewidth":16
        }],
 "tilewidth":16,
 "type":"map",
 "version":"1.10",
 "width":3
});