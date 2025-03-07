using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddNewServiceTypesToNotificationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcRechargeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "AcRechargeNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AlignmentInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "AlignmentNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "BatteryCheckInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "BatteryCheckNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "BrakePadsChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "BrakePadsNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ClutchReplacementInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ClutchReplacementNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "CoolantFlushInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "CoolantFlushNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DifferentialFluidChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "DifferentialFluidChangeNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "EngineFlushInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "EngineFlushNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "FuelInjectionCleaningInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "FuelInjectionCleaningNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LastAcRechargeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastAlignmentMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastBatteryCheckMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastBrakePadsChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastClutchReplacementMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastCoolantFlushMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastDifferentialFluidChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastEngineFlushMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastFuelInjectionCleaningMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastSparkPlugChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastSuspensionCheckMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastTimingBeltChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastTimingChainChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastTireRotationMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LastTransmissionFluidChangeMileage",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SparkPlugChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "SparkPlugChangeNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SuspensionCheckInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "SuspensionNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TimingBeltChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TimingBeltNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TimingChainChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TimingChainChangeNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TireRotationInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TireRotationNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TransmissionFluidChangeInterval",
                table: "NotificationSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TransmissionFluidChangeNotification",
                table: "NotificationSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcRechargeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "AcRechargeNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "AlignmentInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "AlignmentNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "BatteryCheckInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "BatteryCheckNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "BrakePadsChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "BrakePadsNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "ClutchReplacementInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "ClutchReplacementNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "CoolantFlushInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "CoolantFlushNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "DifferentialFluidChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "DifferentialFluidChangeNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "EngineFlushInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "EngineFlushNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "FuelInjectionCleaningInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "FuelInjectionCleaningNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastAcRechargeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastAlignmentMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastBatteryCheckMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastBrakePadsChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastClutchReplacementMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastCoolantFlushMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastDifferentialFluidChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastEngineFlushMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastFuelInjectionCleaningMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastSparkPlugChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastSuspensionCheckMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastTimingBeltChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastTimingChainChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastTireRotationMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "LastTransmissionFluidChangeMileage",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "SparkPlugChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "SparkPlugChangeNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "SuspensionCheckInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "SuspensionNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TimingBeltChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TimingBeltNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TimingChainChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TimingChainChangeNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TireRotationInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TireRotationNotification",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TransmissionFluidChangeInterval",
                table: "NotificationSettings");

            migrationBuilder.DropColumn(
                name: "TransmissionFluidChangeNotification",
                table: "NotificationSettings");
        }
    }
}
