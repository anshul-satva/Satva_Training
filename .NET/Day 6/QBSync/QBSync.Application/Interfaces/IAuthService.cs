using QBSync.Application.DTOs.Auth;

namespace QBSync.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    // Returns the Intuit SSO authorization URL
    string GetIntuitSsoUrl(string state);
    // Called after Intuit SSO redirect — exchanges code for tokens, logs user in
    Task<AuthResponseDto> HandleIntuitSsoCallbackAsync(string code, string state);
}