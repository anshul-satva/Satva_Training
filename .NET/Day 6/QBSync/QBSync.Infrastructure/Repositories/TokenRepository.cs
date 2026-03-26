using MongoDB.Driver;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;
using QBSync.Infrastructure.Data;

namespace QBSync.Infrastructure.Repositories;

public class TokenRepository : ITokenRepository
{
    private readonly MongoDbContext _context;

    public TokenRepository(MongoDbContext context) => _context = context;

    public async Task<QBToken?> GetActiveTokenAsync(string userId, string realmId) =>
        await _context.QBTokens
            .Find(t => t.UserId == userId && t.RealmId == realmId && t.IsActive)
            .FirstOrDefaultAsync();

    public async Task<QBToken?> GetByUserIdAsync(string userId) =>
        await _context.QBTokens
            .Find(t => t.UserId == userId && t.IsActive)
            .FirstOrDefaultAsync();

    public async Task UpsertAsync(QBToken token)
    {
        var existing = await GetActiveTokenAsync(token.UserId, token.RealmId);
        if (existing == null)
        {
            await _context.QBTokens.InsertOneAsync(token);
        }
        else
        {
            token.Id = existing.Id;
            await _context.QBTokens.ReplaceOneAsync(t => t.Id == existing.Id, token);
        }
    }

    public async Task DeactivateAsync(string userId, string realmId)
    {
        var update = Builders<QBToken>.Update
            .Set(t => t.IsActive, false)
            .Set(t => t.UpdatedAt, DateTime.UtcNow);
        await _context.QBTokens.UpdateManyAsync(
            t => t.UserId == userId && t.RealmId == realmId, update);
    }
}