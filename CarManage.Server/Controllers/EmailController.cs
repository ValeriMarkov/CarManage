using CarManage.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CarManage.Server.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<EmailController> _logger;

        public EmailController(INotificationService notificationService, ILogger<EmailController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Subject) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { error = "Invalid request. Email, Subject, and Message are required." });
            }

            try
            {
                _logger.LogInformation("Incoming email request to {Email} with subject: {Subject}", request.Email, request.Subject);

                await _notificationService.SendNotificationAsync(
                    request.Email,
                    request.Subject,
                    request.Message
                );

                _logger.LogInformation("Email successfully sent to {Email}", request.Email);
                return Ok(new { message = "Email sent successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", request.Email);
                return StatusCode(500, new { error = "Internal Server Error. Unable to send email." });
            }
        }
    }

    // DTO (Data Transfer Object) for email requests
    public class EmailRequest
    {
        public string Email { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
