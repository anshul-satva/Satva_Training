using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.DTOs.QuickBooks;
using QBSync.Application.Interfaces;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/accounts")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IQuickBooksService _qbService;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

    public AccountController(IQuickBooksService qbService) => _qbService = qbService;

    [HttpGet]
    public async Task<IActionResult> GetAccounts([FromQuery] string realmId)
    {
        var accounts = await _qbService.GetAccountsAsync(UserId, realmId);
        return Ok(ApiResponse.CreateSuccess(accounts));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromQuery] string realmId, [FromBody] CreateQBAccountDto dto)
    {
        var account = await _qbService.CreateAccountAsync(UserId, realmId, dto);
        return Ok(ApiResponse.CreateSuccess(account, "Account created in QuickBooks."));
    }

    [HttpPut("{accountId}")]
    public async Task<IActionResult> UpdateAccount(string accountId, [FromQuery] string realmId, [FromBody] CreateQBAccountDto dto)
    {
        var account = await _qbService.UpdateAccountAsync(UserId, realmId, accountId, dto);
        return Ok(ApiResponse.CreateSuccess(account, "Account updated in QuickBooks."));
    }

    [HttpDelete("{accountId}")]
    public async Task<IActionResult> DeleteAccount(string accountId, [FromQuery] string realmId)
    {
        await _qbService.DeleteAccountAsync(UserId, realmId, accountId);
        return Ok(ApiResponse.CreateSuccess(message: "Account deactivated in QuickBooks."));
    }
}
