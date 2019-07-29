using CQSGateway.CommandApi.Application.Models;
using CQSGateway.CommandApi.Application.Services.Abstract;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace CQSGateway.CommandApi.Application.Services
{
    public class EntityService : IEntityService
    {
        private readonly EntityResolver _entityResolver;

        public EntityService(EntityResolver entityResolver)
        {
            _entityResolver = entityResolver;
        }

        public object Get(string entityName, string id)
        {
            var entityType = _entityResolver.Resolve(entityName);
            var repo = _entityResolver.GetRepository(entityType);
            return repo.Get(id);
        }

        public object Insert(string entityName, object entity)
        {
            var entityType = _entityResolver.Resolve(entityName);
            var repo = _entityResolver.GetRepository(entityType);
            var id = repo.Insert(entity);
            return repo.Get(id);
        }

        public object InsertChild(string entityName, string id, string childName, object entity)
        {
            // TODO: refactor
            var entityType = _entityResolver.Resolve(entityName);
            var repo = _entityResolver.GetRepository(entityType);
            var childType = _entityResolver.ResolveChild(entityType, childName);
            var json = JsonConvert.SerializeObject(entity);
            var childEntity = JsonConvert.DeserializeObject(json, childType);
            childType.GetProperty("Id").SetValue(childEntity, ObjectId.GenerateNewId().ToString());
            var item = repo.Get(id);
            var childFieldName = $"{childName[0].ToString().ToUpperInvariant()}{childName.Substring(1).ToLowerInvariant()}";
            var childField = entityType.GetProperty(childFieldName);
            var children = childField.GetValue(item);
            children.GetType().GetMethod("Add").Invoke(children, new[] { childEntity });
            repo.Update(id, item);
            return childEntity;
        }

        public object Update(string entityName, string id, object entity)
        {
            var entityType = _entityResolver.Resolve(entityName);
            var repo = _entityResolver.GetRepository(entityType);
            repo.Update(id, entity);
            return repo.Get(id);
        }

        public void Delete(string entityName, string id)
        {
            var entityType = _entityResolver.Resolve(entityName);
            var repo = _entityResolver.GetRepository(entityType);
            repo.Delete(id);
        }
    }
}
