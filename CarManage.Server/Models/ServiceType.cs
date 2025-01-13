namespace CarManage.Server.Models
{
    public enum ServiceType
    {
        OilChange = 1,
        BrakePads = 2,
        FilterChange = 4,
        TireRotation = 8,
        BatteryCheck = 16,
        TransmissionFluidChange = 32,
        EngineFlush = 64,
        CoolantFlush = 128,
        SparkPlugReplacement = 256,
        TimingBeltReplacement = 512,
        FuelInjectionCleaning = 1024,
        Alignment = 2048,
        SuspensionCheck = 4096,
        ACRecharge = 8192,
        DifferentialFluidChange = 16384,
        TimingChainReplacement = 32768,
        ClutchReplacement = 65536
    }
}
