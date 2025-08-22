using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FAKKE_NEWS_MVC.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map Identity to existing tables
            modelBuilder.Entity<IdentityUser>(b =>
            {
                b.ToTable("Users");
                b.Property(u => u.Id).HasColumnName("Id").HasMaxLength(450);
                b.Property(u => u.UserName).HasColumnName("Username").HasMaxLength(50);
                b.Property(u => u.NormalizedUserName).HasColumnName("NormalizedUserName").HasMaxLength(256);
                b.Property(u => u.Email).HasColumnName("Email").HasMaxLength(256);
                b.Property(u => u.NormalizedEmail).HasColumnName("NormalizedEmail").HasMaxLength(256);
                b.Property(u => u.PasswordHash).HasColumnName("PasswordHash");

                // Ignore columns not present in database
                // DB no contiene estas columnas de Identity, ignorarlas para evitar consultas a columnas inexistentes
                b.Ignore(u => u.EmailConfirmed);
                b.Ignore(u => u.SecurityStamp);
                b.Ignore(u => u.LockoutEnabled);
                b.Ignore(u => u.LockoutEnd);
                b.Ignore(u => u.AccessFailedCount);
                b.Ignore(u => u.PhoneNumber);
                b.Ignore(u => u.PhoneNumberConfirmed);
                b.Ignore(u => u.TwoFactorEnabled);
                b.Ignore(u => u.ConcurrencyStamp);
            });

            modelBuilder.Entity<IdentityRole>(b =>
            {
                b.ToTable("AspNetRoles");
            });
            modelBuilder.Entity<IdentityRoleClaim<string>>(b =>
            {
                b.ToTable("AspNetRoleClaims");
            });
            modelBuilder.Entity<IdentityUserClaim<string>>(b =>
            {
                b.ToTable("AspNetUserClaims");
            });
            modelBuilder.Entity<IdentityUserLogin<string>>(b =>
            {
                b.ToTable("AspNetUserLogins");
            });
            modelBuilder.Entity<IdentityUserRole<string>>(b =>
            {
                b.ToTable("AspNetUserRoles");
            });
            modelBuilder.Entity<IdentityUserToken<string>>(b =>
            {
                b.ToTable("AspNetUserTokens");
            });
        }
    }
}
