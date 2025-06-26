namespace EVEAbacus.Domain.Models.ESI.Market
{
    public class MarketStat
    {
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public int TypeId { get; set; }
        public long StationId { get; set; }
        public int RegionId { get; set; }
        public string StationName { get; set; } = string.Empty;
        public decimal AverageSellPrice { get; set; }
        public long SellVolume { get; set; }
        public decimal AverageBuyPrice { get; set; }
        public long BuyVolume { get; set; }
    }
}
