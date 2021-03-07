const Vector2 = require('./vector2');

const {
    moveImpulse, 
    maxThrowImpulse,
    ringRadious,
    outRingDelta,
    respawnTime,
    respawnSquareDimension,
    exposeTime,
    safeDistance,
    attackReloadTime,
    defenseTime,
    defenseReloadTime
} = require('./game-config');


const directionsMap = {
    'up': new Vector2(0, -1),
    'down': new Vector2(0, 1),
    'left': new Vector2(-1, 0),
    'right': new Vector2(1, 0)
};


function attackReload(dot) {
    dot.canAttack = false;

    setTimeout(() => {
        dot.canAttack = true;
    }, attackReloadTime);
}


function getImpulseByDistance(distanceVector) {
    const distance = distanceVector.magnitude();

    if(distance >= safeDistance) {
        return null;
    }

    const throwAmount = -maxThrowImpulse * Math.pow(distance / safeDistance, 2) + maxThrowImpulse;

    let direction;

    if(distance === 0) {
        direction = directionsMap[ ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 5)] ];
    } else {
        direction = distanceVector.normalized();
    }

    return direction.multiplyBy(throwAmount);

}


function randomPosition() {
    const x = Math.floor(Math.random() * respawnSquareDimension) - (respawnSquareDimension / 2);
    const y = Math.floor(Math.random() * respawnSquareDimension) - (respawnSquareDimension / 2);

    return new Vector2(x, y);
}


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
            dot.inGame = false;

            //dots.addPointTo(dot.team);
            
            respawnStep(io, roomId, dot)
            .then(() => exposeStep(io, roomId, dot));
            
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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            dot.restartAt(randomPosition());
            
            const clientRes = [];
            const payload = {
                type: 'respawn',
                position: dot.x0.toArray()
            };

            clientRes.push({ id: dot.id, payload});
            
            io.to(roomId).emit('update', clientRes);

            resolve();

        }, respawnTime);
    });
}


function exposeStep(io, roomId, dot) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            dot.canMove = true;
            dot.exposed = true;
            dot.inGame = true;
            dot.canDefend = true;

            const clientRes = [];
            const payload = { type: 'expose'};

            clientRes.push({ id: dot.id, payload});

            io.to(roomId).emit('update', clientRes);

            resolve();
        }, exposeTime);
    });
}


class ActionsController {
    constructor(io, roomId, dots) {
        this.io = io;
        this.roomId = roomId;
        this.dots = dots;
    }


    attack(socketId, t0) {
        const dot = this.dots.getDot(socketId);
        const clientRes = [];
        
        if(!dot.canAttack) {
            const payload = { type: 'attack', execute: false, t0};
            clientRes.push({ id: dot.id, payload });
        } else {
            const dotPosition = dot.getPositionAtTime(t0);

            const payload = { type: 'attack', execute: true, t0};
            clientRes.push({ id: dot.id, payload });

            attackReload(dot);
            
    
            this.dots.dotsArr.forEach(currentDot => {
                if((dot.id !== currentDot.id) && currentDot.exposed) { //can't hit himself
                    const currentDotPosition = currentDot.getPositionAtTime(t0);
                    const diffVector = currentDotPosition.subtract(dotPosition);
    
                    const impulse = getImpulseByDistance(diffVector);
    
                    if(impulse) {
                        currentDot.addImpulse(impulse, t0);
    
                        outOfRingStep(this.io, this.roomId, currentDot);
    
                        const payload = currentDot.getPolynomialMotion();
                        payload.type = 'motion';
                        payload.t0 = t0;
                        payload.t1 = currentDot.getStopTime();
    
                        clientRes.push({ id: currentDot.id, payload});
                    }
                }
            });
        }



        this.io.to(this.roomId).emit('update', clientRes);
    }


    move(socketId, t0, directionStr) {

        const dot = this.dots.getDot(socketId);

        if(!dot.canMove) {
            return;
        }

        const impulse = directionsMap[directionStr].multiplyBy(moveImpulse);

        dot.addImpulse(impulse, t0);

        outOfRingStep(this.io, this.roomId, dot)

        const clientRes = [];

        const payload = dot.getPolynomialMotion();
        payload.type = 'motion';
        payload.t0 = t0;
        payload.t1 = dot.getStopTime();

        clientRes.push({id: dot.id, payload});

        this.io.to(this.roomId).emit('update', clientRes);
    }


    defense(socketId, t0) {
        const dot = this.dots.getDot(socketId);

        const clientRes = [];

        if(!dot.inGame || !dot.canDefend) {
            const payload = { type: 'defense', execute: false, t0 };
            clientRes.push({ id: dot.id, payload });
        } else {
            dot.canDefend = false;
            dot.exposed = false;
    
            setTimeout(() => {
                if(dot.inGame) {
                    dot.exposed = true;
                }

                setTimeout(() => {
                    dot.canDefend = true;
                }, defenseReloadTime);
                
            }, defenseTime);

            const payload = { type: 'defense', execute: true, t0 };
            clientRes.push({ id: dot.id, payload });
        }

        this.io.to(this.roomId).emit('update', clientRes);
        
    }
}

module.exports = ActionsController;
