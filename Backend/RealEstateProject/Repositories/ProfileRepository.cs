using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RealEstateProject.Data;
using RealEstateProject.Dtos.AuthDtos;
using RealEstateProject.Dtos.UserDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;

namespace RealEstateProject.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public static string NormalizeUserName(string firstName, string lastName)
        {
            string fullName = firstName + lastName;
            fullName = fullName.ToLower();

            fullName = fullName.Replace("ş", "s")
                               .Replace("ı", "i")
                               .Replace("ğ", "g")
                               .Replace("ç", "c")
                               .Replace("ü", "u")
                               .Replace("ö", "o");

            return fullName;
        }
        public ProfileRepository(AppDbContext context,UserManager<AppUser> userManager) 
        {
            _context = context;
            _userManager = userManager;
        }
        public async Task<IdentityResult> DeleteUserAsync(AppUser user, string password)
        {
            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, password);
            if (!isPasswordCorrect)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Incorrect Password" });
            }
            var favs = await _context.UserFavourites.Where(x => x.UserId == user.Id).ToListAsync();
            var homes = await _context.Home.Where(x => x.UserId == user.Id).ToListAsync();
            var comments = await _context.Comments.Where(x => x.userId == user.Id).ToListAsync();

            _context.Comments.RemoveRange(comments);
            _context.UserFavourites.RemoveRange(favs);
            _context.Home.RemoveRange(homes);

            await _context.SaveChangesAsync();
            var result = await _userManager.DeleteAsync(user);
            return result;
        }

        public async Task<AppUser?> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            return user == null ? null : user;
        }

        public async Task<AppUser?> UpdateUserAsync(string id, UpdateUserDto updatedUser)
        {
            var existingUser = await GetUserByIdAsync(id);

            if (existingUser == null)
            {
                return null;
            }

            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.UserName = NormalizeUserName(existingUser.FirstName.Trim(), existingUser.LastName.Trim()) + Guid.NewGuid().ToString().Substring(0, 6);
            existingUser.Age = updatedUser.Age;
            existingUser.DateOfBirth = updatedUser.DateOfBirth;
            existingUser.Gender = updatedUser.Gender;
            existingUser.NationalId = updatedUser.NationalId;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;

            var result = await _userManager.UpdateAsync(existingUser);
            await _context.SaveChangesAsync();

            return result.Succeeded ? existingUser : null;

        }

        public async Task<IdentityResult> ChangePasswordAsync(AppUser user, string oldPassword, string newPassword)
        {
             var result = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);

            return result;
        }

        public async Task<IdentityResult> ResetPasswordAsync(AppUser user,string resetToken, string newPassword)
        {
            var result = await _userManager.ResetPasswordAsync(user, resetToken, newPassword);

            return result;
        }
        public async Task<string> CreateResetPasswordTokenAsync(AppUser user)
        {
            if (user == null)
                return null;

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            return resetToken;
        }
    }
}
