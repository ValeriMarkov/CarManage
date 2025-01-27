using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;

namespace CarManage.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Car> Cars { get; set; }  // Represents the Cars table
        public DbSet<ServiceHistory> ServiceHistories { get; set; } // Represents the ServiceHistories table

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuring the first relationship: CarId (mandatory foreign key)
            modelBuilder.Entity<ServiceHistory>()
                .HasOne(s => s.Car)
                .WithMany(c => c.ServiceHistories)
                .HasForeignKey(s => s.CarId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete
        }
    }
}
