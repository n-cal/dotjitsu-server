const playersPerRoom = 2;

const K = 4 / (100 * 200);
const moveImpulse = 4 / 100;
const maxThrowImpulse = 4 * moveImpulse;
const ringRadious = 14;
const outRingDelta = 0.05;
const respawnTime = 2000;
const respawnRingRadious = 10;
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
            startPosition: [0, 7]
        },

        {
            team: 'blue',
            startPosition: [0, -7]
        }
    ],

    4: []
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
    respawnRingRadious,
    exposeTime,
    safeDistance,
    attackReloadTime,
    defenseTime,
    defenseReloadTime
};