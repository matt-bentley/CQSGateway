using CQSGateway.CommandApi.Domain.Abstractions.Entities;

namespace CQSGateway.CommandApi.Domain.Users.Entities
{
    public class User : AggregateRoot
    {
        public string FirstName { get; set; }
        public string SecondName { get; set; }
        public string Email { get; set; }
        public string FavouriteFood { get; set; }
        public int Age { get; set; }
    }
}
