using EVEAbacus.Domain.Models.Map;

namespace EVEAbacus.Domain.Models.ESI.Market
{
    public class MarketOrder
    {
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public int Duration { get; set; }
        public bool IsBuyOrder { get; set; }
        public string Issued { get; set; } = string.Empty;
        public long LocationId { get; set; }
        public Station? Station { get; set; }
        public int MinVolume { get; set; }
        public long OrderId { get; set; }
        public decimal Price { get; set; }
        public string Range { get; set; } = string.Empty;
        public int RegionId { get; set; }
        public int SystemId { get; set; }
        public int TypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public int VolumeRemain { get; set; }
        public int VolumeTotal { get; set; }
    }
}