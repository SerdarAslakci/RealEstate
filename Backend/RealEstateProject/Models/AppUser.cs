using Microsoft.AspNetCore.Identity;

namespace RealEstateProject.Models
{
    public class AppUser:IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int Age { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? Gender { get; set; }       
        public string? NationalId { get; set; }

        public ICollection<UserFavourites> UserFavourites { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public ICollection<Conversation> ConversationsAsSender { get; set; }
        public ICollection<Conversation> ConversationsAsReceiver { get; set; }

        public ICollection<Message> SentMessages { get; set; }

    }
}
