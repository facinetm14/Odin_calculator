const add = (num1, num2) => {
    return num1 + num2;
}

const subtract = (num1, num2) => {
    return num1 - num2;
}

const multiply = (num1, num2) => {
    return num1 * num2; 
}

const divide = (num1, num2) => {
    return num1 / num2;
}

const operate = (num1, num2, operation) => {
    return operation(num1, num2);
}