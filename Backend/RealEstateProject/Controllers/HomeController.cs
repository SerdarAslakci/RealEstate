using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateProject.Dtos.HomeDtos;
using RealEstateProject.Dtos.HomeTypeDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;
using RealEstateProject.Models.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RealEstateProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHomeRepository _homeRepository;
        private readonly IFavouriteRepository _favouriteRepository;
        private readonly IMapper _mapper;

        public HomeController(IHomeRepository homeRepository,IMapper mapper,IFavouriteRepository favouriteRepository)
        {
            _homeRepository = homeRepository;
            _favouriteRepository = favouriteRepository;
            _mapper = mapper;
        }

        [HttpGet("Homes")]
        public async Task<IActionResult> GetHomes([FromQuery] HomeQueryDto queryDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var homeList = await _homeRepository.GetHomeListAsync(queryDto);

                if(homeList.Count <= 0)
                    return NotFound();

                var homeDtoList = _mapper.Map<List<HomeDto>>(homeList);

                for(int i = 0; i< homeDtoList.Count;i++)
                {
                    homeDtoList[i].HomeTypeDto = _mapper.Map<List<HomeTypeDto>>(homeList[i].HomeType);
                    homeDtoList[i].HomeImage = _mapper.Map<List<HomeImageDto>>(homeList[i].HomeImage);
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (userId != null)
                {
                    var favHomes = await _homeRepository.GetUserFavouriteHomesAsync(userId);
                    
                    if(favHomes != null && favHomes.Count > 0 )
                    {
                        for (int i = 0; i < homeList.Count; i++)
                        {
                            if (favHomes.Contains(homeList[i]))
                            {
                                homeDtoList[i].IsFavourite = true;
                            }
                            else
                            {
                                homeDtoList[i].IsFavourite = false;
                            }
                        }
                    }
                }

                return Ok(homeDtoList);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetUserHomeAds")]
        public async Task<IActionResult> GetUserHomeAds()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {


                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if(string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var homeList = await _homeRepository.GetUsersHomeAdsAsync(userId);

                var homeDtoList = _mapper.Map<List<HomeDto>>(homeList);

                for (int i = 0; i < homeDtoList.Count; i++)
                {
                    homeDtoList[i].HomeTypeDto = _mapper.Map<List<HomeTypeDto>>(homeList[i].HomeType);
                    homeDtoList[i].HomeImage = _mapper.Map<List<HomeImageDto>>(homeList[i].HomeImage);
                }

                return Ok(homeDtoList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Authorize]
        [HttpGet("Homes/Favourites")]
        public async Task<IActionResult> GetFavHomes()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                List<HomeDto> homeDtoList = new List<HomeDto>();

                if (userId != null)
                {
                    var favHomes = await _homeRepository.GetUserFavouriteHomesAsync(userId);

                    if (favHomes != null && favHomes.Count > 0)
                    {
                        homeDtoList = _mapper.Map<List<HomeDto>>(favHomes);
                        for (int i = 0; i < favHomes.Count; i++)
                        {
                            homeDtoList[i].IsFavourite = true;
                            homeDtoList[i].HomeTypeDto = _mapper.Map<List<HomeTypeDto>>(favHomes[i].HomeType);
                            homeDtoList[i].HomeImage = _mapper.Map<List<HomeImageDto>>(favHomes[i].HomeImage);
                        }
                    }
                }

                return Ok(homeDtoList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("Homes/{id}")]
        public async Task<IActionResult> GetHomeById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            Home joinHome = new Home();

            var home = await _homeRepository.GetHomeByIdAsync(id);

            if (home == null)
                return NotFound();

            var homeDto = _mapper.Map<HomeDto>(home);

            homeDto.HomeTypeDto = _mapper.Map<List<HomeTypeDto>>(home.HomeType);
            homeDto.comments = home.Comments;

            if (userId != null)
            {
                var favHomes = await _homeRepository.GetUserFavouriteHomesAsync(userId);
                if(favHomes.Contains(home))
                {
                    homeDto.IsFavourite = true;
                }
                else
                {
                    homeDto.IsFavourite = false;
                }
            }

            return Ok(homeDto);
        }

        [HttpGet("GetHomeTypes")]
        public async Task<IActionResult> GetHomeTypes()
        {
            var homeTypes = await _homeRepository.GetHomeTypesAsync();

            if (homeTypes.Count <= 0)
                return NotFound();

            return Ok(homeTypes);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHome([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var deletedHome = await _homeRepository.DeleteHomeAsync(id);

            if (deletedHome == null)
                return NotFound();

            return Ok(deletedHome);

        }

        [Authorize]
        [HttpPost("AddHome")]
        public async Task<IActionResult> AddHome([FromBody] AddHomeDto addHomeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(string.IsNullOrEmpty(userId))
                return Unauthorized("User Not Found!");

            var home = new Home
            {
                Title = addHomeDto.Title,
                Description = addHomeDto.Description,
                Status = Enum.Parse<HomeStatus>(addHomeDto.Status, true),
                Price = addHomeDto.Price,
                RoomCount = addHomeDto.RoomCount,
                BathroomCount = addHomeDto.BathroomCount,
                Floor = addHomeDto.Floor,
                Area = addHomeDto.Area,
                CreatedAt = DateTime.Now,
                UserId = userId,
                Address = _mapper.Map<Address>(addHomeDto.AddressDto),
                HomeType = await _homeRepository.GetHomeTypesByNameAsync(addHomeDto.homeTypes),
                HomeImage = null,
                balconyCount = addHomeDto.BalconyCount,
                BuildingAge = addHomeDto.BuildingAge,
                isFurnished = addHomeDto.IsFurnished,
                hasElevator = addHomeDto.HasElevator,
                LivingRoomCount = addHomeDto.LivingRoomCount,   
            };

            var added = await _homeRepository.AddHomeAsync(home);

            if (added == null)
                return StatusCode(500, added);

            return Ok(_mapper.Map<HomeDto>(added));
             
        }

        [Authorize]
        [HttpPut("UpdateHome/{id}")]
        public async Task<IActionResult> UpdateHome(int id, [FromBody] AddHomeDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User Not Found!");

            var existingHome = await _homeRepository.GetHomeByIdAsync(id);

            if (existingHome == null)
                return NotFound("Home not found");

            if (existingHome.UserId != userId)
                return Forbid("You are not allowed to update this home");

            if (!Enum.TryParse<HomeStatus>(updateDto.Status, true, out var status))
                return BadRequest("Invalid home status value");


            existingHome.Title = updateDto.Title;
            existingHome.Description = updateDto.Description;
            existingHome.Status = status;
            existingHome.Price = updateDto.Price;
            existingHome.RoomCount = updateDto.RoomCount;
            existingHome.BathroomCount = updateDto.BathroomCount;
            existingHome.Floor = updateDto.Floor;
            existingHome.Area = updateDto.Area;
            existingHome.Address = _mapper.Map<Address>(updateDto.AddressDto);
            existingHome.balconyCount = updateDto.BalconyCount;
            existingHome.BuildingAge = updateDto.BuildingAge;
            existingHome.isFurnished = updateDto.IsFurnished;
            existingHome.hasElevator = updateDto.HasElevator;
            existingHome.LivingRoomCount = updateDto.LivingRoomCount;

            if (existingHome.HomeType == null)
                existingHome.HomeType = new List<HomeType>();

            existingHome.HomeType.Clear();

            var newHomeTypes = await _homeRepository.GetHomeTypesByNameAsync(updateDto.homeTypes);
            foreach (var ht in newHomeTypes)
            {
                existingHome.HomeType.Add(ht);
            }
            var updated = await _homeRepository.UpdateHomeAsync(existingHome);

            if (updated == null)
                return StatusCode(500, "Update failed");

            return Ok(_mapper.Map<HomeDto>(updated));
        }

        [Authorize]
        [HttpPost("Add_Favourites")]
        public async Task<IActionResult> AddHomeToFav([FromBody] int homeId)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var result = await _favouriteRepository.AddToFavourites(userId, homeId);

            return Ok(result == true ? "Added to favourites successfully" : "Failed to add to favourites");

        }

        [Authorize]
        [HttpDelete("Remove_Favourite")]
        public async Task<IActionResult> RemoveHomeFromFavourites([FromBody] int homeId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var result = await _favouriteRepository.RemoveFromFavourites(userId, homeId);

            return Ok(result == true ? "Removed from favourites successfully" : "Failed to remove from favourites");
        }


        [HttpPost("Add_Home_Photos/{homeId}")]
        public async Task<IActionResult> UploadPhotos(int homeId, List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("Dosya seçilmedi.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "homes");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var imageUrls = new List<string>();

            foreach (var file in files)
            {
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var homeImage = new HomeImage
                {
                    HomeId = homeId,
                    ImageUrl = "/uploads/homes/" + uniqueFileName
                };

                await _homeRepository.AddHomeImageAsync(homeImage);

                imageUrls.Add(homeImage.ImageUrl);
            }

            return Ok(new { Message = "Tüm resimler yüklendi", ImageUrls = imageUrls });
        }


        [HttpDelete("Delete_Home_Photo/{homeId}/{imageId}")]
        public async Task<IActionResult> DeleteHomePhoto(int homeId, int imageId)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var deletedImage = await _homeRepository.DeleteHomeImageAsync(homeId, imageId);

            if(deletedImage == null)
            {
                return NotFound("Image Not Found");
            }

            return Ok(deletedImage);
        }

        [Authorize]
        [HttpGet("GetFavouriteFilters")]
        public async Task<IActionResult> GetFavouriteFilters()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var filters = await _homeRepository.GetFavoriteFiltersAsync(userId);
            if (filters == null)
                return NotFound("Filter not found");

            return Ok(filters);
        }

        [Authorize]
        [HttpPost("AddFavouriteFilter")]
        public async Task<IActionResult> AddFavouriteFilter([FromBody]HomeFilterDto filterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var filter = _mapper.Map<FavouriteFilters>(filterDto);

            filter.UserId = userId;

            var added = await _homeRepository.AddFavouriteFilterAsync(filter);

            if (added == null)
                return BadRequest("Could Not Add Filter");

            return Ok(filter);
        }
    }
}
