using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Models;
using UserManagementAPI.Services;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemController(ItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllItems()
        {
            var items = _itemService.GetAllItems();
            return Ok(ApiResponse<List<Item>>.Ok($"{items.Count} items found.", items));
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetItemById(string id)
        {
            var item = _itemService.GetItemById(id);
            return Ok(ApiResponse<Item>.Ok("Item found.", item));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateItem([FromBody] Item item)
        {
            var created = _itemService.CreateItem(item);
            return Ok(ApiResponse<Item>.Ok("Item created successfully.", created));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateItem(string id, [FromBody] Item item)
        {
            var updated = _itemService.UpdateItem(id, item);
            return Ok(ApiResponse<Item>.Ok("Item updated successfully.", updated));
        }

        // ✅ PATCH uses ItemPatch — no Required fields
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult PatchItem(string id, [FromBody] ItemPatch patchData)
        {
            var updated = _itemService.PatchItem(id, patchData);
            return Ok(ApiResponse<Item>.Ok("Item partially updated.", updated));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteItem(string id)
        {
            _itemService.DeleteItem(id);
            return Ok(ApiResponse<object>.Ok("Item deleted successfully."));
        }
    }
}