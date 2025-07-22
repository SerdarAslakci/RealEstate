namespace RealEstateProject.Dtos.CommentDtos
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string? userId { get; set; }
        public string? name { get; set; }
        public string? lastName { get; set; }
        public int homeId { get; set; }
        public string? commentText { get; set; }
        public DateTime? createdAt { get; set; }
        public int point { get; set; }
    }
}
