using System;
using System.Text.Json.Serialization;

namespace Task1_EmployeeManagement.Models
{
    public class Employee
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("phoneNumber")]
        public string PhoneNumber { get; set; } = string.Empty;

        [JsonPropertyName("salary")]
        public decimal Salary { get; set; }

        [JsonPropertyName("encryptedPassword")]
        public string EncryptedPassword { get; set; } = string.Empty;

        // Not serialized — only used at runtime for display
        [JsonIgnore]
        public string? DecryptedPassword { get; set; }
    }
}
