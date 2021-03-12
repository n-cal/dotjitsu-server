const RoomGenerator = require('./room-generator');
const { startGameplay } = require('./start-gameplay');
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
            const now = Date.now();
            socket.emit('synchro_response', [c0, now], (response) => {

                if(response.status === 'ok') {
                    
                    const room = roomGenenerators[playersPerRoom].fillRoom(socket);
            
                    if(room.isReady) {
                        const gameInitInfo = initInfo(room.sockets);
                        
                        let ackCount = 0;
                        
                        room.sockets.forEach(socket => {
                            socket.emit('game_init', gameInitInfo, (response) => {
                                ackCount++;
    
                                if(ackCount === room.size) {
                                    startGameplay(io, room.id, room.sockets, gameInitInfo);
                                }
                                
                            });
                        });
                    }
                }
            });
        });

    });
}