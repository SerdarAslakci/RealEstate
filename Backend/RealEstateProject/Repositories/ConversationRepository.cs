using Microsoft.EntityFrameworkCore;
using RealEstateProject.Data;
using RealEstateProject.Dtos.ConversationDtos;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;

namespace RealEstateProject.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly AppDbContext _context;
        public ConversationRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ConversationDto?> CreateConversationAsync(string userSenderId, string userReceiverId)
        {

            var isExist = await _context.Conversation.AnyAsync(x =>
                    (x.UserSenderId == userSenderId && x.ReceiverUserId == userReceiverId) ||
                    (x.UserSenderId == userReceiverId && x.ReceiverUserId == userSenderId));

            if (isExist)
            {
                return null;
            }

            var conversation = new Conversation()
            {
                ReceiverUserId = userReceiverId,
                UserSenderId = userSenderId
            };

            await _context.Conversation.AddAsync(conversation);
            await _context.SaveChangesAsync();

            var added = await _context.Conversation
                .Include(x => x.UserSender)
                .Include(x => x.ReceiverUser)
                .Where(x => (x.UserSenderId == userSenderId && x.ReceiverUserId == userReceiverId) || (x.UserSenderId == userReceiverId && x.ReceiverUserId == userSenderId))
                .Select(x => new ConversationDto
                {
                    Id = x.Id,
                    UserSenderId = x.UserSenderId,
                    ReceiverUserId = x.ReceiverUserId,
                    SenderUserFirstName = x.UserSender.FirstName,
                    SenderUserLastName = x.UserSender.LastName,
                    ReceiverUserFirstName = x.ReceiverUser.FirstName,
                    ReceiverUserLastName = x.ReceiverUser.LastName
                })
                .FirstOrDefaultAsync();

            return added;
        }

        public async Task<Conversation?> DeleteConservationAsync(int conversationId)
        {
            var deletedConversation = await _context.Conversation.FirstOrDefaultAsync(x => x.Id == conversationId);

            if (deletedConversation == null)
                return null;

            return deletedConversation;
        }

        public async Task<Message?> DeleteMessageAsync(int messageId)
        {
            var message = await _context.Message.FirstOrDefaultAsync(x => x.Id == messageId);

            if (message == null)
                return null;

            _context.Message.Remove(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<List<ConversationDto>?> GetConversationAsync(string userId)
        {
            var conversations = await _context.Conversation
                .Include(x => x.UserSender)
                .Include(x => x.ReceiverUser)
                .Where(x => x.UserSenderId == userId || x.ReceiverUserId == userId)
                .OrderByDescending(x => x.Messages.OrderByDescending(x => x.SentDate).Select(s => s.SentDate).FirstOrDefault())
                .Select(x => new ConversationDto
                {
                    Id = x.Id,
                    UserSenderId = x.UserSenderId,
                    ReceiverUserId = x.ReceiverUserId,
                    SenderUserFirstName = x.UserSender.FirstName,
                    SenderUserLastName = x.UserSender.LastName,
                    ReceiverUserFirstName = x.ReceiverUser.FirstName,
                    ReceiverUserLastName = x.ReceiverUser.LastName
                })
                .ToListAsync();

            if (conversations.Count == 0)
            { 
                return null;
            }

            return conversations;
        }

        public async Task<List<Message>?> GetMessagesAsync(int conversationId)
        {
            var messages = await _context.Message.Where(x => x.ConversationId == conversationId).ToListAsync();

            if (messages.Count == 0) { return null; }

            return messages;
        }

        public async Task<bool?> IsConversationExist(string userSenderId, string userReceiverId)
        {
            return await _context.Conversation.AnyAsync(x =>
                    (x.UserSenderId == userSenderId && x.ReceiverUserId == userReceiverId) ||
                    (x.UserSenderId == userReceiverId && x.ReceiverUserId == userSenderId))
                ? true : false;
        }

        public async Task<Message?> SendMessageAsync(Message message)
        {
            var added = await _context.AddAsync(message);
            await _context.SaveChangesAsync();

            if(added == null)
                return null;

            return message;
        }
    }
}
