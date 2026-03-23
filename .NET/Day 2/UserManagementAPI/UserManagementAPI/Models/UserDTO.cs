using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserManagementAPI.Models
{
    public class UserDTO
    {
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string EmailID { get; set; } = string.Empty;
        public string Role { get; set; } = "NormalUser";
    }
}