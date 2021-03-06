class RoomGenerator {
    constructor(playersPerRoom) {
        this._playersPerRoom = playersPerRoom;
        this._waiting = [];
    }

    fillRoom(socket) {
        this._waiting.push(socket);

        this._waiting.forEach(socket => {
            socket.emit('waiting_players_info', {waiting: this._waiting.length, total: this._playersPerRoom});
        });


        if(this._waiting.length === this._playersPerRoom) {
            return this._createRoom();
        }

        socket.on('disconnect', () => {
            const stillWaitingCount = this._waiting.length - 1;

            this._waiting = this._waiting.filter(waitingSocket => {
                if(waitingSocket.id !== socket.id) {
                    waitingSocket.emit('waiting_players_info', {waiting: stillWaitingCount, total: this._playersPerRoom});
                    return true;
                }
                return false;
            });
        });

        return {isReady: false};
    }

    _createRoom() {
        const sockets = this._waiting;
        const id = sockets[0].id;

        sockets.forEach(socket => {
            socket.removeAllListeners('disconnect');
            socket.join(id);
        });

        this._waiting = [];
        
        return {
            isReady: true,
            id,
            sockets,
            size: sockets.length
        };
    };
}

module.exports = RoomGenerator;