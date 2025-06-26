using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Blueprint
{        
    [Table("industryActivitySkills")]
    public class BPSkill
    {
        public int? BlueprintTypeId { get; set; }
        [JsonIgnore]
        public virtual Blueprint? Blueprint { get; set; }

        public byte? ActivityId { get; set; }

        public int? SkillId { get; set; }
        [JsonIgnore]

        public virtual Item? Skill { get; set; }

        public byte? Level { get; set; }
    }
}
