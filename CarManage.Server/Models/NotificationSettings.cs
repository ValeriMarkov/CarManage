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

        public bool BrakePadsNotification { get; set; }
        public int LastBrakePadsChangeMileage { get; set; }
        public int BrakePadsChangeInterval { get; set; }

        public bool TireRotationNotification { get; set; }
        public int LastTireRotationMileage { get; set; }
        public int TireRotationInterval { get; set; }

        public bool TransmissionFluidChangeNotification { get; set; }
        public int LastTransmissionFluidChangeMileage { get; set; }
        public int TransmissionFluidChangeInterval { get; set; }

        public bool SparkPlugChangeNotification { get; set; }
        public int LastSparkPlugChangeMileage { get; set; }
        public int SparkPlugChangeInterval { get; set; }

        public bool TimingBeltNotification { get; set; }
        public int LastTimingBeltChangeMileage { get; set; }
        public int TimingBeltChangeInterval { get; set; }

        public bool TimingChainChangeNotification { get; set; }
        public int LastTimingChainChangeMileage { get; set; }
        public int TimingChainChangeInterval { get; set; }

        public bool WaterPumpReplacementNotification { get; set; }
        public int LastWaterPumpReplacementMileage { get; set; }
        public int WaterPumpReplacementInterval { get; set; }

        [JsonIgnore]
        public Car? Car { get; set; }
    }
}
