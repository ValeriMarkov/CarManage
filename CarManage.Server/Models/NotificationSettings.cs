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
        public bool BatteryCheckNotification { get; set; }
        public int LastBatteryCheckMileage { get; set; }
        public int BatteryCheckInterval { get; set; }
        public bool TransmissionFluidChangeNotification { get; set; }
        public int LastTransmissionFluidChangeMileage { get; set; }
        public int TransmissionFluidChangeInterval { get; set; }
        public bool EngineFlushNotification { get; set; }
        public int LastEngineFlushMileage { get; set; }
        public int EngineFlushInterval { get; set; }
        public bool CoolantFlushNotification { get; set; }
        public int LastCoolantFlushMileage { get; set; }
        public int CoolantFlushInterval { get; set; }
        public bool SparkPlugChangeNotification { get; set; }
        public int LastSparkPlugChangeMileage { get; set; }
        public int SparkPlugChangeInterval { get; set; }
        public bool TimingBeltNotification { get; set; }
        public int LastTimingBeltChangeMileage { get; set; }
        public int TimingBeltChangeInterval { get; set; }
        public bool FuelInjectionCleaningNotification { get; set; }
        public int LastFuelInjectionCleaningMileage { get; set; }
        public int FuelInjectionCleaningInterval { get; set; }
        public bool AlignmentNotification { get; set; }
        public int LastAlignmentMileage { get; set; }
        public int AlignmentInterval { get; set; }
        public bool SuspensionNotification { get; set; }
        public int LastSuspensionCheckMileage { get; set; }
        public int SuspensionCheckInterval { get; set; }
        public bool AcRechargeNotification { get; set; }
        public int LastAcRechargeMileage { get; set; }
        public int AcRechargeInterval { get; set; }
        public bool DifferentialFluidChangeNotification { get; set; }
        public int LastDifferentialFluidChangeMileage { get; set; }
        public int DifferentialFluidChangeInterval { get; set; }
        public bool TimingChainChangeNotification { get; set; }
        public int LastTimingChainChangeMileage { get; set; }
        public int TimingChainChangeInterval { get; set; }
        public bool ClutchReplacementNotification { get; set; }
        public int LastClutchReplacementMileage { get; set; }
        public int ClutchReplacementInterval { get; set; }

        [JsonIgnore]
        public Car? Car { get; set; }
    }
}
