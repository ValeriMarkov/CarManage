using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;

namespace CarManage.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Car> Cars { get; set; }
        public DbSet<ServiceHistory> ServiceHistories { get; set; }
        public DbSet<NotificationSettings> NotificationSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ServiceHistory>()
                .HasOne(s => s.Car)
                .WithMany(c => c.ServiceHistories)
                .HasForeignKey(s => s.CarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NotificationSettings>()
                .HasOne(ns => ns.Car)
                .WithMany(c => c.NotificationSettings)
                .HasForeignKey(ns => ns.CarId);
        }
    }
}