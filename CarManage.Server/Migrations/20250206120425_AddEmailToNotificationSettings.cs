using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailToNotificationSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "NotificationSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "NotificationSettings");
        }
    }
}
