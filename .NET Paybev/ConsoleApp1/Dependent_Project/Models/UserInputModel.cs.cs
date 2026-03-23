using System.ComponentModel.DataAnnotations;

namespace Dependent_Project.Models
{
    public class UserInputModel
    {
        [Required(ErrorMessage = "Name is required.")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Name must contain letters only (no numbers or special characters).")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Num1 is required.")]
        [Range(1, 10, ErrorMessage = "Num1 must be between 1 and 10.")]
        public int Num1 { get; set; }

        [Required(ErrorMessage = "Num2 is required.")]
        [Range(0, 9999999999, ErrorMessage = "Num2 must be having max 10 digits.")]
        public long Num2 { get; set; }
    }
}