using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Models
{
    public class HomeImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = String.Empty;
        public int HomeId { get; set; }
        public Home Home { get; set; }  
    }

}
