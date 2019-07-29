using CQSGateway.CommandApi.Domain.Abstractions.Entities;

namespace CQSGateway.CommandApi.Domain.Abstractions.Repositories
{
    public interface IRepository<T> where T: AggregateRoot
    {
        T Get(string id);
        string Insert(T entity);
        void Update(string id, T entity);
        void Delete(string id);
    }
}
