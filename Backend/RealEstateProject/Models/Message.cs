    namespace RealEstateProject.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }
        public string SenderUserId { get; set; }
        public string MessageText { get; set; }
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public AppUser SenderUser { get; set; }
    }
}
