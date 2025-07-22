using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RealEstateProject.Dtos.UserDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;
using System.Security.Claims;

namespace RealEstateProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileRepository _profileRepository;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        public ProfileController(IProfileRepository profileRepository,IMapper mapper,SignInManager<AppUser> signInManager) 
        {
            _profileRepository = profileRepository;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserById()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(_mapper.Map<AppUser>(user));

        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var user = await _profileRepository.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound("User Not Found");

            return Ok(_mapper.Map<AppUser>(user));

        }

        [Authorize]
        [HttpPost("Delete_Account")]
        public async Task<IActionResult> DeleteUser([FromBody] string password)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if(user == null)
                return Unauthorized();

            var result = await _profileRepository.DeleteUserAsync(user,password);

            if (result.Succeeded)
            {
                await _signInManager.SignOutAsync();

                return Ok("Account deleted succesfully");
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(errors);
        }

        [HttpPost("Change_Password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if(user == null)
                return NotFound("User Not Found!");

            if (changePasswordDto.OldPassword == changePasswordDto.NewPassword)
                return BadRequest("New password cannot be the same as the old password.");

            var result = await _profileRepository.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

            if (result.Succeeded)
            {
                await _signInManager.SignOutAsync();
                return Ok("Password Changed Succesfully");
            }

            return BadRequest(result.Errors.Select(e => e.Description));
        }

        [Authorize]
        [HttpPost("Generate_Reset_Token")]
        public async Task<IActionResult> GenerateResetToken()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound("User Not Found");

            var token = await _profileRepository.CreateResetPasswordTokenAsync(user);

            return Ok(token);
        }

        [Authorize]
        [HttpPost("Reset_Password")]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordDto resetDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound("User Not Found");

            var result = await _profileRepository.ResetPasswordAsync(user,resetDto.ResetToken,resetDto.NewPassword);

            if (result.Succeeded)
            {
                await _signInManager.SignOutAsync();
                return Ok("Password reset succesfully");
            }
            else
                return BadRequest("Password reset failed");
        }

        [Authorize]
        [HttpPut("Update_Profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (existingUserId == null)
                return Unauthorized();

            var updatedUser = await _profileRepository.UpdateUserAsync(existingUserId, updateUserDto);

            return Ok(_mapper.Map<UserDto>(updatedUser));
        }

    }
}
