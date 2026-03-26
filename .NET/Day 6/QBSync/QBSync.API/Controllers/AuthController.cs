using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.DTOs.Auth;
using QBSync.Application.Interfaces;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        return Ok(ApiResponse.CreateSuccess(result, "Registration successful."));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(ApiResponse.CreateSuccess(result, "Login successful."));
    }

    [HttpGet("intuit/url")]
    public IActionResult GetIntuitSsoUrl([FromQuery] string state = "sso")
    {
        var url = _authService.GetIntuitSsoUrl(state);
        return Ok(ApiResponse.CreateSuccess(new { url }, "Intuit SSO URL generated."));
    }

    [HttpGet("intuit/callback")]
    public async Task<IActionResult> IntuitCallback(
        [FromQuery] string code,
        [FromQuery] string state,
        [FromQuery] string? realmId = null)
    {
        try
        {
            var result = await _authService.HandleIntuitSsoCallbackAsync(code, state);
            var frontendUrl = $"http://localhost:3000/auth/callback?token={result.Token}";
            return Redirect(frontendUrl);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(
                ex.Message,
                result: new
                {
                    inner = ex.InnerException?.Message,
                    type = ex.GetType().Name,
                    stackTrace = ex.StackTrace
                }));
        }
    }
}
