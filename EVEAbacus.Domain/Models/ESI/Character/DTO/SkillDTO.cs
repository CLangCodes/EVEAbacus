using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class SkillDTO
    {
        [JsonProperty("active_skill_level")]
        public int ActiveSkillLevel { get; set; }
        [JsonProperty("skill_id")]
        public int SkillId { get; set; }
        [JsonIgnore]
        public required Item SkillProperty { get; set; }

        [JsonProperty("skillpoints_in_skill")]
        public long SkillpointsInSkill { get; set; }
        [JsonProperty("trained_skill_level")]
        public int TrainedSkillLevel { get; set; }
    }
}
