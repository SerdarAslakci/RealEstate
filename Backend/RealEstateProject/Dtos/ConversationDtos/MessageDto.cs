using RealEstateProject.Models;

namespace RealEstateProject.Dtos.ConversationDtos
{
    public class MessageDto
    {
        public int ConversationId { get; set; }
        public string? MessageText { get; set; }
    }
}
