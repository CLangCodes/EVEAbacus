using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models
{
    public class MarketGroup
    {
        public int MarketGroupId { get; set; }
        public string? DescriptionId { get; set; }
        public bool? HasTypes { get; set; }
        public int? IconId { get; set; }
        public string? NameId { get; set; }
        public int? ParentGroupId { get; set; }
    }
}
