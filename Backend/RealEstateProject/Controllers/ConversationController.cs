using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateProject.Dtos.ConversationDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;
using System.Security.Claims;

namespace RealEstateProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationController : ControllerBase
    {

        private readonly IConversationRepository _conversationRepository;
        private readonly IMapper _mapper;
        public ConversationController(IConversationRepository conversationRepository, IMapper mapper)
        {
            _conversationRepository = conversationRepository;
            _mapper = mapper;
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetConversationByUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var conversations = await _conversationRepository.GetConversationAsync(userId);
            if (conversations == null)
            {
                return NotFound("User's Chat not found");
            }

            return Ok(conversations);
        }


        [Authorize]
        [HttpGet("GetMessages/{conversationId}")]
        public async Task<IActionResult> GetMessagesByConversationId(int conversationId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var messages = await _conversationRepository.GetMessagesAsync(conversationId);

            if (messages == null)
                return NotFound("Messages not found");

            return Ok(messages);
        }

        [Authorize]
        [HttpPost("CreateConversation")]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto createConversationDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var created = await _conversationRepository.CreateConversationAsync(userId, createConversationDto.ReceiverUserId);

            if (created == null)
                return StatusCode(500, "Conversation Already Exists");

            return Ok(created);
        }

        [Authorize]
        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto messageDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var message = _mapper.Map<Message>(messageDto);
            message.SenderUserId = userId;
            
            var created = await _conversationRepository.SendMessageAsync(message);

            return Ok(created);
        }

        [HttpPost("IsExists")]
        public async Task<IActionResult> IsConversationExist([FromBody] CreateConversationDto createConversationDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            bool? result = await _conversationRepository.IsConversationExist(userId, createConversationDto.ReceiverUserId);

            return Ok(result);
            
        }
    }
}
