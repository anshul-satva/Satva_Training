using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QBSync.Domain.Entities;

public class QBToken
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("realmId")]
    public string RealmId { get; set; } = string.Empty;

    [BsonElement("accessToken")]
    public string AccessToken { get; set; } = string.Empty;

    [BsonElement("refreshToken")]
    public string RefreshToken { get; set; } = string.Empty;

    [BsonElement("accessTokenExpiry")]
    public DateTime AccessTokenExpiry { get; set; }

    [BsonElement("refreshTokenExpiry")]
    public DateTime RefreshTokenExpiry { get; set; }

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}