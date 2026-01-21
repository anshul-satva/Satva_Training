const form = document.getElementById("myForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const url = document.getElementById("url");

let isSubmitted = false;

// REGEX
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// REAL-TIME
email.addEventListener("input", () => validateEmail());
password.addEventListener("input", () => validatePassword());
confirmPassword.addEventListener("input", () => validateConfirmPassword());
url.addEventListener("input", () => validateURL());

// SUBMIT
form.addEventListener("submit", function (e) {
  e.preventDefault();
  isSubmitted = true;

  const isValid =
    validateEmail() &
    validatePassword() &
    validateConfirmPassword() &
    validateURL();

  if (isValid) {
    alert("Form Submitted Successfully!");
    form.reset();
    clearValidation();
    isSubmitted = false;
  }
});

// ================= FUNCTIONS =================

function validateEmail() {
  if (!email.value.trim()) {
    return handleEmpty(email);
  }
  return handleRegex(email, emailRegex);
}

function validatePassword() {
  if (!password.value) {
    return handleEmpty(password);
  }
  const valid = handleRegex(password, passRegex);
  if (confirmPassword.value) validateConfirmPassword();
  return valid;
}

function validateConfirmPassword() {
  if (!confirmPassword.value) {
    return handleEmpty(confirmPassword);
  }

  if (confirmPassword.value === password.value) {
    setValid(confirmPassword);
    return true;
  } else {
    setInvalid(confirmPassword);
    return false;
  }
}

function validateURL() {
  if (!url.value.trim()) {
    return handleEmpty(url);
  }

  try {
    new URL(url.value);
    setValid(url);
    return true;
  } catch {
    setInvalid(url);
    return false;
  }
}

// ================= HELPERS =================

function handleEmpty(input) {
  if (isSubmitted) {
    setInvalid(input); // 🔴 show error on submit
  } else {
    clearField(input); // no color while typing
  }
  return false;
}

function handleRegex(input, regex) {
  if (regex.test(input.value.trim())) {
    setValid(input);
    return true;
  } else {
    setInvalid(input);
    return false;
  }
}

function setValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function setInvalid(input) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

function clearField(input) {
  input.classList.remove("is-valid", "is-invalid");
}

function clearValidation() {
  document.querySelectorAll(".form-control").forEach(clearField);
}
