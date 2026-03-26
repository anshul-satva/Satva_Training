using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QBSync.API.Common;
using QBSync.Application.DTOs.QuickBooks;
using QBSync.Application.Interfaces;

namespace QBSync.API.Controllers;

[ApiController]
[Route("api/items")]
[Authorize]
public class ItemController : ControllerBase
{
    private readonly IQuickBooksService _qbService;
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!;

    public ItemController(IQuickBooksService qbService) => _qbService = qbService;

    [HttpGet]
    public async Task<IActionResult> GetItems([FromQuery] string realmId)
    {
        if (string.IsNullOrWhiteSpace(realmId))
            return Ok(ApiResponse.CreateSuccess(new List<QBItemResponseDto>()));

        try
        {
            var items = await _qbService.GetItemsAsync(UserId, realmId);
            return Ok(ApiResponse.CreateSuccess(items));
        }
        catch
        {
            return Ok(ApiResponse.CreateSuccess(new List<QBItemResponseDto>()));
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateItem([FromQuery] string realmId, [FromBody] CreateQBItemDto dto)
    {
        var item = await _qbService.CreateItemAsync(UserId, realmId, dto);
        return Ok(ApiResponse.CreateSuccess(item, "Item created in QuickBooks."));
    }

    [HttpPut("{itemId}")]
    public async Task<IActionResult> UpdateItem(string itemId, [FromQuery] string realmId, [FromBody] CreateQBItemDto dto)
    {
        var item = await _qbService.UpdateItemAsync(UserId, realmId, itemId, dto);
        return Ok(ApiResponse.CreateSuccess(item, "Item updated in QuickBooks."));
    }

    [HttpDelete("{itemId}")]
    public async Task<IActionResult> DeleteItem(string itemId, [FromQuery] string realmId)
    {
        await _qbService.DeleteItemAsync(UserId, realmId, itemId);
        return Ok(ApiResponse.CreateSuccess(message: "Item deactivated in QuickBooks."));
    }
}
