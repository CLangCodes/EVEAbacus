using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.API.Requests
{
    public class PIPlannerRequest
    {
        public string FocalSystemName { get; set; } = string.Empty;
        public int Range { get; set; }
        public string[]? SecurityStatus { get; set; }
        public string[]? PlanetTypes { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }
}
