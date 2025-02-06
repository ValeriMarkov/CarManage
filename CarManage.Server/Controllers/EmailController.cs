using Microsoft.AspNetCore.Mvc;
using CarManage.Server.Services;
using Microsoft.Extensions.Logging;

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
        try
        {
            _logger.LogInformation("Incoming email request: {Email}, {Subject}, {Message}", request.Email, request.Subject, request.Message);

            await _notificationService.SendNotificationAsync(
                request.Email,
                request.Subject,
                request.Message
            );

            _logger.LogInformation("Email sent successfully");

            return Ok(new { message = "Email sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email");

            return BadRequest(new { error = ex.Message });
        }
    }
}

// DTO (Data Transfer Object) for the email request
public class EmailRequest
{
    public string Email { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
}