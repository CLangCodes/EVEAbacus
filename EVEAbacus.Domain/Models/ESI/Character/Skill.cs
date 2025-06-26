using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class Skill
    {
        public int CharacterId { get; set; }
        public int ActiveSkillLevel { get; set; }
        public int SkillId { get; set; }
        public Item? SkillProperty { get; set; }
        public Int64 SkillpointsInSkill { get; set; }
        public int TrainedSkillLevel { get; set; }
    }
}
