using CQSGateway.CommandApi.Domain;
using CQSGateway.CommandApi.Domain.Abstractions.Entities;
using CQSGateway.CommandApi.Domain.Abstractions.Repositories;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CQSGateway.CommandApi.Infrastructure.Repositories
{
    internal class Repository<T> : IRepository<T> where T : AggregateRoot
    {
        protected readonly IMongoCollection<T> Db;

        public Repository(IMongoClient client, IOptions<AppSettings> settings, string collectionName)
        {
            var database = client.GetDatabase(settings.Value.DatabaseName);
            Db = database.GetCollection<T>(collectionName);
        }

        public T Get(string id)
        {
            return Db.Find(item => item.Id == id).First();
        }

        public string Insert(T entity)
        {
            Db.InsertOne(entity);
            return entity.Id;
        }

        public void Update(string id, T entity)
        {
            Db.ReplaceOne(item => item.Id == id, entity);
        }

        public void Delete(string id)
        {
            Db.DeleteOne(item => item.Id == id);
        }
    }
}
