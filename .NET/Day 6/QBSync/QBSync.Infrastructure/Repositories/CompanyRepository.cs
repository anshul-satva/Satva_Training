using MongoDB.Driver;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;
using QBSync.Infrastructure.Data;

namespace QBSync.Infrastructure.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly MongoDbContext _context;

    public CompanyRepository(MongoDbContext context) => _context = context;

    public async Task<Company?> GetByRealmIdAsync(string realmId) =>
        await _context.Companies.Find(c => c.RealmId == realmId).FirstOrDefaultAsync();

    public async Task<Company?> GetByUserAndRealmIdAsync(string userId, string realmId) =>
        await _context.Companies.Find(c => c.UserId == userId && c.RealmId == realmId).FirstOrDefaultAsync();

    public async Task<List<Company>> GetByUserIdAsync(string userId) =>
        await _context.Companies.Find(c => c.UserId == userId && c.IsConnected).ToListAsync();

    public async Task CreateAsync(Company company) =>
        await _context.Companies.InsertOneAsync(company);

    public async Task UpdateAsync(Company company) =>
        await _context.Companies.ReplaceOneAsync(c => c.Id == company.Id, company);

    public async Task DisconnectAsync(string realmId, string userId)
    {
        var update = Builders<Company>.Update
            .Set(c => c.IsConnected, false)
            .Set(c => c.DisconnectedAt, DateTime.UtcNow);
        await _context.Companies.UpdateOneAsync(
            c => c.RealmId == realmId && c.UserId == userId, update);
    }
}
