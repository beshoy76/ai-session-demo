using ECommerceBE.Models.Domain;

namespace ECommerceBE.Presistance.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Product>> GetProductsByIdsAsync(IEnumerable<Guid> ids);
        Task<Order> CreateAsync(Order order);
    }
}
