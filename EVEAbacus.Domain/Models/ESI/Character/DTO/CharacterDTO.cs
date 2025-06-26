using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class CharacterDTO
    {
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        [JsonProperty("alliance_id")]
        public int? AllianceId { get; set; }
        public required string Birthday { get; set; }
        [JsonProperty("bloodline_id")]
        public int? BloodlineId { get; set; }
        [JsonProperty("corporation_id")]
        public int? CorporationId { get; set; }
        public string? Description { get; set; }
        [JsonProperty("faction_id")]
        public int? FactionId { get; set; }
        public string? Gender { get; set; }
        public required string Name { get; set; }
        [JsonProperty("race_id")]
        public int RaceId { get; set; }
        [JsonProperty("security_status")]
        public float? SecurityStatus { get; set; }
        public string? Title { get; set; }
    }
}
