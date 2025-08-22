using FAKKE_NEWS_MVC.Models;
using Microsoft.EntityFrameworkCore;

namespace FAKKE_NEWS_MVC.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<News> News { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Categories");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("Countries");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<News>(entity =>
            {
                entity.ToTable("News");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.PublicationDate).HasColumnType("datetime");
                entity.Property(e => e.AuthorId).IsRequired().HasMaxLength(450);
            });
        }
    }
}


