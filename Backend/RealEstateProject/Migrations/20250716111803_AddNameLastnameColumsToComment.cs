using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealEstateProject.Migrations
{
    /// <inheritdoc />
    public partial class AddNameLastnameColumsToComment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "72153bec-5876-4283-9158-aa1f6e769aa0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c758ea08-dc2a-476c-b8ab-545b31e0125c");

            migrationBuilder.AddColumn<string>(
                name: "lastname",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "07b471e2-2753-46bd-a679-d6c2b6260174", null, "Admin", "ADMIN" },
                    { "ba38c1ae-e9ae-4414-84fc-d8f206409185", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "07b471e2-2753-46bd-a679-d6c2b6260174");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ba38c1ae-e9ae-4414-84fc-d8f206409185");

            migrationBuilder.DropColumn(
                name: "lastname",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "name",
                table: "Comments");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "72153bec-5876-4283-9158-aa1f6e769aa0", null, "Admin", "ADMIN" },
                    { "c758ea08-dc2a-476c-b8ab-545b31e0125c", null, "User", "USER" }
                });
        }
    }
}
