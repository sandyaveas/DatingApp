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

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.Include(a => a.Photos).ToListAsync();
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}
