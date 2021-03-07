const RoomGenerator = require('./room-generator');
const { setGameplayHandlers } = require('./gameplay-handlers');
const { initInfo, playersPerRoom } = require('./game-config');


module.exports = function(io) {
    const roomGen = new RoomGenerator(playersPerRoom);

    io.on('connection', socket => {
        socket.on('synchro', c0 => {
            socket.emit('synchro_response', [c0, Date.now()], (response) => {
                const room = roomGen.fillRoom(socket);
        
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