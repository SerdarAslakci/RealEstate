using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Models
{
    public class HomeType
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = String.Empty;
        public ICollection<Home> Homes { get; set; }
    }
}
