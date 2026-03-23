using System;
using EmployeeApp.Helpers;
using EmployeeApp.Services;
using EmployeeApp.Models;

namespace EmployeeApp.UI
{
    public class ConsoleUI
    {
        private readonly IEmployeeService _service;
        public ConsoleUI(IEmployeeService service)
        {
            _service = service; 
        }

        public void Run()
        {
            Console.Clear();
            Console.WriteLine("====================================");
            Console.WriteLine("    EMPLOYEE MANAGEMENT SYSTEM      ");
            Console.WriteLine("====================================");

            while (true)
            {
                Console.WriteLine("\n  1. Add New Employee");
                Console.WriteLine("  2. Delete Employee");
                Console.WriteLine("  3. Exit");
                Console.Write("\n  Please select an option: ");

                string input = Console.ReadLine()?.Trim() ?? "";

                if (input == "1") AddEmployee();
                else if (input == "2") DeleteEmployee();
                else if (input == "3") { Console.WriteLine("\n  Program Terminated!"); return; }
                else ShowError("Invalid option. Please enter 1, 2, or 3.");
            }
        }

        private void AddEmployee()
        {
            Console.WriteLine("\n  -- ADD NEW EMPLOYEE --\n");

            var emp = new Employee();

            emp.EmployeeID = Guid.NewGuid();
            Console.WriteLine($"  Employee ID: {emp.EmployeeID}");

            // Name
            while (true)
            {
                Console.Write("  Please enter Name: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (string.IsNullOrEmpty(val))
                { ShowError("Name is required."); continue; }
                if (!ValidationHelper.IsValidLetter(val))
                { ShowError("Name must contain letters only."); continue; }
                emp.Name = val;
                break;
            }

            // Date of Birth
            while (true)
            {
                Console.Write("  Please enter Date of Birth (dd/MM/yyyy): ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!DateTime.TryParseExact(val, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime dob))
                { ShowError("Invalid date. Use format dd/MM/yyyy  e.g. 15/06/1995"); continue; }
                if (!ValidationHelper.IsNotFutureDate(dob))
                { ShowError("Date of Birth cannot be in the future."); continue; }
                if (!ValidationHelper.IsAdult(dob))
                { ShowError("Employee must be at least 18 years old."); continue; }
                emp.DOB = dob;
                break;
            }

            // Gender
            while (true)
            {
                Console.Write("  Please enter Gender (M / F): ");
                string val = Console.ReadLine()?.Trim().ToUpper() ?? "";
                if (val != "M" && val != "F")
                { ShowError("Please enter M for Male or F for Female."); continue; }
                emp.Gender = val;
                break;
            }

            // Designation
            while (true)
            {
                Console.Write("  Please enter Designation: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidLetter(val))
                { ShowError("Designation must contain letters only."); continue; }
                emp.Designation = val;
                break;
            }

            // City
            while (true)
            {
                Console.Write("  Please enter City: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidLetter(val))
                { ShowError("City must contain letters only."); continue; }
                emp.City = val;
                break;
            }

            // State
            while (true)
            {
                Console.Write("  Please enter State: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidLetter(val))
                { ShowError("State must contain letters only."); continue; }
                emp.State = val;
                break;
            }

            // Postcode
            while (true)
            {
                Console.Write("  Please enter Postcode: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidPostcode(val))
                { ShowError("Postcode must be 6 digits."); continue; }
                emp.Postcode = val;
                break;
            }

            // Phone
            while (true)
            {
                Console.Write("  Please enter Phone (10 digits): ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidPhone(val))
                { ShowError("Phone must be exactly 10 digits."); continue; }
                emp.Phone = val;
                break;
            }

            // Email
            while (true)
            {
                Console.Write("  Please enter Email: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!ValidationHelper.IsValidEmail(val))
                { ShowError("Please enter a valid email  e.g. anshul@gmail.com"); continue; }
                if (_service.EmailExists(val))
                { ShowError($"Email '{val}' is already registered."); continue; }
                emp.Email = val;
                break;
            }

            // Date of Joining
            while (true)
            {
                Console.Write("  Please enter Date of Joining (dd/MM/yyyy): ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!DateTime.TryParseExact(val, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime doj))
                { ShowError("Invalid date. Use format dd/MM/yyyy  e.g. 01/01/2020"); continue; }
                if (!ValidationHelper.IsNotFutureDate(doj))
                { ShowError("Date of Joining cannot be in the future."); continue; }
                if (doj < emp.DOB)
                { ShowError("Date of Joining cannot be before Date of Birth."); continue; }
                emp.DateOfJoining = doj;
                break;
            }

            // Department
            Console.WriteLine("\n  Select Department:");
            Console.WriteLine("    1. Sales       (Red)");
            Console.WriteLine("    2. Marketing   (Green)");
            Console.WriteLine("    3. Development (Black)");
            Console.WriteLine("    4. QA          (Blue)");
            Console.WriteLine("    5. HR          (Orange)");
            Console.WriteLine("    6. SEO         (Pink)");

            while (true)
            {
                Console.Write("  Enter number (1-6): ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (val == "1") { emp.Department = Department.Sales; break; }
                else if (val == "2") { emp.Department = Department.Marketing; break; }
                else if (val == "3") { emp.Department = Department.Development; break; }
                else if (val == "4") { emp.Department = Department.QA; break; }
                else if (val == "5") { emp.Department = Department.HR; break; }
                else if (val == "6") { emp.Department = Department.SEO; break; }
                else ShowError("Please enter a number from 1 to 6.");
            }

            // Monthly Salary
            while (true)
            {
                Console.Write("  Please enter Monthly Salary: ");
                string val = Console.ReadLine()?.Trim() ?? "";
                if (!decimal.TryParse(val, out decimal salary) || salary <= 0)
                { ShowError("Salary must be a number greater than 0."); continue; }
                emp.MonthlySalary = salary;
                break;
            }

            // Remarks
            Console.Write("  Please enter Remarks (optional - press Enter to skip): ");
            emp.Remarks = Console.ReadLine()?.Trim() ?? "";

            // Save
            _service.AddEmployee(emp);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"\n  Employee '{emp.Name}' added successfully!");
            Console.WriteLine($"  Department : {emp.Department} ({emp.Department.GetColor()})");
            Console.WriteLine($"  Experience : {emp.TotalExperience} year(s)");
            Console.ResetColor();
        }

        private void DeleteEmployee()
        {
            Console.WriteLine("\n  -- DELETE EMPLOYEE --\n");
            Console.Write("  Please provide the Employee ID which you want to delete: ");
            string val = Console.ReadLine()?.Trim() ?? "";
            if (!Guid.TryParse(val, out Guid id))
            {
                ShowError("Invalid ID. Please enter a valid GUID e.g. 3f2504e0-4f89-11d3-9a0c-0305e82c3301");
                return;
            }
            bool deleted = _service.DeleteEmployee(id);

            if (deleted)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"\n  Employee with ID {id} deleted successfully.");
                Console.ResetColor();
            }
            else
            {
                ShowError($"No employee found with ID {id}. Please check and try again.");
            }
        }

        private void ShowError(string message)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"  ERROR: {message}");
            Console.ResetColor();
        }
    }
}