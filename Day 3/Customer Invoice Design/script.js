function showSection(id, el) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document
    .querySelectorAll(".sidebar div")
    .forEach((d) => d.classList.remove("active"));
  el.classList.add("active");
}
function openCustomer() {
  addCustomer.style.display = "block";
}
function openInvoice() {
  addInvoice.style.display = "block";
}
function openDelete() {
  deletePopup.style.display = "block";
}
function closeAll() {
  addCustomer.style.display = "none";
  addInvoice.style.display = "none";
  deletePopup.style.display = "none";
}

function validateCustomerForm() {
  const name = document.getElementById("custName").value.trim();
  const company = document.getElementById("custCompany").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const mobile = document.getElementById("custMobile").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  if (name === "") {
    alert("Name is required");
    return;
  }
  if (company === "") {
    alert("Company name is required");
    return;
  }
  if (!emailRegex.test(email)) {
    alert("Enter valid email");
    return;
  }
  if (!mobileRegex.test(mobile)) {
    alert("Enter valid 10 digit mobile number");
    return;
  }
  if (address === "") {
    alert("Address is required");
    return;
  }

  alert("Customer saved (UI only)");
  closeAll();
}

function validateInvoiceForm() {
  const number = document.getElementById("invNumber").value.trim();
  const customer = document.getElementById("invCustomer").value;
  const date = document.getElementById("invDate").value;
  const due = document.getElementById("invDue").value;
  const rate = document.getElementById("invRate").value.trim();

  const numbRegex = /^[0-9]+$/;

  if (!numbRegex.test(number)) {
    alert("Enter a valid Invoice Number");
    return;
  }
  if (customer === "") {
    alert("Customer is required");
    return;
  }
  if (date === "") {
    alert("Invoice date is required");
    return;
  }
  if (due === "") {
    alert("Due date is required");
    return;
  }
  if (rate === "" || isNaN(rate)) {
    alert("Enter valid rate");
    return;
  }

  alert("Invoice saved (UI only)");
  closeAll();
}
