const form = document.getElementById("shippingForm");

const firstName = document.getElementById("firstName");
const lastName  = document.getElementById("lastName");
const address   = document.getElementById("address");
const apt       = document.getElementById("apt");
const city      = document.getElementById("city");
const state     = document.getElementById("state");
const zip       = document.getElementById("zip");
const email     = document.getElementById("email");
const phone     = document.getElementById("phone");

const nameRegex   = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyNum     = /^[0-9]+$/;

function setValid(el) {
  el.classList.add("is-valid");
  el.classList.remove("is-invalid");
}

function setInvalid(el) {
  el.classList.add("is-invalid");
  el.classList.remove("is-valid");
}

function reset(el) {
  el.classList.remove("is-valid", "is-invalid");
}


// First Name
firstName.addEventListener("input", () => {
  if (firstName.value === "") reset(firstName);
  else if (nameRegex.test(firstName.value)) setValid(firstName);
  else setInvalid(firstName);
});

// Last Name
lastName.addEventListener("input", () => {
  if (lastName.value === "") reset(lastName);
  else if (nameRegex.test(lastName.value)) setValid(lastName);
  else setInvalid(lastName);
});

// Address
address.addEventListener("input", () => {
  if (address.value.trim() === "") setInvalid(address);
  else setValid(address);
});

// Apt
apt.addEventListener("input", () => {
  if (apt.value.trim() === "") setInvalid(apt);
  else setValid(apt);
});

// City
city.addEventListener("input", () => {
  if (city.value === "") reset(city);
  else if (nameRegex.test(city.value)) setValid(city);
  else setInvalid(city);
});

// State
state.addEventListener("change", () => {
  if (state.value === "") setInvalid(state);
  else setValid(state);
});

// ZIP 
zip.addEventListener("input", () => {
  if (zip.value === "") reset(zip);
  else if (!onlyNum.test(zip.value)) setInvalid(zip);
  else if (zip.value.length !== 6) setInvalid(zip);
  else setValid(zip);
});

// Email
email.addEventListener("input", () => {
  if (email.value === "") reset(email);
  else if (emailRegex.test(email.value)) setValid(email);
  else setInvalid(email);
});

// Phone
phone.addEventListener("input", () => {
  if (phone.value === "") reset(phone);
  else if (!onlyNum.test(phone.value)) setInvalid(phone);
  else if (phone.value.length !== 10) setInvalid(phone);
  else setValid(phone);
});

/* SUBMIT VALIDATION */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  if (!nameRegex.test(firstName.value)) { setInvalid(firstName); isValid = false; }
  if (!nameRegex.test(lastName.value))  { setInvalid(lastName);  isValid = false; }
  if (address.value.trim() === "")      { setInvalid(address);   isValid = false; }
  if (apt.value.trim() === "")          { setInvalid(apt);       isValid = false; }
  if (!nameRegex.test(city.value))      { setInvalid(city);      isValid = false; }
  if (state.value === "")               { setInvalid(state);     isValid = false; }
  if (!onlyNum.test(zip.value) || zip.value.length !== 6) {
    setInvalid(zip); isValid = false;
  }
  if (!emailRegex.test(email.value))    { setInvalid(email);     isValid = false; }
  if (!onlyNum.test(phone.value) || phone.value.length !== 10) {
    setInvalid(phone); isValid = false;
  }

  if (isValid) {
    alert("Form submitted successfully!");
    form.reset();
    document.querySelectorAll(".is-valid,.is-invalid")
      .forEach(el => el.classList.remove("is-valid","is-invalid"));
  }
});
