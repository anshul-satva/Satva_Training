using EmployeeApi.Models;
using EmployeeApi.Services.Interfaces;

namespace EmployeeApi.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly List<Employee> employees = new List<Employee>();

        public List<Employee> GetAll()
        {
            return employees;
        }

        public Employee Add(Employee emp)
        {
            emp.Id = employees.Count + 1;
            employees.Add(emp);
            return emp;
        }

        public Employee? GetById(int id)
        {
            return employees.FirstOrDefault(x => x.Id == id);
        }

        public void Put(Employee emp)
        {
            var existing = employees.FirstOrDefault(x => x.Id == emp.Id);
            if (existing != null)
            {
                existing.Name = emp.Name;
                existing.JobTitle = emp.JobTitle;
                existing.Mobile = emp.Mobile;
                existing.ReportingManager = emp.ReportingManager;
                existing.JoiningDate = emp.JoiningDate;
            }
        }
        public void Patch(int id, Employee updatedFields)
        {
            var existing = employees.FirstOrDefault(e => e.Id == id);
            if (existing == null) return;

            if (!string.IsNullOrEmpty(updatedFields.Name))
                existing.Name = updatedFields.Name;

            if (!string.IsNullOrEmpty(updatedFields.JobTitle))
                existing.JobTitle = updatedFields.JobTitle;

            if (!string.IsNullOrEmpty(updatedFields.Mobile))
                existing.Mobile = updatedFields.Mobile;

            if (!string.IsNullOrEmpty(updatedFields.ReportingManager))
                existing.ReportingManager = updatedFields.ReportingManager;

            if (updatedFields.JoiningDate != default(DateTime))
                existing.JoiningDate = updatedFields.JoiningDate;
        }
        public void Delete(int id)
        {
            var emp = employees.FirstOrDefault(x => x.Id == id);
            if (emp != null)
                employees.Remove(emp);
        }
    }
}