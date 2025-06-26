using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class CharacterStandingDTO
    {
        [JsonProperty("from_id")]
        public int FromId { get; set; }
        [JsonProperty("from_type")]
        public string FromType { get; set; } = string.Empty;
        public float Standing { get; set; }
    }
}
