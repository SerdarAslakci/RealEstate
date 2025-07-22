using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using RealEstateProject.Dtos.UserDtos;
using RealEstateProject.Models;

namespace RealEstateProject.Interfaces
{
    public interface IProfileRepository
    {
        public Task<AppUser> GetUserByIdAsync(string userId);
        public Task<IdentityResult> DeleteUserAsync(AppUser user, string password);
        public Task<AppUser> UpdateUserAsync(string id, UpdateUserDto user);
        public Task<string> CreateResetPasswordTokenAsync(AppUser user);
        public Task<IdentityResult> ChangePasswordAsync(AppUser user, string oldPassword, string newPassword);
        public Task<IdentityResult> ResetPasswordAsync(AppUser user, string resetToken,string newPassword);
    }
}
