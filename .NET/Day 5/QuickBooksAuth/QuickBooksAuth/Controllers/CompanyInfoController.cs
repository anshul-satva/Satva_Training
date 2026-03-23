using Microsoft.AspNetCore.Mvc;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;


[ApiController]
[Route("api/qbo/company")]
public class CompanyInfoController : ControllerBase
{
    private readonly QboService _qbo;

    public CompanyInfoController(QboService qbo) => _qbo = qbo;

 
    [HttpGet]
    public async Task<IActionResult> GetCompanyInfo()
    {
        var realmId = await _qbo.GetRealmIdAsync();

        if (realmId == null)
            return BadRequest(new
            {
                error = "No active QuickBooks connection.",
                hint = "Call GET /api/auth/quickbooks/connect first to connect QuickBooks."
            });

        var (success, content) = await _qbo.GetAsync($"companyinfo/{realmId}");

        if (!success)
            return BadRequest(new
            {
                error = "Failed to get company info.",
                hint = "Token may be expired. Call POST /api/auth/quickbooks/refresh first.",
                detail = content
            });

        return Content(content!, "application/json");
    }
}