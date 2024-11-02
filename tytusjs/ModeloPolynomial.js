class PolynomialModel {
    constructor() {
        this.isFit = false;
    }
}

class PolynomialRegression extends PolynomialModel {
    constructor() {
        super();
        this.solutions = [];
        this.error = 0;
    }

    fit(xArray, yArray, degree) {
        let equationSize = degree + 1;
        let nElements = degree + 2;

        let equations = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            equations[i] = new Array(nElements);
        }

        for (let i = 0; i < equationSize; i++) {
            for (let j = 0; j < nElements; j++) {
                let sum = 0;
                if (i == 0 && j == 0) {
                    sum = xArray.length;
                }
                else if (j == nElements - 1) {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], i) * yArray[k];
                    }
                }
                else {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], (j + i));
                    }
                }
                equations[i][j] = sum;
            }
        }

        for (let i = 1; i < equationSize; i++) {
            for (let j = 0; j <= i - 1; j++) {
                let factor = equations[i][j] / equations[j][j];
                for (let k = j; k < nElements; k++) {
                    equations[i][k] = equations[i][k] - factor * equations[j][k];
                }
            }
        }

        for (let i = equationSize - 1; i > -1; i--) {
            for (let j = equationSize - 1; j > -1; j--) {
                if (i == j) {
                    equations[i][nElements - 1] = equations[i][nElements - 1] / equations[i][j];
                }
                else if (equations[i][j] != 0) {
                    equations[i][nElements - 1] -= equations[i][j] * equations[j][nElements - 1];
                }
            }
        }

        this.solutions = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            this.solutions[i] = equations[i][nElements - 1];
        }

        this.isFit = true;

        this.calculateR2(xArray, yArray);
    }

    predict(xArray) {
        let yArray = [];
        if (this.isFit) {
            for (let i = 0; i < xArray.length; i++) {
                let yprediction = 0;
                for (let j = 0; j < this.solutions.length; j++) {
                    yprediction += this.solutions[j] * Math.pow(xArray[i], j);
                }
                yArray.push(yprediction);
            }
        }

        return yArray;
    }

    calculateR2(xArray, yArray) {
        let errors = new Array(xArray.length);
        let prediction = this.predict(xArray);
        let sumY = 0;

        for (let i = 0; i < xArray.length; i++) {
            sumY += yArray[i];
            errors[i] = Math.pow(yArray[i] - prediction[i], 2);
        }

        let sr = 0;
        let st = 0;
        for (let i = 0; i < xArray.length; i++) {
            sr += errors[i];
            st += Math.pow(yArray[i] - (sumY / xArray.length), 2);
        }
        let r2 = (st - sr) / st;
        this.error = r2;
    }

    getError() {
        return this.error;
    }
}