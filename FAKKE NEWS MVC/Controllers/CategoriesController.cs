using System.Threading.Tasks;
using FAKKE_NEWS_MVC.Data;
using FAKKE_NEWS_MVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FAKKE_NEWS_MVC.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class CategoriesController : Controller
    {
        private readonly AdminDbContext _db;

        public CategoriesController(AdminDbContext db)
        {
            _db = db;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _db.Categories.AsNoTracking().ToListAsync();
            return View(data);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Category model)
        {
            if (!ModelState.IsValid)
                return View(model);

            _db.Categories.Add(model);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Category model)
        {
            if (id != model.Id) return BadRequest();
            if (!ModelState.IsValid) return View(model);
            _db.Update(model);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();
            return View(item);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item != null)
            {
                _db.Categories.Remove(item);
                await _db.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}


