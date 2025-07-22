using Microsoft.AspNetCore.Identity;
using RealEstateProject.Models.Enums;
using RealEstateProject.Models;
using System.ComponentModel.DataAnnotations;
using RealEstateProject.Dtos.AddressDtos;

namespace RealEstateProject.Dtos.HomeDtos
{
    public class AddHomeDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int RoomCount { get; set; }
        public int BathroomCount { get; set; }
        public int Floor { get; set; }
        public int Area { get; set; }
        public List<string> homeTypes { get; set; }
        public AddressDto AddressDto { get; set; }
        public DateTime CreatedAt { get; set; }
        public int LivingRoomCount { get; set; }
        public int BuildingAge { get; set; }
        public int BalconyCount { get; set; }
        public bool HasElevator { get; set; }
        public bool IsFurnished { get; set; }
    }
}
