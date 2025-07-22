using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Dtos.ConversationDtos
{
    public class CreateConversationDto
    {
        [Required]
        public string ReceiverUserId { get; set; }
    }
}
