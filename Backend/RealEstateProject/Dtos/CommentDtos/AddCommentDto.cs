using RealEstateProject.Models;

namespace RealEstateProject.Dtos.CommentDtos
{
    public class AddCommentDto
    {
        public int homeId { get; set; }
        public string? commentText { get; set; }
        public int point { get; set; }
    }
}
