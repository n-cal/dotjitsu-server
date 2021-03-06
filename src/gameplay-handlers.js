const  ActionsController = require('./actions-controller');
const DotsGroup = require('./dots-group');

function setGameplayHandlers(io, roomId, sockets, playersInitInfo) {

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
}


module.exports = { setGameplayHandlers };