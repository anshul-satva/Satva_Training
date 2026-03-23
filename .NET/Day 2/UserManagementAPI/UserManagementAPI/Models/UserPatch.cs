using System.ComponentModel.DataAnnotations;

namespace UserManagementAPI.Models
{
    // All fields nullable = all optional
    // [Required] intentionally NOT used here
    // Validation only triggers if field is actually sent
    public class UserPatch
    {
        [StringLength(50, MinimumLength = 2,
            ErrorMessage = "Name must be between 2 and 50 characters.")]
        public string? Name { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string? EmailID { get; set; }

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string? Password { get; set; }

        [RegularExpression("^(Admin|NormalUser)$",
            ErrorMessage = "Role must be 'Admin' or 'NormalUser'.")]
        public string? Role { get; set; }
    }
}