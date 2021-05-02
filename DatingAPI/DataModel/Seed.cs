﻿using DatingAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.DataModel
{
    public class Seed
    {
        public static void SeedUsers(DataContext context) 
        {
            if (!context.Users.Any())
            {
                string userData = System.IO.File.ReadAllText("DataModel/UserSeedData.json");
                List<User> users = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach (var user in users)
                {                    
                    CreatePasswordHash("1234", out byte[] passwordHash, out byte[] passwordSalt);

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();

                    context.Users.Add(user);
                }

                context.SaveChanges();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                passwordSalt = hmac.Key;
            }
        }
    }
}
