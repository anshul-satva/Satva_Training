const display = document.getElementById("display");
const buttons = document.querySelectorAll("td");

let expression = "";
// exmaple: 12+54-78/4

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    if (!value) return;

    // CLEAR the display
    if (value === "AC") {
      expression = "";
      display.textContent = "0";
      return;
    }

    // EQUAL
    if (value === "=") {
      try {
        const result = eval(expression);
        if (result === Infinity || result === -Infinity) {
          display.textContent = "Infinity";
        }
        else {
          display.textContent = result;
          expression = result.toString();
        }
      } catch {
        display.textContent = "Error";
        expression = "";
      }
      return;
    }

    // PERCENTAGE
    if (value === "%") {
      handlePercentage();
      display.textContent = expression;
      return;
    }

    // OPERATOR SAFETY
    const lastChar = expression.slice(-1);
    if (isOperator(value) && isOperator(lastChar)) {
      expression = expression.slice(0, -1);
    }

    // DECIMAL SAFETY
    if (value === ".") {
      const parts = expression.split(/[\+\-\*\/]/);
      if (parts[parts.length - 1].includes(".")) return;
    }
    expression += value;
    display.textContent = expression;
  });
});

// FUNCTIONS
function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

function handlePercentage() {
  const match = expression.match(/(.+)([\+\-\*\/])(\d+\.?\d*)$/);

  // Single number → divide by 100
  if (!match) {
    expression = (parseFloat(expression) / 100).toString();
    return;
  }

  const totalBefore = match[1]; // Everything before last operator
  const operator = match[2]; // Last operator
  const lastNumber = parseFloat(match[3]); // Last number

  // Calculate percentage based on totalBefore
  const base = eval(totalBefore);
  const percentResult = (base * lastNumber) / 100;

  // Replace last number with percentage
  expression = totalBefore + operator + percentResult;
}
