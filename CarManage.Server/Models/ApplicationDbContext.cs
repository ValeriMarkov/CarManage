using Microsoft.EntityFrameworkCore;

namespace CarManage.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Car> Cars { get; set; }  // Represents the Cars table
        public DbSet<ServiceHistory> ServiceHistories { get; set; } // Renamed for clarity

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<ServiceHistory>()
                .HasOne(sh => sh.Car) // ServiceHistory has one Car
                .WithMany(c => c.ServiceHistories) // Car has many ServiceHistories
                .HasForeignKey(sh => sh.CarId) // Foreign key
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete services when a car is deleted

            // Additional configurations if needed
        }
    }
}
