using System;
using System.Collections.Generic;
using Task1_EmployeeManagement.Models;
using Task1_EmployeeManagement.Extensions;
using Task1_EmployeeManagement.Services;

namespace Task1_EmployeeManagement
{
    class Program
    {
        private static EmployeeService _service = null!;

        static void Main(string[] args)
        {
            Console.Title = "Secure Employee Management System";
            PrintBanner();

            try
            {
                _service = new EmployeeService();
            }
            catch (Exception ex)
            {
                PrintError($"Startup failed: {ex.Message}");
                Console.ReadKey();
                return;
            }

            bool running = true;
            while (running)
            {
                PrintMenu();
                string choice = Console.ReadLine()?.Trim() ?? "";
                Console.WriteLine();

                try
                {
                    switch (choice)
                    {
                        case "1": AddEmployeeFlow(); break;
                        case "2": ListEmployeesFlow(); break;
                        case "3": FindEmployeeFlow(); break;
                        case "4": running = false; break;
                        default:
                            PrintWarning("Invalid option. Please choose 1–4.");
                            break;
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    PrintError($"Range Error: {ex.Message}");
                }
                catch (ArgumentException ex)
                {
                    PrintError($"Validation Error: {ex.Message}");
                }
                catch (Exception ex)
                {
                    PrintError($"Unexpected Error: {ex.Message}");
                }

                if (running) { Console.WriteLine(); Console.Write("Press any key to continue: "); Console.ReadKey(); }
            }

            PrintSuccess("Terminated!");
        }

        // ──────────────────────────────────────────────────────────────────────
        // Flow methods
        // ──────────────────────────────────────────────────────────────────────

        static void AddEmployeeFlow()
        {
            PrintHeading("ADD NEW EMPLOYEE");

            // First Name - re-prompt until valid
            string firstName;
            while (true)
            {
                firstName = Prompt("First Name");
                if (string.IsNullOrWhiteSpace(firstName) ||
                    !System.Text.RegularExpressions.Regex.IsMatch(firstName, @"^[a-zA-Z\s\-']+$"))
                    PrintError("First name is required and must contain only letters. Please re-enter.");
                else break;
            }

            // Last Name - re-prompt until valid
            string lastName;
            while (true)
            {
                lastName = Prompt("Last Name");
                if (string.IsNullOrWhiteSpace(lastName) ||
                    !System.Text.RegularExpressions.Regex.IsMatch(lastName, @"^[a-zA-Z\s\-']+$"))
                    PrintError("Last name is required and must contain only letters. Please re-enter.");
                else break;
            }

            // Email - re-prompt until valid
            string email;
            while (true)
            {
                email = Prompt("Email");
                if (!email.IsValidEmail())
                    PrintError("Invalid email format (e.g. user@domain.com). Please re-enter.");
                else break;
            }

            // Phone - re-prompt until valid
            string phone;
            while (true)
            {
                phone = Prompt("Phone (10 digits, no spaces/dashes)");
                if (!phone.IsValidPhoneNumber())
                    PrintError("Phone must be exactly 10 digits. Please re-enter.");
                else break;
            }

            // Salary - re-prompt until valid
            decimal salary;
            while (true)
            {
                string salaryStr = Prompt("Salary (20000–100000)");
                if (!decimal.TryParse(salaryStr, out salary))
                    PrintError("Salary must be a valid number. Please re-enter.");
                else if (!salary.IsValidSalary())
                    PrintError("Salary must be between 20,000 and 1,00,000. Please re-enter.");
                else break;
            }

            // Password - re-prompt until valid
            string password;
            while (true)
            {
                password = PromptPassword("Password (min 6 chars)");
                if (!password.IsValidPassword())
                    PrintError("Password must be at least 6 characters. Please re-enter.");
                else break;
            }

            Employee emp = _service.AddEmployee(firstName, lastName, email, phone, salary, password);
            PrintSuccess($"Employee added successfully! ID: {emp.Id}");
        }

        static void ListEmployeesFlow()
        {
            PrintHeading("ALL EMPLOYEES");
            List<Employee> employees = _service.GetAllEmployees();

            if (employees.Count == 0)
            {
                PrintWarning("No employees found.");
                return;
            }

            foreach (var emp in employees)
                PrintEmployee(emp);
        }

        static void FindEmployeeFlow()
        {
            PrintHeading("FIND EMPLOYEE BY ID");

            // GUID - re-prompt until valid format
            Guid id;
            while (true)
            {
                string idStr = Prompt("Enter Employee ID (GUID)");
                if (!Guid.TryParse(idStr, out id))
                    PrintError("Invalid GUID format (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). Please re-enter.");
                else break;
            }

            Employee? emp = _service.GetEmployeeById(id);
            if (emp == null)
                PrintWarning("Employee not found.");
            else
                PrintEmployee(emp);
        }

        // ──────────────────────────────────────────────────────────────────────
        // UI helpers
        // ──────────────────────────────────────────────────────────────────────

        static void PrintBanner()
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("╔══════════════════════════════════════════════════╗");
            Console.WriteLine("║      SECURE EMPLOYEE MANAGEMENT SYSTEM           ║");
            Console.WriteLine("╚══════════════════════════════════════════════════╝");
            Console.ResetColor();
            Console.WriteLine();
        }

        static void PrintMenu()
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("\n");
            Console.WriteLine("┌─────────────────────────────┐");
            Console.WriteLine("│          MAIN MENU          │");
            Console.WriteLine("├─────────────────────────────┤");
            Console.WriteLine("│  1. Add New Employee        │");
            Console.WriteLine("│  2. List All Employees      │");
            Console.WriteLine("│  3. Find Employee by ID     │");
            Console.WriteLine("│  4. Exit                    │");
            Console.WriteLine("└─────────────────────────────┘");
            Console.ResetColor();
            Console.Write("Enter Choice: ");
        }

        static void PrintHeading(string title)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"\n═══ {title} ═══");
            Console.ResetColor();
        }

        static void PrintEmployee(Employee emp)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"\n  ID         : {emp.Id}");
            Console.ResetColor();
            Console.WriteLine($"  Name       : {emp.FirstName} {emp.LastName}");
            Console.WriteLine($"  Email      : {emp.Email}");
            Console.WriteLine($"  Phone      : {emp.PhoneNumber}");
            Console.WriteLine($"  Salary     : ₹{emp.Salary:N2}");
            Console.WriteLine($"  Password   : {emp.DecryptedPassword ?? "(encrypted)"}");
            Console.WriteLine(new string('─', 60));
        }

        static string Prompt(string label)
        {
            Console.Write($"  {label}: ");
            return Console.ReadLine()?.Trim() ?? "";
        }

        static string PromptPassword(string label)
        {
            Console.Write($"  {label}: ");
            string password = "";
            ConsoleKeyInfo key;
            do
            {
                key = Console.ReadKey(true);
                if (key.Key != ConsoleKey.Backspace && key.Key != ConsoleKey.Enter)
                {
                    password += key.KeyChar;
                    Console.Write("*");
                }
                else if (key.Key == ConsoleKey.Backspace && password.Length > 0)
                {
                    password = password[..^1];
                    Console.Write("\b \b");
                }
            } while (key.Key != ConsoleKey.Enter);
            Console.WriteLine();
            return password;
        }

        static void PrintSuccess(string msg) { Console.ForegroundColor = ConsoleColor.Green; Console.WriteLine($"  ✔ {msg}"); Console.ResetColor(); }
        static void PrintError(string msg) { Console.ForegroundColor = ConsoleColor.Red; Console.WriteLine($"  ✖ {msg}"); Console.ResetColor(); }
        static void PrintWarning(string msg) { Console.ForegroundColor = ConsoleColor.Yellow; Console.WriteLine($"  ⚠ {msg}"); Console.ResetColor(); }
    }
}