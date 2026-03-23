using StudentAPI.Models;

namespace StudentAPI.Services
{
    public interface IAuthService
    {
        string? GenerateToken(LoginRequest request);
    }
}