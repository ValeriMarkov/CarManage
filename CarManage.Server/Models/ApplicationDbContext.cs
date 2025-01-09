using Microsoft.EntityFrameworkCore;

namespace CarManage.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Car> Cars { get; set; }  // Represents the Cars table
    }
}