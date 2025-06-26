using Newtonsoft.Json;

namespace EVEAbacus.Domain.Models.ESI.Industry.DTO
{
    public class IndustryJobDTO
    {
        [JsonProperty("activity_id")]
        public int ActivityId { get; set; }
        [JsonProperty("blueprint_id")]
        public long BlueprintId { get; set; }
        [JsonProperty("blueprint_location_id")]
        public long BlueprintLocationId { get; set; }
        [JsonProperty("blueprint_type_id")]
        public int BlueprintTypeId { get; set; }
        [JsonProperty("completed_character_id")]
        public int CompletedCharacterId { get; set; }
        [JsonProperty("completed_date")]
        public string CompletedDate { get; set; } = string.Empty;
        public float Cost { get; set; }
        public int Duration { get; set; }
        [JsonProperty("end_date")]
        public string EndDate { get; set; } = string.Empty;
        [JsonProperty("facility_id")]
        public long FacilityId { get; set; }
        [JsonProperty("installer_id")]
        public int InstallerId { get; set; }
        [JsonProperty("job_id")]
        public int JobId { get; set; }
        [JsonProperty("licensed_runs")]
        public int LicensedRuns { get; set; }
        [JsonProperty("output_location_id")]
        public long OutputLocationId { get; set; }
        [JsonProperty("pause_date")]
        public string PauseDate { get; set; } = string.Empty;
        public float Probability { get; set; }
        [JsonProperty("product_type_id")]
        public int ProductTypeId { get; set; }
        public int Runs { get; set; }
        [JsonProperty("start_date")]
        public string StartDate { get; set; } = string.Empty;
        [JsonProperty("station_id")]
        public long StationId { get; set; }
        public string Status { get; set; } = string.Empty;
        [JsonProperty("successful_runs")]
        public int SuccessfulRuns { get; set; }
    }
}
