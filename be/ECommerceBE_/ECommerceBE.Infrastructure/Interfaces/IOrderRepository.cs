// (2) Repository interface lives in Infrastructure (Core references Infrastructure, not the reverse)
using ECommerceBE.Models.Domain;

namespace ECommerceBE.Infrastructure.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateAsync(Order order);
    }
}
