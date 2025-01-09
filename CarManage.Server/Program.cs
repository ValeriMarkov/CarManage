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
                Credential = GoogleCredential.FromFile("C:\\Users\\valer\\carmanage-59888-55751e2e69ac.json")
            });

            // Add services to the container
            builder.Services.AddControllers();

            // Add Entity Framework Core and configure SQL Server connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Swagger for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Enable CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", policy =>
                {
                    policy.AllowAnyOrigin()  // Allow all origins
                          .AllowAnyMethod()  // Allow any HTTP methods (GET, POST, etc.)
                          .AllowAnyHeader(); // Allow any headers
                });
            });

            // Add authentication (JWT, Firebase, etc.)
            // If using Firebase or other authentication, configure here.

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                // Serve Swagger UI before applying Firebase authentication
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Middleware to skip Firebase Authentication for Swagger requests
            app.Use(async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments("/swagger"))
                {
                    await next(); // Skip Firebase Authentication
                }
                else
                {
                    // Apply Firebase Authentication Middleware for other routes
                    await next();
                }
            });

            // Enable CORS globally
            app.UseCors("AllowAllOrigins");

            // Use Firebase Authentication Middleware
            app.UseMiddleware<FirebaseAuthMiddleware>();

            // Serve static files
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Middleware for handling HTTPS redirection and Authorization
            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map API controllers
            app.MapControllers();

            // Fallback to index.html for SPA
            app.MapFallbackToFile("/index.html");

            // Run the application
            app.Run();
        }
    }
}
