using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace CarManage.Server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(IConfiguration configuration, ILogger<NotificationService> logger)
        {
            _smtpServer = configuration["SmtpSettings:Server"];
            _smtpPort = int.Parse(configuration["SmtpSettings:Port"]);
            _smtpUsername = configuration["SmtpSettings:Username"];
            _smtpPassword = configuration["SmtpSettings:Password"];
            _fromEmail = configuration["SmtpSettings:FromEmail"]; // Use separate FromEmail config
            _logger = logger;
        }

        public async Task SendNotificationAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(_fromEmail)); // Use fromEmail instead of username
                message.To.Add(MailboxAddress.Parse(toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {ToEmail}", toEmail);
            }
            catch (SmtpCommandException ex)
            {
                _logger.LogError(ex, "SMTP Command Error while sending email to {ToEmail}", toEmail);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while sending email to {ToEmail}", toEmail);
                throw;
            }
        }
    }
}
