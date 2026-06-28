using ECommerceBE.Models.Domain;
using ECommerceBE.Presistance.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBE.Presistance.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationContext _context;

        public OrderRepository(ApplicationContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetProductsByIdsAsync(IEnumerable<Guid> ids)
        {
            return await _context.Products
                .Where(p => ids.Contains(p.Id) && !p.IsDeleted)
                .ToListAsync();
        }

        public async Task<Order> CreateAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
