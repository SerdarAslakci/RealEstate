using System.ComponentModel.DataAnnotations;

namespace RealEstateProject.Dtos.UserDtos
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
