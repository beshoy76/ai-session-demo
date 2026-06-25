// (3) OrdersController — POST api/orders/checkout; ModelState handles annotation validation
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
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "Cart cannot be empty" });

            try
            {
                var order = await _orderService.CheckoutAsync(request);

                return Ok(new
                {
                    id = order.Id,
                    fullName = order.FullName,
                    address = order.Address,
                    city = order.City,
                    phone = order.Phone,
                    status = order.Status,
                    total = order.Total,
                    createdAt = order.CreatedAt,
                    items = order.Items.Select(i => new
                    {
                        productId = i.ProductId,
                        quantity = i.Quantity,
                        unitPrice = i.UnitPrice
                    })
                });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
