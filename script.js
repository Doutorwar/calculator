class Stack {
  constructor() {
    this.stack = [];
    this[Symbol.iterator] = function *() {
      for (const el of this.stack) {
        yield el;
      }
    }
  }

  isEmpty() {
    return this.stack.length === 0;
  }

  push(val) {
    this.stack.push(val);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('empty stack');
    } else {
      return this.stack.pop();
    }
  }

  peek(n = -1) {
    if (this.isEmpty()) {
      throw new Error('empty stack');
    } else {
      return this.stack[this.stack.length + n];
    }
  }
}

document.getElementById('key-pad').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    input(event.target.innerHTML);
    render();
  }
});

const $screen = document.getElementById('screen');
const stack = new Stack();
let shouldResetIfNumber = false;
let display = 0;

stack.push(0);

function input(char) {
  if (isNum(char)) {
    if (shouldResetIfNumber) {
      stack.pop();
      stack.push(parseInt(char));
      shouldResetIfNumber = false;
    } else if (isNum(stack.peek())) {
      const n = stack.pop();
      stack.push(n * 10 + parseInt(char));
    } else {
      stack.push(parseInt(char));
    }
    display = stack.peek();
  } else if (char !== '=') {
    shouldResetIfNumber = false;
    if (isNum(stack.peek())) {
      stack.push(char);
    } else {
      stack.pop();
      stack.push(char);
    }
    display = evaluate(stack);
  } else {
    const res = evaluate(stack, true);
    while (!stack.isEmpty()) {
      stack.pop();
    }
    stack.push(res);
    shouldResetIfNumber = true;
    display = res;
  }
}

function evaluate(stack, isComplete = false) {
  const values = new Stack();
  const operators = new Stack();
  for (const val of stack) {
    if (isNum(val)) {
      values.push(val);
    } else {
      if (val === '+' || val === '-') {
        while (!operators.isEmpty()) {
          values.push(operators.pop());
        }
        operators.push(val);
      } else {
        while (!operators.isEmpty() && (operators.peek() === '*' || operators.peek() === '/')) {
          values.push(operators.pop());
        }
        operators.push(val);
      }
    }
  }

  if (isComplete) {
    while (!operators.isEmpty()) {
      values.push(operators.pop());
    }
  }

  const rpn = new Stack();
  for (const val of values) {
    if (isNum(val)) {
      rpn.push(val);
    } else {
      const b = rpn.pop();
      const a = rpn.pop();
      switch (val) {
        case '+':
          rpn.push(a + b);
          break;
        case '-':
          rpn.push(a - b);
          break;
        case '/':
          rpn.push(a / b);
          break;
        case '*':
          rpn.push(a * b);
          break;
      }
    }
  }

  return rpn.pop();
}

function render() {
  $screen.innerHTML = display;
}

function isNum(val) {
  if (typeof val === 'number') {
    return true;
  } else if (typeof val === 'string') {
    return !Number.isNaN(parseInt(val));
  } else {
    return false;
  }
}