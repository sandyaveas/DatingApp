using DatingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> Register(User user);
        Task<User> Login(User user);
        Task<bool> UserExists(string username);
    }
}
