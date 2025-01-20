using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;
using Microsoft.Extensions.Logging; // Make sure this is included for logging
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CarManage.Server.Controllers
{
    [Route("api/cars/{carId}/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ServiceController> _logger; // Logger field

        // Inject ILogger into the constructor
        public ServiceController(ApplicationDbContext context, ILogger<ServiceController> logger)
        {
            _context = context;
            _logger = logger; // Assign logger to the field
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
                SelectedServices = sh.SelectedServices // Decode bitmask into service types
            }));
        }

        // GET: api/cars/{carId}/services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetServiceHistory(int carId, int id)
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

                _logger.LogInformation($"Found service history: {serviceHistory.Id}");

                return Ok(new
                {
                    serviceHistory.Id,
                    serviceHistory.ServiceDate,
                    serviceHistory.OdometerAtService,
                    serviceHistory.Notes,
                    SelectedServices = serviceHistory.SelectedServices
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error occurred while fetching service history: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/cars/{carId}/services
        [HttpPost]
        public async Task<ActionResult<ServiceHistory>> AddServiceHistory(int carId, [FromBody] ServiceHistory serviceHistory)
        {
            _logger.LogInformation($"Received request to add service history for CarId: {carId}");

            // Ensure CarId in URL matches the CarId in the body
            if (carId != serviceHistory.CarId)
            {
                _logger.LogWarning($"CarId in URL does not match CarId in request body. CarId: {carId}, ServiceHistory CarId: {serviceHistory.CarId}");
                return BadRequest("CarId in URL does not match CarId in request body");
            }

            // Log the SelectedServicesInput to check its contents
            _logger.LogInformation($"SelectedServicesInput: {string.Join(", ", serviceHistory.SelectedServicesInput)}");

            // Check if the model is valid
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                _logger.LogWarning($"ModelState errors: {string.Join(", ", errorMessages)}");
                return BadRequest(errorMessages);
            }

            // Verify if the car exists
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                _logger.LogWarning($"Car with CarId: {carId} not found");
                return NotFound("Car not found");
            }

            // Explicitly set the Car navigation property
            serviceHistory.Car = car; // This ensures the navigation property is populated

            // Ensure SelectedServicesInput is populated
            if (serviceHistory.SelectedServicesInput == null || !serviceHistory.SelectedServicesInput.Any())
            {
                _logger.LogWarning("SelectedServices cannot be empty");
                return BadRequest("SelectedServices cannot be empty.");
            }

            // Convert selected services to a bitmask
            int servicesBitmask = 0;
            foreach (var service in serviceHistory.SelectedServicesInput)
            {
                servicesBitmask |= (int)service;
            }

            serviceHistory.Services = servicesBitmask;

            // No need to include the Car object; set the CarId directly
            serviceHistory.CarId = carId;

            _context.ServiceHistories.Add(serviceHistory);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Service history added successfully for CarId: {carId}, ServiceHistory Id: {serviceHistory.Id}");

            return CreatedAtAction(nameof(GetServiceHistory), new { carId, id = serviceHistory.Id }, serviceHistory);
        }


        // PUT: api/cars/{carId}/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceHistory(int carId, int id, [FromBody] ServiceHistory serviceHistory)
        {
            _logger.LogInformation($"Received request to update service history for CarId: {carId} and ServiceId: {id}");

            // Check if the model is valid
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

            // Update fields
            existingService.ServiceDate = serviceHistory.ServiceDate;
            existingService.OdometerAtService = serviceHistory.OdometerAtService;
            existingService.Notes = serviceHistory.Notes;

            // Convert the list of selected services to a bitmask
            int servicesBitmask = 0;
            foreach (var service in serviceHistory.SelectedServicesInput)
            {
                servicesBitmask |= (int)service;
            }

            existingService.Services = servicesBitmask; // Update the bitmask field

            _context.Entry(existingService).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Service history updated successfully for CarId: {carId}, ServiceHistory Id: {existingService.Id}");

            return NoContent();
        }

        // DELETE: api/cars/{carId}/services/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceHistory(int carId, int id)
        {
            _logger.LogInformation($"Received request to delete service history for CarId: {carId} and ServiceId: {id}");

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
    }
}
