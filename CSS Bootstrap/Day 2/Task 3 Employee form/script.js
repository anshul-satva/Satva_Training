const form = document.getElementById("employeeForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const gender = document.getElementById("gender");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const skills = document.querySelectorAll("input[name='skills']");
const photo = document.getElementById("photo");
const fileText = document.getElementById("fileText");
const browseBtn = document.getElementById("browseBtn");
const address = document.getElementById("address");
const terms = document.getElementById("terms");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^\d{10}$/;

/* COMMON VALIDATION */
function setValid(el) {
  el.classList.add("is-valid");
  el.classList.remove("is-invalid");
}

function setInvalid(el) {
  el.classList.add("is-invalid");
  el.classList.remove("is-valid");
}

/* LIVE VALIDATION */
firstName.addEventListener("input", () =>
  firstName.value.trim() ? setValid(firstName) : setInvalid(firstName)
);

lastName.addEventListener("input", () =>
  lastName.value.trim() ? setValid(lastName) : setInvalid(lastName)
);

email.addEventListener("input", () =>
  emailRegex.test(email.value) ? setValid(email) : setInvalid(email)
);

mobile.addEventListener("input", () =>
  mobileRegex.test(mobile.value) ? setValid(mobile) : setInvalid(mobile)
);

gender.addEventListener("change", () =>
  gender.value ? setValid(gender) : setInvalid(gender)
);

address.addEventListener("input", () =>
  address.value.trim() ? setValid(address) : setInvalid(address)
);

/* FILE UPLOAD (IMAGE ONLY) */
browseBtn.addEventListener("click", () => photo.click());

photo.addEventListener("change", () => {
  const file = photo.files[0];

  // Reset state
  fileText.classList.remove("is-valid", "is-invalid");

  if (!file) {
    fileText.value = "";
    return;
  }

  // ❌ Not an image
  if (!file.type.startsWith("image/")) {
    fileText.value = "";
    photo.value = "";
    setInvalid(fileText);
    return;
  }

  // ✅ Valid image
  fileText.value = file.name;
  setValid(fileText);
});

/* TERMS */
terms.addEventListener("change", () =>
  terms.checked ? setValid(terms) : setInvalid(terms)
);

/* SUBMIT */
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  if (!firstName.value.trim()) {
    setInvalid(firstName);
    valid = false;
  }
  if (!lastName.value.trim()) {
    setInvalid(lastName);
    valid = false;
  }
  if (!emailRegex.test(email.value)) {
    setInvalid(email);
    valid = false;
  }
  if (!mobileRegex.test(mobile.value)) {
    setInvalid(mobile);
    valid = false;
  }
  if (!gender.value) {
    setInvalid(gender);
    valid = false;
  }
  if (!address.value.trim()) {
    setInvalid(address);
    valid = false;
  }

  // SKILLS
  const skillSelected = [...skills].some((s) => s.checked);
  if (!skillSelected) valid = false;

  // FILE
  if (photo.files.length === 0) {
    setInvalid(fileText);
    valid = false;
  }

  // TERMS
  if (!terms.checked) {
    setInvalid(terms);
    valid = false;
  }

  if (valid) {
    alert("Employee Registered Successfully!");
    resetAll();
  }
});

/* RESET */
const cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", resetAll);

function resetAll() {
  form.reset();
  document
    .querySelectorAll(".is-valid, .is-invalid")
    .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
  fileText.value = "";
}
