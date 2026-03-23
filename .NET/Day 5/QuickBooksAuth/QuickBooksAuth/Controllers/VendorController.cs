using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/qbo/vendor")]
public class VendorController : ControllerBase
{
    private readonly QboService _qbo;
    public VendorController(QboService qbo) => _qbo = qbo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var (success, content) = await _qbo.GetAsync("query?query=SELECT * FROM Vendor MAXRESULTS 100");
        if (!success) return BadRequest(new { error = "Failed", detail = content });
        return Content(content!, "application/json");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var (success, content) = await _qbo.GetAsync($"vendor/{id}");
        if (!success) return NotFound(new { error = $"Vendor {id} not found", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVendorDto body)
    {
        var (success, content) = await _qbo.PostAsync("vendor", body);
        if (!success) return BadRequest(new { error = "Failed to create vendor", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateVendorDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("vendor", json);
        if (!success) return BadRequest(new { error = "Failed to update vendor", detail = content });
        return Content(content!, "application/json");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> MakeInactive(string id, [FromBody] DeleteVendorDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        json["Active"] = false;
        var (success, content) = await _qbo.PostAsync("vendor", json);
        if (!success) return BadRequest(new { error = "Failed to deactivate vendor", detail = content });
        return Content(content!, "application/json");
    }
}