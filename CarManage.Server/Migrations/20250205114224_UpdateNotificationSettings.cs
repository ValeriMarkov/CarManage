using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CarId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OilChangeNotification = table.Column<bool>(type: "bit", nullable: false),
                    FilterChangeNotification = table.Column<bool>(type: "bit", nullable: false),
                    AverageWeeklyMileage = table.Column<int>(type: "int", nullable: false),
                    CurrentOdometer = table.Column<int>(type: "int", nullable: false),
                    LastOilChangeMileage = table.Column<int>(type: "int", nullable: false),
                    OilChangeInterval = table.Column<int>(type: "int", nullable: false),
                    IsAutomaticMileageTracking = table.Column<bool>(type: "bit", nullable: false),
                    ManualOdometerEntry = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationSettings_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationSettings_CarId",
                table: "NotificationSettings",
                column: "CarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationSettings");
        }
    }
}