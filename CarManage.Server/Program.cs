using CarManage.Server.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Filters;
using FluentValidation.AspNetCore;
using CarManage.Server.Validators;
using System.Text.Json.Serialization;
using System.Text.Json;
using CarManage.Server.Services;

namespace CarManage.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                var builder = WebApplication.CreateBuilder(args);

                // Firebase Initialization inside ConfigureServices
                builder.Services.AddSingleton(FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("C:\\Users\\valer\\carmanage-59888-55751e2e69ac.json")
                }));

                builder.Services.AddControllers(options =>
                {
                    options.Filters.Add<AddCorsHeadersFilter>();
                })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                })
                .AddFluentValidation(fv =>
                {
                    fv.RegisterValidatorsFromAssemblyContaining<ServiceHistoryValidator>();
                });

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
                        policy.WithOrigins("https://localhost:5173", "http://localhost:5173")
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
                });

                builder.Services.AddTransient<INotificationService, NotificationService>();
                builder.Services.AddHostedService<DailyNotificationService>();

                var app = builder.Build();

                // Enable HTTPS redirection
                app.UseHttpsRedirection();

                // Apply the CORS policy globally
                app.UseCors("AllowFrontendOrigin");

                // Configure the HTTP request pipeline
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }

                app.Use(async (context, next) =>
                {
                    if (context.Request.Path.StartsWithSegments("/swagger"))
                    {
                        await next();
                    }
                    else
                    {
                        await next();
                    }
                });

                app.UseMiddleware<FirebaseAuthMiddleware>();

                // Serve static files
                app.UseDefaultFiles();
                app.UseStaticFiles();

                // Middleware for handling Authentication & Authorization
                app.UseAuthentication();
                app.UseAuthorization();

                // Map API controllers
                app.MapControllers();

                // Fallback to index.html for SPA
                app.MapFallbackToFile("/index.html");

                // Run the application
                app.Run();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Application startup failed: {ex.Message}");
                throw;
            }
        }
    }
}
