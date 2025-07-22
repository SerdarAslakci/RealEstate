using Microsoft.EntityFrameworkCore;
using RealEstateProject.Data;
using RealEstateProject.Interfaces;
using RealEstateProject.Models;

namespace RealEstateProject.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Comment?> AddCommentToHomeAsync(string userId, int homeId, Comment comment)
        {
            if(comment == null) return null;

            var existComment = await _context.Comments.FirstOrDefaultAsync(x => x.userId == userId && x.homeId == homeId);

            if(existComment != null) return null;

            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<Comment?> DeleteCommentAsync(string userId, int commentId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(x => x.Id == commentId);

            if (comment == null)
                return null;

            _context.Comments.Remove(comment);  
            await _context.SaveChangesAsync();

            return comment;
        }

        public async Task<List<Comment>> GetCommentsByHomeAsync(string userId, int homeId)
        {
            var commentList = await _context.Comments.Where(x => x.homeId == homeId).ToListAsync();
            if(!string.IsNullOrEmpty(userId))
            {
                var comment = await _context.Comments.FirstOrDefaultAsync(x => x.userId == userId && x.homeId == homeId);
                if(comment != null)
                {
                    commentList = commentList.Where(x => x.userId != userId).ToList();
                    commentList.Add(comment);
                }

            }

            commentList.Reverse();

            return commentList;
        }

        public async Task<bool> HasUserCommentAsync(string userId, int homeId)
        {
            return await _context.Comments.AnyAsync(x => x.userId == userId && x.homeId == homeId);
        }

        public async Task<bool> IsItOwnHouse(string userId, int homeId)
        {
            return await _context.Home.AnyAsync(x => x.UserId == userId && x.Id == homeId);
        }
    }
}
