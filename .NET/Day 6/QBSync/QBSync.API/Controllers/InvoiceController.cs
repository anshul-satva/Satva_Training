using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.DTOs.Invoice;
using QBSync.Application.Interfaces;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

    public InvoiceController(IInvoiceService invoiceService) => _invoiceService = invoiceService;

    [HttpGet]
    public async Task<IActionResult> GetInvoices([FromQuery] string realmId, [FromQuery] bool sync = true)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(realmId))
                return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

            var invoices = await _invoiceService.GetInvoicesByUserAsync(UserId, realmId, sync);
            return Ok(ApiResponse.CreateSuccess(invoices));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(ex.Message));
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetInvoice(int id, [FromQuery] string realmId)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(realmId))
                return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

            var invoice = await _invoiceService.GetInvoiceByIdAsync(UserId, id, realmId);
            return Ok(ApiResponse.CreateSuccess(invoice));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse.CreateFailure(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(ex.Message));
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromQuery] string realmId, [FromBody] CreateInvoiceDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(realmId))
                return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

            var invoice = await _invoiceService.CreateInvoiceAsync(UserId, realmId, dto);
            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id, realmId },
                ApiResponse.CreateSuccess(invoice, "Invoice created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.CreateFailure(ex.Message));
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvoice(int id, [FromQuery] string realmId, [FromBody] UpdateInvoiceDto dto)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

        var invoice = await _invoiceService.UpdateInvoiceAsync(UserId, id, realmId, dto);
        return Ok(ApiResponse.CreateSuccess(invoice, "Invoice updated successfully."));
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncInvoices([FromQuery] string realmId)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

        var invoices = await _invoiceService.SyncInvoicesByUserAsync(UserId, realmId);
        return Ok(ApiResponse.CreateSuccess(invoices, "Invoices synchronized with QuickBooks successfully."));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvoice(int id, [FromQuery] string realmId)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            return BadRequest(ApiResponse.CreateFailure("RealmId is required."));

        await _invoiceService.DeleteInvoiceAsync(UserId, id, realmId);
        return Ok(ApiResponse.CreateSuccess(message: "Invoice deleted from QuickBooks and local database."));
    }
}
