using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuickBooksAuth.Models;

public class QuickBooksToken
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public int UserId { get; set; }

    [BsonElement("realmId")]
    public string RealmId { get; set; } = "";

    [BsonElement("accessToken")]
    public string AccessToken { get; set; } = "";

    [BsonElement("refreshToken")]
    public string RefreshToken { get; set; } = "";

    [BsonElement("accessTokenExpiresAt")]
    public DateTime AccessTokenExpiresAt { get; set; }

    [BsonElement("refreshTokenExpiresAt")]
    public DateTime RefreshTokenExpiresAt { get; set; }

    [BsonElement("idToken")]
    public string? IdToken { get; set; }

    [BsonElement("qbUserEmail")]
    public string? QbUserEmail { get; set; }

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}