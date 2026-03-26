using QBSync.Domain.Entities;

namespace QBSync.Application.Interfaces.Repositories;

public interface ITokenRepository
{
    Task<QBToken?> GetActiveTokenAsync(string userId, string realmId);
    Task<QBToken?> GetByUserIdAsync(string userId);
    Task UpsertAsync(QBToken token);
    Task DeactivateAsync(string userId, string realmId);
}