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
  if (!expression) return;

  // Split the expression to find the last number and the operator before it
  // Example: "100+20" -> match[1]="100", match[2]="+", match[3]="20"
  const match = expression.match(/(.+)([\+\-\*\/])(\d+\.?\d*)$/);

  if (!match) {
      // Case: Single number (e.g., "50") -> 0.5
      expression = (parseFloat(expression) / 100).toString();
  } else {
      const totalBefore = match[1]; 
      const operator = match[2]; 
      const lastNumber = parseFloat(match[3]); 

      let baseValue;
      try {
          baseValue = eval(totalBefore); // Calculate what came before
      } catch {
          return;
      }

      let calculatedValue;
      if (operator === "+" || operator === "-") {
          // Modern Calc Rule: 100 + 20%  => 100 + (100 * 0.20)
          calculatedValue = (baseValue * lastNumber) / 100;
      } else {
          // Modern Calc Rule: 100 * 20% => 100 * 0.20
          calculatedValue = lastNumber / 100;
      }

      expression = totalBefore + operator + calculatedValue;
  }
}