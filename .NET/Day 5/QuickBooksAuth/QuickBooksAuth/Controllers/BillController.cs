using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/qbo/bill")]
public class BillController : ControllerBase
{
    private readonly QboService _qbo;
    public BillController(QboService qbo) => _qbo = qbo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var (success, content) = await _qbo.GetAsync("query?query=SELECT * FROM Bill MAXRESULTS 100");
        if (!success) return BadRequest(new { error = "Failed", detail = content });
        return Content(content!, "application/json");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var (success, content) = await _qbo.GetAsync($"bill/{id}");
        if (!success) return NotFound(new { error = $"Bill {id} not found", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBillDto body)
    {
        var (success, content) = await _qbo.PostAsync("bill", body);
        if (!success) return BadRequest(new { error = "Failed to create bill", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateBillDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("bill", json);
        if (!success) return BadRequest(new { error = "Failed to update bill", detail = content });
        return Content(content!, "application/json");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromBody] DeleteByTokenRequest body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("bill?operation=delete", json);
        if (!success) return BadRequest(new { error = "Failed to delete bill", detail = content });
        return Content(content!, "application/json");
    }
}