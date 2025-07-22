using RealEstateProject.Models;

namespace RealEstateProject.Interfaces
{
    public interface ICommentRepository
    {
        public Task<Comment> AddCommentToHomeAsync(string userId, int homeId, Comment comment);
        public Task<List<Comment>> GetCommentsByHomeAsync(string userId,int homeId);
        public Task<Comment> DeleteCommentAsync(string userId,int commentId);
        public Task<bool> HasUserCommentAsync(string userId, int homeId);
        public Task<bool> IsItOwnHouse(string userId, int homeId);


    }
}
