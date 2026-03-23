function calculateTax() {
  const form = document.getElementById("taxForm");

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const birthdate = document.getElementById("birthdate").value;
  const gender = document.getElementById("gender").value;
  const income = parseFloat(document.getElementById("income").value);
  const loan = parseFloat(document.getElementById("loan").value);
  const investment = parseFloat(document.getElementById("investment").value);

  let taxableAmount = income;
  let slab = "";
  let payableTax = 0;

  const loanExemption = Math.min(loan * 0.8, income * 0.2);

  const investmentExemption = Math.min(investment, 100000);

  taxableAmount -= loanExemption + investmentExemption;

  if (gender === "male") {
    if (income <= 240000) {
      slab = "No Tax";
    } else if (income <= 600000) {
      slab = "10%";
      payableTax = taxableAmount * 0.1;
    } else {
      slab = "20%";
      payableTax = taxableAmount * 0.2;
    }
  } else if (gender === "female") {
    if (income <= 260000) {
      slab = "No Tax";
    } else if (income <= 700000) {
      slab = "10%";
      payableTax = taxableAmount * 0.1;
    } else {
      slab = "20%";
      payableTax = taxableAmount * 0.2;
    }
  } else if (gender === "senior") {
    if (income <= 300000) {
      slab = "No Tax";
    } else if (income <= 700000) {
      slab = "10%";
      payableTax = taxableAmount * 0.1;
    } else {
      slab = "20%";
      payableTax = taxableAmount * 0.2;
    }
  }

  document.getElementById("out-name").textContent = name;
  document.getElementById("out-taxable").textContent = taxableAmount.toFixed(2);
  document.getElementById("out-tax").textContent = payableTax.toFixed(2);

  const output = document.getElementById("output");
  output.style.display = "block";

  if (slab === "No Tax") {
    output.classList.add("bg-success");
    output.classList.remove("bg-primary");
  } else {
    output.classList.add("bg-primary");
    output.classList.remove("bg-success");
  }
}

function resetForm() {
  const form = document.getElementById("taxForm");
  form.reset();
  form.classList.remove("was-validated");
  document.getElementById("output").style.display = "none";
}

function allowOnlyNumbers(id) {
  document.getElementById(id).addEventListener("keypress", function (e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });
}
allowOnlyNumbers("mobile");

function allowOnlyLetters(id) {
  document.getElementById(id).addEventListener("keypress", function (e) {
    if (!/[A-Za-z\s]/.test(e.key)) {
      e.preventDefault();
    }
  });
}
allowOnlyLetters("name");

document.addEventListener("input", function (e) {
  if (
    e.target.classList.contains("form-control") ||
    e.target.classList.contains("form-select")
  ) {
    if (e.target.checkValidity()) {
      e.target.classList.remove("is-invalid");
      e.target.classList.add("is-valid");
    } else {
      e.target.classList.remove("is-valid");
    }
  }
});
