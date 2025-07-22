using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Models
{
    public class UserFavourites
    {
        [Key]
        public int Id { get; set; }
        public int HomeId { get; set; }
        public Home Home { get; set; }
        public string UserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
