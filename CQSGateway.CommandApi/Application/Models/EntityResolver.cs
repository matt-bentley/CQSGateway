using CQSGateway.CommandApi.Domain;
using CQSGateway.CommandApi.Domain.Abstractions.Entities;
using CQSGateway.CommandApi.Domain.Abstractions.Repositories;
using CQSGateway.CommandApi.Domain.Clients.Entities;
using CQSGateway.CommandApi.Domain.Users.Entities;
using CQSGateway.CommandApi.Infrastructure.Repositories;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

namespace CQSGateway.CommandApi.Application.Models
{
    public class EntityResolver
    {
        private readonly Dictionary<string, Type> _aggregateRootCache;
        private readonly Dictionary<Type, Dictionary<string, Type>> _childEntityCache;
        private Dictionary<Type, IDynamicRepository> _repositoryCache;

        public EntityResolver(IMongoClient client, IOptions<AppSettings> settings)
        {
            _aggregateRootCache = new Dictionary<string, Type>();
            _childEntityCache = new Dictionary<Type, Dictionary<string, Type>>();
            _repositoryCache = new Dictionary<Type, IDynamicRepository>();

            // register clients
            _aggregateRootCache.Add("clients", typeof(Client));
            var clientsRepo = new Repository<Client>(client, settings, "clients");
            IDynamicRepository dynamicClientsRepo = new DynamicRepository<Client>(clientsRepo);
            _repositoryCache.Add(typeof(Client), dynamicClientsRepo);

            // register client children
            var clientChildEntityCache = new Dictionary<string, Type>();
            clientChildEntityCache.Add("entities", typeof(Entity));
            _childEntityCache.Add(typeof(Client), clientChildEntityCache);

            // register users
            _aggregateRootCache.Add("users", typeof(User));
            var usersRepo = new Repository<User>(client, settings, "users");
            IDynamicRepository dynamicUsersRepo = new DynamicRepository<User>(usersRepo);
            _repositoryCache.Add(typeof(User), dynamicUsersRepo);
        }

        public Type Resolve(string aggregateName)
        {
            Type t;
            if (_aggregateRootCache.TryGetValue(aggregateName.ToLowerInvariant(), out t))
            {
                return t;
            }
            else
            {
                throw new ArgumentOutOfRangeException($"{aggregateName} has not been registered as an entity", nameof(aggregateName));
            }
        }

        public Type ResolveChild(Type aggregateType, string childName)
        {
            Type t;
            if (_childEntityCache[aggregateType].TryGetValue(childName.ToLowerInvariant(), out t))
            {
                return t;
            }
            else
            {
                throw new ArgumentOutOfRangeException($"{childName} has not been registered as a child entity on the aggregate {aggregateType.Name}", nameof(childName));
            }
        }

        public IDynamicRepository GetRepository(Type entityType)
        {
            bool isAggregate = entityType.BaseType == typeof(AggregateRoot);
            if (!isAggregate)
            {
                throw new ArgumentException($"{entityType.Name} is not an aggregate root");
            }
            else
            {
                IDynamicRepository repo;
                if (_repositoryCache.TryGetValue(entityType, out repo))
                {
                    return repo;
                }
                else
                {
                    throw new ArgumentOutOfRangeException($"{entityType} does not have a registered repository", nameof(entityType));
                }
            }
        }
    }
}
