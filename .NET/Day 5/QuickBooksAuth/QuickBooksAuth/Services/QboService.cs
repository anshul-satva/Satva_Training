using MongoDB.Driver;
using Newtonsoft.Json;
using QuickBooksAuth.Data;
using QuickBooksAuth.Models;
using RestSharp;

namespace QuickBooksAuth.Services;

public class QboService
{
    private readonly MongoDbContext _db;
    private const int USER_ID = 1;
    private const string SANDBOX_BASE = "https://sandbox-quickbooks.api.intuit.com/v3/company";

    public QboService(MongoDbContext db) => _db = db;

    private async Task<QuickBooksToken?> GetTokenAsync()
    {
        var filter = Builders<QuickBooksToken>.Filter  
            .And(Builders<QuickBooksToken>.Filter.Eq(t => t.UserId, USER_ID),
                 Builders<QuickBooksToken>.Filter.Eq(t => t.IsActive, true));

        return await _db.QuickBooksTokens.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<(bool success, string? content)> GetAsync(string endpoint)
    {
        var token = await GetTokenAsync();
        if (token == null)
            return (false, "No active QuickBooks connection. Please connect first.");

        var url = $"{SANDBOX_BASE}/{token.RealmId}/{endpoint}";
        var client = new RestClient(url);
        var request = new RestRequest() { Method = Method.Get };
        request.AddHeader("Authorization", $"Bearer {token.AccessToken}");
        request.AddHeader("Accept", "application/json");

        var response = await client.ExecuteAsync(request);
        return (response.IsSuccessful, response.Content);
    }

    public async Task<(bool success, string? content)> PostAsync(string endpoint, object body)
    {
        var token = await GetTokenAsync();
        if (token == null)
            return (false, "No active QuickBooks connection. Please connect first.");

        var url = $"{SANDBOX_BASE}/{token.RealmId}/{endpoint}";
        var client = new RestClient(url);
        var request = new RestRequest() { Method = Method.Post };

        request.AddHeader("Authorization", $"Bearer {token.AccessToken}");
        request.AddHeader("Accept", "application/json");
        request.AddHeader("Content-Type", "application/json");

        var json = JsonConvert.SerializeObject(body);
        request.AddStringBody(json, "application/json");

        var response = await client.ExecuteAsync(request);
        return (response.IsSuccessful, response.Content);
    }

    public async Task<string?> GetRealmIdAsync()
    {
        var token = await GetTokenAsync();
        return token?.RealmId;
    }
}