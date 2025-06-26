using EVEAbacus.Domain.Models.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Assets
{
    public class AssetLocation
    {
        public long ItemId { get; set; }
        public Position Position { get; set; }
    }
}
