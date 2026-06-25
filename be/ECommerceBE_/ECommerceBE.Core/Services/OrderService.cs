// (4) Service — re-prices from DB so the client total is never trusted
using ECommerceBE.Core.DTOs;
using ECommerceBE.Core.Interfaces;
using ECommerceBE.Infrastructure.Interfaces;
using ECommerceBE.Models.Domain;
using ECommerceBE.Presistance.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBE.Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ApplicationContext _context;

        public OrderService(IOrderRepository orderRepository, ApplicationContext context)
        {
            _orderRepository = orderRepository;
            _context = context;
        }

        public async Task<Order> CheckoutAsync(CheckoutRequest request)
        {
            var productIds = request.Items.Select(i => i.ProductId).ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id) && !p.IsDeleted)
                .ToDictionaryAsync(p => p.Id);

            var items = request.Items.Select(i =>
            {
                if (!products.TryGetValue(i.ProductId, out var product))
                    throw new KeyNotFoundException($"Product {i.ProductId} not found");

                return new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = product.Price ?? 0m
                };
            }).ToList();

            var total = items.Sum(i => i.UnitPrice * i.Quantity);

            var order = new Order
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName,
                Address = request.Address,
                City = request.City,
                Phone = request.Phone,
                Status = "Pending",
                Total = total,
                Items = items
            };

            return await _orderRepository.CreateAsync(order);
        }
    }
}
