using QuickBooksAuth.Models;

namespace QuickBooksAuth.Services;

public interface IQuickBooksService
{
    string GetAuthorizationUrl(out string state);
    Task<bool> ExchangeCodeForTokensAsync(string code, string realmId, int userId);
    Task<bool> RefreshAccessTokenAsync(int userId);
    Task<bool> RevokeTokenAsync(int userId);
    Task<QuickBooksToken?> GetTokenAsync(int userId);
    Task<string?> GetValidAccessTokenAsync(int userId);
}