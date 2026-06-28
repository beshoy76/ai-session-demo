using ECommerceBE.Core.DTOs;
using ECommerceBE.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceBE.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            try
            {
                var order = await _orderService.CheckoutAsync(request);
                return CreatedAtAction(nameof(Checkout), new { id = order.Id }, new
                {
                    id = order.Id,
                    status = order.Status,
                    totalAmount = order.TotalAmount,
                    customerName = order.CustomerName,
                    customerEmail = order.CustomerEmail,
                    items = order.Items.Select(i => new
                    {
                        productId = i.ProductId,
                        quantity = i.Quantity,
                        unitPrice = i.UnitPrice
                    })
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
