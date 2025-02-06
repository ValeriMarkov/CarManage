using CarManage.Server.Models;
using Microsoft.AspNetCore.Mvc;
using CarManage.Server.Services;

[ApiController]
[Route("api/[controller]")]
public class NotificationSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;

    public NotificationSettingsController(ApplicationDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpPut("{carId}")]
    public async Task<IActionResult> UpdateNotificationSettings(int carId, [FromBody] NotificationSettings notificationSettings)
    {
        var car = await _context.Cars.FindAsync(carId);
        if (car == null)
        {
            return NotFound();
        }

        var existingNotificationSettings = car.NotificationSettings?.FirstOrDefault(ns => ns.CarId == carId);
        if (existingNotificationSettings != null)
        {
            existingNotificationSettings.OilChangeNotification = notificationSettings.OilChangeNotification;
            existingNotificationSettings.FilterChangeNotification = notificationSettings.FilterChangeNotification;
            existingNotificationSettings.AverageWeeklyMileage = notificationSettings.AverageWeeklyMileage;
            existingNotificationSettings.CurrentOdometer = notificationSettings.CurrentOdometer;
            existingNotificationSettings.LastOilChangeMileage = notificationSettings.LastOilChangeMileage;
            existingNotificationSettings.OilChangeInterval = notificationSettings.OilChangeInterval;
            existingNotificationSettings.IsAutomaticMileageTracking = notificationSettings.IsAutomaticMileageTracking;
            existingNotificationSettings.ManualOdometerEntry = notificationSettings.ManualOdometerEntry;

            await _context.SaveChangesAsync();

            // Send email notification
            await _notificationService.SendNotificationAsync(
                notificationSettings.Email,
                "Notification Settings Updated",
                $"Notification settings for car {carId} have been updated."
            );

            return Ok(existingNotificationSettings);
        }
        else
        {
            notificationSettings.CarId = carId;
            car.NotificationSettings = new List<NotificationSettings> { notificationSettings };
            await _context.SaveChangesAsync();

            // Send email notification
            await _notificationService.SendNotificationAsync(
                notificationSettings.Email,
                "Notification Settings Created",
                $"Notification settings for car {carId} have been created."
            );

            return Ok(notificationSettings);
        }
    }
}