const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

const EXCLUDED_KEY = "excluded";
const UNRECONCILED_KEY = "unreconciled";

function getExcluded() {
  return JSON.parse(localStorage.getItem(EXCLUDED_KEY)) || [];
}

function getUnreconciled() {
  return JSON.parse(localStorage.getItem(UNRECONCILED_KEY) || "[]");
}

function showLoader() {
  $("#globalLoader").removeClass("d-none");
}

function hideLoader() {
  $("#globalLoader").addClass("d-none");
}


$(document).ready(() => {
  renderExcluded();
});

/* RENDER */
function renderExcluded() {
  const data = getExcluded();
  const c1Container = $("#c1ExcludedColumn");
  const c2Container = $("#c2ExcludedColumn");
  
  c1Container.empty();
  c2Container.empty();

  if (!Array.isArray(data) || !data.length) {
    $("#excludedContainer").html("<div class='text-muted p-3 text-center'>No excluded transactions</div>");
    $("#includeBtn").prop("disabled", true);
    return;
  }
  
  // Separate data into two lists for the two columns
  data.forEach((item) => {
    // Check if it's a C1 item or a C2 item
    // Based on your storage logic, we extract the actual transaction objects
    if (item.c1) {
      c1Container.append(renderExcludeCard(item.c1, "Company1"));
      // If there were mapped C2s inside a C1 exclusion, list them in C2 column
      if (item.c2 && item.c2.length) {
        item.c2.forEach(c2tx => c2Container.append(renderExcludeCard(c2tx, "Company2")));
      }
    } else if (item.c2 && item.c2.length) {
      item.c2.forEach(c2tx => c2Container.append(renderExcludeCard(c2tx, "Company2")));
    }
  });
}

function renderExcludeCard(tx, company) {
  return `
    <div class="tx-card border p-2 mb-2 bg-success text-white rounded d-flex align-items-start gap-2" 
         data-id="${tx.transactionId}" data-company="${company}">
      <input type="checkbox" class="include-check" style="margin-top: 5px;">
      <div>
        <div class="fw-bold">${tx.transactionType || 'Transaction'}</div>
        <small class="d-block">ID: ${tx.transactionId}</small>
        <div class="fw-bold">₹${tx.amount}</div>
      </div>
    </div>
  `;
}

/* ENABLE INCLUDE BUTTON */
/* ENABLE INCLUDE BUTTON + SYNC SELECT-ALL BUTTONS */
$(document).on("change", ".include-check", function () {
  const anyChecked = $(".include-check:checked").length > 0;
  $("#includeBtn").prop("disabled", !anyChecked);

  // Sync Select All / Unselect All button per column
  ["Company1", "Company2"].forEach(company => {
    const all = $(`.tx-card[data-company="${company}"] .include-check`);
    const btn = $(`.select-all-btn[data-company="${company}"]`);

    if (!all.length) return;

    const isAllChecked = all.filter(":checked").length === all.length;
    btn.text(isAllChecked ? "Unselect All" : "Select All");
  });
});


/* INCLUDE LOGIC */
$("#includeBtn").click(() => {
  const excluded = getExcluded();
  const unreconciled = getUnreconciled();
  
  const selectedIds = [];
  $(".include-check:checked").each(function () {
    selectedIds.push(String($(this).closest(".tx-card").data("id")));
  });

  const toRestore = [];
  const remainingExcluded = [];

  excluded.forEach((entry) => {
    let keepEntry = true;

    // Logic to handle nested C1/C2 structure in your storage
    if (entry.c1 && selectedIds.includes(String(entry.c1.transactionId))) {
        toRestore.push(entry.c1);
        if(entry.c2) toRestore.push(...entry.c2); // Restore children too
        keepEntry = false;
    } else if (entry.c2) {
        // Filter out selected C2s from this entry
        const restoredC2 = entry.c2.filter(c => selectedIds.includes(String(c.transactionId)));
        const stayingC2 = entry.c2.filter(c => !selectedIds.includes(String(c.transactionId)));
        
        if (restoredC2.length > 0) {
            toRestore.push(...restoredC2);
            if (stayingC2.length === 0 && !entry.c1) {
                keepEntry = false;
            } else {
                entry.c2 = stayingC2;
            }
        }
    }

    if (keepEntry) remainingExcluded.push(entry);
  });

  const merged = [...unreconciled, ...toRestore];
  merged.sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));

  localStorage.setItem(EXCLUDED_KEY, JSON.stringify(remainingExcluded));
  localStorage.setItem(UNRECONCILED_KEY, JSON.stringify(merged));

  window.location.href = "index.html";
});

/* SELECT ALL / UNSELECT ALL PER COLUMN */
$(document).on("click", ".select-all-btn", function () {
  const company = $(this).data("company");
  const checkboxes = $(`.tx-card[data-company="${company}"] .include-check`);

  const allChecked = checkboxes.length &&
                     checkboxes.filter(":checked").length === checkboxes.length;

  // Toggle
  checkboxes.prop("checked", !allChecked);

  // Button text toggle
  $(this).text(allChecked ? "Select All" : "Unselect All");

  // Enable / disable include button
  $("#includeBtn").prop(
    "disabled",
    $(".include-check:checked").length === 0
  );
});
