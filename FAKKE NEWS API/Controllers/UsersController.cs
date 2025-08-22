using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FAKKE_NEWS_API.Models;

namespace FAKKE_NEWS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly FAKKENEWSDBContext _context;

        public UsersController(FAKKENEWSDBContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        [Produces("application/json")]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Users.AsNoTracking().AsQueryable();

            var totalCount = await query.CountAsync();
            var data = await query
                .OrderBy(u => u.Username)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.NormalizedUserName,
                    u.NormalizedEmail
                })
                .ToListAsync();

            return Ok(new
            {
                Data = data,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<ActionResult<object>> GetUser(string id)
        {
            var user = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.NormalizedUserName,
                    u.NormalizedEmail
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
