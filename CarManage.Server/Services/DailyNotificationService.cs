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

            await CheckAndSendNotification(notificationService, settings, settings.OilChangeNotification, settings.LastOilChangeMileage, settings.OilChangeInterval, car, "Oil Change");
            await CheckAndSendNotification(notificationService, settings, settings.FilterChangeNotification, settings.LastOilChangeMileage, settings.OilChangeInterval * 2, car, "Filter Change");
            await CheckAndSendNotification(notificationService, settings, settings.BrakePadsNotification, settings.LastBrakePadsChangeMileage, settings.BrakePadsChangeInterval, car, "Brake Pads Change");
            await CheckAndSendNotification(notificationService, settings, settings.TireRotationNotification, settings.LastTireRotationMileage, settings.TireRotationInterval, car, "Tire Rotation");
            await CheckAndSendNotification(notificationService, settings, settings.BatteryCheckNotification, settings.LastBatteryCheckMileage, settings.BatteryCheckInterval, car, "Battery Check");
            await CheckAndSendNotification(notificationService, settings, settings.TransmissionFluidChangeNotification, settings.LastTransmissionFluidChangeMileage, settings.TransmissionFluidChangeInterval, car, "Transmission Fluid Change");
            await CheckAndSendNotification(notificationService, settings, settings.EngineFlushNotification, settings.LastEngineFlushMileage, settings.EngineFlushInterval, car, "Engine Flush");
            await CheckAndSendNotification(notificationService, settings, settings.CoolantFlushNotification, settings.LastCoolantFlushMileage, settings.CoolantFlushInterval, car, "Coolant Flush");
            await CheckAndSendNotification(notificationService, settings, settings.SparkPlugChangeNotification, settings.LastSparkPlugChangeMileage, settings.SparkPlugChangeInterval, car, "Spark Plug Change");
            await CheckAndSendNotification(notificationService, settings, settings.TimingBeltNotification, settings.LastTimingBeltChangeMileage, settings.TimingBeltChangeInterval, car, "Timing Belt Replacement");
            await CheckAndSendNotification(notificationService, settings, settings.FuelInjectionCleaningNotification, settings.LastFuelInjectionCleaningMileage, settings.FuelInjectionCleaningInterval, car, "Fuel Injection Cleaning");
            await CheckAndSendNotification(notificationService, settings, settings.AlignmentNotification, settings.LastAlignmentMileage, settings.AlignmentInterval, car, "Wheel Alignment");
            await CheckAndSendNotification(notificationService, settings, settings.SuspensionNotification, settings.LastSuspensionCheckMileage, settings.SuspensionCheckInterval, car, "Suspension Check");
            await CheckAndSendNotification(notificationService, settings, settings.AcRechargeNotification, settings.LastAcRechargeMileage, settings.AcRechargeInterval, car, "A/C Recharge");
            await CheckAndSendNotification(notificationService, settings, settings.DifferentialFluidChangeNotification, settings.LastDifferentialFluidChangeMileage, settings.DifferentialFluidChangeInterval, car, "Differential Fluid Change");
            await CheckAndSendNotification(notificationService, settings, settings.TimingChainChangeNotification, settings.LastTimingChainChangeMileage, settings.TimingChainChangeInterval, car, "Timing Chain Change");
            await CheckAndSendNotification(notificationService, settings, settings.ClutchReplacementNotification, settings.LastClutchReplacementMileage, settings.ClutchReplacementInterval, car, "Clutch Replacement");

            dbContext.Update(settings);
        }

        await dbContext.SaveChangesAsync();
        _logger.LogInformation("Daily notifications sent successfully.");
    }

    private async Task CheckAndSendNotification(INotificationService notificationService, NotificationSettings settings, bool isEnabled, int lastServiceMileage, int interval, Car car, string serviceName)
    {
        if (!isEnabled) return;

        int nextServiceMileage = lastServiceMileage + interval;
        int remainingKm = nextServiceMileage - settings.CurrentOdometer;

        if (remainingKm == 1000 || remainingKm <= 0)
        {
            await notificationService.SendNotificationAsync(
                settings.Email,
                $"{serviceName} Reminder",
                $"Your car ({car.Brand} {car.Model}, {car.Year}, {car.Color}) is due for {serviceName} in {remainingKm} km. Calculated current odometer: {settings.CurrentOdometer} km. Please update odometer manually, if actual odometer is less/more."
            );
        }
    }
}
