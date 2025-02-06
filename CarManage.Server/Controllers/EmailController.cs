using Microsoft.AspNetCore.Mvc;
using CarManage.Server.Services;

[ApiController]
[Route("api/email")]
public class EmailController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public EmailController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        try
        {
            await _notificationService.SendNotificationAsync(
                request.Email,
                request.Subject,
                request.Message
            );

            return Ok(new { message = "Email sent successfully" });
        }
        catch (Exception ex)
        {
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
