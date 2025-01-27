using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace CarManage.Server.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ServiceType
    {
        [EnumMember(Value = "oil_change")]
        OilChange = 1,
        [EnumMember(Value = "brake_pads")]
        BrakePads = 2,
        [EnumMember(Value = "filter_change")]
        FilterChange = 4,
        [EnumMember(Value = "tire_rotation")]
        TireRotation = 8,
        [EnumMember(Value = "battery_check")]
        BatteryCheck = 16,
        [EnumMember(Value = "transmission_fluid_change")]
        TransmissionFluidChange = 32,
        [EnumMember(Value = "engine_flush")]
        EngineFlush = 64,
        [EnumMember(Value = "coolant_flush")]
        CoolantFlush = 128,
        [EnumMember(Value = "spark_plug_replacement")]
        SparkPlugReplacement = 256,
        [EnumMember(Value = "timing_belt_replacement")]
        TimingBeltReplacement = 512,
        [EnumMember(Value = "fuel_injection_cleaning")]
        FuelInjectionCleaning = 1024,
        [EnumMember(Value = "alignment")]
        Alignment = 2048,
        [EnumMember(Value = "suspension_check")]
        SuspensionCheck = 4096,
        [EnumMember(Value = "ac_recharge")]
        ACRecharge = 8192,
        [EnumMember(Value = "differential_fluid_change")]
        DifferentialFluidChange = 16384,
        [EnumMember(Value = "timing_chain_replacement")]
        TimingChainReplacement = 32768,
        [EnumMember(Value = "clutch_replacement")]
        ClutchReplacement = 65536
    }
}