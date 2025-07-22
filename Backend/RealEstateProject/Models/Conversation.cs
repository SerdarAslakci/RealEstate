namespace RealEstateProject.Models
{
    public class Conversation
    {
        public int Id {  get; set; }
        public string UserSenderId {  get; set; }
        public string ReceiverUserId { get; set; }
        public AppUser UserSender { get; set; }
        public AppUser ReceiverUser { get; set; }
        public ICollection<Message> Messages { get; set; }


    }
}
