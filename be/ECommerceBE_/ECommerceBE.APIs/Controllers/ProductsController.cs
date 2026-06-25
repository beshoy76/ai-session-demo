using ECommerceBE.Presistance.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceBE.APIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public ProductsController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Category)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    description = p.Description,
                    price = p.Price,
                    imageUrl = p.ImageUrl,
                    categoryName = p.Category != null ? p.Category.Name : string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}
