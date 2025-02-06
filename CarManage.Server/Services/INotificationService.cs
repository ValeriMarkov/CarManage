namespace CarManage.Server.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string email, string subject, string body);
    }
}