using EVEAbacus.Domain.Models.ESI.Character.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class SkillQueue
    {
        public required string FinishDate { get; set; }
        public int FinishedLevel { get; set; }
        public int LevelEndSP { get; set; }
        public int LevelStartSP { get; set; }
        public int QueuePosition { get; set; }
        public int SkillId { get; set; }
        public required string StartDate { get; set; }
        public int TrainingStartSP { get; set; }
    }
}
