using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateProject.Dtos.CommentDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;
using System.Security.Claims;

namespace RealEstateProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IProfileRepository _profileRepository;
        private readonly IMapper _mapper;

        public CommentController(ICommentRepository commentRepository, IMapper mapper, IProfileRepository profileRepository)
        {
            _commentRepository = commentRepository;
            _profileRepository = profileRepository;
            _mapper = mapper;
        }

        [HttpGet("{homeId}")]
        public async Task<IActionResult> GetComments(int homeId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var comments = await _commentRepository.GetCommentsByHomeAsync(userId, homeId);

            var commentDtos = _mapper.Map<List<CommentDto>>(comments);

            return Ok(_mapper.Map<List<CommentDto>>(comments));
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> AddCommentToHome([FromBody] AddCommentDto addCommentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = await _profileRepository.GetUserByIdAsync(userId);

            if (await _commentRepository.HasUserCommentAsync(userId, addCommentDto.homeId))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "You have already submitted a comment for this property.");
            }

            if (await _commentRepository.IsItOwnHouse(userId, addCommentDto.homeId))
            {
                return StatusCode(StatusCodes.Status400BadRequest, "You cannot submit a comment for your own property.");
            }
            
            var comment = _mapper.Map<Comment>(addCommentDto);
            comment.userId = userId;
            comment.name = user.FirstName;
            comment.lastname = user.LastName;

            var addedComment = await _commentRepository.AddCommentToHomeAsync(userId, addCommentDto.homeId, comment);

            return Ok(_mapper.Map<CommentDto>(addedComment));
        }

        [Authorize]
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var deletedComment = await _commentRepository.DeleteCommentAsync(userId, commentId);

            return Ok(deletedComment);
        }
    }
}
