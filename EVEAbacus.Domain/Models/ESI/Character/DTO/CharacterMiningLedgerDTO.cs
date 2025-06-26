using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class CharacterMiningLedgerDTO
    {
        public string Date { get; set; } = string.Empty;
        public long Quantity { get; set; }
        [JsonProperty("solar_system_id")]
        public int SolarSystemId { get; set; }
        public int TypeId { get; set; }
    }
}
