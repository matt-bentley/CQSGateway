
namespace CQSGateway.CommandApi.Application.Services.Abstract
{
    public interface IEntityService
    {
        object Get(string entityName, string id);
        object Insert(string entityName, object entity);
        object InsertChild(string entityName, string id, string childName, object entity);
        object Update(string entityName, string id, object entity);
        void Delete(string entityName, string id);
    }
}
