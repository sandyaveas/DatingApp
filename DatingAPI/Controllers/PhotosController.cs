using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingAPI.DTOs;
using DatingAPI.Helpers;
using DatingAPI.Interfaces;
using DatingAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{

    [ApiController, Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }


        
        [HttpGet("{id:int}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDTO>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotos(int userId, [FromForm]PhotoForCreationDTO photoForCreation)
        {
            if (userId != Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            var file = photoForCreation.File;

            if (file is null)
                return BadRequest("No file found to upload.");

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(400).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreation.Url = uploadResult.Url.ToString();
            photoForCreation.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreation);

            if (!user.Photos.Any(a => a.IsMain))
                photo.IsMain = true;

            user.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDTO>(photo);

                //Not working in my case
                //return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
                return Ok(photoToReturn);
            }

            return BadRequest("Couldn't add the photo");
        }
    }

}
