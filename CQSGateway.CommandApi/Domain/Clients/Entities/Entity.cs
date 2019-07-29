using CQSGateway.CommandApi.Domain.Abstractions.Entities;

namespace CQSGateway.CommandApi.Domain.Clients.Entities
{
    public class Entity : DomainEntity
    {
        public string Name { get; set; }
        public bool Dissolved { get; set; }
    }
}
