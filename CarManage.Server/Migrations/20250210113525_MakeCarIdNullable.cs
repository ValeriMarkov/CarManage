using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class MakeCarIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CarId",
                table: "NotificationSettings",
                nullable: true,
                oldClrType: typeof(int));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CarId",
                table: "NotificationSettings",
                nullable: false,
                oldClrType: typeof(int));
        }
    }
}