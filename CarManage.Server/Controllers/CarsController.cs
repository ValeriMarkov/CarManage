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

        // POST: api/cars
        [HttpPost]
        public async Task<IActionResult> AddCar([FromBody] Car car)
        {
            var user = HttpContext.Items["User"] as FirebaseToken;

            if (user == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Save the car to the database
            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            // Return the car with the CreatedAtAction result
            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
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

        // Other methods (if any) can go here...
    }
}
