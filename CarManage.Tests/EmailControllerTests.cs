using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using CarManage.Server.Controllers;
using CarManage.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CarManage.Tests
{
    public class EmailControllerTests
    {
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<ILogger<EmailController>> _mockLogger;
        private readonly EmailController _controller;

        public EmailControllerTests()
        {
            _mockNotificationService = new Mock<INotificationService>();
            _mockLogger = new Mock<ILogger<EmailController>>();
            _controller = new EmailController(_mockNotificationService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task SendEmail_ValidRequest_CallsSendNotificationAsyncAndReturnsOk()
        {
            var request = new EmailRequest
            {
                Email = "test@example.com",
                Subject = "Test Subject",
                Message = "Hello!"
            };

            _mockNotificationService
                .Setup(s => s.SendNotificationAsync(request.Email, request.Subject, request.Message))
                .Returns(Task.CompletedTask);

            var result = await _controller.SendEmail(request);

            _mockNotificationService.Verify(s => s.SendNotificationAsync(
                request.Email, request.Subject, request.Message), Times.Once);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task SendEmail_InvalidRequest_ReturnsBadRequest()
        {
            var request = new EmailRequest { Email = "", Subject = "", Message = "" };
            var result = await _controller.SendEmail(request);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);

            Assert.Equal(400, badRequest.StatusCode);

            _mockNotificationService.Verify(
                s => s.SendNotificationAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()),
                Times.Never);
        }
    }
}
