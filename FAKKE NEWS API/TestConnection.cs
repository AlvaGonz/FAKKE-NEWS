using Microsoft.EntityFrameworkCore;
using FAKKE_NEWS_API.Models;

namespace FAKKE_NEWS_API
{
    public class TestConnection
    {
        public static async Task TestDatabaseConnection()
        {
            var optionsBuilder = new DbContextOptionsBuilder<FAKKENEWSDBContext>();
            optionsBuilder.UseSqlServer("Data Source=ELEC\\MSSQLSERVER01;Initial Catalog=FAKKE NEWS;Integrated Security=True;Trust Server Certificate=True");
            
            using (var context = new FAKKENEWSDBContext(optionsBuilder.Options))
            {
                try
                {
                    // Test connection
                    await context.Database.CanConnectAsync();
                    Console.WriteLine("✅ Database connection successful");
                    
                    // Test categories
                    var categories = await context.Categories.ToListAsync();
                    Console.WriteLine($"✅ Found {categories.Count} categories");
                    
                    // Test countries
                    var countries = await context.Countries.ToListAsync();
                    Console.WriteLine($"✅ Found {countries.Count} countries");
                    
                    // Test news
                    var news = await context.News.ToListAsync();
                    Console.WriteLine($"✅ Found {news.Count} news items");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Database connection failed: {ex.Message}");
                }
            }
        }
    }
}
