using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/qbo/invoice")]
public class InvoiceController : ControllerBase
{
    private readonly QboService _qbo;
    public InvoiceController(QboService qbo) => _qbo = qbo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var (success, content) = await _qbo.GetAsync("query?query=SELECT * FROM Invoice MAXRESULTS 100");
        if (!success) return BadRequest(new { error = "Failed", detail = content });
        return Content(content!, "application/json");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var (success, content) = await _qbo.GetAsync($"invoice/{id}");
        if (!success) return NotFound(new { error = $"Invoice {id} not found", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInvoiceDto body)
    {
        var (success, content) = await _qbo.PostAsync("invoice", body);
        if (!success) return BadRequest(new { error = "Failed to create invoice", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateInvoiceDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("invoice", json);
        if (!success) return BadRequest(new { error = "Failed to update invoice", detail = content });
        return Content(content!, "application/json");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromBody] DeleteByTokenRequest body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("invoice?operation=delete", json);
        if (!success) return BadRequest(new { error = "Failed to delete invoice", detail = content });
        return Content(content!, "application/json");
    }
}