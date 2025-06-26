using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class CharacterAttributeDTO
    {
        [JsonProperty("accrued_remap_cooldown_date")]
        public required string AccruedRemapCooldownDate { get; set; }
        [JsonProperty("bonus_remaps")]
        public int BonusRemaps { get; set; }
        public int Charisma { get; set; }
        public int Intelligence { get; set; }
        [JsonProperty("last_remap_date")]
        public required string LastRemapDate { get; set; }
        public int Memory { get; set; }
        public int Perception { get; set; }
        public int Willpower { get; set; }
    }
}
