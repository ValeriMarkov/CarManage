using System.Text.Json.Serialization;

namespace CarManage.Server.Models
{
    public class NotificationSettings
    {
        public int Id { get; set; }
        public int? CarId { get; set; }
        public string UserId { get; set; }
        public bool OilChangeNotification { get; set; }
        public bool FilterChangeNotification { get; set; }
        public int AverageWeeklyMileage { get; set; }
        public int CurrentOdometer { get; set; }
        public int LastOilChangeMileage { get; set; }
        public int OilChangeInterval { get; set; }
        public bool IsAutomaticMileageTracking { get; set; }
        public int ManualOdometerEntry { get; set; }
        public string Email { get; set; }

        [JsonIgnore]
        public Car? Car { get; set; }
    }
}
