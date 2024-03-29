"use strict";
import {
    Calculator,
    isNonZeroDigit,
    isZero,
    isOperator,
    OPERATORS,
    isEquality,
    SPACE,
    FLOAT_SEPARATOR,
    operate,
    isCleaning,
} from './calculator.js';

const TRANSITION_TIMES = 250;
const MAX_COLUMN = 15;
const calculation = {
    num1: "",
    num2: "",
    operator: "",
    result: ""
};

const touches = document.querySelectorAll('.row_touch');
const screenOperation = document.querySelector('#screen_operation');
const screenResult = document.querySelector("#screen_result");

function unselectTouch(touch) {
    touch.classList.remove('selected');
}

function animateTouch(touch) {
    touch.classList.add('selected');
    setTimeout(() => {
        unselectTouch(touch);
    }, TRANSITION_TIMES);
}

const updateScreenOperation = (value) => {
    screenOperation.textContent = value;
}

const cleanScreen = () => {
    screenOperation.textContent = '0';
    screenResult.textContent = '';
    calculation.num1 = "";
    calculation.num2 = "";
    calculation.operator = "";
    calculation.result = "";
} 

const validPosition = (text, key) => {
    if (!text.length) return false;
    if (text == "0") return false;
    const secondPart = text.lastIndexOf(SPACE);
    if (secondPart != - 1 && text[secondPart + 1] && isZero(text[secondPart + 1])) {
        return false; 
    }
    if (secondPart != -1 && !text[secondPart + 1] && key.length > 1) return false;
    return true;
}

const updateOperation = (key, operation) => {
    let currentOperation = operation;
    if (currentOperation.length == MAX_COLUMN - 4 && !calculation.operator) return currentOperation;
    if (currentOperation.length >= MAX_COLUMN && calculation.operator) return currentOperation;
    if (calculation.result) {
        cleanScreen();
        currentOperation = "0";
    }
    const startNum2 = currentOperation.lastIndexOf(SPACE);
    if (key == FLOAT_SEPARATOR) {
        if (currentOperation.indexOf(FLOAT_SEPARATOR) < 0) currentOperation += key;
        else if ( startNum2 > 0 && currentOperation.indexOf(FLOAT_SEPARATOR, startNum2)) {
            currentOperation += key;
        }
    }
    else if (isNonZeroDigit(key)) {
        const spaceIndex = currentOperation.lastIndexOf(SPACE);
        if (isZero(currentOperation)) currentOperation = key;
        else if (spaceIndex > 0 &&
            currentOperation.indexOf(FLOAT_SEPARATOR, spaceIndex) < 0 &&
            isZero(currentOperation[spaceIndex + 1])) {
            currentOperation = currentOperation.substring(0, spaceIndex + 1) + key;
        }
        else currentOperation = currentOperation + key;
    }
    else if (isZero(key) && validPosition(currentOperation, key)) currentOperation += key;
    return currentOperation;
}

const setFirstOperand = (currentOperation) => {
    if (!calculation.num1) calculation.num1 = currentOperation;
}

const startNewOperation = (key) => {
    const num1 = calculation.result;
    cleanScreen();
    calculation.num1 = num1;
    calculation.operator = key;
    return num1 + SPACE + OPERATORS[key] + SPACE;
}
const updateOperator = (key, operation) => {
    let currentOperation = operation;
    if (!calculation.operator) {
        calculation.operator = key;
        currentOperation += SPACE + OPERATORS[key] + SPACE;
    }
    else if (calculation.result) currentOperation = startNewOperation(key);
    else if (operation.lastIndexOf(SPACE) == operation.length - 1) {
        currentOperation = currentOperation.replace(OPERATORS[calculation.operator], OPERATORS[key]);
        calculation.operator = key;
    }
    else if (operation.lastIndexOf(SPACE) < operation.length - 1) {
        execCalculation(operation);
        currentOperation = startNewOperation(key);
    }
    return currentOperation;
}
const setSecondOperand = (currentOperation) => {
    const start = currentOperation.lastIndexOf(SPACE);
    calculation.num2 = currentOperation.substring(start + 1);
}

const updateScreenResult = (result) => {
     if (result.length > MAX_COLUMN) {
        screenResult.textContent = result.substring(0, MAX_COLUMN);
    }
    else screenResult.textContent = result;
}

const execCalculation = (currentOperation) => {
     if (calculation.operator) {
         setSecondOperand(currentOperation);
         calculation.result = operate(calculation.num1, calculation.num2, Calculator[calculation.operator]);
         updateScreenResult(`${calculation.result}`);
    }
}

function handleClick() {
    animateTouch(this);
    const currentOperation = screenOperation.textContent;
    const key = this.dataset.key;
    if (isCleaning(key)) return cleanScreen();
    if (isOperator(key)) {
        setFirstOperand(currentOperation);
        updateScreenOperation(updateOperator(key, currentOperation));
    }
    else if (isEquality(key)) execCalculation(currentOperation);
    else updateScreenOperation(updateOperation(key, currentOperation));
}

touches.forEach((touch) => {
    touch.addEventListener('click', handleClick);
});