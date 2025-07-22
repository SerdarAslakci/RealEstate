using Microsoft.AspNetCore.Identity;
using RealEstateProject.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace RealEstateProject.Models
{
    public class Home
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public HomeStatus Status { get; set; }  = HomeStatus.Available;

        public ICollection<HomeTransaction> HomeTransactions { get; set; }

        [Required]
        public decimal Price { get; set; }
        public int RoomCount { get; set; }      
        public int BathroomCount { get; set; }  
        public int LivingRoomCount { get; set; }
        public int BuildingAge { get; set; }
        public int balconyCount { get; set; }
        public bool hasElevator {  get; set; }
        public bool isFurnished { get; set; }
        public int Floor { get; set; } 
        public int Area { get; set; } 
        public ICollection<HomeType> HomeType { get; set; }
        [Required]
        public Address Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserId { get; set; }
        public IdentityUser User { get; set; }
        public ICollection<UserFavourites> UserFavourites { get; set; }
        public ICollection<HomeImage> HomeImage { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }
}
