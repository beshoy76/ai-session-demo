using Microsoft.AspNetCore.Mvc;

namespace ECommerceBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("ECommerceBE is running successfully.");
        }
    }
}
