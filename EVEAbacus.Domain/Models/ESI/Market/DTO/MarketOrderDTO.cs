using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Market.DTO
{
    public class MarketOrderDTO
    {
        public int Duration { get; set; }
        [JsonProperty("is_buy_order")]
        public bool IsBuyOrder { get; set; }
        public string Issued { get; set; } = string.Empty;
        [JsonProperty("location_id")]
        public long LocationId { get; set; }
        public int MinVolume { get; set; }
        [JsonProperty("order_id")]
        public long OrderId { get; set; }
        public float Price { get; set; }
        public string Range { get; set; } = string.Empty;
        [JsonProperty("system_id")]
        public int SystemId { get; set; }
        [JsonProperty("type_id")]
        public int TypeId { get; set; }
        [JsonProperty("volume_remain")]
        public int VolumeRemain { get; set; }
        [JsonProperty("volume_total")]
        public int VolumeTotal { get; set; }
    }
}