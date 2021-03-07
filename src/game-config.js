const playersPerRoom = 2;

const K = 4 / (100 * 200);
const moveImpulse = 4 / 100;
const maxThrowImpulse = 4 * moveImpulse;
const ringRadious = 14;
const outRingDelta = 0.05;
const respawnTime = 2000;
const respawnSquareDimension = 16;
const exposeTime = 1500;
const safeDistance = 5.8;
const attackReloadTime = 1000;
const defenseTime = 300;
const defenseReloadTime = 1000;


/* DIMENSIONS
   - DOT = 1
   - RING = 13
*/

const initStates = {
    2: [
        {
            team: 'red',
            color: 0,
            startPosition: [0, 7]
        },

        {
            team: 'blue',
            color: 0,
            startPosition: [0, -7]
        }
    ],

    4: [
        {
            team: 'red',
            color: 0,
            startPosition: [-6, -6]
        },

        {
            team: 'red',
            color: 1,
            startPosition: [6, -6]
        },

        {
            team: 'blue',
            color: 0,
            startPosition: [6, 6]
        },

        {
            team: 'blue',
            color: 1,
            startPosition: [-6, 6]
        }
    ]
};


function initInfo(sockets) {

    const state = initStates[sockets.length];

    return sockets.map((socket, i) => {
        state[i].socketId = socket.id;
        return state[i];
    });
}


module.exports = {
    playersPerRoom,
    K, 
    moveImpulse, 
    maxThrowImpulse, 
    initInfo,
    ringRadious,
    outRingDelta,
    respawnTime,
    respawnSquareDimension,
    exposeTime,
    safeDistance,
    attackReloadTime,
    defenseTime,
    defenseReloadTime
};