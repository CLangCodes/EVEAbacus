using EVEAbacus.Domain.Models.Calculator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.API.Requests
{
    public class SupplyPlanRequest
    {
        public List<BOMLineItem> BillOfMaterials { get; set; } = [];
        public long[] StationIds { get; set; } = [];
    }
}
