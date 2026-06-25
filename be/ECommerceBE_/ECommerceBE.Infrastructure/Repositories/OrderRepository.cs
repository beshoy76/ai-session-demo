// (2) Repository implementation — Infrastructure owns the DbContext dependency
using ECommerceBE.Infrastructure.Interfaces;
using ECommerceBE.Models.Domain;
using ECommerceBE.Presistance.Data;

namespace ECommerceBE.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationContext _context;

        public OrderRepository(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
