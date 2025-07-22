using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RealEstateProject.Dtos.AuthDtos;
using RealEstateProject.Models;
using RealEstateProject.TokenService;

namespace RealEstateProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AuthController(ITokenService tokenService, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

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

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = new AppUser
                {
                    UserName = NormalizeUserName(registerDto.FirstName.Trim(), registerDto.LastName.Trim()) + Guid.NewGuid().ToString().Substring(0, 6),
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    DateOfBirth = registerDto.DateOfBirth,
                    Age = registerDto.Age,
                    Gender = registerDto.Gender,
                    NationalId = registerDto.NationalId,
                    PhoneNumber = registerDto.PhoneNumber,
                };


                var createResult = await _userManager.CreateAsync(user, registerDto.Password);

                if (createResult.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, "User");

                    if (roleResult.Succeeded)
                    {
                        var token = await _tokenService.CreateTokenAsync(user);
                        var refreshToken = await _tokenService.CreateRefreshTokenAsync();
                        user.RefreshToken = refreshToken;
                        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

                        await _userManager.UpdateAsync(user);

                        return Ok(new NewUserDto()
                        {
                            UserName = user.UserName,
                            Email = user.Email,
                            Token = token,
                        });

                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createResult.Errors);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);

                if (user == null) { return Unauthorized("Email Incorrect"); }

                var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if (!signInResult.Succeeded) return Unauthorized("Password Incorrect");

                if (user.RefreshTokenExpiry < DateTime.UtcNow)
                {
                    user.RefreshToken = await _tokenService.CreateRefreshTokenAsync();
                    user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

                    await _userManager.UpdateAsync(user);
                }

                return Ok(new NewUserDto()
                {
                    Email = user.Email,
                    UserName = user.UserName,
                    Token = await _tokenService.CreateTokenAsync(user),
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
