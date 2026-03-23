const textBox1 = document.getElementById("textBox1");
const textBox2 = document.getElementById("textBox2");
const textBox3 = document.getElementById("textBox3");
const textBox4 = document.getElementById("textBox4");

const addFirstTwoValues = () => {
  const value1 = Number(textBox1.value);
  const value2 = Number(textBox2.value);
  return value1 + value2;
};

const addCommaSeparatedValues = () => {
  const cleanedInput = textBox3.value
    .split(/[\s,]+/)
    .filter((value) => value !== "");

  let total = 0;

  for (let number of cleanedInput) {
    total += Number(number);
  }

  return total;
};

const restrictCommaInput = (inputField) => {
  inputField.value = inputField.value.replace(/[^0-9," "]/g, "");
};

const restrictNumberInput = (inputField) => {
  // Allow only digits and at most one decimal point
  inputField.value = inputField.value
    .replace(/[^0-9.]/g, "") // Remove all except digits and dot
    .replace(/(\..*)\./g, "$1"); // Allow only one decimal point
};

// Add this to your existing code

textBox1.addEventListener("input", () => restrictNumberInput(textBox1));
textBox2.addEventListener("input", () => restrictNumberInput(textBox2));

const calculateFinalResult = () => {
  let isValid = true;

  if (!textBox1.value) {
    textBox1.classList.add("is-invalid");
    isValid = false;
  }

  if (!textBox2.value) {
    textBox2.classList.add("is-invalid");
    isValid = false;
  }

  if (!textBox3.value) {
    textBox3.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) {
    textBox4.value = "";
    return;
  }

  const sumOfFirstTwo = addFirstTwoValues();
  const sumOfThird = addCommaSeparatedValues();
  const finalSum = sumOfFirstTwo + sumOfThird;

  textBox4.value = `${sumOfFirstTwo} | ${sumOfThird} | ${finalSum}`;
};
const removeInvalidOnInput = (inputField) => {
  if (inputField.value.trim() !== "") {
    inputField.classList.remove("is-invalid");
    inputField.classList.add("is-valid");
  }
};

textBox1.addEventListener("input", () => removeInvalidOnInput(textBox1));
textBox2.addEventListener("input", () => removeInvalidOnInput(textBox2));
textBox3.addEventListener("input", () => removeInvalidOnInput(textBox3));
