using DatingAPI.Helpers;
using DatingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Interfaces
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(PaginationParams paginationParams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(PaginationParams messageParams);
        Task<List<Message>> GetMessageThread(int userId, int recipientId);

    }
}
