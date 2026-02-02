const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

let allData = [];
let c1ToC2Map = {};
let debit = 0;
let credit = 0;
let dragOrigin = null;

$(document).ajaxStart(function () {
  showLoader();
});

$(document).ajaxStop(function () {
  hideLoader();
});

function showLoader() {
  $("#globalLoader").removeClass("d-none");
}

function hideLoader() {
  $("#globalLoader").addClass("d-none");
}


$(document).ready(() => {
  fetchTransactions();
});

/* GET RECONCILED */
function getReconciledIds() {
  const reconciled = JSON.parse(localStorage.getItem("reconciled") || "[]");
  return reconciled.flatMap((r) => [
    String(r.c1Id),
    ...r.c2.map((x) => String(x.id)),
  ]);
}

/* FETCH TRANSACTIONS */
function fetchTransactions() {
  const currentToken = localStorage.getItem("token");
  if (!currentToken) {
    location.href = "login.html";
    return;
  }

  $.ajax({
    url: "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction",
    type: "GET",
    headers: { Authorization: "Bearer " + currentToken },
    success(res) {
      const reconciledIds = getReconciledIds();
      const excludedIds = (JSON.parse(localStorage.getItem("excluded")) || [])
        .flatMap((r) => (r.c1 ? [String(r.c1.transactionId)] : []))
        .concat(
          (JSON.parse(localStorage.getItem("excluded")) || []).flatMap(
            (r) => r.c2?.map((c2tx) => String(c2tx.transactionId)) || []
          )
        );
      console.log("API Transactions Response:", res);
      console.log("Mapped Unreconciled:", allData);
      console.log(
        "Excluded Storage:",
        JSON.parse(localStorage.getItem("excluded"))
      );

      allData = [
        ...res.fromCompanyTransaction.map((tx) => mapTx(tx, "Company1")),
        ...res.toCompanyTransaction.map((tx) => mapTx(tx, "Company2")),
      ].filter(
        (tx) =>
          !reconciledIds.includes(String(tx.transactionId)) &&
          !excludedIds.includes(String(tx.transactionId))
      );

      allData.sort(
        (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
      );
      localStorage.setItem("unreconciled", JSON.stringify(allData));

      renderUnreconciled();
      initDragDrop();
    },
    error(xhr) {
      if (xhr.status === 401) {
        alert("Session expired. Login again.");
        localStorage.removeItem("token");
        location.href = "login.html";
      }
      console.error(xhr.responseText);
    },
  });
}

/* MAP TX */
function mapTx(tx, company) {
  let d = 0,
    c = 0;
  tx.lines.forEach((l) => (l.isCredit ? (c += l.amount) : (d += l.amount)));
  return {
    transactionId: tx.transactionId,
    transactionType: tx.transactionType,
    transactionDate: tx.date,
    amount: Math.max(d, c),
    company,
    lines: tx.lines,
  };
}

/* RENDER UNRECONCILED */
function renderUnreconciled() {
  $("#reconciliation-container, #company2").empty();

  allData.forEach((tx) => {
    if (tx.company === "Company1") {
      $("#reconciliation-container").append(`
        <div class="row mb-3 shadow-sm p-2 bg-white rounded" data-c1="${
          tx.transactionId
        }">
          <div class="col-md-5">${renderTxCard(tx)}</div>
          <div class="col-md-7">
            <div class="drop-area border border-dashed p-4 rounded text-center text-muted" 
                 data-c1="${tx.transactionId}" style="min-height: 80px;"></div>
          </div>
        </div>
      `);
    } else {
      $("#company2").append(renderTxCard(tx, true));
    }
    $("#excludeBtn").prop("disabled", true);
  });
}

/* RENDER TX CARD */
function renderTxCard(tx, isC2 = false) {
  return `
    <div class="tx-card border p-2 ${
      isC2 ? "bg-success text-white" : "bg-light"
    }"
         data-id="${tx.transactionId}"
         data-company="${tx.company}"
         data-amount="${tx.amount}">
      <div class="d-flex align-items-center gap-2">
        <input type="checkbox" class="exclude-check">
        <div>
          <div class="fw-bold">${tx.transactionType} — ₹${tx.amount}</div>
          <small>${tx.transactionDate}</small>
        </div>
      </div>
    </div>
  `;
}

/* DRAG & DROP */
function initDragDrop() {
  const company2El = document.getElementById("company2");
  if (!company2El) return;

  new Sortable(company2El, {
    group: { name: "shared", put: true },
    sort: true,
    onStart(evt) {
      dragOrigin = { parent: evt.from, next: evt.item.nextSibling };
    },
  });

  $(".drop-area").each(function () {
    new Sortable(this, {
      group: { name: "shared", put: true },
      onAdd(evt) {
        const c1Id = $(evt.to).data("c1");
        const c1Amount = Number($(`[data-id="${c1Id}"]`).data("amount"));
        const currentSum = Array.from(evt.to.children).reduce(
          (acc, el) => acc + Number($(el).data("amount")),
          0
        );

        if (currentSum > c1Amount) {
          alert("Total C2 amount exceeds C1 amount!");
          dragOrigin.parent.insertBefore(evt.item, dragOrigin.next);
          return;
        }

        c1ToC2Map[c1Id] = Array.from(evt.to.children);
        updateTotals();
      },
      onRemove(evt) {
        const c1Id = $(evt.from).data("c1");
        c1ToC2Map[c1Id] = Array.from(evt.from.children);
        updateTotals();
      },
    });
  });
}

/* UPDATE TOTALS */
function updateTotals() {
  debit = 0;
  credit = 0;
  Object.keys(c1ToC2Map).forEach((c1Id) => {
    const c1Amt = Number($(`[data-id="${c1Id}"]`).data("amount"));
    const c2Sum = c1ToC2Map[c1Id].reduce(
      (s, e) => s + Number($(e).data("amount")),
      0
    );
    if (c2Sum > 0) {
      credit += c1Amt;
      debit += c2Sum;
    }
  });
  $("#debit").text(debit.toFixed(2));
  $("#credit").text(credit.toFixed(2));
  $("#reconcileBtn").prop("disabled", debit === 0 || debit !== credit);
}

/* SAVE RECONCILE */
/* SAVE RECONCILE - Updated to store full objects */
$("#reconcileBtn").click(() => {
    const existing = JSON.parse(localStorage.getItem("reconciled") || "[]");
  
    Object.keys(c1ToC2Map).forEach((c1Id) => {
      if (c1ToC2Map[c1Id].length > 0) {
        // Find the full Company 1 object from allData
        const c1Obj = allData.find(item => String(item.transactionId) === String(c1Id));
  
        if (c1Obj) {
          existing.push({
            c1Id: String(c1Id),
            transactionType: c1Obj.transactionType,
            transactionDate: c1Obj.transactionDate,
            amount: c1Obj.amount,
            // Map Company 2 items to include their full details
            c2: c1ToC2Map[c1Id].map((e) => {
              const c2Id = $(e).data("id");
              const c2Obj = allData.find(item => String(item.transactionId) === String(c2Id));
              return {
                id: String(c2Id),
                amount: c2Obj ? c2Obj.amount : 0,
                transactionType: c2Obj ? c2Obj.transactionType : "Transaction",
                transactionDate: c2Obj ? c2Obj.transactionDate : ""
              };
            }),
          });
        }
      }
    });
  
    localStorage.setItem("reconciled", JSON.stringify(existing));
    location.reload();
  });

/* LOGOUT */
$("#logoutBtn").click(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("unreconciled");
  window.location.href = "login.html";
});

/* ENABLE EXCLUDE BUTTON */
$(document).on("change", ".exclude-check", function () {
  $("#excludeBtn").prop("disabled", $(".exclude-check:checked").length === 0);
});

/* EXCLUDE LOGIC */
$("#excludeBtn").click(() => {
  let unreconciled = JSON.parse(localStorage.getItem("unreconciled") || "[]");
  let excluded = JSON.parse(localStorage.getItem("excluded") || "[]");

  const excludeC1Ids = new Set();
  const excludeC2Ids = new Set();

  // Collect selected IDs
  $(".exclude-check:checked").each(function () {
    const card = $(this).closest(".tx-card");
    const id = String(card.data("id"));
    const company = card.data("company");
    if (company === "Company1") excludeC1Ids.add(id);
    if (company === "Company2") excludeC2Ids.add(id);
  });

  if (!excludeC1Ids.size && !excludeC2Ids.size) return;

  const remaining = [];
  const newExcluded = [];

  unreconciled.forEach((tx) => {
    // C1 exclusion
    if (
      tx.company === "Company1" &&
      excludeC1Ids.has(String(tx.transactionId))
    ) {
      // include mapped C2 if any
      const mappedC2 = (c1ToC2Map[tx.transactionId] || [])
        .map((el) => {
          const c2Id = String($(el).data("id"));
          return unreconciled.find((u) => String(u.transactionId) === c2Id);
        })
        .filter(Boolean);

      newExcluded.push({ c1: tx, c2: mappedC2 });
      return; // skip adding to remaining
    }

    // C2-only exclusion
    if (
      tx.company === "Company2" &&
      excludeC2Ids.has(String(tx.transactionId))
    ) {
      newExcluded.push({ c1: null, c2: [tx] });
      return; // skip adding to remaining
    }

    // Keep in unreconciled
    remaining.push(tx);
  });

  // Merge existing excluded + newExcluded avoiding duplicates
  const excludedMap = {};

  [...excluded, ...newExcluded].forEach((e) => {
    if (e.c1?.transactionId) {
      excludedMap[`c1-${e.c1.transactionId}`] = e;
    } else if (e.c2 && e.c2.length) {
      e.c2.forEach((c2tx) => {
        excludedMap[`c2-${c2tx.transactionId}`] = { c1: null, c2: [c2tx] };
      });
    }
  });

  // Save back to LocalStorage
  localStorage.setItem("excluded", JSON.stringify(Object.values(excludedMap)));
  localStorage.setItem("unreconciled", JSON.stringify(remaining));

  location.reload();
});
