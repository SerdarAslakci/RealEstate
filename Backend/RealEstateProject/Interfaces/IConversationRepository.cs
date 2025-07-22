using RealEstateProject.Dtos.ConversationDtos;
using RealEstateProject.Models;

namespace RealEstateProject.Interfaces
{
    public interface IConversationRepository
    {
        public Task<List<ConversationDto>?> GetConversationAsync(string userId);
        public Task<ConversationDto?> CreateConversationAsync(string userSenderId, string userReceiverId);
        public Task<Conversation?> DeleteConservationAsync(int conversationId);
        public Task<bool?> IsConversationExist(string userSenderId, string userReceiverId);

        public Task<List<Message>?> GetMessagesAsync(int conversationId);
        public Task<Message?> SendMessageAsync(Message message);
        public Task<Message?> DeleteMessageAsync(int messageId);
    }
}
