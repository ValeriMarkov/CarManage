using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Globalization;
using CarManage.Server.Controllers;
using Newtonsoft.Json;

namespace CarManage.Server.Controllers
{
    [Route("api/cars/{carId}/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ServiceController> _logger;

        public ServiceController(ApplicationDbContext context, ILogger<ServiceController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class ServiceHistoryInput
        {
            public int CarId { get; set; }
            public string ServiceDate { get; set; }
            public string OdometerAtService { get; set; }
            public string Notes { get; set; }
            public List<ServiceType>? SelectedServices { get; set; }
        }

        // GET: api/cars/{carId}/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetServiceHistories(int carId)
        {
            _logger.LogInformation($"Fetching service histories for CarId: {carId}");

            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                _logger.LogWarning($"Car with CarId: {carId} not found");
                return NotFound("Car not found");
            }

            var serviceHistories = await _context.ServiceHistories
                                                 .Where(s => s.CarId == carId)
                                                 .ToListAsync();

            _logger.LogInformation($"Found {serviceHistories.Count} service histories for CarId: {carId}");

            return Ok(serviceHistories.Select(sh => new
            {
                sh.Id,
                sh.ServiceDate,
                sh.OdometerAtService,
                sh.Notes,
                selectedServices = Enum.GetValues(typeof(ServiceType))
                    .Cast<ServiceType>()
                    .Where(st => (sh.Services & (long)st) != 0)
                    .Select(st => st.ToString())
                    .ToList()
            }));
        }

        // GET: api/cars/{carId}/services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceHistoryInput>> GetServiceHistory(int carId, int id)
        {
            try
            {
                _logger.LogInformation($"Fetching service history for CarId: {carId} and ServiceId: {id}");

                var serviceHistory = await _context.ServiceHistories
                                                    .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

                if (serviceHistory == null)
                {
                    _logger.LogWarning($"Service history with Id {id} not found for CarId {carId}");
                    return NotFound("Service not found");
                }

                _logger.LogInformation($"Found service history with Id: {serviceHistory.Id} for CarId: {carId}");

                var selectedServices = Enum.GetValues(typeof(ServiceType))
                    .Cast<ServiceType>()
                    .Where(st => (serviceHistory.Services & (int)st) != 0)
                    .ToList();

                return Ok(new ServiceHistoryInput
                {
                    CarId = carId,
                    ServiceDate = serviceHistory.ServiceDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    OdometerAtService = serviceHistory.OdometerAtService.ToString(),
                    Notes = serviceHistory.Notes,
                    SelectedServices = selectedServices
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while fetching service history: {ex.Message}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ServiceHistory>> AddServiceHistory([FromRoute] int carId, [FromBody] ServiceHistoryInput serviceHistoryInput)
        {
            try
            {

                if (!ModelState.IsValid)
                {
                    var errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    _logger.LogWarning($"ModelState is not valid. Errors: {string.Join(", ", errorMessages)}");
                }

                if (carId <= 0)
                {
                    _logger.LogWarning($"CarId is not valid. CarId: {carId}");
                }

                if (serviceHistoryInput == null)
                {
                    _logger.LogWarning($"ServiceHistoryInput is null.");
                }

                if (carId != serviceHistoryInput.CarId)
                {
                    _logger.LogWarning($"CarId in URL does not match CarId in request body. CarId: {carId}, ServiceHistory CarId: {serviceHistoryInput.CarId}");
                    return BadRequest("CarId in URL does not match CarId in request body");
                }

                if (!ModelState.IsValid)
                {
                    var errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    _logger.LogWarning($"ModelState errors: {string.Join(", ", errorMessages)}");
                    return BadRequest(errorMessages);
                }

                var car = await _context.Cars.FindAsync(carId);
                if (car == null)
                {
                    _logger.LogWarning($"Car with CarId: {carId} not found");
                    return NotFound("Car not found");
                }

                var serviceHistory = new ServiceHistory
                {
                    CarId = carId,
                    ServiceDate = ParseServiceDate(serviceHistoryInput.ServiceDate),
                    OdometerAtService = int.Parse(serviceHistoryInput.OdometerAtService),
                    Notes = serviceHistoryInput.Notes,
                    Services = 0,
                };

                foreach (var serviceType in Enum.GetValues(typeof(ServiceType)))
                {
                    if (serviceHistoryInput.SelectedServices.Contains((ServiceType)serviceType))
                    {
                        serviceHistory.Services |= (long)serviceType;
                    }
                }

                _logger.LogInformation($"ServiceHistory created with Id: {serviceHistory.Id} for CarId: {carId}");

                try
                {
                    _logger.LogInformation($"Attempting to add ServiceHistory to database. ServiceHistory: {JsonConvert.SerializeObject(serviceHistory)}");
                    _context.ServiceHistories.Add(serviceHistory);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Service history added successfully for CarId: {carId}, ServiceHistory Id: {serviceHistory.Id}");
                    return CreatedAtAction(nameof(GetServiceHistory), new { carId, id = serviceHistory.Id }, serviceHistory);
                }
                catch (DbUpdateException ex)
                {
                    _logger.LogError($"Database update error occurred while adding service history: {ex.Message}");
                    _logger.LogError($"ServiceHistory: {JsonConvert.SerializeObject(serviceHistory)}");
                    _logger.LogError($"Exception details: {ex.StackTrace}");
                    return new JsonResult(new { error = "A database error occurred" }) { StatusCode = 500 };
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error occurred while adding service history: {ex.Message}");
                    _logger.LogError($"ServiceHistory: {JsonConvert.SerializeObject(serviceHistory)}");
                    _logger.LogError($"Exception details: {ex.StackTrace}");
                    return new JsonResult(new { error = "An error occurred" }) { StatusCode = 500 };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while adding service history: {ex.Message}");
                _logger.LogError($"Exception details: {ex.StackTrace}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceHistoryInput>> UpdateServiceHistory(int carId, int id, [FromBody] ServiceHistoryInput serviceHistoryInput)
        {
            if (serviceHistoryInput == null)
            {
                _logger.LogError("ServiceHistoryInput is null.");
                return BadRequest("ServiceHistoryInput is null.");
            }

            try
            {

                if (!ModelState.IsValid)
                {
                    var errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                    _logger.LogWarning($"ModelState errors: {string.Join(", ", errorMessages)}");
                    return BadRequest(errorMessages);
                }

                var existingService = await _context.ServiceHistories
                                                    .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

                if (existingService == null)
                {
                    _logger.LogWarning($"Service history with Id {id} not found for CarId {carId}");
                    return NotFound("Service not found");
                }

                if (!int.TryParse(serviceHistoryInput.OdometerAtService, out var odometerAtService))
                {
                    _logger.LogError("Failed to parse odometerAtService");
                    return BadRequest("Failed to parse odometerAtService");
                }

                try
                {
                    existingService.ServiceDate = ParseServiceDate(serviceHistoryInput.ServiceDate);
                }
                catch (FormatException ex)
                {
                    _logger.LogError($"Error parsing ServiceDate: {ex.Message}");
                    return BadRequest("Invalid ServiceDate format");
                }

                existingService.OdometerAtService = odometerAtService;
                existingService.Notes = serviceHistoryInput.Notes;
                existingService.Services = 0;
                foreach (var serviceType in Enum.GetValues(typeof(ServiceType)))
                {
                    if (serviceHistoryInput.SelectedServices.Contains((ServiceType)serviceType))
                    {
                        existingService.Services |= (int)serviceType;
                    }
                }

                _context.Entry(existingService).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Service history updated successfully for CarId: {carId}, ServiceHistory Id: {existingService.Id}");

                var updatedServiceHistoryInput = new ServiceHistoryInput
                {
                    CarId = carId,
                    ServiceDate = existingService.ServiceDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    OdometerAtService = existingService.OdometerAtService.ToString(),
                    Notes = existingService.Notes,
                    SelectedServices = Enum.GetValues(typeof(ServiceType))
                        .Cast<ServiceType>()
                        .Where(st => (existingService.Services & (int)st) != 0)
                        .ToList()
                };

                return Ok(updatedServiceHistoryInput);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while updating service history: {ex.Message}");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        // DELETE: api/cars/{carId}/services/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceHistory(int carId, int id)
        {
            var serviceHistory = await _context.ServiceHistories
                                                   .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

            if (serviceHistory == null)
            {
                _logger.LogWarning($"Service history with Id {id} not found for CarId {carId}");
                return NotFound("Service not found");
            }

            _context.ServiceHistories.Remove(serviceHistory);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Service history deleted successfully for CarId: {carId}, ServiceHistory Id: {id}");

            return NoContent();
        }

        [HttpGet("ServiceTypes")]
        public async Task<IActionResult> GetServiceTypes()
        {
            var serviceTypes = Enum.GetValues(typeof(ServiceType));
            return Ok(serviceTypes);
        }

        private DateTime ParseServiceDate(string serviceDate)
        {
            try
            {
                return DateTime.ParseExact(serviceDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
            }
            catch (FormatException ex)
            {
                _logger.LogError($"Error parsing ServiceDate: {ex.Message}");
                throw;
            }
        }
    }
}