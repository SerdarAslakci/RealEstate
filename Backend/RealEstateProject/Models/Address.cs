using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Models
{
    public class Address
    {
        public int Id { get; set; }

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string District { get; set; } = string.Empty;
        public string Neighborhood { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
    }
}
