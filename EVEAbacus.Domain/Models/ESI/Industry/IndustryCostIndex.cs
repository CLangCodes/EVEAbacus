using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Industry
{
    public class IndustryCostIndex
    {
        public required string Activity { get; set; }
        public float CostIndex { get; set; }
    }
}
