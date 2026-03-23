using EmployeeApi.Models;

namespace EmployeeApi.Services.Interfaces
{
    public interface IUserService
    {
        User? Authenticate(string username, string password);
    }
}