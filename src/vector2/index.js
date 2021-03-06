class Vector2 {
    constructor(x, y) {
        for(let coord of arguments) {
            if(!isFinite(coord) || coord === null || typeof coord !== 'number') {
                throw new Error('Vector2 constructor accept only numbers!');
            }
        }

        this.x = x;
        this.y = y;
    }

    normalized() {
        const magnitude = this.magnitude();
        if(magnitude === 0) {
            return this;
        }

        return new Vector2(this.x / magnitude, this.y / magnitude);
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    add(vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    subtract(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    multiplyBy(m) {
        try {
            if(typeof m !== 'number') throw new Error();
            return new Vector2(this.x * m, this.y * m);
        } catch(e) {
            throw new Error('Can multiply only by numbers!');
        }
    }

    divideBy(d) {
        if(d === 0) throw new Error("Division by 0 is not allowed!");
        if(Math.abs(d) === Infinity) throw new Error("Division by Infinity is not allowed!");
        try {
            if(typeof d !== 'number') throw new Error();
            return new Vector2(this.x / d, this.y / d);
        } catch(e) {
            throw new Error('Can divide only by numbers!');
        }
    }

    reverse() {
        this.x = -this.x;
        this.y = -this.y;
    }

    toArray() {
        return [this.x, this.y];
    }
}


module.exports = Vector2;