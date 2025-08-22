using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FAKKE_NEWS_API.Models;

namespace FAKKE_NEWS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class NewsController : ControllerBase
    {
        private readonly FAKKENEWSDBContext _context;

        public NewsController(FAKKENEWSDBContext context)
        {
            _context = context;
        }

        // GET: api/News
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetNews(
            [FromQuery] string? search,
            [FromQuery] int? countryId,
            [FromQuery] int? categoryId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.News
                .Include(n => n.Author)
                .Include(n => n.Category)
                .Include(n => n.Country)
                .AsNoTracking()
                .AsQueryable();

            // Filtros
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(n => n.Title.Contains(search) || n.Content.Contains(search));
            }

            if (countryId.HasValue)
            {
                query = query.Where(n => n.CountryId == countryId.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(n => n.CategoryId == categoryId.Value);
            }

            // Paginación
            var totalCount = await query.CountAsync();
            var news = await query
                .OrderByDescending(n => n.PublicationDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.PublicationDate,
                    n.CountryId,
                    CountryName = n.Country.Name,
                    n.CategoryId,
                    CategoryName = n.Category.Name,
                    n.AuthorId,
                    AuthorName = n.Author.Username,
                    n.ImagePath
                })
                .ToListAsync();

            return Ok(new
            {
                Data = news,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET: api/News/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetNews(int id)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .Include(n => n.Category)
                .Include(n => n.Country)
                .AsNoTracking()
                .Where(n => n.Id == id)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.PublicationDate,
                    n.CountryId,
                    CountryName = n.Country.Name,
                    n.CategoryId,
                    CategoryName = n.Category.Name,
                    n.AuthorId,
                    AuthorName = n.Author.Username,
                    n.ImagePath
                })
                .FirstOrDefaultAsync();

            if (news == null)
            {
                return NotFound();
            }

            return Ok(news);
        }

        // GET: api/News/ByCountry/5
        [HttpGet("ByCountry/{countryId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetNewsByCountry(int countryId)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .Include(n => n.Category)
                .Include(n => n.Country)
                .AsNoTracking()
                .Where(n => n.CountryId == countryId)
                .OrderByDescending(n => n.PublicationDate)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.PublicationDate,
                    n.CountryId,
                    CountryName = n.Country.Name,
                    n.CategoryId,
                    CategoryName = n.Category.Name,
                    n.AuthorId,
                    AuthorName = n.Author.Username,
                    n.ImagePath
                })
                .ToListAsync();

            return Ok(news);
        }

        // GET: api/News/ByCategory/5
        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetNewsByCategory(int categoryId)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .Include(n => n.Category)
                .Include(n => n.Country)
                .AsNoTracking()
                .Where(n => n.CategoryId == categoryId)
                .OrderByDescending(n => n.PublicationDate)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.PublicationDate,
                    n.CountryId,
                    CountryName = n.Country.Name,
                    n.CategoryId,
                    CategoryName = n.Category.Name,
                    n.AuthorId,
                    AuthorName = n.Author.Username,
                    n.ImagePath
                })
                .ToListAsync();

            return Ok(news);
        }

        // GET: api/News/Search/{term}
        [HttpGet("Search/{term}")]
        public async Task<ActionResult<IEnumerable<object>>> SearchNews(string term)
        {
            var news = await _context.News
                .Include(n => n.Author)
                .Include(n => n.Category)
                .Include(n => n.Country)
                .AsNoTracking()
                .Where(n => n.Title.Contains(term) || n.Content.Contains(term))
                .OrderByDescending(n => n.PublicationDate)
                .Select(n => new
                {
                    n.Id,
                    n.Title,
                    n.Content,
                    n.PublicationDate,
                    n.CountryId,
                    CountryName = n.Country.Name,
                    n.CategoryId,
                    CategoryName = n.Category.Name,
                    n.AuthorId,
                    AuthorName = n.Author.Username,
                    n.ImagePath
                })
                .ToListAsync();

            return Ok(news);
        }

        // POST: api/News
        [HttpPost]
        public async Task<ActionResult<News>> PostNews(News news)
        {
            _context.News.Add(news);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNews), new { id = news.Id }, news);
        }

        // PUT: api/News/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNews(int id, News news)
        {
            if (id != news.Id)
            {
                return BadRequest();
            }

            _context.Entry(news).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NewsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/News/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null)
            {
                return NotFound();
            }

            _context.News.Remove(news);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NewsExists(int id)
        {
            return _context.News.Any(e => e.Id == id);
        }
    }
}
