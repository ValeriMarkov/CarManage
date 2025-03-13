using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace CarManage.Server.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ServiceType : long
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
        ClutchReplacement = 65536,
        [EnumMember(Value = "coolant_hose_replacement")]
        CoolantHoseReplacement = 131072,
        [EnumMember(Value = "turbocharger_replacement")]
        TurbochargerReplacement = 262144,
        [EnumMember(Value = "alternator_replacement")]
        AlternatorReplacement = 524288,
        [EnumMember(Value = "alternator_element_replacement")]
        AlternatorElementReplacement = 1048576,
        [EnumMember(Value = "water_pump_replacement")]
        WaterPumpReplacement = 2097152,
        [EnumMember(Value = "starter_motor_replacement")]
        StarterMotorReplacement = 4194304,
        [EnumMember(Value = "drive_shaft_replacement")]
        DriveShaftReplacement = 8388608,
        [EnumMember(Value = "control_arm_replacement")]
        ControlArmReplacement = 16777216,
        [EnumMember(Value = "control_arm_bushing_replacement")]
        ControlArmBushingReplacement = 33554432,
        [EnumMember(Value = "shock_absorber_replacement")]
        ShockAbsorberReplacement = 67108864,
        [EnumMember(Value = "engine_mount_replacement")]
        EngineMountReplacement = 134217728,
        [EnumMember(Value = "cylinder_head_gasket_replacement")]
        CylinderHeadGasketReplacement = 268435456,
        [EnumMember(Value = "intake_manifold_gasket_replacement")]
        IntakeManifoldGasketReplacement = 536870912,
        [EnumMember(Value = "exhaust_manifold_gasket_replacement")]
        ExhaustManifoldGasketReplacement = 1073741824,
        [EnumMember(Value = "valve_cover_gasket_replacement")]
        ValveCoverGasketReplacement = 2147483648,
        [EnumMember(Value = "egr_valve_replacement")]
        EGRValveReplacement = 4294967296,
        [EnumMember(Value = "axle_replacement")]
        AxleReplacement = 8589934592,
        [EnumMember(Value = "camshaft_replacement")]
        CamshaftReplacement = 17179869184,
        [EnumMember(Value = "piston_ring_replacement")]
        PistonRingReplacement = 34359738368
    }
}