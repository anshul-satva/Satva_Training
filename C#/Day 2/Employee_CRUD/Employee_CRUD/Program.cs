using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

class Program
{
    static EmployeeService _service;

    static void Main()
    {
        string storedPin = GetConfig("AppPin", "1234");
        string dataFile = GetConfig("DataFile", "employees.json");

        if (!AuthenticateUser(storedPin)) return;

        _service = new EmployeeService(dataFile);

        bool running = true;
        while (running)
        {
            ShowMenu();
            string choice = ConsoleHelper.Ask("Enter option");

            switch (choice)
            {
                case "1": AddEmployee(); break;
                case "2": ViewAll(); break;
                case "3": FindById(); break;
                case "4": FindByEmail(); break;
                case "5": UpdateEmployee(); break;
                case "6": DeleteEmployee(); break;
                case "0": running = false; break;
                default:
                    Console.WriteLine("Invalid option. Please enter 0-6.");
                    break;
            }
        }

        Console.WriteLine("\nThank you");
    }

    static string GetConfig(string key, string defaultValue = "")
    {
        try
        {
            string folder = AppDomain.CurrentDomain.BaseDirectory;
            string[] names =
                {
                   "Employee_CRUD.exe.config",
                   "Employee_CRUD.dll.config",
                   "App.config"
                };

            string configPath = null;
            foreach (string name in names)
            {
                string full = Path.Combine(folder, name);
                if (File.Exists(full)) { configPath = full; break; }
            }

            if (configPath == null) return defaultValue;

            XDocument doc = XDocument.Load(configPath);
            string value = doc.Descendants("add")
                                 .FirstOrDefault(x => (string)x.Attribute("key") == key)
                                 ?.Attribute("value")?.Value;
            return value ?? defaultValue;
        }
        catch { return defaultValue; }
    }

    static void ShowMenu()
    {
        Console.WriteLine("\nEmployee Dashboard Menu");
        Console.WriteLine("1. Add New Employee");
        Console.WriteLine("2. View All Employees");
        Console.WriteLine("3. Find Employee by ID");
        Console.WriteLine("4. Find Employee by Email");
        Console.WriteLine("5. Update Employee");
        Console.WriteLine("6. Delete Employee");
        Console.WriteLine("0. Exit");
    }

    static bool AuthenticateUser(string storedPin)
    {
        Console.WriteLine("Employee Dashboard - Login");
        Console.WriteLine("This application is PIN protected.");

        for (int attempt = 1; attempt <= 3; attempt++)
        {
            string entered = ConsoleHelper.AskPassword("Enter PIN");

            if (entered == storedPin)
            {
                Console.WriteLine("Access granted! Welcome.");
                return true;
            }

            int remaining = 3 - attempt;
            if (remaining > 0)
                Console.WriteLine($"Incorrect PIN. {remaining} attempt(s) remaining.");
            else
                Console.WriteLine("Too many failed attempts. Application locked.");
        }
        return false;
    }

    static Employee CollectInput(int excludeId = 0)
    {
        var emp = new Employee();

        emp.FirstName = ConsoleHelper.AskUntilValid(
            "First Name",
            v => v.IsNotEmpty(),
            "First Name cannot be empty."
        );

        emp.LastName = ConsoleHelper.AskUntilValid(
            "Last Name",
            v => v.IsNotEmpty(),
            "Last Name cannot be empty."
        );

        emp.Gender = ConsoleHelper.AskUntilValid(
            "Gender",
            v => v.IsValidGender(),
            "Invalid gender. Please enter again.",
            "Male | Female | Other"
        );

        emp.Email = ConsoleHelper.AskUntilValid(
            "Email Address",
            v =>
            {
                if (!v.IsValidEmail())
                {
                    Console.WriteLine("Error: Invalid email format. Please enter again.");
                    return false;
                }
                if (_service.EmailExists(v, excludeId))
                {
                    Console.WriteLine("Error: This email is already registered. Please enter another.");
                    return false;
                }
                return true;
            },
            ""
        );

        emp.Phone = ConsoleHelper.AskUntilValid(
            "Phone Number",
            v => v.IsValidPhone(),
            "Invalid phone. Max 10 digits/characters.",
            "Max 10 digits e.g. 9876543210"
        );

        emp.Designation = ConsoleHelper.AskUntilValid(
            "Designation",
            v => v.IsValidDesignation(),
            "Invalid designation. Please enter again.",
            "Developer | QA | BA | HR"
        );

        emp.Salary = ConsoleHelper.AskDecimalUntilValid(
            "Salary",
            v => v.IsValidSalary(),
            "Salary must be between 10,000 and 50,000.",
            "Range: 10000 - 50000"
        );

        return emp;
    }

    static void AddEmployee()
    {
        Console.WriteLine("\nAdd New Employee");
        Employee emp = CollectInput();
        var (success, message) = _service.Add(emp);
        Console.WriteLine(message);
    }

    static void ViewAll()
    {
        Console.WriteLine("\nAll Employees");
        List<Employee> all = _service.GetAll();

        if (all.Count == 0)
        {
            Console.WriteLine("No employees found. Add some first!");
            return;
        }

        Console.WriteLine($"Total records: {all.Count}");
        foreach (Employee e in all)
            ConsoleHelper.PrintEmployee(e);
    }

    static void FindById()
    {
        Console.WriteLine("\nFind Employee by ID");

        string input = ConsoleHelper.AskUntilValid(
            "Enter Employee ID",
            v =>
            {
                if (!int.TryParse(v, out int checkId))
                {
                    Console.WriteLine("Error: Invalid ID. Please enter a number.");
                    return false;
                }
                if (_service.GetById(checkId) == null)
                {
                    Console.WriteLine($"Error: No employee found with ID {checkId}. Try again.");
                    return false;
                }
                return true;
            },
            ""
        );

        int.TryParse(input, out int id);
        ConsoleHelper.PrintEmployee(_service.GetById(id));
    }

    static void FindByEmail()
    {
        Console.WriteLine("\nFind Employee by Email");

        string email = ConsoleHelper.AskUntilValid(
            "Enter Email Address",
            v =>
            {
                if (!v.IsNotEmpty())
                {
                    Console.WriteLine("Error: Email cannot be empty.");
                    return false;
                }
                if (_service.GetByEmail(v) == null)
                {
                    Console.WriteLine($"Error: No employee found with email: {v}. Try again.");
                    return false;
                }
                return true;
            },
            ""
        );

        ConsoleHelper.PrintEmployee(_service.GetByEmail(email));
    }

    static void UpdateEmployee()
    {
        Console.WriteLine("\nUpdate Employee");

        string input = ConsoleHelper.AskUntilValid(
            "Enter Employee ID to update",
            v =>
            {
                if (!int.TryParse(v, out int checkId))
                {
                    Console.WriteLine("Error: Invalid ID. Please enter a number.");
                    return false;
                }
                if (_service.GetById(checkId) == null)
                {
                    Console.WriteLine($"Error: No employee found with ID {checkId}. Try again.");
                    return false;
                }
                return true;
            },
            ""
        );

        int.TryParse(input, out int id);
        Employee existing = _service.GetById(id);

        Console.WriteLine($"\nUpdating: {existing.FullName}  (press Enter to keep current value)");
        ConsoleHelper.PrintEmployee(existing);
        Console.WriteLine();

        Employee updated = new Employee();

        updated.FirstName = ConsoleHelper.AskUpdateField(
            $"First Name [{existing.FirstName}]", existing.FirstName,
            v => v.IsNotEmpty(), "First Name cannot be empty."
        );

        updated.LastName = ConsoleHelper.AskUpdateField(
            $"Last Name [{existing.LastName}]", existing.LastName,
            v => v.IsNotEmpty(), "Last Name cannot be empty."
        );

        updated.Gender = ConsoleHelper.AskUpdateField(
            $"Gender [{existing.Gender}]", existing.Gender,
            v => v.IsValidGender(), "Invalid gender. Valid values: Male | Female | Other"
        );

        updated.Email = ConsoleHelper.AskUpdateFieldCustom(
            $"Email [{existing.Email}]", existing.Email,
            v =>
            {
                if (!v.IsValidEmail())
                {
                    Console.WriteLine("Error: Invalid email format.");
                    return false;
                }
                if (_service.EmailExists(v, excludeId: id))
                {
                    Console.WriteLine("Error: This email is already used by another employee.");
                    return false;
                }
                return true;
            }
        );

        updated.Phone = ConsoleHelper.AskUpdateField(
            $"Phone [{existing.Phone}]", existing.Phone,
            v => v.IsValidPhone(), "Invalid phone. Max 10 digits/characters."
        );

        updated.Designation = ConsoleHelper.AskUpdateField(
            $"Designation [{existing.Designation}]", existing.Designation,
            v => v.IsValidDesignation(), "Invalid designation. Valid values: Developer | QA"
        );

        updated.Salary = ConsoleHelper.AskUpdateDecimal(
            $"Salary [{existing.Salary}]", existing.Salary,
            v => v.IsValidSalary(), "Salary must be between 10,000 and 50,000."
        );

        var (success, message) = _service.Update(id, updated);
        Console.WriteLine(message);
    }

    static void DeleteEmployee()
    {
        Console.WriteLine("\nDelete Employee");

        string input = ConsoleHelper.AskUntilValid(
            "Enter Employee ID to delete",
            v =>
            {
                if (!int.TryParse(v, out int checkId))
                {
                    Console.WriteLine("Error: Invalid ID. Please enter a number.");
                    return false;
                }
                if (_service.GetById(checkId) == null)
                {
                    Console.WriteLine($"Error: No employee found with ID {checkId}. Try again.");
                    return false;
                }
                return true;
            },
            ""
        );

        int.TryParse(input, out int id);
        Employee emp = _service.GetById(id);

        ConsoleHelper.PrintEmployee(emp);

        string confirm = ConsoleHelper.AskUntilValid(
            $"Type YES to confirm delete '{emp.FullName}'",
            v => v.Equals("YES", StringComparison.OrdinalIgnoreCase) ||
                 v.Equals("NO", StringComparison.OrdinalIgnoreCase),
            "Please type YES or NO."
        );

        if (!confirm.Equals("YES", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("Delete cancelled.");
            return;
        }

        var (success, message) = _service.Delete(id);
        Console.WriteLine(message);
    }
}