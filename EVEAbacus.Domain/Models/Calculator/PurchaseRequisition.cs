using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class PurchaseRequisition
    {
        public long StationId { get; set; }
        public Station? Station { get; set; }
        public int TypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public MarketOrder? MarketOrder { get; set; }
        public decimal Price { get; set; }
        public Item Item { get; set; }
    }
}
