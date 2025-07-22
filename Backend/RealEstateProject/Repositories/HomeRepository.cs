using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RealEstateProject.Data;
using RealEstateProject.Dtos.HomeDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;

namespace RealEstateProject.Repositories
{
    public class HomeRepository : IHomeRepository
    {
        private readonly AppDbContext _context;
        public HomeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Home> AddHomeAsync(Home home)
        {
            home.CreatedAt = DateTime.UtcNow;
            var addedHome = await _context.Home.AddAsync(home);

            await _context.SaveChangesAsync();

            if(addedHome == null)
            {
                return null;
            }
            return home;
        }

        public async Task<HomeImage> AddHomeImageAsync(HomeImage homeImage)
        {
            await _context.HomeImage.AddAsync(homeImage);
            await _context.SaveChangesAsync();

            return homeImage;
        }

        public async Task<HomeImage?> DeleteHomeImageAsync(int homeId,int imageId)
        {
            var image = await _context.HomeImage.FirstOrDefaultAsync(x => x.Id == imageId && x.HomeId == homeId);

            if (image == null)
                return null;

            _context.HomeImage.Remove(image);
            await _context.SaveChangesAsync();

            string path = "C:\\Users\\serda\\source\\repos\\RealEstateProject\\RealEstateProject\\wwwroot"+ image.ImageUrl;

            if(File.Exists(path))
            {
                File.Delete(path);
            }

            return image;
        }

        public async Task<Home> DeleteHomeAsync(int id)
        {
            var home = await _context.Home.FirstOrDefaultAsync(x => x.Id == id);
            if (home == null) return null;

            _context.Home.Remove(home);
            await _context.SaveChangesAsync();
            return home;
        }

        public async Task<Home> GetHomeByIdAsync(int id)
        {
            var home = await _context.Home
                         .Include(x => x.HomeType)
                         .Include(x => x.HomeImage)
                         .Include(x => x.Address)
                         .Include(x => x.Comments)
                         .FirstOrDefaultAsync(x => x.Id == id);

            if (home == null) return null;

            return home;
        }

        public async Task<List<HomeImage>> GetHomeImagesAsync(int homeId)
        {
            return await _context.HomeImage
                .Where(img => img.HomeId == homeId)
                .ToListAsync();
        }

        public async Task<List<Home>> GetHomeListAsync(HomeQueryDto queryDto)
        {
            var homeList = _context.Home
                .Include(x => x.HomeType)
                .Include(x => x.HomeImage)
                .Include(x => x.Address)
                .Include (x => x.Comments)
                .AsQueryable();

            if(!string.IsNullOrEmpty(queryDto.Title))
            {
                homeList = homeList.Where(x => x.Title.Trim().ToLower() == queryDto.Title.ToLower().Trim());
            }
            if(queryDto.RoomCount != null)
            {
                homeList = homeList.Where(x => x.RoomCount == queryDto.RoomCount);
            }
            if(queryDto.BathroomCount!= null)
            {
                homeList = homeList.Where(x => x.BathroomCount == queryDto.BathroomCount);
            }
            if(queryDto.Status != null)
            {
                homeList = homeList.Where(x => x.Status == queryDto.Status);
            }
            if(queryDto.City != null)
            {
                homeList = homeList.Where(x => x.Address.City.ToLower().Trim().Contains(queryDto.City.ToLower().Trim()) || 
                queryDto.City.ToLower().Trim().Contains(x.Address.City.ToLower().Trim()));
            }
            if(queryDto.HomeTypeName != null)
            {
                var homeType = await _context.HomeType.FirstOrDefaultAsync(x => x.Name.ToLower().Trim().Contains(queryDto.HomeTypeName.ToLower().Trim()));
                homeList = homeList.Where(h => h.HomeType.Contains(homeType));

            }
            if (queryDto.MinPrice != null)
            {
                homeList = homeList.Where(x => x.Price >= queryDto.MinPrice);
            }
            if(queryDto.MaxPrice != null)
            {
                homeList = homeList.Where(x => x.Price <= queryDto.MaxPrice);
            }

            if (queryDto.MinArea != null)
            {
                homeList = homeList.Where(x => x.Area >= queryDto.MinArea);
            }

            if (queryDto.MaxArea != null)
            {
                homeList = homeList.Where(x => x.Area <= queryDto.MaxArea);
            }

            if (queryDto.LivingRoomCount != null)
            {
                homeList = homeList.Where(x => x.LivingRoomCount == queryDto.LivingRoomCount);
            }

            if (queryDto.BuildingAge != null)
            {
                homeList = homeList.Where(x => x.BuildingAge == queryDto.BuildingAge);
            }

            if (queryDto.BalconyCount != null)
            {
                homeList = homeList.Where(x => x.balconyCount == queryDto.BalconyCount);
            }

            if (queryDto.HasElevator != null)
            {
                homeList = homeList.Where(x => x.hasElevator == queryDto.HasElevator);
            }

            if (queryDto.IsFurnished != null)
            {
                homeList = homeList.Where(x => x.isFurnished == queryDto.IsFurnished);
            }
            if(queryDto.sortBy != null)
            {
                if (queryDto.sortBy == "createdAt")
                {
                    if(queryDto.sortOrder == "asc")
                    {
                        homeList = homeList.OrderBy(x => x.CreatedAt);
                    }
                    if(queryDto.sortOrder == "desc")
                    {
                        homeList = homeList.OrderByDescending(x => x.CreatedAt);
                    }
                }
                if (queryDto.sortBy == "price")
                {
                    if (queryDto.sortOrder == "asc")
                    {
                        homeList = homeList.OrderBy(x => x.Price);
                    }
                    if (queryDto.sortOrder == "desc")
                    {
                        homeList = homeList.OrderByDescending(x => x.Price);
                    }
                }
            }

            return await homeList.Skip((queryDto.PageNumber - 1) * queryDto.PageSize).Take(queryDto.PageSize).ToListAsync();
        }

        public async Task<List<HomeType>> GetHomeTypesAsync()
        {
            var hometypes = await _context.HomeType.ToListAsync();
            return hometypes;
        }

        public async Task<List<HomeType>> GetHomeTypesByNameAsync(List<string> homeTypeNames)
        {
            var homeTypes = await _context.HomeType.ToListAsync();

            var typeList = new List<HomeType>();

            foreach (var homeTypeName in homeTypeNames)
            {
                var matchingTypes = homeTypes
                    .Where(x => x.Name.ToLower().Contains(homeTypeName.ToLower()))
                    .ToList();

                typeList.AddRange(matchingTypes); 
            }

            return typeList;
        }

        public async Task<List<Home>?> GetUserFavouriteHomesAsync(string? userId)
        {
            var favHomeIds = await _context.UserFavourites
                .Where(x => x.UserId == userId)
                .Select(x => x.HomeId)
                .ToListAsync();

            var homes = await _context.Home
                .Include(x => x.HomeType)
                .Include(x => x.HomeImage)
                .Include(x => x.Address)
                .Where(x => favHomeIds.Contains(x.Id))
                .ToListAsync();

            if(homes.Count == 0)
                return null;

            return homes;
        }

        public async Task<List<Home>> GetUsersHomeAdsAsync(string? userId)
        {
            var homes = await _context.Home
                .Include(x => x.HomeType)
                .Include(x => x.HomeImage)
                .Include(x => x.Address)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return homes;
        }

        public async Task<Home> UpdateHomeAsync(Home home)
        {
            _context.Home.Update(home);
            await _context.SaveChangesAsync();
            return home;

        }

        public async Task<List<FavouriteFilters>> GetFavoriteFiltersAsync(string userId)
        {
            var filters = await _context.FavouriteFilters.Where(x => x.UserId == userId).ToListAsync();

            return filters;
        }

        public async Task<FavouriteFilters?> AddFavouriteFilterAsync(FavouriteFilters filter)
        {
            if (filter == null) return null;

            var addedFilter = await _context.FavouriteFilters.AddAsync(filter);
            await _context.SaveChangesAsync();
            if (addedFilter == null)
                return null;

            return filter;
        }
    }
}
