using AutoMapper;
using RealEstateProject.Dtos.AddressDtos;
using RealEstateProject.Dtos.CommentDtos;
using RealEstateProject.Dtos.ConversationDtos;
using RealEstateProject.Dtos.HomeDtos;
using RealEstateProject.Dtos.HomeTypeDtos;
using RealEstateProject.Dtos.UserDtos;
using RealEstateProject.Models;

namespace RealEstateProject.Helper
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Home, HomeDto>();
            CreateMap<HomeDto, Home>();
            CreateMap<AddHomeDto,Home>();
            CreateMap<Home,AddHomeDto>();

            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>();

            CreateMap<HomeType, HomeTypeDto>();
            CreateMap<HomeTypeDto, HomeType>();

            CreateMap<UserDto, AppUser>();
            CreateMap<AppUser, UserDto>();

            CreateMap<UpdateUserDto, AppUser>();
            CreateMap<AppUser, UpdateUserDto>();

            CreateMap<HomeImageDto, HomeImage>();
            CreateMap<HomeImage, HomeImageDto>();

            CreateMap<HomeFilterDto, FavouriteFilters>();
            CreateMap<FavouriteFilters, HomeFilterDto>();

            CreateMap<CommentDto, Comment>();
            CreateMap<Comment, CommentDto>();

            CreateMap<AddCommentDto, Comment>();
            CreateMap<Comment, AddCommentDto>();

            CreateMap<MessageDto, Message>();
            CreateMap<Message, MessageDto>();
        }
    }
}
