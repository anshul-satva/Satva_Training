const form = document.getElementById("registration");

const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

// REGEX
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

function setValid(input) {
  input.classList.add("is-valid");
  input.classList.remove("is-invalid");
}

function setInvalid(input) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
}

function resetState(input) {
  input.classList.remove("is-valid", "is-invalid");
}


// FIRST NAME
firstName.addEventListener("input", () => {
  if (firstName.value.trim().length < 2) {
    resetState(firstName);
  } else {
    setValid(firstName);
  }
});

// LAST NAME
lastName.addEventListener("input", () => {
  if (lastName.value.trim().length < 2) {
    resetState(lastName);
  } else {
    setValid(lastName);
  }
});

// EMAIL
email.addEventListener("input", () => {
  if (email.value === "") {
    resetState(email);
  } else if (emailRegex.test(email.value)) {
    setValid(email);
  } else {
    setInvalid(email);
  }
});

// PASSWORD
password.addEventListener("input", () => {
  if (password.value === "") {
    resetState(password);
  } else if (passwordRegex.test(password.value)) {
    setValid(password);
  } else {
    setInvalid(password);
  }
});

// CONFIRM PASSWORD
confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value === "") {
    resetState(confirmPassword);
  } else if (confirmPassword.value === password.value) {
    setValid(confirmPassword);
  } else {
    setInvalid(confirmPassword);
  }
});

// Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  if (firstName.value.trim().length < 2) {
    setInvalid(firstName);
    isValid = false;
  }

  if (lastName.value.trim().length < 2) {
    setInvalid(lastName);
    isValid = false;
  }

  if (!emailRegex.test(email.value)) {
    setInvalid(email);
    isValid = false;
  }

  if (!passwordRegex.test(password.value)) {
    setInvalid(password);
    isValid = false;
  }

  if (confirmPassword.value !== password.value) {
    setInvalid(confirmPassword);
    isValid = false;
  }

  if (!terms.checked) {
    terms.classList.add("is-invalid");
    isValid = false;
  } else {
    terms.classList.remove("is-invalid");
  }

  if (isValid) {
    alert("Registration Successful!");
    form.reset();
    document
      .querySelectorAll(".is-valid, .is-invalid")
      .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
  }
});

terms.addEventListener("change", () => {
  if (terms.checked) {
    terms.classList.remove("is-invalid");
  }
});
