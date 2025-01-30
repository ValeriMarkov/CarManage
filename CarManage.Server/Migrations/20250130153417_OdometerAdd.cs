using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class OdometerAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Odometer",
                table: "Cars",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Odometer",
                table: "Cars");
        }
    }
}