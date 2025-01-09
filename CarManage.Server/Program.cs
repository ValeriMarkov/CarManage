using CarManage.Server.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;

namespace CarManage.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Initialize Firebase Admin SDK
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.GetApplicationDefault(),
            });

            // Add services to the container.
            builder.Services.AddControllers();

            // Add Entity Framework Core and configure SQL Server connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Swagger for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Static files and default files
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Middleware to skip Firebase Authentication for Swagger
            app.Use(async (context, next) =>
            {
                // Skip authentication for Swagger endpoints
                if (context.Request.Path.StartsWithSegments("/swagger"))
                {
                    await next();
                }
                else
                {
                    // Pass control to Firebase Authentication Middleware
                    await next();
                }
            });

            // Use Firebase Authentication Middleware (to check Firebase token on every request)
            app.UseMiddleware<FirebaseAuthMiddleware>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map controllers (your API endpoints)
            app.MapControllers();

            // Fallback to index.html for SPA routing
            app.MapFallbackToFile("/index.html");

            // Run the application
            app.Run();
        }
    }
}
