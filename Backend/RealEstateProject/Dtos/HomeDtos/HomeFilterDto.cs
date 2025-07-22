using RealEstateProject.Models;

namespace RealEstateProject.Dtos.HomeDtos
{
    public class HomeFilterDto
    {
        public string? Title { get; set; }
        public string? RoomCount { get; set; }
        public string? BathroomCount { get; set; }
        public string? Status { get; set; }
        public string? City { get; set; }
        public string? HomeTypeName { get; set; }
        public string? MinPrice { get; set; }
        public string? MaxPrice { get; set; }
        public string? MinArea { get; set; }
        public string? MaxArea { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? LivingRoomCount { get; set; }
        public string? BuildingAge { get; set; }
        public string? BalconyCount { get; set; }
        public bool? HasElevator { get; set; }
        public bool? IsFurnished { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; }
    }
}
