using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using MailKitSmtp = MailKit.Net.Smtp;

namespace CarManage.Server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly ILogger _logger;

        public NotificationService(IConfiguration configuration, ILogger<NotificationService> logger)
        {
            _smtpServer = configuration["SmtpSettings:Server"];
            _smtpPort = int.Parse(configuration["SmtpSettings:Port"]);
            _smtpUsername = configuration["SmtpSettings:Username"];
            _smtpPassword = configuration["SmtpSettings:Password"];
            _logger = logger;
        }

        public async Task SendNotificationAsync(string email, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(_smtpUsername));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = body;
                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new MailKitSmtp.SmtpClient())
                {
                    await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
            }
            catch (MailKit.Net.Smtp.SmtpCommandException ex)
            {
                // log the exception and rethrow it
                _logger.LogError(ex, "Error sending email");
                throw;
            }
            catch (Exception ex)
            {
                // log the exception and rethrow it
                _logger.LogError(ex, "Error sending email");
                throw;
            }
        }
    }
}