using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.DTOs.QuickBooks;
using QBSync.Application.Interfaces;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize]
public class CustomerController : ControllerBase
{
    private readonly IQuickBooksService _qbService;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

    public CustomerController(IQuickBooksService qbService) => _qbService = qbService;

    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] string realmId)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            return Ok(ApiResponse.CreateSuccess(new List<QBCustomerResponseDto>()));

        try
        {
            var customers = await _qbService.GetCustomersAsync(UserId, realmId);
            return Ok(ApiResponse.CreateSuccess(customers));
        }
        catch
        {
            return Ok(ApiResponse.CreateSuccess(new List<QBCustomerResponseDto>()));
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromQuery] string realmId, [FromBody] CreateQBCustomerDto dto)
    {
        var customer = await _qbService.CreateCustomerAsync(UserId, realmId, dto);
        return Ok(ApiResponse.CreateSuccess(customer, "Customer created in QuickBooks."));
    }

    [HttpPut("{customerId}")]
    public async Task<IActionResult> UpdateCustomer(string customerId, [FromQuery] string realmId, [FromBody] CreateQBCustomerDto dto)
    {
        var customer = await _qbService.UpdateCustomerAsync(UserId, realmId, customerId, dto);
        return Ok(ApiResponse.CreateSuccess(customer, "Customer updated in QuickBooks."));
    }

    [HttpDelete("{customerId}")]
    public async Task<IActionResult> DeleteCustomer(string customerId, [FromQuery] string realmId)
    {
        await _qbService.DeleteCustomerAsync(UserId, realmId, customerId);
        return Ok(ApiResponse.CreateSuccess(message: "Customer deactivated in QuickBooks."));
    }
}
