const Vector2 = require("./vector2");
const eq = require('./motion-equations');

class Dot {
    constructor(id, team, startPosition) {
        this.id = id;
        this.team = team;

        this.x0 = new Vector2(startPosition[0], startPosition[1]);
        this.v0 = 0;
        this.t0 = Date.now();
        this.direction = new Vector2(0, 0);

        this.canMove = true;
        this.exposed = true;
        this.canAttack = true;
    }

    addImpulse(vector, t) {
        const currentPosition = this.getPositionAtTime(t);
        const currentVelocity = this.getVelocityAtTime(t);
        const resultVelocity = currentVelocity.add(vector);

        this.direction = resultVelocity.normalized();
        this.v0 = resultVelocity.magnitude();
        this.t0 = t;
        this.x0 = currentPosition;
    }


    getPositionAtTime(t) {
        t = Math.min(t, this.getStopTime());

        return eq.xt(this.direction, this.v0, this.t0, this.x0, t);
    }


    getVelocityAtTime(t) {
        const stopTime = this.getStopTime();

        return t < stopTime ? eq.vt(this.direction, this.v0, this.t0, t) : new Vector2(0, 0);

    }


    getStopTime() {
        return eq.vtRoot(this.v0, this.t0);
    }


    getStopPosition() {
        return this.getPositionAtTime(this.getStopTime());
    }


    getPolynomialMotion() {
        return eq.getPolynomialMotion(this.direction, this.v0, this.x0);
    }

    restartAt(position) {
        this.x0 = position;
        this.v0 = 0;
        this.t0 = Date.now();
        this.direction = new Vector2(0, 0);
    }
}

module.exports = Dot;



