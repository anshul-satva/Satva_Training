using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using QBSync.Application.DTOs.Auth;
using QBSync.Application.Interfaces;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Constants;
using QBSync.Domain.Entities;

namespace QBSync.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthService(
        IUserRepository userRepository,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepository.GetByEmailAsync(dto.Email.ToLower());
        if (existing != null)
            throw new InvalidOperationException("User with this email already exists.");

        var user = new User
        {
            Email = dto.Email.ToLower(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(user);
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.ToLower())
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return BuildAuthResponse(user);
    }

    public string GetIntuitSsoUrl(string state)
    {
        var clientId = _configuration["QuickBooks:ClientId"]!;
        var redirectUri = _configuration["QuickBooks:SsoRedirectUri"]!;

        var scope = Uri.EscapeDataString(
            $"{AppConstants.QBScopes.OpenId} " +
            $"{AppConstants.QBScopes.Profile} " +
            $"{AppConstants.QBScopes.Email}");

        var url = $"{AppConstants.QBEndpoints.AuthorizeUrl}?client_id={clientId}" +
                  $"&response_type=code&scope={scope}" +
                  $"&redirect_uri={Uri.EscapeDataString(redirectUri)}&state={state}";
        return url;
    }

    public async Task<AuthResponseDto> HandleIntuitSsoCallbackAsync(string code, string state)
    {
        var clientId = _configuration["QuickBooks:ClientId"]!;
        var clientSecret = _configuration["QuickBooks:ClientSecret"]!;
        var redirectUri = _configuration["QuickBooks:SsoRedirectUri"]!;

        // Step 1: Exchange code for tokens (separate client)
        var tokenClient = _httpClientFactory.CreateClient();
        var credentials = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        tokenClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Basic", credentials);
        tokenClient.DefaultRequestHeaders.Accept
            .Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var tokenRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", redirectUri)
        });

        var tokenResponse = await tokenClient.PostAsync(
            AppConstants.QBEndpoints.TokenUrl, tokenRequest);
        var tokenJson = await tokenResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"[Token Response Status]: {tokenResponse.StatusCode}");
        Console.WriteLine($"[Token Response Body]: {tokenJson}");

        if (!tokenResponse.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Token exchange failed: {tokenResponse.StatusCode} - {tokenJson}");

        if (string.IsNullOrWhiteSpace(tokenJson))
            throw new InvalidOperationException("Token response body is empty.");

        var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenJson);

        if (!tokenData.TryGetProperty("access_token", out var accessTokenProp))
            throw new InvalidOperationException($"No access_token in response: {tokenJson}");

        var accessToken = accessTokenProp.GetString()!;

        //  Step 2: Get user info (NEW separate client)
        var userInfoClient = _httpClientFactory.CreateClient();
        userInfoClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", accessToken);
        userInfoClient.DefaultRequestHeaders.Accept
            .Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var userInfoResponse = await userInfoClient.GetAsync(
            AppConstants.QBEndpoints.UserInfoUrl);
        var userInfoJson = await userInfoResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"[UserInfo Response Status]: {userInfoResponse.StatusCode}");
        Console.WriteLine($"[UserInfo Response Body]: {userInfoJson}");

        if (!userInfoResponse.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"UserInfo request failed: {userInfoResponse.StatusCode} - {userInfoJson}");

        if (string.IsNullOrWhiteSpace(userInfoJson))
            throw new InvalidOperationException("UserInfo response body is empty.");

        var userInfo = JsonSerializer.Deserialize<JsonElement>(userInfoJson);

        //  Step 3: Extract user info safely
        var intuitId = userInfo.TryGetProperty("sub", out var subProp)
            ? subProp.GetString()!
            : throw new InvalidOperationException("No 'sub' in userInfo response.");

        var email = userInfo.TryGetProperty("email", out var emailProp)
            ? emailProp.GetString() ?? ""
            : "";

        var givenName = userInfo.TryGetProperty("givenName", out var gn)
            ? gn.GetString() ?? ""
            : "";

        var familyName = userInfo.TryGetProperty("familyName", out var fn)
            ? fn.GetString() ?? ""
            : "";

        Console.WriteLine($"[Intuit User]: id={intuitId}, email={email}");

        //  Step 4: Find or create user
        var user = await _userRepository.GetByIntuitIdAsync(intuitId);
        if (user == null && !string.IsNullOrEmpty(email))
            user = await _userRepository.GetByEmailAsync(email.ToLower());

        if (user == null)
        {
            user = new User
            {
                Email = email.ToLower(),
                FirstName = givenName,
                LastName = familyName,
                IntuitId = intuitId,
                IsIntuitUser = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _userRepository.CreateAsync(user);
        }
        else if (user.IntuitId != intuitId)
        {
            user.IntuitId = intuitId;
            user.IsIntuitUser = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
        }

        return BuildAuthResponse(user);
    }

    private AuthResponseDto BuildAuthResponse(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var jwtIssuer = _configuration["Jwt:Issuer"]!;
        var jwtAudience = _configuration["Jwt:Audience"]!;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("firstName", user.FirstName),
            new Claim("lastName", user.LastName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }
} 