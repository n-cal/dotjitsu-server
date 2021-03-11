const playersPerRoom = 2;
const gameDurationInSeconds = 120;

// const K = 4 / (100 * 200);
// const moveImpulse = 4 / 100;
const jump = 5;
const jumpDuration = 400;

const K = (2 * jump) / Math.pow(jumpDuration, 2);
const moveImpulse = (2 * jump) / jumpDuration;

const maxThrowImpulse = 4 * moveImpulse;
const ringRadious = 17;
const outRingDelta = 0.05;
const respawnTime = 2000;
const respawnSquareDimension = 16;
const exposeTime = 1500;
const safeDistance = 5.8;
const attackReloadTime = 800;
const defenseTime = 300;
const defenseReloadTime = 500;


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
    gameDurationInSeconds,
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