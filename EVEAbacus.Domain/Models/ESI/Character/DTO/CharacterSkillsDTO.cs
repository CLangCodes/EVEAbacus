using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class CharacterSkillsDTO
    {
        [JsonProperty("skills")]
        public List<SkillDTO> Skills { get; set; } = [];

        [JsonProperty("total_sp")]
        public long TotalSP { get; set; }

        [JsonProperty("unallocated_sp")]
        public int UnallocatedSP { get; set; }
    }
}
