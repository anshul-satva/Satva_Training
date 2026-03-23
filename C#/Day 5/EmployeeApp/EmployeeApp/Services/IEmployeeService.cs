using EmployeeApp.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace EmployeeApp.Services
{
    public interface IEmployeeService
    {
        bool EmployeeIdExists(Guid id);
        bool EmailExists(string email);
        void AddEmployee(Employee employee);
        bool DeleteEmployee(Guid employeeId);
    }
}
