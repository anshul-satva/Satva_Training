using System;
using System.Collections.Generic;
using System.Linq;
using EmployeeApp.Helpers;
using EmployeeApp.Models;

namespace EmployeeApp.Services
{
    public class EmployeeService : IEmployeeService
    {
        private List<Employee> _employees;

        public EmployeeService()
        {
            _employees = FileHelper.LoadEmployees();
        }

        public IReadOnlyList<Employee> GetAll() => _employees.AsReadOnly();

        public bool EmployeeIdExists(Guid id)
            => _employees.Any(e => e.EmployeeID == id);

        public bool EmailExists(string email)
            => _employees.Any(e =>
                e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

        public void AddEmployee(Employee employee)
        {
            try
            {
                if (EmployeeIdExists(employee.EmployeeID))
                    throw new Exception($"Employee with ID '{employee.EmployeeID}' already exists.");

                if (EmailExists(employee.Email))
                    throw new Exception($"Employee with Email '{employee.Email}' already exists.");

                employee.TotalExperience = CalculateExperience(employee.DateOfJoining);

                _employees.Add(employee);

                _employees = _employees
                    .OrderByDescending(e => e.MonthlySalary)
                    .ToList();

                FileHelper.SaveEmployees(_employees);
            }
            catch (Exception ex)
            {
                throw new Exception($"Add Employee failed: {ex.Message}");
            }
        }

        public bool DeleteEmployee(Guid employeeId)
        {
            try
            {
                Employee? employee = _employees
                    .FirstOrDefault(e => e.EmployeeID == employeeId);

                if (employee == null)
                    return false;

                _employees.Remove(employee);
                FileHelper.SaveEmployees(_employees);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Delete Employee failed: {ex.Message}");
            }
        }

        private static double CalculateExperience(DateTime joiningDate)
        {
            TimeSpan span = DateTime.Today - joiningDate.Date;
            return Math.Round(span.TotalDays / 365.25, 1);
        }
    }
}