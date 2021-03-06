const { moveImpulse, throwImpulse, ringRadious, outRingDelta} = require('./game-config');
const Vector2 = require('./vector2');


const directionsMap = {
    'up': new Vector2(0, -1),
    'down': new Vector2(0, 1),
    'left': new Vector2(-1, 0),
    'right': new Vector2(1, 0)
};


function approximateOutTime(dot) {
    let tLow = dot.t0;
    let tUp = dot.getStopTime();
    let tx;

    for(let i = 0; i < 20; i++) {
        tx = (tUp + tLow) / 2;
        const positionX = dot.getPositionAtTime(tx);

        const magnitude = positionX.magnitude();

        if(magnitude <= ringRadious - outRingDelta) {
            tLow = tx;
        } else if(magnitude >= ringRadious + outRingDelta) {
            tUp = tx;
        } else {
            return tx;
        }
        
    }

    return tx;
}


function outOfRingStep(io, roomId, dot) {
    clearTimeout(dot.timerForOut);

    const stopPosition = dot.getStopPosition();

    if(stopPosition.magnitude() > ringRadious) {
        const outOfRingTime =  approximateOutTime(dot) - dot.t0;
        
        dot.timerForOut = setTimeout(() => {
            dot.canMove = false;
            dot.exposed = false;

            //dots.addPointTo(dot.team);
            
            //respawnStep(io, roomId, dot);
            
            const clientRes = [];
            const payload = {
                type: 'out_of_ring',
                // redPoints: dots.redPoints,
                // bluePoints: dots.bluePoints,
            };

            clientRes.push({id: dot.id, payload});

            io.to(roomId).emit('update', clientRes);
        }, outOfRingTime);
    }

}


function respawnStep(io, roomId, dot) {
    return; 
}


class ActionsController {
    constructor(io, roomId, dots) {
        this.io = io;
        this.roomId = roomId;
        this.dots = dots;
    }


    attack(dot, t0) {
        return;
    }


    move(socketId, t0, directionStr) {

        const dot = this.dots.getDot(socketId);

        if(!dot.canMove) {
            return;
        }

        const impulse = directionsMap[directionStr].multiplyBy(moveImpulse);

        dot.addImpulse(impulse, t0);

        outOfRingStep(this.io, this.roomId, dot)
        // .then(() => respawnStep(this.io, this.roomId, dot))
        // .then(() => exposeStep(this.io, this.roomId, dot))
        // .catch(() => 'not out of ring');

        const clientRes = [];

        const payload = dot.getPolynomialMotion();
        payload.type = 'motion';
        payload.t0 = t0;
        payload.t1 = dot.getStopTime();

        clientRes.push({id: dot.id, payload});

        this.io.to(this.roomId).emit('update', clientRes);
    }


    defense() {
        return;
    }
}

module.exports = ActionsController;
