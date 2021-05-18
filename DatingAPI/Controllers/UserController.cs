using AutoMapper;
using DatingAPI.DTOs;
using DatingAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var usersToReturn = _mapper.Map<List<UserForListDTO>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailDTO>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO updateUser)
        {
            if (id != Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(id);

            if(user is Models.User)
            {
                _mapper.Map(updateUser, user);

                if (await _repo.SaveAll())
                {
                    return NoContent();
                }
            }

            throw new Exception();
        }

        private bool ClaimType(Claim obj)
        {
            throw new NotImplementedException();
        }
    }


}
