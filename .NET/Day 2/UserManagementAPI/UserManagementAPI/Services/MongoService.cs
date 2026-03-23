using MongoDB.Driver;

namespace UserManagementAPI.Services
{
    public class MongoService
    {
        private readonly IMongoDatabase _database;

        public MongoService(IConfiguration config)
        {
            var connectionString = config["MongoDBSettings:ConnectionString"]!;
            var databaseName = config["MongoDBSettings:DatabaseName"]!;

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }
}