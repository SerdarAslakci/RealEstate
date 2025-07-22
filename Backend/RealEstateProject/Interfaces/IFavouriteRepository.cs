namespace RealEstateProject.Interfaces
{
    public interface IFavouriteRepository
    {
        public Task<bool> AddToFavourites(string userId, int homeId);
        public Task<bool> RemoveFromFavourites(string userId, int homeId);
    }
}
