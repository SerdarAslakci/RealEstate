namespace RealEstateProject.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string? userId { get; set; }
        public string? name { get; set; }
        public string? lastname { get; set; }
        public int homeId { get; set; }
        public string? commentText { get; set; }
        public DateTime? createdAt { get; set; } = DateTime.UtcNow;
        public int point { get; set; }
        public Home Home { get; set; }
        public AppUser AppUser { get; set; }

    }
}
