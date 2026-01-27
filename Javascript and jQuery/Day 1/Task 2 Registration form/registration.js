let currentTab = 0;
showTab(currentTab);

function showTab(n) {
  const tabs = document.getElementsByClassName("tab");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  tabs[n].classList.add("active");

  if (n === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "inline-block";
  }

  if (n === tabs.length - 1) {
    nextBtn.innerHTML = "Submit";
  } else {
    nextBtn.innerHTML = "Next";
  }

  updateStepIndicator(n);
}

function changeTab(direction) {
  const tabs = document.getElementsByClassName("tab");

  if (direction === 1 && !validateTab()) {
    return false;
  }

  if (currentTab === tabs.length - 1 && direction === 1) {
    alert("Registration Submitted Successfully!");
    location.reload();
  }

  if (currentTab === tabs.length - 2 && direction === 1) {
    populateSummary();
  }

  currentTab = currentTab + direction;

  if (currentTab >= tabs.length) {
    currentTab = tabs.length - 1;
    return false;
  }
  if (currentTab < 0) {
    currentTab = 0;
    return false;
  }

  showTab(currentTab);
}

function validateTab() {
  const tabs = document.getElementsByClassName("tab");
  const currentTabElement = tabs[currentTab];
  const inputs = currentTabElement.querySelectorAll(".form-control");
  const selects = currentTabElement.querySelectorAll(".form-select");
  let valid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      valid = false;
      return;
    }

    if (input.pattern) {
      const regex = new RegExp(input.pattern);
      if (!regex.test(input.value)) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        valid = false;
        return;
      }
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  });

  selects.forEach((select) => {
    if (!select.value || select.value === "") {
      select.classList.add("is-invalid");
      select.classList.remove("is-valid");
      valid = false;
    } else {
      select.classList.remove("is-invalid");
      select.classList.add("is-valid");
    }
  });

  if (currentTab === 1) {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("confirmPassword").classList.add("is-invalid");
      document.getElementById("confirmPassword").classList.remove("is-valid");
      valid = false;
    }
  }
  return valid;
}

function updateStepIndicator(n) {
  const steps = document.getElementsByClassName("step");

  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.remove("active");
  }

  steps[n].classList.add("active");
}

function populateSummary() {
  // Personal Details
  document.getElementById("sum-fname").textContent =
    document.getElementById("fname").value;
  document.getElementById("sum-lname").textContent =
    document.getElementById("lname").value;
  document.getElementById("sum-gender").textContent =
    document.getElementById("gender").value;
  document.getElementById("sum-zipcode").textContent =
    document.getElementById("zipcode").value;

  // Profile Information
  document.getElementById("sum-email").textContent =
    document.getElementById("email").value;
  document.getElementById("sum-username").textContent =
    document.getElementById("username").value;
  document.getElementById("sum-password").textContent =
    document.getElementById("password").value;

  // Bank Information
  document.getElementById("sum-bankName").textContent =
    document.getElementById("bankName").value;
  document.getElementById("sum-branch").textContent =
    document.getElementById("branch").value;
  document.getElementById("sum-accountType").textContent =
    document.getElementById("accountType").value;
  document.getElementById("sum-accountNumber").textContent =
    document.getElementById("accountNumber").value;

  // Payment Information
  document.getElementById("sum-paymentType").textContent =
    document.getElementById("paymentType").value;
  document.getElementById("sum-holderName").textContent =
    document.getElementById("holderName").value;
  document.getElementById("sum-cardNumber").textContent =
    document.getElementById("cardNumber").value;
  document.getElementById("sum-cvv").textContent =
    document.getElementById("cvv").value;
  document.getElementById("sum-expiry").textContent =
    document.getElementById("expiry").value;
}

document.addEventListener("input", function (e) {
  if (
    e.target.classList.contains("form-control") ||
    e.target.classList.contains("form-select")
  ) {
    if (e.target.id === "confirmPassword") return;

    if (e.target.classList.contains("form-control")) {
      if (e.target.value.trim()) {
        if (e.target.pattern) {
          const regex = new RegExp(e.target.pattern);
          if (regex.test(e.target.value)) {
            e.target.classList.remove("is-invalid");
            e.target.classList.add("is-valid");
          } else {
            e.target.classList.add("is-invalid");
            e.target.classList.remove("is-valid");
          }
        } else {
          e.target.classList.remove("is-invalid");
          e.target.classList.add("is-valid");
        }
      } else {
        e.target.classList.remove("is-valid");
      }
    }

    if (e.target.classList.contains("form-select")) {
      if (e.target.value && e.target.value !== "") {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
      } else {
        e.target.classList.remove("is-valid");
      }
    }
  }
});

document
  .getElementById("confirmPassword")
  .addEventListener("input", function () {
    const password = document.getElementById("password").value;
    const confirmPassword = this.value;

    if (!confirmPassword) {
      this.classList.remove("is-valid", "is-invalid");
      return;
    }

    if (password === confirmPassword) {
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
    } else {
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
    }
  });

function allowOnlyNumbers(id) {
  document.getElementById(id).addEventListener("keypress", function (e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });
}

function allowOnlyLetters(id) {
  document.getElementById(id).addEventListener("keypress", function (e) {
    if (!/[A-Za-z\s]/.test(e.key)) {
      e.preventDefault();
    }
  });
}

allowOnlyNumbers("zipcode");
allowOnlyNumbers("cardNumber");
allowOnlyNumbers("cvv");
allowOnlyNumbers("accountNumber");

allowOnlyLetters("holderName");
allowOnlyLetters("username");
allowOnlyLetters("lname");
allowOnlyLetters("fname");
