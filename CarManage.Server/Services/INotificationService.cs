namespace CarManage.Server.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string email, string subject, string body);
    }
}

namespace CarManage.Server.Services
{
    public class NotificationService : INotificationService
    {
        public async Task SendNotificationAsync(string email, string subject, string body)
        {
            // Implement the email sending logic here
        }
    }
}