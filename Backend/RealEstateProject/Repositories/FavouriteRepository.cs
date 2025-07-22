using Microsoft.EntityFrameworkCore;
using RealEstateProject.Data;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;

namespace RealEstateProject.Repositories
{
    public class FavouriteRepository : IFavouriteRepository
    {
        private readonly AppDbContext _context;
        private readonly IProfileRepository _profileRepo;
        private readonly IHomeRepository _homeRepository;
        public FavouriteRepository(AppDbContext context,IProfileRepository profileRepo,IHomeRepository homeRepository)
        {
            _context = context;
            _homeRepository = homeRepository;
            _profileRepo = profileRepo;
        }
        public async Task<bool> AddToFavourites(string userId, int homeId)
        {
            var home = await _homeRepository.GetHomeByIdAsync(homeId);
            var user = await _profileRepo.GetUserByIdAsync(userId);

            if(user == null || home == null)
                return false;
            var userFav = new UserFavourites
            {
                UserId = userId,
                HomeId = homeId,
                Home = home,
                AppUser = user,
            };

            var isExist = await _context.UserFavourites.AnyAsync(x => x.UserId == userId && x.HomeId == homeId);

            if(isExist) 
                return false;

            await _context.UserFavourites.AddAsync(userFav);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveFromFavourites(string userId, int homeId)
        {
            var userFav = await _context.UserFavourites.FirstOrDefaultAsync(x => x.UserId == userId && x.HomeId == homeId);

            if(userFav == null) return false;

            var result = _context.UserFavourites.Remove(userFav);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
