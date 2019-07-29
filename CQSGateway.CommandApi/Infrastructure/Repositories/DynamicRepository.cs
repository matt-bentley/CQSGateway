using CQSGateway.CommandApi.Domain.Abstractions.Entities;
using CQSGateway.CommandApi.Domain.Abstractions.Repositories;
using Newtonsoft.Json;

namespace CQSGateway.CommandApi.Infrastructure.Repositories
{
    public class DynamicRepository<T> : IDynamicRepository where T : AggregateRoot
    {
        private readonly IRepository<T> _repository;

        public DynamicRepository(IRepository<T> repository)
        {
            _repository = repository;
        }

        public object Get(string id)
        {
            return _repository.Get(id);
        }

        public string Insert(object entity)
        {
            return _repository.Insert(Deserialize(entity));
        }

        public void Update(string id, object entity)
        {
            var typedEntity = Deserialize(entity);
            typedEntity.Id = id;
            _repository.Update(id, typedEntity);
        }

        public void Delete(string id)
        {
            _repository.Delete(id);
        }

        private T Deserialize(object entity)
        {
            var json = JsonConvert.SerializeObject(entity);
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
