using RealEstateProject.Dtos.HomeDtos;
using RealEstateProject.Models;

namespace RealEstateProject.Interfaces
{
    public interface IHomeRepository
    {
        public Task<List<Home>> GetHomeListAsync(HomeQueryDto queryDto);
        public Task<Home> GetHomeByIdAsync(int id);
        public Task<Home> AddHomeAsync(Home home);
        public Task<Home> UpdateHomeAsync(Home home);
        public Task<Home> DeleteHomeAsync(int id);
        public Task<List<HomeType>> GetHomeTypesByNameAsync(List<string> homeTypeNames);
        public Task<HomeImage> AddHomeImageAsync(HomeImage homeImage);
        public Task<List<HomeImage>> GetHomeImagesAsync(int homeId);
        public Task<List<HomeType>> GetHomeTypesAsync();
        public Task<List<Home>> GetUserFavouriteHomesAsync(string? userId);
        public Task<List<Home>> GetUsersHomeAdsAsync(string? userId);
        public Task<HomeImage> DeleteHomeImageAsync(int homeId, int imageId);
        public Task<List<FavouriteFilters>> GetFavoriteFiltersAsync(string userId);
        public Task<FavouriteFilters> AddFavouriteFilterAsync(FavouriteFilters filter);


    }
}
