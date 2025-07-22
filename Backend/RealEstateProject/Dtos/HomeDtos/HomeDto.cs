using Microsoft.AspNetCore.Identity;
using RealEstateProject.Models.Enums;
using RealEstateProject.Models;
using System.ComponentModel.DataAnnotations;
using RealEstateProject.Dtos.HomeTypeDtos;

namespace RealEstateProject.Dtos.HomeDtos
{
    public class HomeDto
    {
        public int Id { get; set; }
        public string userId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public HomeStatus Status { get; set; } 
        public string StatusText => Status.ToString();  
        public decimal Price { get; set; }
        public int RoomCount { get; set; }
        public int BathroomCount { get; set; }
        public int Floor { get; set; }
        public int Area { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<HomeTypeDto> HomeTypeDto { get; set; }
        public ICollection<HomeImageDto> HomeImage { get; set; }
        public ICollection<Comment> comments { get; set; }
        public Address Address { get; set; }
        public int LivingRoomCount { get; set; }
        public int BuildingAge { get; set; }
        public int BalconyCount { get; set; }
        public bool HasElevator { get; set; }
        public bool IsFurnished { get; set; }
        public bool IsFavourite { get; set; }



    }
}
