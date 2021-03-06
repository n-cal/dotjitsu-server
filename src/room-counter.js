class RoomCounter {
    constructor(maxRooms) {
        this._maxRooms = maxRooms;
        this._roomsCount = 0;
    }

    increase() {
        this._roomsCount++;
    }

    decrease() {
        this._roomsCount--;
    }

    noRoomsLeft() {
        return this._roomsCount >= this._maxRooms;
    }

    count() {
        return this._roomsCount;
    }
}

module.exports = RoomCounter;





/* ESEMPIO DI UTILIZZO ROOMCOUNTER IN APP.JS

const RoomCounter = require('./room-counter');
const RoomGenerator = require('./room-generator');
const GameState = require('./game-state');
const gamePlay = require('./gameplay');

const maxRooms = 5;
const playersPerRoom = 2;


module.exports = function(io) {
    const roomCounter = new RoomCounter(maxRooms);

    const roomGen = new RoomGenerator(playersPerRoom);

    io.on('connection', socket => {

        socket.on('synchronization_request', () => {
            socket.emit('synchronization_response', Date.now());
        });

        if(roomCounter.noRoomsLeft()) {
            socket.emit('server_full');
            socket.disconnect(true);
        }

        const room = roomGen.fillRoom(socket);

        if(room.isReady) {
            
            roomCounter.increase();
            console.log(`rooms count: ${roomCounter.count()}`);

            const gameState = new GameState(room.sockets);

            io.to(room.id).emit('assign_players', gameState.playersInitInfo());
            
            // gamePlay(io, game, room.id, room.sockets);

            checkRoomLeft(roomCounter, room.sockets);

        }
    });
}


function checkRoomLeft(roomCounter, sockets) {
    let leaving = 0;

    sockets.forEach(socket => {
        socket.on('disconnect', () => {
            leaving++;
            if(leaving === playersPerRoom) {
                roomCounter.decrease();
                console.log(`rooms count: ${roomCounter.count()}`);
            }
        });
    });
}
*/