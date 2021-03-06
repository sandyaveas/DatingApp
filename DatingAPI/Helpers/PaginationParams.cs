using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Helpers
{
    public class PaginationParams
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int UserId { get; set; }
        public string Gender { get; set; }
        public int minAge { get; set; } = 18;
        public int maxAge { get; set; } = 99;
        public string OrderBy { get; set; }
        public bool Likees { get; set; }
        public bool Likers { get; set; }
        public string MessageContainer { get; set; } = "Unread";
    }
}
