using DatingAPI.Helpers;
using DatingAPI.Interfaces;
using DatingAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAPI.Helpers;

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
