using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/qbo/item")]
public class ItemController : ControllerBase
{
    private readonly QboService _qbo;
    public ItemController(QboService qbo) => _qbo = qbo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var (success, content) = await _qbo.GetAsync("query?query=SELECT * FROM Item MAXRESULTS 100");
        if (!success) return BadRequest(new { error = "Failed", detail = content });
        return Content(content!, "application/json");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var (success, content) = await _qbo.GetAsync($"item/{id}");
        if (!success) return NotFound(new { error = $"Item {id} not found", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItemDto body)
    {
        var (success, content) = await _qbo.PostAsync("item", body);
        if (!success) return BadRequest(new { error = "Failed to create item", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateItemDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("item", json);
        if (!success) return BadRequest(new { error = "Failed to update item", detail = content });
        return Content(content!, "application/json");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> MakeInactive(string id, [FromBody] DeleteByTokenRequest body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        json["Active"] = false;
        var (success, content) = await _qbo.PostAsync("item", json);
        if (!success) return BadRequest(new { error = "Failed to deactivate item", detail = content });
        return Content(content!, "application/json");
    }
}