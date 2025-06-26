using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Character.DTO
{
    public class SkillQueueDTO
    {
        [JsonProperty("finish_date")]
        public required string FinishDate { get; set; }
        [JsonProperty("finished_level")]
        public int FinishedLevel { get; set; }
        [JsonProperty("level_end_sp")]
        public int LevelEndSP { get; set; }
        [JsonProperty("level_start_sp")]
        public int LevelStartSP { get; set; }
        [JsonProperty("queue_position")]
        public int QueuePosition { get; set; }
        [JsonProperty("skill_id")]
        public int SkillId { get; set; }
        [JsonProperty("start_date")]
        public required string StartDate { get; set; }
        [JsonProperty("training_start_sp")]
        public int TrainingStartSP { get; set; }
    }
}
