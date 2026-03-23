using System;
using System.Collections.Generic;
using System.Linq;
using Task1_EmployeeManagement.Extensions;
using Task1_EmployeeManagement.Helpers;
using Task1_EmployeeManagement.Models;

namespace Task1_EmployeeManagement.Services
{
    public class EmployeeService
    {
        private List<Employee> _employees;
        private readonly string _filePath;
        private readonly string _encryptionKey;

        public EmployeeService()
        {
            _filePath = ConfigHelper.EmployeeFilePath;
            _encryptionKey = ConfigHelper.EncryptionKey;
            _employees = LoadFromFile();
        }

        // ──────────────────────────────────────────────────────────────────────
        // Public API
        // ──────────────────────────────────────────────────────────────────────

        /// <summary>Validates, encrypts password, and persists a new employee.</summary>
        public Employee AddEmployee(string firstName, string lastName, string email,
                                   string phoneNumber, decimal salary, string password)
        {
            ValidateFields(firstName, lastName, email, phoneNumber, salary, password);

            // Uniqueness check on email
            if (_employees.Any(e => e.Email.Equals(email, StringComparison.OrdinalIgnoreCase)))
                throw new ArgumentException($"An employee with email '{email}' already exists.");

            var employee = new Employee
            {
                FirstName     = firstName.Trim(),
                LastName      = lastName.Trim(),
                Email         = email.Trim().ToLowerInvariant(),
                PhoneNumber   = phoneNumber.Trim(),
                Salary        = salary,
                EncryptedPassword = EncryptionHelper.Encrypt(password, _encryptionKey)
            };

            _employees.Add(employee);
            SaveToFile();
            return employee;
        }

        /// <summary>Returns all employees with their passwords decrypted.</summary>
        public List<Employee> GetAllEmployees()
        {
            foreach (var emp in _employees)
            {
                try
                {
                    emp.DecryptedPassword = EncryptionHelper.Decrypt(emp.EncryptedPassword, _encryptionKey);
                }
                catch
                {
                    emp.DecryptedPassword = "[decryption error]";
                }
            }
            return _employees;
        }

        /// <summary>Retrieves a single employee by ID, with password decrypted.</summary>
        public Employee? GetEmployeeById(Guid id)
        {
            var emp = _employees.FirstOrDefault(e => e.Id == id);
            if (emp == null) return null;

            try { emp.DecryptedPassword = EncryptionHelper.Decrypt(emp.EncryptedPassword, _encryptionKey); }
            catch { emp.DecryptedPassword = "[decryption error]"; }
            return emp;
        }

        // ──────────────────────────────────────────────────────────────────────
        // Private helpers
        // ──────────────────────────────────────────────────────────────────────

        private static void ValidateFields(string firstName, string lastName, string email,
                                           string phoneNumber, decimal salary, string password)
        {
            if (!firstName.IsValidName())
                throw new ArgumentException("First name is required and must contain only letters.");

            if (!lastName.IsValidName())
                throw new ArgumentException("Last name is required and must contain only letters.");

            if (!email.IsValidEmail())
                throw new ArgumentException("Email address is invalid.");

            if (!phoneNumber.IsValidPhoneNumber())
                throw new ArgumentException("Phone number must be exactly 10 digits.");

            if (!salary.IsValidSalary())
                throw new ArgumentOutOfRangeException(nameof(salary),
                    "Salary must be between 20,000 and 1,00,000.");

            if (!password.IsValidPassword())
                throw new ArgumentException("Password must be at least 6 characters long.");
        }

        private List<Employee> LoadFromFile()
        {
            try
            {
                return JsonHelper.DeserializeFromJson<List<Employee>>(_filePath);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[WARNING] Could not load employee data: {ex.Message}");
                Console.ResetColor();
                return new List<Employee>();
            }
        }

        private void SaveToFile()
        {
            try
            {
                JsonHelper.SerializeToJson(_employees, _filePath);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[ERROR] Failed to save employee data: {ex.Message}");
                Console.ResetColor();
            }
        }
    }
}
