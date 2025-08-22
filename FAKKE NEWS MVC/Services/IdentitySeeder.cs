using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FAKKE_NEWS_MVC.Services
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            // Ensure roles
            string[] roles = new[] { "Admin", "Editor" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Ensure admin user
            var adminUserName = configuration["AdminUser:UserName"] ?? "admin";
            var adminEmail = configuration["AdminUser:Email"] ?? "admin@example.com";
            var adminPassword = configuration["AdminUser:Password"] ?? "Admin123$";

            var admin = await userManager.FindByNameAsync(adminUserName);
            if (admin == null)
            {
                admin = new IdentityUser
                {
                    UserName = adminUserName,
                    Email = adminEmail
                };
                var result = await userManager.CreateAsync(admin, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}


