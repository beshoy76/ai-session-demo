using ECommerceBE.Core.DTOs;
using ECommerceBE.Core.Interfaces;
using ECommerceBE.Models.Domain;
using ECommerceBE.Presistance.Repositories;

namespace ECommerceBE.Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<Order> CheckoutAsync(CheckoutRequest request)
        {
            if (request.Items == null || !request.Items.Any())
                throw new ArgumentException("Cart cannot be empty.");

            if (string.IsNullOrWhiteSpace(request.CustomerName) ||
                string.IsNullOrWhiteSpace(request.CustomerEmail) ||
                string.IsNullOrWhiteSpace(request.ShippingStreet) ||
                string.IsNullOrWhiteSpace(request.ShippingCity) ||
                string.IsNullOrWhiteSpace(request.ShippingState) ||
                string.IsNullOrWhiteSpace(request.ShippingCountry) ||
                string.IsNullOrWhiteSpace(request.ShippingZipCode))
            {
                throw new ArgumentException("All customer and shipping fields are required.");
            }

            if (request.Items.Any(i => i.Quantity <= 0))
                throw new ArgumentException("All item quantities must be greater than zero.");

            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = (await _orderRepository.GetProductsByIdsAsync(productIds))
                .ToDictionary(p => p.Id);

            var missingIds = productIds.Except(products.Keys).ToList();
            if (missingIds.Count != 0)
                throw new ArgumentException($"Products not found: {string.Join(", ", missingIds)}");

            var items = request.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = products[i.ProductId].Price ?? 0m
            }).ToList();

            var order = new Order
            {
                CustomerName = request.CustomerName,
                CustomerEmail = request.CustomerEmail,
                ShippingStreet = request.ShippingStreet,
                ShippingCity = request.ShippingCity,
                ShippingState = request.ShippingState,
                ShippingCountry = request.ShippingCountry,
                ShippingZipCode = request.ShippingZipCode,
                Status = "Pending",
                TotalAmount = items.Sum(i => i.UnitPrice * i.Quantity),
                Items = items
            };

            return await _orderRepository.CreateAsync(order);
        }
    }
}
