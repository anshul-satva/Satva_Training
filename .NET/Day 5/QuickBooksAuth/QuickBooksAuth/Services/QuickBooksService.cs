using MongoDB.Driver;
using Newtonsoft.Json;
using QuickBooksAuth.Data;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Models;
using RestSharp;
using System.Text;

namespace QuickBooksAuth.Services;

public class QuickBooksService : IQuickBooksService
{
    private readonly MongoDbContext _db;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _redirectUri;
    private readonly string _tokenUrl;
    private readonly string _revokeUrl;
    private readonly string _scopes;
    private readonly string _authBaseUrl;

    public QuickBooksService(MongoDbContext db, IConfiguration config)
    {
        _db = db;
        _clientId = config["QuickBooks:ClientId"]!;
        _clientSecret = config["QuickBooks:ClientSecret"]!;
        _redirectUri = config["QuickBooks:RedirectUri"]!;
        _tokenUrl = config["QuickBooks:TokenUrl"]!;
        _revokeUrl = config["QuickBooks:RevokeUrl"]!;
        _scopes = config["QuickBooks:Scopes"]!;
        _authBaseUrl = config["QuickBooks:AuthBaseUrl"]!;
    }

    public string GetAuthorizationUrl(out string state)
    {
        state = Guid.NewGuid().ToString("N");

        return $"{_authBaseUrl}" +
               $"?client_id={Uri.EscapeDataString(_clientId)}" +
               $"&redirect_uri={Uri.EscapeDataString(_redirectUri)}" +
               $"&scope={Uri.EscapeDataString(_scopes)}" +
               $"&response_type=code" +
               $"&state={state}";
    }

    public async Task<bool> ExchangeCodeForTokensAsync(string code, string realmId, int userId)
    {
        var tokenData = await CallTokenEndpointAsync(new Dictionary<string, string>
        {
            ["grant_type"] = "authorization_code",
            ["code"] = code,
            ["redirect_uri"] = _redirectUri
        });

        if (tokenData == null) return false;

        var filter = Builders<QuickBooksToken>.Filter.Eq(t => t.UserId, userId);
        var existing = await _db.QuickBooksTokens.Find(filter).FirstOrDefaultAsync();

        if (existing != null)
        {
            var update = Builders<QuickBooksToken>.Update
                .Set(t => t.AccessToken, tokenData.AccessToken)
                .Set(t => t.RefreshToken, tokenData.RefreshToken)
                .Set(t => t.RealmId, realmId)
                .Set(t => t.AccessTokenExpiresAt, DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn))
                .Set(t => t.RefreshTokenExpiresAt, DateTime.UtcNow.AddSeconds(tokenData.RefreshTokenExpiresIn))
                .Set(t => t.IdToken, tokenData.IdToken)
                .Set(t => t.IsActive, true)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            await _db.QuickBooksTokens.UpdateOneAsync(filter, update);
        }
        else
        {
            await _db.QuickBooksTokens.InsertOneAsync(new QuickBooksToken
            {
                UserId = userId,
                RealmId = realmId,
                AccessToken = tokenData.AccessToken,
                RefreshToken = tokenData.RefreshToken,
                AccessTokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn),
                RefreshTokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.RefreshTokenExpiresIn),
                IdToken = tokenData.IdToken
            });
        }

        return true;
    }

    public async Task<bool> RefreshAccessTokenAsync(int userId)
    {
        var token = await GetTokenAsync(userId);
        if (token == null) return false;
        if (DateTime.UtcNow > token.RefreshTokenExpiresAt) return false;

        var tokenData = await CallTokenEndpointAsync(new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token",
            ["refresh_token"] = token.RefreshToken
        });

        if (tokenData == null) return false;

        var filter = Builders<QuickBooksToken>.Filter
            .And(Builders<QuickBooksToken>.Filter.Eq(t => t.UserId, userId),
                 Builders<QuickBooksToken>.Filter.Eq(t => t.IsActive, true));

        var update = Builders<QuickBooksToken>.Update
            .Set(t => t.AccessToken, tokenData.AccessToken)
            .Set(t => t.RefreshToken, tokenData.RefreshToken)
            .Set(t => t.AccessTokenExpiresAt, DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn))
            .Set(t => t.RefreshTokenExpiresAt, DateTime.UtcNow.AddSeconds(tokenData.RefreshTokenExpiresIn))
            .Set(t => t.UpdatedAt, DateTime.UtcNow);

        await _db.QuickBooksTokens.UpdateOneAsync(filter, update);
        return true;
    }

    public async Task<bool> RevokeTokenAsync(int userId)
    {
        var token = await GetTokenAsync(userId);
        if (token == null) return false;

        var client = new RestClient(_revokeUrl);
        var request = new RestRequest() { Method = Method.Post };
        request.AddHeader("Authorization", $"Basic {GetBasicAuth()}");
        request.AddHeader("Content-Type", "application/json");
        request.AddHeader("Accept", "application/json");
        request.AddJsonBody(new { token = token.RefreshToken });

        var response = await client.ExecuteAsync(request);

        var filter = Builders<QuickBooksToken>.Filter.Eq(t => t.UserId, userId);
        var update = Builders<QuickBooksToken>.Update
            .Set(t => t.IsActive, false)
            .Set(t => t.AccessToken, "")
            .Set(t => t.RefreshToken, "")
            .Set(t => t.UpdatedAt, DateTime.UtcNow);

        await _db.QuickBooksTokens.UpdateOneAsync(filter, update);
        return response.IsSuccessful;
    }

    public async Task<QuickBooksToken?> GetTokenAsync(int userId)
    {
        var filter = Builders<QuickBooksToken>.Filter
            .And(Builders<QuickBooksToken>.Filter.Eq(t => t.UserId, userId),
                 Builders<QuickBooksToken>.Filter.Eq(t => t.IsActive, true));

        return await _db.QuickBooksTokens.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<string?> GetValidAccessTokenAsync(int userId)
    {
        var token = await GetTokenAsync(userId);
        if (token == null) return null;

        if (DateTime.UtcNow.AddMinutes(5) >= token.AccessTokenExpiresAt)
        {
            var refreshed = await RefreshAccessTokenAsync(userId);
            if (!refreshed) return null;
            token = await GetTokenAsync(userId);
        }

        return token?.AccessToken;
    }

    private string GetBasicAuth()
        => Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));

    private async Task<TokenResponseDto?> CallTokenEndpointAsync(Dictionary<string, string> bodyParams)
    {
        var client = new RestClient(_tokenUrl);
        var request = new RestRequest() { Method = Method.Post };

        request.AddHeader("Authorization", $"Basic {GetBasicAuth()}");
        request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
        request.AddHeader("Accept", "application/json");

        foreach (var param in bodyParams)
            request.AddParameter(param.Key, param.Value);

        var response = await client.ExecuteAsync(request);
        if (!response.IsSuccessful || response.Content == null) return null;

        return JsonConvert.DeserializeObject<TokenResponseDto>(response.Content);
    }
}