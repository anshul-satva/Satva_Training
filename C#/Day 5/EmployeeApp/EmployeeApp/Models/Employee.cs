using System;

namespace EmployeeApp.Models
{
    public class Employee
    {
        public Guid EmployeeID { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Gender { get; set; } = string.Empty;      
        public string Designation { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfJoining { get; set; }
        public double TotalExperience { get; set; }              
        public string Remarks { get; set; } = string.Empty;
        public Department Department { get; set; }
        public decimal MonthlySalary { get; set; }
    }
}