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
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
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
    }
}
