using QBSync.Domain.Entities;

namespace QBSync.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIntuitIdAsync(string intuitId);
    Task CreateAsync(User user);
    Task UpdateAsync(User user);
}