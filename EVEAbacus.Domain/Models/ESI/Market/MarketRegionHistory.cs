using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Market
{
    public class MarketRegionHistory
    {
        public int RegionId {  get; set; }
        public int TypeId { get; set; }
        public decimal Average { get; set; }
        public DateTime Date { get; set; }
        public decimal Highest { get; set; }
        public decimal Lowest { get; set; }
        public Int64 OrderCount { get; set; }
        public Int64 Volume { get; set; }
    }
}