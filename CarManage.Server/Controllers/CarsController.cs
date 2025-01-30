using Microsoft.AspNetCore.Mvc;
using CarManage.Server.Models;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin.Auth;
using Newtonsoft.Json;

namespace CarManage.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger _logger;

        public CarsController(ApplicationDbContext context, ILogger<CarsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpOptions("")]
        public IActionResult Preflight()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:5173");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            return Ok();
        }

        // POST: api/cars
        [HttpPost]
        public async Task<IActionResult> AddCar([FromBody] Car car)
        {
            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            car.UserId = user.Uid;

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
        }

        // GET: api/cars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var cars = await _context.Cars.Where(c => c.UserId == user.Uid).ToListAsync();

            return Ok(cars);
        }

        // GET: api/cars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return car;
        }

        // PUT: api/cars/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, [FromBody] Car car)
        {
            _logger.LogInformation($"Received update request for car {id} with values: {JsonConvert.SerializeObject(car)}");
            _logger.LogInformation($"Received update request for car {id} with HorsePower: {car.HorsePower}");

            if (car.HorsePower == null || car.HorsePower == 0)
            {
                _logger.LogInformation("HorsePower property is null or empty");
            }

            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (id != car.Id)
            {
                return BadRequest("Car ID mismatch.");
            }

            var existingCar = await _context.Cars
                                            .Include(c => c.ServiceHistories)
                                            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == user.Uid);
            if (existingCar == null)
            {
                return NotFound("Car not found or you do not have permission to edit it.");
            }

            existingCar.Brand = car.Brand;
            existingCar.Model = car.Model;
            existingCar.Year = car.Year;
            existingCar.Color = car.Color;
            existingCar.Vin = car.Vin;
            existingCar.Engine = car.Engine;
            existingCar.HorsePower = car.HorsePower;
            existingCar.Odometer = car.Odometer;

            _context.Entry(existingCar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cars.Any(e => e.Id == id))
                {
                    return NotFound("Car not found during update.");
                }
                else
                {
                    throw;
                }
            }

            return Ok(existingCar);
        }

        // DELETE: api/cars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveCar(int id)
        {
            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id && c.UserId == user.Uid);

            if (car == null)
            {
                return NotFound("Car not found or you do not have permission to delete it.");
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car removed successfully." });
        }
    }
}
