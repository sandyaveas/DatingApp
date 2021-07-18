using DatingAPI.Helpers;
using DatingAPI.Interfaces;
using DatingAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.DataModel
{
    public class DatingRepository : IDatingRepository
    {
        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        private readonly DataContext _context;

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(a => a.Photos).FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(PaginationParams paginationParams)
        {
            var users = _context.Users.Include(a => a.Photos).OrderByDescending(b=> b.LastActive).AsQueryable();

            users = users.Where(a => a.Id != paginationParams.UserId && a.Gender == paginationParams.Gender);
            
            if(paginationParams.minAge != 18 || paginationParams.maxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-paginationParams.maxAge - 1);
                var maxDob = DateTime.Today.AddYears(-paginationParams.minAge);

                users = users.Where(a => a.DateOfBirth >= minDob && a.DateOfBirth <= maxDob);
            }

            if (paginationParams.Likers)
            {
                var userLikers = await GetUserLikes(paginationParams.UserId, paginationParams.Likers);

                users = users.Where(a => userLikers.Contains(a.Id));
            }

            if (paginationParams.Likees)
            {
                var userLikees = await GetUserLikes(paginationParams.UserId, paginationParams.Likers);

                users = users.Where(a => userLikees.Contains(a.Id));
            }

            if (!string.IsNullOrEmpty(paginationParams.OrderBy))
            { 
                switch (paginationParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(a => a.Created);
                        break;
                    default:
                        users = users.OrderByDescending(a => a.LastActive);
                        break;
                }
            }


            return await PagedList<User>.CreateAsync(users, paginationParams.PageNumber, paginationParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users.Include(a => a.Likers).Include(a => a.Likees).FirstOrDefaultAsync(a => a.Id == id);

            if(likers)
                return user.Likers.Where(a => a.LikeeId == id).Select(a => a.LikerId);
            else
                return user.Likees.Where(a => a.LikerId == id).Select(a => a.LikeeId);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Like> GetLike(int userId, int recepientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(a => a.LikerId == userId && a.LikeeId == recepientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(PaginationParams paginationParams)
        {
            var messages = _context.Messages.Include(a => a.Sender).ThenInclude(a => a.Photos)
                                            .Include(a => a.Recipient).ThenInclude(a => a.Photos)
                                            .AsQueryable();

            switch (paginationParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(a => a.RecipientId == paginationParams.UserId && !a.RecipientDeleted);
                    break;
                case "Outbox":
                    messages = messages.Where(a => a.SenderId == paginationParams.UserId && !a.SenderDeleted);
                    break;
                default:
                    messages = messages.Where(a => a.RecipientId == paginationParams.UserId && !a.IsRead && !a.RecipientDeleted);
                    break;
            }

            messages = messages.OrderByDescending(a => a.DateSent);

            return await PagedList<Message>.CreateAsync(messages, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<List<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = _context.Messages.Include(a => a.Sender).ThenInclude(a => a.Photos)
                                            .Include(a => a.Recipient).ThenInclude(a => a.Photos)
                                            .Where(a => (a.RecipientId == userId && a.SenderId == recipientId && !a.RecipientDeleted)
                                                     || (a.RecipientId == recipientId && a.SenderId == userId && !a.SenderDeleted))
                                            .OrderByDescending(a => a.DateSent)
                                            .ToListAsync();

            return await messages;
        }
    }
}
