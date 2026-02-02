const reconciledKey = "reconciled";
const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

$(document).ready(() => {
  renderReconciled();
});

function showLoader() {
  $("#globalLoader").removeClass("d-none");
}

function hideLoader() {
  $("#globalLoader").addClass("d-none");
}


/* LOAD DATA */
function getReconciled() {
  const data = JSON.parse(localStorage.getItem(reconciledKey) || "[]");
  console.log("Reconciled data loaded from Storage:", data);
  return data;
}

/* RENDER */
/* RENDER RECONCILED - Updated for new data structure */
function renderReconciled() {
    const data = getReconciled();
    const container = $("#reconciledContainer");
    container.empty();
  
    if (!data.length) {
      container.html("<div class='text-muted p-3 text-center'>No reconciled transactions</div>");
      $("#unreconcileBtn").prop("disabled", true);
      return;
    }
  
    data.forEach(r => {
      container.append(`
        <div class="row mb-3 align-items-start border rounded p-2 bg-white shadow-sm" data-c1="${r.c1Id}">
          <div class="col-md-1 text-center pt-3">
            <input type="checkbox" class="unreconcile-check" style="transform: scale(1.3);">
          </div>
  
          <div class="col-md-4">
            <div class="tx-card border p-2 bg-light rounded">
              <div class="fw-bold text-capitalize">${r.transactionType} : ₹${r.amount}</div>
              <div class="text-muted small">${r.transactionDate}</div>
            </div>
          </div>
  
          <div class="col-md-7">
            <div class="d-flex flex-wrap gap-2">
              ${r.c2.map(c => `
                <div class="tx-card border p-2 bg-success text-white rounded shadow-sm" style="min-width: 160px;">
                  <div class="fw-bold text-capitalize">${c.transactionType} : ₹${c.amount}</div>
                  <div class="small" style="opacity: 0.9;">${c.transactionDate}</div>
                </div>`).join("")}
            </div>
          </div>
        </div>
      `);
    });
  }

/* ENABLE BUTTON */
$(document).on("change", ".unreconcile-check", function () {
  const anyChecked = $(".unreconcile-check:checked").length > 0;
  $("#unreconcileBtn").prop("disabled", !anyChecked);
});

/* UNRECONCILE LOGIC */
$("#unreconcileBtn").click(() => {
  const checkedC1Ids = [];

  // 1. Get all IDs marked for removal
  $(".unreconcile-check:checked").each(function () {
    const id = $(this).closest("[data-c1]").data("c1");
    checkedC1Ids.push(String(id)); 
  });

  if (!checkedC1Ids.length) return;

  // 2. Filter out the selected items from the reconciled list
  const reconciled = getReconciled();
  const updatedReconciled = reconciled.filter(r => !checkedC1Ids.includes(String(r.c1Id)));

  // 3. Update LocalStorage
  localStorage.setItem(reconciledKey, JSON.stringify(updatedReconciled));
  console.log("Updated Reconciled Storage after removal:", updatedReconciled);

  // 4. Redirect to main page (unreconciled items will reload from API and show up)
  window.location.href = "index.html"; 
});