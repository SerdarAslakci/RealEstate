using RealEstateProject.Models;

namespace RealEstateProject.TokenService
{
    public interface ITokenService
    {
        public Task<string> CreateTokenAsync(AppUser user);
        public Task<string> CreateRefreshTokenAsync();
    }
}
