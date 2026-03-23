using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuickBooksAuth.DTOs;
using QuickBooksAuth.Services;

namespace QuickBooksAuth.Controllers;

[ApiController]
[Route("api/qbo/customer")]
public class CustomerController : ControllerBase
{
    private readonly QboService _qbo;
    public CustomerController(QboService qbo) => _qbo = qbo;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var (success, content) = await _qbo.GetAsync("query?query=SELECT * FROM Customer MAXRESULTS 100");
        if (!success) return BadRequest(new { error = "Failed", detail = content });
        return Content(content!, "application/json");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var (success, content) = await _qbo.GetAsync($"customer/{id}");
        if (!success) return NotFound(new { error = $"Customer {id} not found", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto body)
    {
        var (success, content) = await _qbo.PostAsync("customer", body);
        if (!success) return BadRequest(new { error = "Failed to create customer", detail = content });
        return Content(content!, "application/json");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCustomerDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        var (success, content) = await _qbo.PostAsync("customer", json);
        if (!success) return BadRequest(new { error = "Failed to update customer", detail = content });
        return Content(content!, "application/json");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> MakeInactive(string id, [FromBody] DeleteCustomerDto body)
    {
        var json = JObject.FromObject(body);
        json["Id"] = id;
        json["Active"] = false;
        var (success, content) = await _qbo.PostAsync("customer", json);
        if (!success) return BadRequest(new { error = "Failed to deactivate customer", detail = content });
        return Content(content!, "application/json");
    }
}