const K = 5 / (100 * 200);
const moveImpulse = 5 / 100;
const throwImpulse = 800;
const ringRadious = 14;
const outRingDelta = 0.05;
const respawnTime = 2000;


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
    K, 
    moveImpulse, 
    throwImpulse, 
    initInfo,
    ringRadious,
    outRingDelta,
    respawnTime
};