using MongoDB.Driver;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;
using QBSync.Infrastructure.Data;

namespace QBSync.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MongoDbContext _context;

    public UserRepository(MongoDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(string id) =>
        await _context.Users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<User?> GetByIntuitIdAsync(string intuitId) =>
        await _context.Users.Find(u => u.IntuitId == intuitId).FirstOrDefaultAsync();

    public async Task CreateAsync(User user) =>
        await _context.Users.InsertOneAsync(user);

    public async Task UpdateAsync(User user) =>
        await _context.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
}