using EmployeeApi.Models;

namespace EmployeeApi.Services.Interfaces
{
    public interface IEmployeeService
    {
        List<Employee> GetAll();

        Employee Add(Employee emp);

        Employee? GetById(int id);

        void Put(Employee emp);
        void Patch(int id, Employee emp);

        void Delete(int id);
    }
}