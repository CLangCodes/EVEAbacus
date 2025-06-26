using EVEAbacus.Domain.Models.ESI.Character.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class CharacterSkills
    {
        [JsonProperty("skills")]
        public List<SkillDTO> Skills { get; set; } = [];

        [JsonProperty("total_sp")]
        public long TotalSP { get; set; }

        [JsonProperty("unallocated_sp")]
        public int UnallocatedSP { get; set; }
    }
}
