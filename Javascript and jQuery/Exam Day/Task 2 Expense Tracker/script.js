// Cookie Functions
function setCookie(name, value) {
  document.cookie = `${name}=${value};max-age=31536000;path=/`;
}

function getCookie(name) {
  const c = document.cookie.split("; ").find((r) => r.startsWith(name + "="));
  return c ? c.split("=")[1] : null;
}

// Initialize Settings
function initializeSettings() {
  let theme = getCookie("theme") || "system";

  if (theme === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  setCookie("theme", theme);
  applyTheme(theme);
}

// Apply Theme
function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
}

// Initialize on page load
initializeSettings();

// Settings Page Functions
function loadSettings() {
  const currency = getCookie("currency") || "₹";
  const theme = getCookie("theme") || "light";

  if (currency === "₹") {
    document.getElementById("rupee").checked = true;
  } else {
    document.getElementById("euro").checked = true;
  }

  if (theme === "light") {
    document.getElementById("lightMode").checked = true;
  } else {
    document.getElementById("darkMode").checked = true;
  }
}
function saveCurrency() {
  const currency = document.querySelector(
    'input[name="currency"]:checked'
  ).value;
  setCookie("currency", currency);
  alert("Currency preference saved!");
}

function saveTheme() {
  const theme = document.querySelector('input[name="theme"]:checked').value;
  setCookie("theme", theme);
  applyTheme(theme);
  alert("Theme preference saved!");
}

function clearPreferences() {
  setCookie("currency", "₹");
  setCookie("theme", "light");
  applyTheme("light");
  loadSettings();
  alert("Preferences cleared! Default settings restored.");
}
// Local Storage Functions
function getExpenses() {
  return JSON.parse(localStorage.getItem("expenses")) || [];
}
function saveExpensesToStorage(expenses) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
// Add Expense Page - Step Navigation
function goToStep1() {
  document.getElementById("step1").classList.remove("d-none");
  document.getElementById("step2").classList.add("d-none");
  document.getElementById("step1-tab").classList.add("active");
  document.getElementById("step2-tab").classList.remove("active");
}

function goToStep2() {
  const title = document.getElementById("expenseTitle").value;
  const amount = document.getElementById("amount").value;

  if (!title || !amount) {
    alert("Please fill all fields");
    return;
  }

  document.getElementById("step1").classList.add("d-none");
  document.getElementById("step2").classList.remove("d-none");
  document.getElementById("step1-tab").classList.remove("active");
  document.getElementById("step2-tab").classList.add("active");
}

function showConfirmModal() {
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const paymentMode = document.getElementById("paymentMode").value;

  if (!category || !date || !paymentMode) {
    alert("Please fill all fields");
    return;
  }

  const currency = getCookie("currency") || "₹";

  document.getElementById("confirmTitle").textContent =
    document.getElementById("expenseTitle").value;
  document.getElementById("confirmAmount").textContent =
    currency + document.getElementById("amount").value;
  document.getElementById("confirmType").textContent = document.querySelector(
    'input[name="expenseType"]:checked'
  ).value;
  document.getElementById("confirmCategory").textContent = category;
  document.getElementById("confirmDate").textContent = date;
  document.getElementById("confirmPayment").textContent = paymentMode;

  const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
  modal.show();
}
function saveExpense() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");

  const expense = {
    id: editId || Date.now().toString(),
    title: document.getElementById("expenseTitle").value,
    amount: parseFloat(document.getElementById("amount").value),
    type: document.querySelector('input[name="expenseType"]:checked').value,
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
    paymentMode: document.getElementById("paymentMode").value,
    currency: getCookie("currency") || "₹",
  };
  let expenses = getExpenses();

  if (editId) {
    const index = expenses.findIndex((e) => e.id === editId);
    if (index !== -1) {
      expenses[index] = expense;
    }
  } else {
    expenses.push(expense);
  }

  saveExpensesToStorage(expenses);

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("confirmModal")
  );
  modal.hide();

  alert(
    editId ? "Expense updated successfully!" : "Expense added successfully!"
  );
  window.location.href = "ViewExpense.html";
}
function loadExpenseForEdit(id) {
  const expenses = getExpenses();
  const expense = expenses.find((e) => e.id === id);

  if (expense) {
    document.getElementById("expenseTitle").value = expense.title;
    document.getElementById("amount").value = expense.amount;
    document.querySelector(
      `input[name="expenseType"][value="${expense.type}"]`
    ).checked = true;
    document.getElementById("category").value = expense.category;
    document.getElementById("date").value = expense.date;
    document.getElementById("paymentMode").value = expense.paymentMode;
  }
}
// View Expenses Page
function displayExpenses() {
  let expenses = getExpenses();
  const searchTerm =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const filterCat = document.getElementById("filterCategory")?.value || "";
  const sortBy = document.getElementById("sortBy")?.value || "date-desc";

  // Filter
  expenses = expenses.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm) ||
      e.category.toLowerCase().includes(searchTerm);
    const matchCategory = !filterCat || e.category === filterCat;
    return matchSearch && matchCategory;
  });

  // Sort
  expenses.sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
  });

  const tbody = document.getElementById("expenseTableBody");

  if (!expenses.length) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">No expenses added</td></tr>';
    return;
  }

  tbody.innerHTML = expenses
    .map(
      (e) => `
    <tr>
      <td>${e.title}</td>
      <td>${e.currency}${e.amount}</td>
      <td>${e.type}</td>
      <td>${e.category}</td>
      <td>${e.date}</td>
      <td>${e.paymentMode}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editExpense('${e.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense('${e.id}')">Delete</button>
      </td>
    </tr>
  `
    )
    .join("");
}

function editExpense(id) {
  window.location.href = `AddExpense.html?edit=${id}`;
}

function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;

  let expenses = getExpenses();
  expenses = expenses.filter((e) => e.id !== id);
  saveExpensesToStorage(expenses);
  displayExpenses();
  alert("Expense deleted successfully!");
}

// Dashboard Functions
function updateDashboard() {
  const expenses = getExpenses();
  const currency = getCookie("currency") || "₹";

  let totalIncome = 0;
  let totalExpense = 0;

  expenses.forEach((e) => {
    if (e.type === "Income") {
      totalIncome += e.amount;
    } else {
      totalExpense += e.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  document.getElementById("totalIncome").textContent =
    currency + totalIncome.toFixed(2);
  document.getElementById("totalExpenses").textContent =
    currency + totalExpense.toFixed(2);
  document.getElementById("balance").textContent =
    currency + balance.toFixed(2);
  document.getElementById("transactions").textContent = expenses.length;
}
