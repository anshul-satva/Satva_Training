using System.Security.Claims;
using System.Text;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.Interfaces;
using QBSync.Application.Interfaces.Repositories;
using QBSync.Domain.Entities;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/quickbooks")]
[Authorize]
public class QuickBooksController : ControllerBase
{
    private readonly IQuickBooksService _quickBooksService;
    private readonly ICompanyRepository _companyRepository;
    private readonly ITokenRepository _tokenRepository;

    public QuickBooksController(
        IQuickBooksService quickBooksService,
        ICompanyRepository companyRepository,
        ITokenRepository tokenRepository)
    {
        _quickBooksService = quickBooksService;
        _companyRepository = companyRepository;
        _tokenRepository = tokenRepository;
    }

    private string? GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    [HttpGet("connect")]
    public IActionResult Connect()
    {
        try
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse.CreateFailure("User not authenticated."));

            var url = _quickBooksService.GetAuthorizationUrl(userId, "qbconnect");
            return Ok(ApiResponse.CreateSuccess(new { url }, "QuickBooks authorization URL generated."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(
                ex.Message,
                new { inner = ex.InnerException?.Message }));
        }
    }

    [HttpGet("callback")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback(
        [FromQuery] string code,
        [FromQuery] string state,
        [FromQuery] string realmId)
    {
        try
        {
            var base64 = state.Replace("-", "+").Replace("_", "/");
            switch (base64.Length % 4)
            {
                case 2: base64 += "=="; break;
                case 3: base64 += "="; break;
            }

            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            var parts = decoded.Split('|');
            var userId = parts.Length > 1 ? parts[1] : parts[0];

            await _quickBooksService.HandleCallbackAsync(code, realmId, userId);

            var savedCompany = await _companyRepository.GetByUserAndRealmIdAsync(userId, realmId);
            if (savedCompany == null)
            {
                var savedToken = await _tokenRepository.GetActiveTokenAsync(userId, realmId);
                if (savedToken != null)
                {
                    var companyName = await _quickBooksService.GetCompanyNameAsync(userId, realmId);
                    await _companyRepository.CreateAsync(new Company
                    {
                        RealmId = realmId,
                        CompanyName = string.IsNullOrWhiteSpace(companyName) ? "Unknown Company" : companyName,
                        UserId = userId,
                        IsConnected = true,
                        ConnectedAt = DateTime.UtcNow
                    });

                    savedCompany = await _companyRepository.GetByUserAndRealmIdAsync(userId, realmId);
                }
            }

            if (savedCompany == null || !savedCompany.IsConnected)
            {
                return Redirect("http://localhost:3000/dashboard?connected=false&error=QuickBooks%20callback%20completed%2C%20but%20the%20company%20was%20not%20saved%20for%20this%20user.");
            }

            return Redirect($"http://localhost:3000/dashboard?connected=true&realmId={realmId}");
        }
        catch (Exception ex)
        {
            return Redirect($"http://localhost:3000/dashboard?connected=false&error={Uri.EscapeDataString(ex.Message)}");
        }
    }

    [HttpPost("refresh/{realmId}")]
    public async Task<IActionResult> RefreshConnection(string realmId)
    {
        try
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse.CreateFailure("User not authenticated."));

            await _quickBooksService.RefreshConnectionAsync(userId, realmId);

            var company = await _companyRepository.GetByUserAndRealmIdAsync(userId, realmId);
            if (company != null)
            {
                company.CompanyName = await _quickBooksService.GetCompanyNameAsync(userId, realmId);
                company.IsConnected = true;
                company.DisconnectedAt = null;
                await _companyRepository.UpdateAsync(company);
            }

            return Ok(ApiResponse.CreateSuccess(message: "QuickBooks token refreshed successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(
                ex.Message,
                new { inner = ex.InnerException?.Message }));
        }
    }

    [HttpDelete("disconnect/{realmId}")]
    public async Task<IActionResult> Disconnect(string realmId)
    {
        try
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse.CreateFailure("User not authenticated."));

            await _quickBooksService.DisconnectAsync(userId, realmId);
            return Ok(ApiResponse.CreateSuccess(message: "QuickBooks disconnected successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(ex.Message));
        }
    }

    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies()
    {
        try
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse.CreateFailure("User not authenticated."));

            var companies = await _companyRepository.GetByUserIdAsync(userId);
            foreach (var company in companies.Where(c =>
                string.IsNullOrWhiteSpace(c.CompanyName) ||
                c.CompanyName.StartsWith("QuickBooks Company ", StringComparison.OrdinalIgnoreCase)))
            {
                var actualCompanyName = await _quickBooksService.GetCompanyNameAsync(userId, company.RealmId);
                if (!string.IsNullOrWhiteSpace(actualCompanyName) &&
                    !string.Equals(actualCompanyName, company.CompanyName, StringComparison.Ordinal))
                {
                    company.CompanyName = actualCompanyName;
                    await _companyRepository.UpdateAsync(company);
                }
            }

            return Ok(ApiResponse.CreateSuccess(companies));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(
                ex.Message,
                new
                {
                    inner = ex.InnerException?.Message,
                    type = ex.GetType().Name
                }));
        }
    }
}
