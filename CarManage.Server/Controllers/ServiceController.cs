using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarManage.Server.Models;
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

        public ServiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/cars/{carId}/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetServiceHistories(int carId)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                return NotFound("Car not found");
            }

            var serviceHistories = await _context.ServiceHistories
                                                 .Where(s => s.CarId == carId)
                                                 .ToListAsync();

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
            var serviceHistory = await _context.ServiceHistories
                                               .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

            if (serviceHistory == null)
            {
                return NotFound("Service not found");
            }

            return Ok(new
            {
                serviceHistory.Id,
                serviceHistory.ServiceDate,
                serviceHistory.OdometerAtService,
                serviceHistory.Notes,
                SelectedServices = serviceHistory.SelectedServices // Decode bitmask into service types
            });
        }

        // POST: api/cars/{carId}/services
        [HttpPost]
        public async Task<ActionResult<ServiceHistory>> AddServiceHistory(int carId, [FromBody] ServiceHistory serviceHistory)
        {
            // Ensure CarId is correctly set
            if (carId != serviceHistory.CarId)
            {
                return BadRequest("CarId in URL does not match CarId in request body");
            }

            // Ensure CarId exists in the database
            var carExists = await _context.Cars.AnyAsync(c => c.Id == carId);
            if (!carExists)
            {
                return NotFound("Car not found");
            }

            // Convert selected services to a bitmask
            if (serviceHistory.SelectedServices == null || !serviceHistory.SelectedServices.Any())
            {
                return BadRequest("SelectedServices cannot be empty.");
            }

            int servicesBitmask = 0;
            foreach (var service in serviceHistory.SelectedServices)
            {
                servicesBitmask |= (int)service;
            }
            serviceHistory.Services = servicesBitmask; // Store the bitmask in the database

            // Save to the database
            _context.ServiceHistories.Add(serviceHistory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceHistory), new { carId, id = serviceHistory.Id }, serviceHistory);
        }



        // PUT: api/cars/{carId}/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceHistory(int carId, int id, [FromBody] ServiceHistory serviceHistory)
        {
            var existingService = await _context.ServiceHistories
                                                .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

            if (existingService == null)
            {
                return NotFound("Service not found");
            }

            // Update fields
            existingService.ServiceDate = serviceHistory.ServiceDate;
            existingService.OdometerAtService = serviceHistory.OdometerAtService;
            existingService.Notes = serviceHistory.Notes;

            // Convert the list of selected services to a bitmask
            int servicesBitmask = 0;
            foreach (var service in serviceHistory.SelectedServices)
            {
                servicesBitmask |= (int)service;
            }

            existingService.Services = servicesBitmask; // Update the bitmask field

            _context.Entry(existingService).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/cars/{carId}/services/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceHistory(int carId, int id)
        {
            var serviceHistory = await _context.ServiceHistories
                                               .FirstOrDefaultAsync(s => s.CarId == carId && s.Id == id);

            if (serviceHistory == null)
            {
                return NotFound("Service not found");
            }

            _context.ServiceHistories.Remove(serviceHistory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
