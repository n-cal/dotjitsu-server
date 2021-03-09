const  ActionsController = require('./actions-controller');
const DotsGroup = require('./dots-group');
const { gameDurationInSeconds } = require('./game-config');

function startGameplay(io, roomId, sockets, playersInitInfo) {

    const dots = new DotsGroup(playersInitInfo);
    const controller = new ActionsController(io, roomId, dots);

    sockets.forEach(socket => {

        socket.on('player_action', ({action, t0 }) => {

            switch(action) {
                case 'up':
                case 'down':
                case 'left':
                case 'right':
                    
                    controller.move(socket.id, t0, action);
                    
                    break;
                
                case 'attack':

                    controller.attack(socket.id, t0);

                    break;
                
                case 'defense':

                    controller.defense(socket.id, t0);

                    break;

            }
        });



        let allConnected = true;

        socket.on('disconnect', () => {
            if(allConnected) {
                allConnected = false;
                io.to(roomId).emit('player_leaved');
                sockets.forEach(socket => {
                    socket.disconnect(true);
                });
            }
        });
    });

    
    startGameTimer(() => {
        io.to(roomId).emit('game_end', {
            winner: dots.getWinner()
        });

        sockets.forEach(socket => {
            socket.disconnect(true);
        });
    });


    io.to(roomId).emit('game_ready', {
        t0: Date.now(),
        gameDuration: gameDurationInSeconds
    });
}


function startGameTimer(cb) {
    setTimeout(cb, gameDurationInSeconds * 1000);
}


module.exports = { startGameplay };