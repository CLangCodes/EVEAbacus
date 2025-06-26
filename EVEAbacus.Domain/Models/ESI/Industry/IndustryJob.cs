using EVEAbacus.Domain.Models.ESI.Industry.DTO;

namespace EVEAbacus.Domain.Models.ESI.Industry
{
    public class IndustryJob
    {
        public int ActivityId { get; set; }
        public long BlueprintId { get; set; }
        public long BlueprintLocationId { get; set; }
        public int BlueprintTypeId { get; set; }
        public int CompletedCharacterId { get; set; }
        public required string CompletedDate { get; set; }
        public float Cost { get; set; }
        public int Duration { get; set; }
        public required string EndDate { get; set; }
        public long FacilityId { get; set; }
        public int InstallerId { get; set; }
        public int JobId { get; set; }
        public int LicensedRuns { get; set; }
        public long OutputLocationId { get; set; }
        public required string PauseDate { get; set; }
        public float Probability { get; set; }
        public int ProductTypeId { get; set; }
        public int Runs { get; set; }
        public required string StartDate { get; set; }
        public Int64 StationId { get; set; }
        public required string Status { get; set; }
        public int SuccessfulRuns { get; set; }
    }
}
