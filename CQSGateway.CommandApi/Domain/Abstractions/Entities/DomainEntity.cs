using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CQSGateway.CommandApi.Domain.Abstractions.Entities
{
    public abstract class DomainEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; }
    }
}
