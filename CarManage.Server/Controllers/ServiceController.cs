using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using static CarManage.Server.Controllers.ServiceController;

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
                SelectedServices = sh.SelectedServices
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
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        // POST: api/cars/{carId}/services
        [HttpPost]
        public async Task<ActionResult<ServiceHistory>> AddServiceHistory([FromRoute] int carId, [FromBody] ServiceHistoryInput serviceHistoryInput)
        {
            try
            {
                _logger.LogInformation($"Received request to add service history for CarId: {carId}");

                if (carId != serviceHistoryInput.CarId)
                {
                    _logger.LogWarning($"CarId in URL does not match CarId in request body. CarId: {carId}, ServiceHistory CarId: {serviceHistoryInput.CarId}");
                    return BadRequest("CarId in URL does not match CarId in request body");
                }

                _logger.LogInformation($"SelectedServicesInput: {string.Join(", ", serviceHistoryInput.SelectedServicesInput)}");

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

                if (serviceHistoryInput.SelectedServicesInput == null || !serviceHistoryInput.SelectedServicesInput.Any())
                {
                    _logger.LogWarning("SelectedServices cannot be empty");
                    return BadRequest("SelectedServices cannot be empty.");
                }

                int servicesBitmask = 0;
                foreach (var serviceId in serviceHistoryInput.SelectedServicesInput)
                {
                    if (Enum.TryParse(serviceId.ToString(), out ServiceType serviceType))
                    {
                        servicesBitmask |= (int)serviceType;
                    }
                    else
                    {
                        _logger.LogWarning($"Invalid service ID: {serviceId}");
                        return BadRequest("Invalid service ID");
                    }
                }

                var serviceHistory = new ServiceHistory
                {
                    CarId = carId,
                    ServiceDate = serviceHistoryInput.ServiceDate,
                    OdometerAtService = serviceHistoryInput.OdometerAtService,
                    Notes = serviceHistoryInput.Notes,
                    Services = servicesBitmask,
                    SelectedServicesInput = serviceHistoryInput.SelectedServicesInput.Select(x => (ServiceType)x).ToList()
                };

                serviceHistory.ConvertSelectedServicesToBitmask();

                try
                {
                    _context.ServiceHistories.Add(serviceHistory);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Service history added successfully for CarId: {carId}, ServiceHistory Id: {serviceHistory.Id}");
                    return CreatedAtAction(nameof(GetServiceHistory), new { carId, id = serviceHistory.Id }, serviceHistory);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Error occurred while adding service history");
                    return new JsonResult(new { error = "An error occurred" }) { StatusCode = 500 };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while handling request");
                return new JsonResult(new { error = "An error occurred" }) { StatusCode = 500 };
            }
        }

        // PUT: api/cars/{carId}/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceHistory(int carId, int id, [FromBody] ServiceHistoryUpdateInput serviceHistoryUpdateInput)
        {
            _logger.LogInformation($"Received request to update service history for CarId: {carId} and ServiceId: {id}");

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

            existingService.ServiceDate = serviceHistoryUpdateInput.ServiceDate;
            existingService.OdometerAtService = serviceHistoryUpdateInput.OdometerAtService;
            existingService.Notes = serviceHistoryUpdateInput.Notes;

            int servicesBitmask = 0;
            foreach (var serviceId in serviceHistoryUpdateInput.SelectedServicesInput)
            {
                ServiceType serviceType;
                if (Enum.TryParse(serviceId.ToString(), out serviceType))
                {
                    servicesBitmask |= (int)serviceType;
                }
                else
                {
                    _logger.LogWarning($"Invalid service ID: {serviceId}");
                    return BadRequest("Invalid service ID");
                }
            }

            existingService.Services = servicesBitmask;

            _context.Entry(existingService).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Service history updated successfully for CarId: {carId}, ServiceHistory Id: {existingService.Id}");

            return NoContent();
        }

        public class ServiceHistoryUpdateInput
        {
            public DateTime ServiceDate { get; set; }
            public int OdometerAtService { get; set; }
            public string Notes { get; set; }
            public string[] SelectedServicesInput { get; set; }
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