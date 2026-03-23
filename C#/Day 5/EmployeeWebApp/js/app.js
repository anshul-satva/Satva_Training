var allEmployees = [];
var filteredData = [];
var currentPage  = 1;
var pageSize     = 10;
var sortCol      = "";
var sortDir      = "asc";

function formatDate(dateStr) {
    if (!dateStr) return "-";
    var months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
    var d = new Date(dateStr);
    if (isNaN(d)) return "-";
    var day = String(d.getDate()).padStart(2, "0");
    return day + "-" + months[d.getMonth()] + "-" + d.getFullYear();
}

function deptColor(dept) {
    return '<span class="dept-' + dept + '">' + dept + "</span>";
}

function loadEmployees() {
    var today = new Date();
    var dd    = String(today.getDate()).padStart(2, "0");
    var mm    = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy  = today.getFullYear();
    var file  = "EmployeeData_" + dd + mm + yyyy + ".json";

    $.ajax({
        url: file,
        method: "GET",
        dataType: "json",
        success: function(data) {
            allEmployees = data;
            $("#totalCount").text(data.length + " Employees");
            applyFilters();
        },
        error: function() {
            $("#tableBody").html(
                '<div class="text-center py-5 text-danger">' +
                '<i class="bi bi-exclamation-triangle fs-1"></i>' +
                '<p class="mt-2">Could not load <b>' + file + '</b>.<br>Make sure the JSON file is in the same folder as index.html and run with Live Server.</p>' +
                "</div>"
            );
        }
    });
}

function applyFilters() {
    var q = $("#searchInput").val().toLowerCase().trim();

    filteredData = allEmployees.filter(function(e) {
        if (!q) return true;
        return e.Name.toLowerCase().indexOf(q)       >= 0 ||
               e.Email.toLowerCase().indexOf(q)      >= 0 ||
               e.Department.toLowerCase().indexOf(q) >= 0 ||
               e.Phone.indexOf(q)                    >= 0;
    });

    if (sortCol) {
        filteredData.sort(function(a, b) {
            var va = a[sortCol].toString().toLowerCase();
            var vb = b[sortCol].toString().toLowerCase();
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ?  1 : -1;
            return 0;
        });
    }

    currentPage = 1;
    renderTable();
}

function setSort(col) {
    sortDir = (sortCol === col && sortDir === "asc") ? "desc" : "asc";
    sortCol = col;
    applyFilters();
}

function sortIcon(col) {
    if (sortCol !== col) return " &#8645;";
    return sortDir === "asc" ? " &#8593;" : " &#8595;";
}

function renderTable() {
    if (filteredData.length === 0) {
        $("#tableBody").html(
            '<div class="text-center py-5 text-muted">' +
            '<i class="bi bi-inbox fs-1 d-block mb-2"></i>No employees found.</div>'
        );
        $("#paginationWrap").hide();
        return;
    }

    var start = (currentPage - 1) * pageSize;
    var page  = filteredData.slice(start, start + pageSize);
    var rows  = "";

    for (var i = 0; i < page.length; i++) {
        var e   = page[i];
        var num = start + i + 1;

        rows += "<tr>"
            + "<td>" + num + "</td>"
            + "<td><strong>" + e.Name + "</strong></td>"
            + "<td>" + deptColor(e.Department) + "</td>"
            + '<td><a href="mailto:' + e.Email + '">' + e.Email + "</a></td>"
            + '<td><a href="tel:'    + e.Phone + '">' + e.Phone + "</a></td>"
            + '<td class="text-center">' + e.Gender + "</td>"
            + '<td class="text-center">'
            + '<button class="btn btn-dark btn-sm" onclick="openModal(\'' + e.EmployeeID + '\')">'
            + '<i class="bi bi-eye"></i></button>'
            + "</td>"
            + "</tr>";
    }

    var table =
        '<table class="table table-bordered table-hover align-middle mb-0 ">'
        + '<thead class="table-light">'
        + "<tr>"
        + "<th>Sr.No</th>"
        + '<th onclick="setSort(\'Name\')"       style="cursor:pointer ">Name'       + sortIcon("Name")       + "</th>"
        + '<th onclick="setSort(\'Department\')" style="cursor:pointer">Department' + sortIcon("Department") + "</th>"
        + '<th onclick="setSort(\'Email\')"      style="cursor:pointer">Email'      + sortIcon("Email")      + "</th>"
        + "<th>Phone Number</th>"
        + "<th>Gender</th>"
        + '<th class="text-center">View Detail</th>'
        + "</tr>"
        + "</thead>"
        + "<tbody>" + rows + "</tbody>"
        + "</table>";

    $("#tableBody").html(table);
    renderPagination();
}

function renderPagination() {
    var total      = filteredData.length;
    var totalPages = Math.ceil(total / pageSize);
    var start      = (currentPage - 1) * pageSize + 1;
    var end        = Math.min(currentPage * pageSize, total);

    $("#pageInfo").text("Showing " + start + " to " + end + " of " + total + " employees");
    $("#paginationWrap").show();

    var items = "";

    items += '<li class="page-item ' + (currentPage === 1 ? "disabled" : "") + '">'
           + '<a class="page-link" href="#" onclick="goPage(' + (currentPage - 1) + ');return false;">« Prev</a></li>';

    var pages = getPageRange(currentPage, totalPages);
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] === "...") {
            items += '<li class="page-item disabled"><a class="page-link">...</a></li>';
        } else {
            items += '<li class="page-item ' + (pages[i] === currentPage ? "active" : "") + '">'
                   + '<a class="page-link" href="#" onclick="goPage(' + pages[i] + ');return false;">' + pages[i] + "</a></li>";
        }
    }

    items += '<li class="page-item ' + (currentPage === totalPages ? "disabled" : "") + '">'
           + '<a class="page-link" href="#" onclick="goPage(' + (currentPage + 1) + ');return false;">Next »</a></li>';

    $("#pageBtns").html(items);
}

function getPageRange(current, total) {
    if (total <= 8) {
        var p = [];
        for (var i = 1; i <= total; i++) p.push(i);
        return p;
    }
    var pages = [];
    for (var i = 1; i <= 7; i++) pages.push(i);
    pages.push("...");
    pages.push(total);
    return pages;
}

function goPage(p) {
    var totalPages = Math.ceil(filteredData.length / pageSize);
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    renderTable();
}

function openModal(id) {
    var e = null;
    for (var i = 0; i < allEmployees.length; i++) {
        if (allEmployees[i].EmployeeID === id) { e = allEmployees[i]; break; }
    }
    if (!e) return;

    var body =
        "<p><b>Employee ID :</b> " + e.EmployeeID + "</p>" +
        "<p><b>Name :</b> "          + e.Name        + "</p>"
      + "<p><b>Email :</b> "         + e.Email       + "</p>"
      + "<p><b>DOB :</b> "           + formatDate(e.DOB) + "</p>"
      + "<p><b>Gender :</b> "        + (e.Gender === "F" ? "Female" : "Male") + "</p>"
      + "<p><b>Designation :</b> "   + e.Designation + "</p>"
      + "<p><b>State :</b> "         + e.State
            + " &nbsp; <b>City :</b> "     + e.City
            + " &nbsp; <b>Postcode :</b> " + e.Postcode + "</p>"
      + "<p><b>Phone :</b> "         + e.Phone
            + " &nbsp; <b>Department :</b> "     + e.Department
            + " &nbsp; <b>Monthly Salary :</b> " + e.MonthlySalary + "</p>"
      + "<p><b>Date Of Joining :</b> " + formatDate(e.DateOfJoining)
            + " &nbsp; <b>Total Experience :</b> " + e.TotalExperience + " year(s)</p>"
      + (e.Remarks ? "<p><b>Remark :</b> " + e.Remarks + "</p>" : "");

    $("#modalBody").html(body);
    new bootstrap.Modal(document.getElementById("empModal")).show();
}

$(document).ready(function() {
    loadEmployees();

    $("#searchInput").on("input", function() {
        applyFilters();
    });
});