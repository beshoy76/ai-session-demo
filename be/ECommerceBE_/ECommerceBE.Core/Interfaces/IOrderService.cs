// (4) Service interface — keeps the controller free of implementation details
using ECommerceBE.Core.DTOs;
using ECommerceBE.Models.Domain;

namespace ECommerceBE.Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CheckoutAsync(CheckoutRequest request);
    }
}
