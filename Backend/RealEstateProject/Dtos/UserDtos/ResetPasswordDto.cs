namespace RealEstateProject.Dtos.UserDtos
{
    public class ResetPasswordDto
    {
        public string NewPassword { get; set; }
        public string ResetToken { get; set; }
    }
}
