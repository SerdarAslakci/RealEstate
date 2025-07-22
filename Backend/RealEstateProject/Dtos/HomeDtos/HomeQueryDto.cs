namespace RealEstateProject.Dtos.HomeDtos
{
    using System.ComponentModel.DataAnnotations;
    using RealEstateProject.Models.Enums;

    public class HomeQueryDto
    {
        public string? Title { get; set; } = null;
        public int? RoomCount { get; set; } = null;
        public int? BathroomCount { get; set; } = null;
        public HomeStatus? Status { get; set; } = null;
        public string? City { get; set; } = null;
        public string? HomeTypeName { get; set; } = null;

        [Range(0, double.MaxValue, ErrorMessage = "Minimum fiyat 0 veya daha büyük olmalıdır.")]
        public decimal? MinPrice { get; set; } = null;

        [Range(0, double.MaxValue, ErrorMessage = "Maksimum fiyat 0 veya daha büyük olmalıdır.")]
        public decimal? MaxPrice { get; set; } = null;

        [Range(0, double.MaxValue, ErrorMessage = "Minimum fiyat 0 veya daha büyük olmalıdır.")]
        public decimal? MinArea { get; set; } = null;

        [Range(0, double.MaxValue, ErrorMessage = "Maksimum fiyat 0 veya daha büyük olmalıdır.")]
        public decimal? MaxArea { get; set; } = null;

        [Range(1, int.MaxValue, ErrorMessage = "Page number must be greater than 0")]
        public int PageNumber { get; set; } = 1;  

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;
        public int? LivingRoomCount { get; set; } = null;
        public int? BuildingAge { get; set; } = null;
        public int? BalconyCount { get; set; } = null;
        public bool? HasElevator { get; set; } = null;
        public bool? IsFurnished { get; set; } = null;
        public string? sortBy { get; set; } = null;
        public string? sortOrder { get; set; } = null;

    }

}
