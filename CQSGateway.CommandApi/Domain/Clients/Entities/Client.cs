using CQSGateway.CommandApi.Domain.Abstractions.Entities;
using System;
using System.Collections.Generic;

namespace CQSGateway.CommandApi.Domain.Clients.Entities
{
    public class Client : AggregateRoot
    {
        public string Name { get; set; }
        public string Sector { get; set; }
        public List<Entity> Entities { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
