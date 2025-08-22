using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FAKKE_NEWS_MVC.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AccountController(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            return View(new Models.LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(Models.LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
                TempData["AuthMessage"] = "No encontramos esa cuenta. Verifica tu usuario y contraseña.";
                TempData["ToastType"] = "error";
                return View(model);
            }

            await _signInManager.SignOutAsync();
            var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                TempData["AuthMessage"] = "Inicio de sesión exitoso";
                TempData["ToastType"] = "success";
                if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
                {
                    // Evitar bucles si returnUrl apunta a Register sin permisos
                    var signedUser = await _userManager.GetUserAsync(User);
                    var isAdmin = signedUser != null && await _userManager.IsInRoleAsync(signedUser, "Admin");
                    if (model.ReturnUrl.Contains("/Account/Register", StringComparison.OrdinalIgnoreCase) && !isAdmin)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                    return Redirect(model.ReturnUrl);
                }
                return RedirectToAction("Index", "Home");
            }

            ModelState.AddModelError(string.Empty, "Usuario o contraseña incorrectos.");
            TempData["AuthMessage"] = "Usuario o contraseña incorrectos.";
            TempData["ToastType"] = "error";
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Logout(string? returnUrl = null)
        {
            await _signInManager.SignOutAsync();
            await HttpContext.SignOutAsync();
            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet]
        public IActionResult Register()
        {
            return View(new Models.RegisterViewModel());
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(Models.RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);
            if (model.Role != "Admin" && model.Role != "Editor")
            {
                ModelState.AddModelError(string.Empty, "Rol inválido");
                return View(model);
            }

            var exists = await _userManager.FindByNameAsync(model.Username);
            if (exists != null)
            {
                ModelState.AddModelError(string.Empty, "El usuario ya existe.");
                TempData["AuthMessage"] = "El usuario ya existe. Elige otro nombre o recupera tu cuenta.";
                TempData["ToastType"] = "warning";
                return View(model);
            }

            var user = new IdentityUser { UserName = model.Username, Email = model.Email };
            var create = await _userManager.CreateAsync(user, model.Password);
            if (!create.Succeeded)
            {
                foreach (var e in create.Errors)
                {
                    ModelState.AddModelError(string.Empty, e.Description);
                }
                TempData["AuthMessage"] = "No pudimos crear la cuenta. Revisa los requisitos e inténtalo de nuevo.";
                TempData["ToastType"] = "error";
                return View(model);
            }

            var addToRole = await _userManager.AddToRoleAsync(user, model.Role);
            if (!addToRole.Succeeded)
            {
                foreach (var e in addToRole.Errors)
                {
                    ModelState.AddModelError(string.Empty, e.Description);
                }
                TempData["AuthMessage"] = "No se pudo asignar el rol. Intenta nuevamente.";
                TempData["ToastType"] = "error";
                return View(model);
            }

            TempData["AuthMessage"] = "Usuario creado exitosamente. Inicia sesión para continuar.";
            TempData["ToastType"] = "success";
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                ModelState.AddModelError(string.Empty, "Ingresa tu usuario");
                return View();
            }
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                // No revelar si el usuario existe
                return View("ForgotPasswordConfirmation");
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, token = token }, Request.Scheme);
            ViewData["DevResetUrl"] = resetUrl; // Mostrar en dev
            return View("ForgotPasswordConfirmation");
        }

        [HttpGet]
        public IActionResult ResetPassword(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token)) return BadRequest();
            ViewData["UserId"] = userId;
            ViewData["Token"] = token;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(string userId, string token, string password)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token) || string.IsNullOrEmpty(password))
            {
                ModelState.AddModelError(string.Empty, "Datos inválidos");
                ViewData["UserId"] = userId;
                ViewData["Token"] = token;
                return View();
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return View("ResetPasswordConfirmation");
            }
            var result = await _userManager.ResetPasswordAsync(user, token, password);
            if (!result.Succeeded)
            {
                foreach (var e in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, e.Description);
                }
                ViewData["UserId"] = userId;
                ViewData["Token"] = token;
                return View();
            }
            return View("ResetPasswordConfirmation");
        }
    }
}


