using EmployeeApi.Models;
using EmployeeApi.Services.Interfaces;

namespace EmployeeApi.Services
{
    public class UserService : IUserService
    {
        private List<User> users = new()
        {
            new User{ Id=1, Username="admin", Password="admin@123", Role="Admin"},
            new User{ Id=2, Username="Anshul", Password="anshul@123", Role="User"}
        };

        public User? Authenticate(string username, string password)
        {
            return users.FirstOrDefault(x =>
                x.Username == username && x.Password == password);
        }
    }
}