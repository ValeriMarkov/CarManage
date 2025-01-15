using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CarManage.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateServiceHistoryModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CarId1",
                table: "ServiceHistories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceHistories_CarId1",
                table: "ServiceHistories",
                column: "CarId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceHistories_Cars_CarId1",
                table: "ServiceHistories",
                column: "CarId1",
                principalTable: "Cars",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceHistories_Cars_CarId1",
                table: "ServiceHistories");

            migrationBuilder.DropIndex(
                name: "IX_ServiceHistories_CarId1",
                table: "ServiceHistories");

            migrationBuilder.DropColumn(
                name: "CarId1",
                table: "ServiceHistories");
        }
    }
}
