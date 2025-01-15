using Microsoft.EntityFrameworkCore;

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

            // Configure relationships

            // The ServiceHistory model will reference CarId, not the Car navigation property
            modelBuilder.Entity<ServiceHistory>()
                .HasOne<Car>()  // Specifies that ServiceHistory has one Car
                .WithMany()  // Car can have many ServiceHistories
                .HasForeignKey(sh => sh.CarId) // Foreign key is CarId
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete when Car is deleted

            // Additional configurations if needed
        }
    }
}
