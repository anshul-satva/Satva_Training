using Microsoft.AspNetCore.Mvc;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/auth/quickbooks")]
public class QuickBooksAuthController : ControllerBase
{
    private readonly IQuickBooksService _qbService;
    private const int TEMP_USER_ID = 1;

    public QuickBooksAuthController(IQuickBooksService qbService)
        => _qbService = qbService;

    [HttpGet("connect")]
    public IActionResult Connect()
    {
        var url = _qbService.GetAuthorizationUrl(out string state);

        HttpContext.Session.SetString("qb_state", state);

        return Ok(new { authUrl = url, state });
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback(
        [FromQuery] string code,
        [FromQuery] string state,
        [FromQuery] string realmId)
    {
       
        if (string.IsNullOrEmpty(code))
            return BadRequest(new { error = "Authorization code is missing." });

        var success = await _qbService.ExchangeCodeForTokensAsync(code, realmId, TEMP_USER_ID);

        if (!success)
            return BadRequest(new { error = "Failed to exchange code for tokens. Check your ClientId/Secret." });

        return Ok(new
        {
            message = "QuickBooks connected successfully!",
            realmId = realmId
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var success = await _qbService.RefreshAccessTokenAsync(TEMP_USER_ID);
        return success
            ? Ok(new { message = "Token refreshed successfully" })
            : BadRequest(new { error = "Failed to refresh. User may need to reconnect QB." });
    }

    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke()
    {
        var success = await _qbService.RevokeTokenAsync(TEMP_USER_ID);
        return success
            ? Ok(new { message = "QuickBooks disconnected successfully" })
            : BadRequest(new { error = "Failed to revoke token" });
    }

    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        var token = await _qbService.GetTokenAsync(TEMP_USER_ID);

        if (token == null)
            return Ok(new { connected = false });

        return Ok(new
        {
            connected = true,
            realmId = token.RealmId,
            email = token.QbUserEmail,
            accessTokenExpiresAt = token.AccessTokenExpiresAt,
            isAccessTokenExpired = DateTime.UtcNow > token.AccessTokenExpiresAt
        });
    }
}