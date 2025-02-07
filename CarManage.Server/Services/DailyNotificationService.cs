using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarManage.Server.Models;
using CarManage.Server.Services;
using Microsoft.EntityFrameworkCore;

public class DailyNotificationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DailyNotificationService> _logger;

    public DailyNotificationService(IServiceProvider serviceProvider, ILogger<DailyNotificationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Daily Notification Service is running.");

            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                await SendNotificationsAsync(dbContext, notificationService);
            }

            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
        }
    }

    private async Task SendNotificationsAsync(ApplicationDbContext dbContext, INotificationService notificationService)
    {
        var cars = await dbContext.Cars
            .Include(c => c.NotificationSettings)
            .Where(c => c.NotificationSettings.Any())
            .ToListAsync();

        foreach (var car in cars)
        {
            var settings = car.NotificationSettings.FirstOrDefault();

            if (settings == null) continue;

            if (settings.IsAutomaticMileageTracking)
            {
                settings.CurrentOdometer += settings.AverageWeeklyMileage / 7;
            }

            // Check if oil change is due
            if (settings.OilChangeNotification &&
                settings.CurrentOdometer >= settings.LastOilChangeMileage + settings.OilChangeInterval)
            {
                await notificationService.SendNotificationAsync(
                    settings.Email,
                    "Oil Change Reminder",
                    $"Your car (ID: {car.Id}) is due for an oil change. Current mileage: {settings.CurrentOdometer}."
                );
            }

            // Check if filter change is due
            if (settings.FilterChangeNotification &&
                settings.CurrentOdometer >= settings.LastOilChangeMileage + (settings.OilChangeInterval * 2))
            {
                await notificationService.SendNotificationAsync(
                    settings.Email,
                    "Filter Change Reminder",
                    $"Your car (ID: {car.Id}) is due for a filter change. Current mileage: {settings.CurrentOdometer}."
                );
            }

            dbContext.Update(settings);
        }

        await dbContext.SaveChangesAsync();
        _logger.LogInformation("Daily notifications sent successfully.");
    }
}
