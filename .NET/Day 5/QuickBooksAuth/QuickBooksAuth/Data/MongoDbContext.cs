using MongoDB.Driver;
using QuickBooksAuth.Models;

namespace QuickBooksAuth.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IConfiguration config)
    {
        var connectionString = config["MongoDB:ConnectionString"]!;
        var databaseName = config["MongoDB:DatabaseName"]!;
        var client = new MongoClient(connectionString);
        _database = client.GetDatabase(databaseName);
    }

    public IMongoCollection<QuickBooksToken> QuickBooksTokens
        => _database.GetCollection<QuickBooksToken>("QuickBooksTokens");
}