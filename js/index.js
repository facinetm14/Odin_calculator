"use strict";
import {
    Calculator,
    isNonZeroDigit,
    isZero,
    isOperator,
    OPERATORS,
    isEquality,
    SPACE,
    operate,
    isCleaning,
} from './calculator.js';

const TRANSITION_TIMES = 250;
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
    if (text[0] == '0') return false;
    const secondPart = text.lastIndexOf(SPACE);
    if (secondPart != - 1 && text[secondPart + 1] && isZero(text[secondPart + 1])) {
        return false; 
    }
    if (secondPart != -1 && !text[secondPart + 1] && key.length > 1) return false;
    return true;
}

function handleClick() {
    animateTouch(this);

    let currentOperation = screenOperation.textContent;
    const key = this.dataset.key;
    if (isCleaning(key)) return cleanScreen();
    if (isNonZeroDigit(key)) {
        const spaceIndex = currentOperation.lastIndexOf(SPACE);
        if (isZero(currentOperation)) {
            currentOperation = key;
        }
        else if (isZero(currentOperation[spaceIndex + 1])) {
            currentOperation = currentOperation.substring(0, spaceIndex + 1) + key;
        }
        else currentOperation = currentOperation + key;
    }
    else if (isZero(key) && validPosition(currentOperation, key)) currentOperation += key;
    else if (isOperator(key)) {
        calculation.num1 = currentOperation;
        if (!calculation.operator) {
            currentOperation += ` ${OPERATORS[key]} `;
            calculation.operator = key;
        }
    }
    else if (isEquality(key)) {
        const start = currentOperation.lastIndexOf(SPACE);
        calculation.num2 = currentOperation.substring(start + 1);
        const result = operate(+calculation.num1, +calculation.num2, Calculator[calculation.operator]);
        screenResult.textContent = `${result}`;
    }
    updateScreenOperation(currentOperation);
}

touches.forEach((touch) => {
    touch.addEventListener('click', handleClick);
});