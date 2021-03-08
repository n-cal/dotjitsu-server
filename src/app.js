const RoomGenerator = require('./room-generator');
const { setGameplayHandlers } = require('./gameplay-handlers');
const { initInfo } = require('./game-config');


module.exports = function(io) {
    const roomGenenerators = { 
        2: new RoomGenerator(2),
        4: new RoomGenerator(4)
    };

    io.on('connection', socket => {

        const playersPerRoom = parseInt(socket.handshake.query.playersPerRoom);

        if(playersPerRoom !== 2 && playersPerRoom !== 4) {
            socket.disconnect(true);
            return;
        }

        socket.on('synchro', c0 => {
            socket.emit('synchro_response', [c0, Date.now()], (response) => {
                const room = roomGenenerators[playersPerRoom].fillRoom(socket);
        
                if(room.isReady) {
                    const gameInitInfo = initInfo(room.sockets);
                    
                    let ackCount = 0;
                    
                    room.sockets.forEach(socket => {
                        socket.emit('game_init', gameInitInfo, (response) => {
                            ackCount++;

                            if(ackCount === room.size) {
                                setGameplayHandlers(io, room.id, room.sockets, gameInitInfo);
                                io.to(room.id).emit('game_ready', ackCount);
                            }
                            
                        });
                    });
                }
            });
        });

    });
}