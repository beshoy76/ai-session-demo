using ECommerceBE.Core.DTOs;
using ECommerceBE.Models.Domain;

namespace ECommerceBE.Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CheckoutAsync(CheckoutRequest request);
    }
}
