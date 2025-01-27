using CarManage.Server.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Filters;
using FluentValidation.AspNetCore;
using CarManage.Server.Validators;
using System.Text.Json.Serialization;


namespace CarManage.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Initialize Firebase Admin SDK (make sure the path is correct)
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("C:\\Users\\valer\\carmanage-59888-55751e2e69ac.json")
            });

            // Add services to the container
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<AddCorsHeadersFilter>();
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            })
            .AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssemblyContaining<ServiceHistoryValidator>();
            });

            // Add Entity Framework Core and configure SQL Server connection
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Swagger for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Add CORS configuration
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontendOrigin", policy =>
                {
                    policy.WithOrigins("https://localhost:5173", "http://localhost:5173") // Allow frontend origin
                          .AllowAnyMethod()                     // Allow all HTTP methods (GET, POST, etc.)
                          .AllowAnyHeader();                    // Allow all headers
                });
            });

            var app = builder.Build();

            // Enable HTTPS redirection
            app.UseHttpsRedirection();

            // Apply the CORS policy globally
            app.UseCors("AllowFrontendOrigin");

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
                    await next(); // Skip Firebase Authentication for Swagger
                }
                else
                {
                    // Apply Firebase Authentication Middleware for other routes
                    await next();
                }
            });

            // Use Firebase Authentication Middleware
            app.UseMiddleware<FirebaseAuthMiddleware>();

            // Serve static files
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Middleware for handling Authorization
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