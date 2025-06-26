using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Assets
{
    public class Asset
    {
        public bool IsBlueprintCopy { get; set; }
        public bool IsSingleton { get; set; }
        public long ItemId { get; set; }
        public string LocationFlag { get; set; }
        public long LocationId { get; set; }
        public string LocationType { get; set; }
        public int Quantiy { get; set; }
        public int TypeId { get; set; }
    }
}
