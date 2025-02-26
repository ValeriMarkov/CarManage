using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CarManage.Server.Models;
using CarManage.Server.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class NotificationSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationSettingsController> _logger;

    public NotificationSettingsController(ApplicationDbContext context, INotificationService notificationService, ILogger<NotificationSettingsController> logger)
    {
        _context = context;
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpPut("{carId}")]
    public async Task<IActionResult> UpdateNotificationSettings(int carId, [FromBody] NotificationSettings notificationSettings)
    {
        _logger.LogInformation("Received request to update settings for Car ID: {CarId}", carId);
        _logger.LogInformation("Incoming Data: {NotificationSettings}", System.Text.Json.JsonSerializer.Serialize(notificationSettings));

        if (!ModelState.IsValid)
        {
            _logger.LogError("Invalid Model State: {@ModelState}", ModelState);
            return BadRequest(ModelState);
        }

        var car = await _context.Cars.FindAsync(carId);
        if (car == null)
        {
            _logger.LogError("Car not found with ID: {CarId}", carId);
            return NotFound(new { Message = "Car not found" });
        }

        try
        {
            if (car.NotificationSettings == null || !car.NotificationSettings.Any(ns => ns.CarId == carId))
            {
                car.NotificationSettings = new List<NotificationSettings>();
            }


            var existingSettings = car.NotificationSettings.FirstOrDefault(ns => ns.CarId == carId);
            if (existingSettings != null)
            {
                _logger.LogInformation("Updating existing notification settings...");
                existingSettings.OilChangeNotification = notificationSettings.OilChangeNotification;
                existingSettings.FilterChangeNotification = notificationSettings.FilterChangeNotification;
                existingSettings.AverageWeeklyMileage = notificationSettings.AverageWeeklyMileage;
                existingSettings.CurrentOdometer = notificationSettings.CurrentOdometer;
                existingSettings.LastOilChangeMileage = notificationSettings.LastOilChangeMileage;
                existingSettings.OilChangeInterval = notificationSettings.OilChangeInterval;
                existingSettings.IsAutomaticMileageTracking = notificationSettings.IsAutomaticMileageTracking;
                existingSettings.ManualOdometerEntry = notificationSettings.ManualOdometerEntry;
                existingSettings.UserId = notificationSettings.UserId;
            }
            else
            {
                _logger.LogInformation("Creating new notification settings...");
                notificationSettings.CarId = carId;
                car.NotificationSettings.Add(notificationSettings);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully saved notification settings.");

            await _notificationService.SendNotificationAsync(
                notificationSettings.Email,
                "Notification Settings Updated",
                $"Notification settings for car {carId} have been updated."
            );

            return Ok(notificationSettings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification settings for Car ID: {CarId}", carId);
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("{carId}")]
    public async Task<IActionResult> GetNotificationSettings(int carId)
    {
        _logger.LogInformation("Fetching notification settings for Car ID: {CarId}", carId);

        var car = await _context.Cars
            .Include(c => c.NotificationSettings)
            .FirstOrDefaultAsync(c => c.Id == carId);

        if (car == null || car.NotificationSettings == null || !car.NotificationSettings.Any())
        {
            return NotFound(new { Message = "No notification settings found for this car." });
        }

        return Ok(car.NotificationSettings);
    }

    [HttpGet("{carId}/{notificationId}")]
    public async Task<IActionResult> GetSingleNotification(int carId, int notificationId)
    {
        _logger.LogInformation("Fetching notification {NotificationId} for Car ID: {CarId}", notificationId, carId);

        var car = await _context.Cars
            .Include(c => c.NotificationSettings)
            .FirstOrDefaultAsync(c => c.Id == carId);

        if (car == null || car.NotificationSettings == null)
        {
            return NotFound(new { Message = "Car or notification settings not found." });
        }

        var notification = car.NotificationSettings.FirstOrDefault(ns => ns.Id == notificationId);
        if (notification == null)
        {
            return NotFound(new { Message = "Notification settings not found." });
        }

        return Ok(notification);
    }


    [HttpDelete("{carId}/{notificationId}")]
    public async Task<IActionResult> DeleteNotification(int carId, int notificationId)
    {
        _logger.LogInformation("Deleting notification with ID: {NotificationId} for Car ID: {CarId}", notificationId, carId);

        var notificationSettings = await _context.NotificationSettings
            .FirstOrDefaultAsync(ns => ns.Id == notificationId && ns.CarId == carId);

        if (notificationSettings == null)
        {
            return NotFound(new { Message = "Notification settings not found." });
        }

        _context.NotificationSettings.Remove(notificationSettings);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Successfully deleted notification for Car ID: {CarId}", carId);

        return Ok(new { Message = "Notification removed successfully." });
    }
}
