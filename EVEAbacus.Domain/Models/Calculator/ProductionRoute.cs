using EVEAbacus.Domain.Models.ESI.Market;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class ProductionRoute
    {
        public int MaterialTypeId { get; set; }
        public string MaterialName { get; set; } = string.Empty;
        public int BlueprintTypeId { get; set; }
        public string? BlueprintName { get; set; }
        public int Requisitioned { get; set; }
        public required Order Order { get; set; }
        public List<Order> Orders { get; set; } = [];
        public required int ProducedPerRun { get; set; }
        public int Produced { get { return Order.Runs * Order.Copies * ProducedPerRun; } }
        public int Inventory { get; set; } = 0;
        public decimal? AverageSellPrice { get; set; }
        public decimal? AverageBuyPrice { get; set; }
        public Item? BlueprintMetaData { get; set; }
        public Item? MaterialMetaData { get; set; }
        public List<MarketRegionHistory> MaterialMarketHistory { get; set; } = [];
        public List<MarketStat> MarketStats { get; set; } = [];
    }
}
