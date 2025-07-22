using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealEstateProject.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueConversation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Conversation_UserSenderId",
                table: "Conversation");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3a786b7a-d488-4739-9faa-f502c5a6cb0a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d7acf78f-6f4f-47bc-9bd3-e690ed2cc567");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "786dcdf7-a7eb-46c3-927a-d75e0aa37edb", null, "Admin", "ADMIN" },
                    { "d0c5553e-ddc2-4d12-b696-489c6079528a", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_UserSenderId_ReceiverUserId",
                table: "Conversation",
                columns: new[] { "UserSenderId", "ReceiverUserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Conversation_UserSenderId_ReceiverUserId",
                table: "Conversation");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "786dcdf7-a7eb-46c3-927a-d75e0aa37edb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d0c5553e-ddc2-4d12-b696-489c6079528a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3a786b7a-d488-4739-9faa-f502c5a6cb0a", null, "User", "USER" },
                    { "d7acf78f-6f4f-47bc-9bd3-e690ed2cc567", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Conversation_UserSenderId",
                table: "Conversation",
                column: "UserSenderId");
        }
    }
}
