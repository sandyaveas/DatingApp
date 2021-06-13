using DatingAPI.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using DatingAPI.Models;

namespace DatingAPI.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var requestContext = await next();
            int userId = int.Parse(requestContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var repo = requestContext.HttpContext.RequestServices.GetService<IDatingRepository>();

            User user = await repo.GetUser(userId);
            user.LastActive = DateTime.Now;
            await repo.SaveAll();
        }
    }
}
