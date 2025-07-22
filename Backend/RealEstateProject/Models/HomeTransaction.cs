using Microsoft.AspNetCore.Identity;
using RealEstateProject.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Models
{
    public class HomeTransaction
    {
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; }
        public AppUser AppUser { get; set; }
        [Required]
        public int HomeId { get; set; }
        public Home Home { get; set; }
        [Required]
        public TransactionType Type { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
        public decimal Price { get; set; } 
    }

}
