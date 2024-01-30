const nonZeroDigits = "123456789";
const OPERATORS = {
    add: '+',
    substract: '-',
    multiply: 'X',
    divide: '/',
    modulo: '%',
    powX: '^',
};

const EQUALITY = "operate";
const SPACE = ' ';
const CLEAN = 'C';
const FLOAT_SEPARATOR = '.';

const add = (num1, num2) => {
    return num1 + num2;
}

const substract = (num1, num2) => {
    return num1 - num2;
}

const multiply = (num1, num2) => {
    return num1 * num2; 
}

const divide = (num1, num2) => {
    return num1 / num2;
}

const modulo = (num1, num2) => {
    return num1 % num2;
}

const operate = (num1, num2, operation) => {
    try {
        const result = operation(+num1, +num2);
        return result;
    }
    catch (error) {
        return `ERROR ${error}`;
    }
}

const isNonZeroDigit = (key) => {
    return nonZeroDigits.includes(key);
}

const powX = (base, exp) => {
    return Math.pow(base, exp);   
}

const isZero = (key) => {
    return (key == "00" || key == "0");
}
const isOperator = (key) => {
    return OPERATORS.hasOwnProperty(key);
}

const isEquality = (key) => {
    return key == EQUALITY;
}

const isCleaning = (key) => {
    return key == CLEAN;
}

const Calculator = {
    add: add,
    substract: substract,
    multiply: multiply,
    divide: divide,
    modulo: modulo,
    powX: powX
};

export {
    operate,
    isNonZeroDigit,
    isZero,
    isOperator,
    isEquality,
    isCleaning,
    Calculator,
    OPERATORS,
    SPACE,
    FLOAT_SEPARATOR
};