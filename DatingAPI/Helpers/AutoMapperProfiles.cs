using AutoMapper;
using DatingAPI.DTOs;
using DatingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForDetailDTO>()
                .ForMember(dest => dest.PhotoUrl, 
                           opt => opt.MapFrom(src => src.Photos.FirstOrDefault(a => a.IsMain).Url))
                .ForMember(dest => dest.Age,
                           opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForListDTO>()
                .ForMember(dest => dest.PhotoUrl, 
                           opt => opt.MapFrom(src => src.Photos.FirstOrDefault(a => a.IsMain).Url))
                .ForMember(dest => dest.Age,
                           opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<UserForUpdateDTO, User>();

            CreateMap<Photo, PhotosForDetailDTO>();
            CreateMap<Photo, PhotoForReturnDTO>();
            CreateMap<PhotoForCreationDTO, Photo>();
        }
    }
}
