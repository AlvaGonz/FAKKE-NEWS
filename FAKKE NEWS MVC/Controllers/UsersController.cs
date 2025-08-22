using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FAKKE_NEWS_MVC.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    public class UsersController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public IActionResult Index(string? search, int page = 1, int pageSize = 10)
        {
            var query = _userManager.Users.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(u => (u.UserName ?? "").Contains(search) || (u.Email ?? "").Contains(search));
            }
            var total = query.Count();
            var data = query
                .OrderBy(u => u.UserName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.Total = total;
            ViewBag.Page = page;
            ViewBag.PageSize = pageSize;
            ViewBag.Search = search;
            return View(data);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Lock(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
            TempData["AuthMessage"] = "Usuario bloqueado";
            TempData["ToastType"] = "success";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Unlock(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            await _userManager.SetLockoutEndDateAsync(user, null);
            await _userManager.ResetAccessFailedCountAsync(user);
            TempData["AuthMessage"] = "Usuario desbloqueado";
            TempData["ToastType"] = "success";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SetRole(string id, string role)
        {
            if (role != "Admin" && role != "Editor")
            {
                TempData["AuthMessage"] = "Rol inválido";
                TempData["ToastType"] = "error";
                return RedirectToAction(nameof(Index));
            }
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
            await _userManager.AddToRoleAsync(user, role);
            TempData["AuthMessage"] = "Rol actualizado";
            TempData["ToastType"] = "success";
            return RedirectToAction(nameof(Index));
        }
    }
}


