using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Dtos.AddressDtos
{
    public class AddressDto
    {
        public string City { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Neighborhood { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
    }
}
