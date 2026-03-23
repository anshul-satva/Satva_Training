using System.ComponentModel.DataAnnotations;

namespace UserManagementAPI.Models
{
    // All nullable = all optional for PATCH
    public class ItemPatch
    {
        [StringLength(100, MinimumLength = 1,
            ErrorMessage = "Name must be between 1 and 100 characters.")]
        public string? Name { get; set; }

        // decimal? = nullable = not required
        [Range(0.01, 999999.99,
            ErrorMessage = "Price must be between 0.01 and 999999.99.")]
        public decimal? Price { get; set; }

        // int? = nullable = not required
        [Range(0, 99999,
            ErrorMessage = "Quantity must be between 0 and 99999.")]
        public int? Quantity { get; set; }
    }
}