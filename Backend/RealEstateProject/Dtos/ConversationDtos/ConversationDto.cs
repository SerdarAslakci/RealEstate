namespace RealEstateProject.Dtos.ConversationDtos
{
    public class ConversationDto
    {
        public int Id { get; set; }
        public string? UserSenderId { get; set; }
        public string? ReceiverUserId { get; set; }
        public string? SenderUserFirstName { get; set; }
        public string? SenderUserLastName { get; set; }
        public string? ReceiverUserFirstName { get; set; }
        public string? ReceiverUserLastName { get; set; }
    }

}
