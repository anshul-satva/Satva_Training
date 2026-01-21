const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

email.addEventListener("input", () => {
  if (email.value === "") resetState(email);
  else if (emailRegex.test(email.value)) setValid(email);
  else setInvalid(email);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  if (!emailRegex.test(email.value)) {
    setInvalid(email);
    valid = false;
  }

  if (valid) {
    alert("Login Successful!");
    form.reset();
    document
      .querySelectorAll(".is-valid, .is-invalid")
      .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
  }
});

function togglePassword() {
  const eyeIcon = document.getElementById("eyeIcon");

  if (password.type === "password") {
    password.type = "text";
    eyeIcon.classList.remove("bi-eye");
    eyeIcon.classList.add("bi-eye-slash");
  } else {
    password.type = "password";
    eyeIcon.classList.remove("bi-eye-slash");
    eyeIcon.classList.add("bi-eye");
  }
}
