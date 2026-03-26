using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using QBSync.Domain.Constants;
using QBSync.Domain.Entities;

namespace QBSync.Infrastructure.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"]!;
        var databaseName = configuration["MongoDB:DatabaseName"]!;

        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>(AppConstants.Collections.Users);

    public IMongoCollection<Company> Companies =>
        _database.GetCollection<Company>(AppConstants.Collections.Companies);

    public IMongoCollection<QBToken> QBTokens =>
        _database.GetCollection<QBToken>(AppConstants.Collections.QBTokens);
}