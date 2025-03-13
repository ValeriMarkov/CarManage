using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.RenameColumn(
                name: "SuspensionNotification",
                table: "NotificationSettings",
                newName: "WaterPumpReplacementNotification");

            migrationBuilder.RenameColumn(
                name: "SuspensionCheckInterval",
                table: "NotificationSettings",
                newName: "WaterPumpReplacementInterval");

            migrationBuilder.RenameColumn(
                name: "LastSuspensionCheckMileage",
                table: "NotificationSettings",
                newName: "LastWaterPumpReplacementMileage");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WaterPumpReplacementNotification",
                table: "NotificationSettings",
                newName: "SuspensionNotification");

            migrationBuilder.RenameColumn(
                name: "WaterPumpReplacementInterval",
                table: "NotificationSettings",
                newName: "SuspensionCheckInterval");

            migrationBuilder.RenameColumn(
                name: "LastWaterPumpReplacementMileage",
                table: "NotificationSettings",
                newName: "LastSuspensionCheckMileage");

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
        }
    }
}
