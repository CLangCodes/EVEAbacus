using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Market.DTO
{
    public class MarketRegionHistoryDTO
    {
        public float Average { get; set; }
        public string Date { get; set; } = string.Empty;
        public float Highest { get; set; }
        public float Lowest { get; set; }
        [JsonProperty("order_count")]
        public long OrderCount { get; set; }
        public long Volume { get; set; }
    }
}