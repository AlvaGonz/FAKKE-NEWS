using System.Linq;
using System.Threading.Tasks;
using FAKKE_NEWS_MVC.Data;
using FAKKE_NEWS_MVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FAKKE_NEWS_MVC.Controllers
{
    [Authorize(Policy = "EditorOrAdmin")]
    public class NewsController : Controller
    {
        private readonly AdminDbContext _db;
        private readonly UserManager<IdentityUser> _userManager;

        public NewsController(AdminDbContext db, UserManager<IdentityUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Challenge();
            }
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            var query = _db.News.AsNoTracking().AsQueryable();
            if (!isAdmin)
            {
                query = query.Where(n => n.AuthorId == user.Id);
            }
            var data = await query
                .OrderByDescending(n => n.PublicationDate)
                .ToListAsync();
            return View(data);
        }

        public IActionResult Create()
        {
            ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name");
            ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(News model, IFormFile? image)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CountryId);
                ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CategoryId);
                return View(model);
            }
            var user = await _userManager.GetUserAsync(User);
            model.AuthorId = user.Id;
            if (image != null && image.Length > 0)
            {
                var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
                const long maxBytes = 5L * 1024 * 1024; // 5 MB
                if (!allowed.Contains(image.ContentType.ToLower()) || image.Length > maxBytes)
                {
                    ModelState.AddModelError(string.Empty, "Imagen no válida. Solo JPG, PNG o WebP hasta 5 MB.");
                    ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CountryId);
                    ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CategoryId);
                    return View(model);
                }

                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsPath);
                var fileName = Guid.NewGuid().ToString("N") + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await image.CopyToAsync(stream);
                }
                model.ImagePath = $"/uploads/{fileName}";
            }
            _db.News.Add(model);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var item = await _db.News.FindAsync(id);
            if (item == null) return NotFound();
            var user = await _userManager.GetUserAsync(User);
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin && item.AuthorId != user.Id)
            {
                TempData["AuthMessage"] = "No puedes editar noticias de otros usuarios.";
                TempData["ToastType"] = "warning";
                Response.StatusCode = 403;
                return View("~/Views/Account/AccessDenied.cshtml");
            }
            ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", item.CountryId);
            ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", item.CategoryId);
            return View(item);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, News model, IFormFile? image)
        {
            if (id != model.Id) return BadRequest();
            if (!ModelState.IsValid)
            {
                ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CountryId);
                ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CategoryId);
                return View(model);
            }
            var user = await _userManager.GetUserAsync(User);
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            var existing = await _db.News.AsNoTracking().FirstOrDefaultAsync(n => n.Id == id);
            if (existing == null) return NotFound();
            if (!isAdmin && existing.AuthorId != user.Id)
            {
                TempData["AuthMessage"] = "No puedes editar noticias de otros usuarios.";
                TempData["ToastType"] = "warning";
                Response.StatusCode = 403;
                return View("~/Views/Account/AccessDenied.cshtml");
            }
            model.AuthorId = existing.AuthorId; // preserve original author
            if (image != null && image.Length > 0)
            {
                var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
                const long maxBytes = 5L * 1024 * 1024; // 5 MB
                if (!allowed.Contains(image.ContentType.ToLower()) || image.Length > maxBytes)
                {
                    ModelState.AddModelError(string.Empty, "Imagen no válida. Solo JPG, PNG o WebP hasta 5 MB.");
                    ViewBag.Countries = new SelectList(_db.Countries.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CountryId);
                    ViewBag.Categories = new SelectList(_db.Categories.AsNoTracking().OrderBy(c => c.Name), "Id", "Name", model.CategoryId);
                    return View(model);
                }

                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsPath);
                var fileName = Guid.NewGuid().ToString("N") + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await image.CopyToAsync(stream);
                }
                model.ImagePath = $"/uploads/{fileName}";
            }
            _db.Update(model);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.News.FindAsync(id);
            if (item == null) return NotFound();
            var user = await _userManager.GetUserAsync(User);
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin && item.AuthorId != user.Id)
            {
                TempData["AuthMessage"] = "No puedes eliminar noticias de otros usuarios.";
                TempData["ToastType"] = "warning";
                Response.StatusCode = 403;
                return View("~/Views/Account/AccessDenied.cshtml");
            }
            return View(item);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var item = await _db.News.FindAsync(id);
            if (item != null)
            {
                var user = await _userManager.GetUserAsync(User);
                var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                if (!isAdmin && item.AuthorId != user.Id) return Forbid();
                if (!string.IsNullOrEmpty(item.ImagePath))
                {
                    var physical = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.ImagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                    if (System.IO.File.Exists(physical))
                    {
                        System.IO.File.Delete(physical);
                    }
                }
                _db.News.Remove(item);
                await _db.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}


