using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QBSync.Domain.Entities;

public class Company
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("realmId")]
    public string RealmId { get; set; } = string.Empty;

    [BsonElement("companyName")]
    public string CompanyName { get; set; } = string.Empty;

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("isConnected")]
    public bool IsConnected { get; set; } = true;

    [BsonElement("connectedAt")]
    public DateTime ConnectedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("disconnectedAt")]
    public DateTime? DisconnectedAt { get; set; }
}