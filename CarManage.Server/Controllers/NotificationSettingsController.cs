using CarManage.Server.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class NotificationSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationSettingsController(ApplicationDbContext context)
    {
        _context = context;
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
            return Ok(existingNotificationSettings);
        }
        else
        {
            notificationSettings.CarId = carId;
            car.NotificationSettings = new List<NotificationSettings> { notificationSettings };
            await _context.SaveChangesAsync();
            return Ok(notificationSettings);
        }
    }
}