using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Dtos.AuthDtos
{
    public class LoginDto
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; }

        [PasswordPropertyText]
        [Required]
        public string Password { get; set; }
    }
}
