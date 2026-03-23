# Employee Management System

A two-part application to manage employee records.
- **Task 1** — C# Console App to add/delete employee records, saved in a JSON file
- **Task 2** — Web App to display, search, sort, and paginate employees from that JSON file

---

## Project Structure

```
EmployeeApp/                        ← C# Console Application
├── Program.cs                      ← Entry point
├── app.config                      ← Stores JSON file save path
├── EmployeeApp.csproj              ← Project file (.NET 10)
├── Models/
│   ├── Employee.cs                 ← Employee model (14 fields)
│   └── Department.cs               ← Department enum with colors
├── Helpers/
│   ├── FileHelper.cs               ← JSON read/write, path from app.config
│   └── ValidationHelper.cs         ← All field validations
├── Services/
│   └── EmployeeService.cs          ← Add, Delete, Sort, Duplicate check
└── UI/
    └── ConsoleUI.cs                ← Menu, user input, output

EmpFinal/                           ← Web Application
├── index.html                      ← Bootstrap UI, table, modal
├── js/
│   └── app.js                      ← AJAX, search, sort, pagination, modal
└── EmployeeData_13032026.json      ← JSON data file (from console app)
```

---

## Task 1 — C# Console Application

### How to Run

1. Open `EmployeeApp.sln` in **Visual Studio 2022**
2. Open `app.config` and set your save folder path:
```xml
<add key="EmployeeDataPath" value="C:\EmployeeData" />
```
3. Press **F5** or **Ctrl+F5** to run

### Menu Options

```
1. Add New Employee
2. Delete Employee
3. Exit
```

### Field List

| Field | Type | Validation |
|---|---|---|
| EmployeeID | GUID | Auto-generated, unique |
| Name | string | Letters only, required |
| DOB | DateTime | Valid date, must be 18+ years old |
| Gender | string | M or F only |
| Designation | string | Letters only, required |
| City | string | Letters only, required |
| State | string | Letters only, required |
| Postcode | string | 4 to 10 digits |
| Phone | string | Exactly 10 digits |
| Email | string | Valid format, unique |
| Date of Joining | DateTime | Valid date, not future, not before DOB |
| Total Experience | double | Auto-calculated from Date of Joining |
| Remarks | string | Optional |
| Department | enum | Must pick from list (1–6) |
| Monthly Salary | decimal | Greater than 0 |

### Department Enum

| # | Department | Color |
|---|---|---|
| 1 | Sales | Red |
| 2 | Marketing | Green |
| 3 | Development | Black |
| 4 | QA | Blue |
| 5 | HR | Orange |
| 6 | SEO | Pink |

### Key Logic

- **Auto ID** — `EmployeeID` is a GUID, generated automatically with `Guid.NewGuid()`
- **Total Experience** — calculated automatically: `(Today - DateOfJoining) / 365.25`
- **No Duplicates** — duplicate Email is not allowed
- **Sort** — employees are sorted by Monthly Salary (highest first) before saving
- **File Name** — `EmployeeData_DDMMYYYY.json` e.g. `EmployeeData_13032026.json`
- **File Path** — read from `app.config` key `EmployeeDataPath`

### OOP Concepts Used

| Concept | Where |
|---|---|
| Class | Employee, EmployeeService, ConsoleUI, FileHelper |
| Encapsulation | Private fields, public methods only |
| Enum | Department |
| Extension Method | `GetColor()` on Department enum |
| Static Class | FileHelper, ValidationHelper |
| Exception Handling | try/catch in all methods |

---

## Task 2 — Web Application

### How to Run

1. Copy the JSON file from `C:\EmployeeData\` into the `EmpFinal\` folder
2. Open `EmpFinal\` folder in **VS Code**
3. Install the **Live Server** extension (if not already installed)
4. Right-click `index.html` → **Open with Live Server**

> ⚠️ Must use Live Server — AJAX does not work on `file://` directly

### Features

| Feature | Details |
|---|---|
| AJAX Load | Loads `EmployeeData_DDMMYYYY.json` automatically |
| Search | Filters by Name, Email, Department, Phone (live search) |
| Sort | Click column header — Name, Email, Department only |
| Pagination | 5 / 10 / 25 per page — configurable |
| Department Colors | Matches C# enum colors exactly |
| Date Format | Displayed as `04-Mar-2022` |
| Gender Display | Shows M or F |
| Eye Icon | Click to open full employee detail modal |

### Technologies Used

- HTML5
- Bootstrap 5.3
- Bootstrap Icons
- jQuery 3.7
- AJAX (via jQuery)
- Google Fonts — Mulish

---

## How Task 1 and Task 2 Connect

```
Console App  →  saves  →  EmployeeData_13032026.json  →  Web App reads it
```

The only connection between both apps is the **JSON file**.
Copy the JSON file into the web app folder every time new employees are added.

---

## Requirements

### Console App
- .NET 10
- Visual Studio 2022
- NuGet: `System.Configuration.ConfigurationManager`

### Web App
- VS Code
- Live Server extension
- Internet connection (for Bootstrap and jQuery CDN)

---

## Validation Rules

| Field | Rule |
|---|---|
| EmployeeID | Auto-generated GUID — no user input needed |
| Name | Required, letters/spaces/hyphens/apostrophes only |
| DOB | Valid date format dd/MM/yyyy, not future, age 18+ |
| Gender | M or F only |
| Designation | Required, letters only |
| City | Required, letters only |
| State | Required, letters only |
| Postcode | 4 to 10 digits |
| Phone | Exactly 10 digits, numbers only |
| Email | Valid format e.g. abc@gmail.com, no duplicates |
| Date of Joining | Valid date, not future, not before DOB |
| Monthly Salary | Positive number greater than 0 |
| Department | Must select 1–6 from list |
| Remarks | Optional — press Enter to skip |