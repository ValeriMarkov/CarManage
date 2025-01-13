using Microsoft.AspNetCore.Mvc;
using CarManage.Server.Models;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin.Auth;

namespace CarManage.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Handle Preflight Requests for CORS
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

            // Associate the car with the user
            car.UserId = user.Uid;

            // Save the car to the database
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

            // Fetch only the cars that belong to the logged-in user
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
            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            if (id != car.Id)
            {
                return BadRequest("Car ID mismatch.");
            }

            // Check if the car exists and belongs to the logged-in user
            var existingCar = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id && c.UserId == user.Uid);
            if (existingCar == null)
            {
                return NotFound("Car not found or you do not have permission to edit it.");
            }

            // Update car details
            existingCar.Brand = car.Brand;
            existingCar.Model = car.Model;
            existingCar.Year = car.Year;
            existingCar.Color = car.Color;
            existingCar.Vin = car.Vin;
            existingCar.Engine = car.Engine;
            existingCar.HorsePower = car.HorsePower;

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

            // Return the updated car object as a JSON response
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

            // Find the car by ID and ensure it belongs to the authenticated user
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.Id == id && c.UserId == user.Uid);

            if (car == null)
            {
                return NotFound("Car not found or you do not have permission to delete it.");
            }

            // Remove the car
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            // Return a successful response
            return Ok(new { message = "Car removed successfully." });
        }
    }
}
