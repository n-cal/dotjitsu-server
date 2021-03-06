const { K } = require('./game-config');
const Vector2 = require('./vector2');

const eq = {

    /**
     * 
     * @param {Vector2} V 
     * @param {number} v0 
     * @param {number} t0 
     * @param {number} t 
     */

    vt(V, v0, t0, t) { // V * (v0 - K * (t - t0))
        return V.multiplyBy(v0 - K * (t - t0));
    },

    /**
     * 
     * @param {Vector2} V 
     * @param {number} v0 
     * @param {number} t0 
     * @param {Vector2} X0 
     * @param {number} t 
     */
    xt(V, v0, t0, X0, t) { // V * (v0 * (t - t0) - (K/2) * (t - t0)^2 ) + X0;
        return V.multiplyBy(v0 * (t - t0) - (K / 2) * Math.pow(t - t0, 2)).add(X0);
    },

    vtRoot(v0, t0) {
        return (v0 / K) + t0;
    },

    getPolynomialMotion(V, v0, X0) {
        const xt = [V.x * v0, V.x * K / 2, X0.x];
        const yt = [V.y * v0, V.y * K / 2, X0.y];

        return {
            xt,
            yt,
        }
    }
}

module.exports = eq;