const Dot = require('./dot');

class DotsGroup {
    constructor(playersInitInfo) {
        this.dotsArr = playersInitInfo.map(playerInfo => new Dot(playerInfo.socketId, playerInfo.team, playerInfo.startPosition));

        this.redPoints = 0;
        this.bluePoints = 0;
    }

    getDot(id) {
        return this.dotsArr.find(dot => dot.id === id);
    }

    addPointToOpponentsOf(dot) {
        switch(dot.team) {
            case 'red':
                this.bluePoints++;
                break
            case 'blue':
                this.redPoints++;
                break;
            default:
                return
        }
    }
}

module.exports = DotsGroup;