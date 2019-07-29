
namespace CQSGateway.CommandApi.Domain.Abstractions.Repositories
{
    public interface IDynamicRepository
    {
        object Get(string id);
        string Insert(object entity);
        void Update(string id, object entity);
        void Delete(string id);
    }
}
