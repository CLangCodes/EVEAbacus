using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Industry
{
    public class IndustrySystemCostIndex
    {
        public List<IndustryCostIndex> CostIndices = [];
        public int SolarSystemId { get; set; }
    }
}
