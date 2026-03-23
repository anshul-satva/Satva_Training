let excelData = [];
let tableData = [];

const excelBody = document.getElementById("excelBody");
const tableWrapper = document.getElementById("tableWrapper");

/* INITIAL ROW */
addExcelRow();

/* ADD EXCEL ROW */
function addExcelRow() {
  const row = document.createElement("tr");
  row.dataset.saved = "false";

  row.innerHTML = `
    <td class="text-center"></td>

    <td>
      <select class="form-select form-select-sm">
        <option value="">Select</option>
        <option>JavaScript Project</option>
        <option>React Project</option>
      </select>
    </td>

    <td><input type="date" class="form-control form-control-sm"></td>

    <td>
      <select class="form-select form-select-sm">
        <option value="">Select</option>
        <option>Analysis</option>
        <option>Communication</option>
        <option>Development</option>
      </select>
    </td>

    <td>
      <select class="form-select form-select-sm">
        <option value="">Select</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>
    </td>

    <td><input type="time" placeholder="H:MM" class="form-control form-control-sm logged"></td>
    <td><input type="time" placeholder="H:MM" class="form-control form-control-sm billable"></td>
    
    <td><input type="text" class="form-control form-control-sm"></td>
    <td class="text-center"><input type="checkbox" class="form-check-input"></td>
    <td><input type="url" class="form-control form-control-sm"></td>
    <td><input type="text" class="form-control form-control-sm"></td>
  `;

  excelBody.appendChild(row);
  renumberRows();

  const l = row.querySelector(".logged");
  const b = row.querySelector(".billable");

  row.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", () => {
      if (b.value > l.value && l.value) b.value = l.value;
      tryAddEntry(row);
    });
  });
}

/* VALIDATION */
function isRowValid(v) {
  return (
    v.project &&
    v.date &&
    v.phase &&
    v.status &&
    v.logged &&
    v.billable &&
    v.billable <= v.logged &&
    v.notes.length > 0 &&
    v.bcLink.startsWith("http") &&
    v.bcDesc.length >= 3
  );
}

/* TRY ADD ENTRY */
function tryAddEntry(row) {
  const cells = row.querySelectorAll("td");

  const data = {
    project: cells[1].querySelector("select").value,
    date: cells[2].querySelector("input").value,
    phase: cells[3].querySelector("select").value,
    status: cells[4].querySelector("select").value,
    logged: cells[5].querySelector("input").value,
    billable: cells[6].querySelector("input").value,
    notes: cells[7].querySelector("input").value.trim(),
    out: cells[8].querySelector("input").checked,
    bcLink: cells[9].querySelector("input").value,
    bcDesc: cells[10].querySelector("input").value.trim(),
  };

  if (!isRowValid(data)) return;

  if (row.dataset.saved === "true") {
    const index = Number(row.dataset.index);
    excelData[index] = data;
    tableData[index] = data;
  } else {
    excelData.push(data);
    tableData.push(data);
    row.dataset.saved = "true";
    row.dataset.index = excelData.length - 1;
    addExcelRow();
  }

  renderTable();
}

/* RENDER TABLE */
function renderTable() {
  if (!tableData.length) {
    tableWrapper.innerHTML = "";
    return;
  }

  let html = `
    <div class="table-responsive mt-4">
      <table class="table table-dark table-bordered table-sm">
        <thead>
          <tr>
            <th>#</th><th>Project</th><th>Date</th><th>Phase</th>
            <th>Status</th><th>Logged</th><th>Billable</th>
            <th>Notes</th><th>Out</th><th>BC Link</th><th>BC Desc</th>
          </tr>
        </thead>
        <tbody>
  `;

  tableData.forEach((d, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${d.project}</td>
        <td>${d.date}</td>
        <td>${d.phase}</td>
        <td>${d.status}</td>
        <td>${d.logged}</td>
        <td>${d.billable}</td>
        <td>${d.notes}</td>
        <td>${d.out}</td>
        <td>${d.bcLink}</td>
        <td>${d.bcDesc}</td>
      </tr>`;
  });

  html += "</tbody></table></div>";
  tableWrapper.innerHTML = html;
}

/* DELETE LAST ROW */
document.getElementById("deleteRow").onclick = () => {
  const rows = [...excelBody.querySelectorAll("tr")];
  if (!rows.length) return;

  const emptyRow = [...rows].reverse().find((r) => r.dataset.saved === "false");
  if (emptyRow) {
    emptyRow.remove();
    renumberRows();
    return;
  }

  const filledRow = [...rows].reverse().find((r) => r.dataset.saved === "true");
  if (!filledRow) return;

  const index = Number(filledRow.dataset.index);
  filledRow.remove();

  excelData.splice(index, 1);
  tableData.splice(index, 1);

  renderTable();
  renumberRows();
};

/* ADD EMPTY ROWS */
document.getElementById("addRow").onclick = () => {
  const count = Number(rowCount.value);
  if (!count) return;
  for (let i = 0; i < count; i++) addExcelRow();
};

/* RENUMBER */
function renumberRows() {
  [...excelBody.children].forEach((row, i) => {
    row.children[0].textContent = i + 1;
    if (row.dataset.saved === "true") row.dataset.index = i;
  });
}

/* SESSION STORAGE */
function saveToSession() {
  sessionStorage.setItem("excelData", JSON.stringify(excelData));
  sessionStorage.setItem("tableData", JSON.stringify(tableData));
}

function loadFromSession() {
  const eData = sessionStorage.getItem("excelData");
  const tData = sessionStorage.getItem("tableData");

  if (!eData || !tData) return;

  excelData = JSON.parse(eData);
  tableData = JSON.parse(tData);

  excelBody.innerHTML = "";

  excelData.forEach((d, i) => {
    addExcelRow();
    const row = excelBody.lastElementChild;
    row.dataset.saved = "true";
    row.dataset.index = i;

    const cells = row.querySelectorAll("td");

    cells[1].querySelector("select").value = d.project;
    cells[2].querySelector("input").value = d.date;
    cells[3].querySelector("select").value = d.phase;
    cells[4].querySelector("select").value = d.status;
    cells[5].querySelector("input").value = d.logged;
    cells[6].querySelector("input").value = d.billable;
    cells[7].querySelector("input").value = d.notes;
    cells[8].querySelector("input").checked = d.out;
    cells[9].querySelector("input").value = d.bcLink;
    cells[10].querySelector("input").value = d.bcDesc;
  });

  addExcelRow(); // empty row at end
  renderTable();
  renumberRows();
}
