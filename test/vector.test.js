const { assert } = require('chai');
const Vector2 = require('../src/vector2');
const expect = require('chai').expect;

describe('Test for Vector2 class', () => {
    describe('.contructor', () => {
        it('creates a Vector2 with x=1, y=2', () => {
            
            const inputX = 1;
            const inputY = 2;
            
            const v = new Vector2(1, 2);

            expect(v.x).to.equal(inputX);
            expect(v.y).to.equal(inputY);
        });

        it('creates a Vector2 with x=239041, y=9999302', () => {

            const inputX = 239041;
            const inputY = 9999302;

            const v = new Vector2(inputX, inputY);

            expect(v.x).to.equal(inputX);
            expect(v.y).to.equal(inputY);
        });

        it('creates a Vector2 with negative numbers', () => {

            const inputX = -1223;
            const inputY = -128;

            const v = new Vector2(inputX, inputY);

            expect(v.x).to.equal(inputX);
            expect(v.y).to.equal(inputY);
        })

        it('creates the origin vector (0, 0)', () => {

            const inputX = 0;
            const inputY = 0;

            const v = new Vector2(inputX, inputY);

            expect(v.x).to.equal(inputX);
            expect(v.y).to.equal(inputY);
        });

        it('throws an error with x = null', () => {

            const inputX = null;
            const inputY = 3;

            const errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with y = null', () => {
            
            const inputX = -20;
            const inputY = null;

            const errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with x = undefined or y = undefined', () => {
            let inputX = undefined;
            let inputY = 291;

            let errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();


            inputX = -32;
            inputY = undefined;

            errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with x = NaN or y = NaN', () => {
            
            let inputX = NaN;
            let inputY = 178;

            let errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();

            inputX = -491;
            inputY = NaN;

            errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with x = Infinity or y = Infinity', () => {

            let inputX = Infinity;
            let inputY = 98;

            let errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with x = -Infinity or y = -Infinity', () => {

            let inputX = -Infinity;
            let inputY = -1129;

            let errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();

            inputX = 4422;
            inputY = -Infinity;

            errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });

        it('throws an error with strings', () => {

            let inputX = 'hello';
            let inputY = 900;

            let errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();

            inputX = 99888;
            inputY = 'hello';

            errorFn = () => {
                new Vector2(inputX, inputY);
            };

            expect(errorFn).to.throw();
        });
    });

    describe('.magnitude', () => {
        it('gives the correct magnitude of (0, 0)', () => {
            const inputX = 0;
            const inputY = 0;
            const expectedMagnitude = 0;

            const resultMagnitude = (new Vector2(inputX, inputY)).magnitude();

            expect(resultMagnitude).to.equal(expectedMagnitude);
        });

        it('gives the correct magnitude of (238, 893)', () => {
            const inputX = 238;
            const inputY = 893;
            const expectedMagnitude = 924.17;

            const resultMagnitude = (new Vector2(inputX, inputY)).magnitude();

            expect(resultMagnitude).to.be.closeTo(expectedMagnitude, 0.01);
        });

        it('gives the correct magnitude of (-73, 9)', () => {
            const inputX = -73;
            const inputY = 9;
            const expectedMagnitude = 73.55;

            const resultMagnitude = (new Vector2(inputX, inputY)).magnitude();

            expect(resultMagnitude).to.be.closeTo(expectedMagnitude, 0.01);
        });
    });

    describe('.add', () => {
        it('gives the correct result of v + (0, 0)', () => {
            const v = new Vector2(5, 8);
            
            const resultSum = v.add(new Vector2(0, 0));

            expect(resultSum.x).to.equal(v.x);
            expect(resultSum.y).to.equal(v.y);
        });

        it('gives the correct result of v1 + v2', () => {
            const v1 = new Vector2(-3, 10);
            const v2 = new Vector2(5, 5);
            const expectedX = 2;
            const expectedY = 15;

            const resultVec = v1.add(v2);

            expect(resultVec.x).to.equal(expectedX);
            expect(resultVec.y).to.equal(expectedY);
        });
    });

    describe('.subtract', () => {
        it('subtracts a vector from an other', () => {
            const v1 = new Vector2(8, 3);
            const v2 = new Vector2(2, 2);
            const expectedX = 6;
            const expectedY = 1;

            const resultVec = v1.subtract(v2);

            expect(resultVec.x).to.equal(expectedX);
            expect(resultVec.y).to.equal(expectedY);
        });
    });

    describe('.multiply', () => {
        it('multiplies a vector by 0', () => {
            const v1 = new Vector2(9, 4);
            const [expectedX, expectedY] = [0, 0];
            const multiplier = 0

            const resultVec = v1.multiplyBy(multiplier);

            expect(resultVec.x).to.equal(expectedX);
            expect(resultVec.y).to.equal(expectedY);
        });

        it('multiplies a vector by a negative number', () => {
            const v = new Vector2(8, 2);
            const multiplier = -3;
            const [expectedX, expectedY] = [-24, -6];

            const resultVec = v.multiplyBy(multiplier);

            expect(resultVec.x).to.equal(expectedX);
            expect(resultVec.y).to.equal(expectedY);
        });

        it('throws an error if a vector is multiplied by NaN', () => {
            const v = new Vector2(91, 13);
            const multiplier = NaN;

            const errorFn = () => {
                v.multiplyBy(multiplier);
            }

            expect(errorFn).to.throw('Can multiply only by numbers!');
        });

        it('throws an error if a vector is multiplied by undefined', () => {
            const v = new Vector2(5, 12);
            const multiplier = undefined;

            const errorFn = () => {
                v.multiplyBy(multiplier);
            };

            expect(errorFn).to.throw('Can multiply only by numbers!');
        });

        it('throws an error if a vector is multiplied by Infinity', () => {
            const v = new Vector2(25, 64);
            const multiplier = Infinity;

            const errorFn = () => {
                v.multiplyBy(multiplier);
            };

            expect(errorFn).to.throw('Can multiply only by numbers!');
        });

        it('throws an error if a vector is multiplied by a type different from number', () => {
            const v = new Vector2(2, 2);
            const multiplier = '6';

            const errorFn = () => {
                v.multiplyBy(multiplier);
            };

            expect(errorFn).to.throw('Can multiply only by numbers!');
        });
    });

    describe('.normalized', () => {
        it('returns the correct normalized vector', () => {
            const v = new Vector2(5, 0);

            const res = v.normalized();
            expect(res.x).to.equal(1);
            expect(res.y).to.equal(0);
        });
    });

    describe('.divide', () => {
        it('throws an error if a vector is divided by 0', () => {
            const v = new Vector2(28, 4);
            const divisor = 0;

            const errorFn = () => {
                v.divideBy(divisor);
            };

            expect(errorFn).to.throw('Division by 0 is not allowed');
        });

        it('throws an error if a vector is divided by NaN', () => {
            const v = new Vector2(9, 2);
            const divisor = NaN;

            const errorFn = () => {
                v.divideBy(divisor);
            };

            expect(errorFn).to.throw('Can divide only by numbers!');
        });

        it('throws an error if a vector is divided by undefined', () => {
            const v = new Vector2(6, 3);
            const divisor = undefined;

            const errorFn = () => {
                v.divideBy(divisor);
            };

            expect(errorFn).to.throw('Can divide only by numbers!');
        });

        it('throws an error if a vector is divided by Infinity', () => {
            const v = new Vector2(7, 9);
            const divisor = Infinity;

            const errorFn = () => {
                v.divideBy(divisor);
            };

            expect(errorFn).to.throw('Division by Infinity is not allowed!');
        });

        it('throws an error if a vector is divided by a type different from number', () => {
            const v = new Vector2(5, 5);
            const divisor = '10';

            const errorFn = () => {
                v.divideBy(divisor);
            };

            expect(errorFn).to.throw('Can divide only by numbers!');
        });
    });
});