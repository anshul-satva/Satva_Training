using QBSync.Domain.Entities;

namespace QBSync.Application.Interfaces.Repositories;

public interface ICompanyRepository
{
    Task<Company?> GetByRealmIdAsync(string realmId);
    Task<Company?> GetByUserAndRealmIdAsync(string userId, string realmId);
    Task<List<Company>> GetByUserIdAsync(string userId);
    Task CreateAsync(Company company);
    Task UpdateAsync(Company company);
    Task DisconnectAsync(string realmId, string userId);
}
