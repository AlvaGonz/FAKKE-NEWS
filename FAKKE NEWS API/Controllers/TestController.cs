using Microsoft.AspNetCore.Mvc;

namespace FAKKE_NEWS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "API is working!", timestamp = DateTime.UtcNow });
        }
    }
}
