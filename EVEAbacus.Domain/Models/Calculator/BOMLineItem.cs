using EVEAbacus.Domain.Models.ESI.Market;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class BOMLineItem
    {
        public int TypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Requisitioned { get; set; }
        public int Inventory { get; set; } = 0;
        public int NetRequisitioned => Math.Max(0, Requisitioned - Inventory);
        public required Item Item { get; set; }
        public List<MarketRegionHistory> MarketHistory { get; set; } = [];
        public List<PurchaseRequisition> PurchaseRequisitions { get; set; } = [];
        public List<MarketStat> MarketStats { get; set; } = [];
        public decimal? LowestSellPrice => MarketStats?
            .Where(x => x.TypeId == this.TypeId &&
                        x.AverageSellPrice > 0)
            .MinBy(x => x.AverageSellPrice)?
            .AverageSellPrice;

        public string? SellStation => MarketStats?
            .Where(x => x.TypeId == this.TypeId &&
                        x.AverageSellPrice > 0)
            .MinBy(x => x.AverageSellPrice)?
            .StationName;

        public decimal? LowestBuyPrice => MarketStats?
            .Where(x => x.TypeId == this.TypeId &&
                        x.AverageBuyPrice > 0)
            .MaxBy(x => x.AverageBuyPrice)?
            .AverageBuyPrice;

        public string? BuyStation => MarketStats?
            .Where(x => x.TypeId == this.TypeId &&
                        x.AverageBuyPrice > 0)
            .MaxBy(x => x.AverageBuyPrice)?
            .StationName;
    }
}
