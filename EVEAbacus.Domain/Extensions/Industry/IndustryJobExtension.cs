using EVEAbacus.Domain.Models.ESI.Industry;
using EVEAbacus.Domain.Models.ESI.Industry.DTO;

namespace EVEAbacus.Domain.Extensions.Industry
{
    public static class IndustryJobExtension
    {
        public static IndustryJob ToIndustryJob(this IndustryJobDTO v)
        {
            return new IndustryJob()
            {
                ActivityId = v.ActivityId,
                BlueprintId = v.BlueprintId,
                BlueprintLocationId = v.BlueprintLocationId,
                BlueprintTypeId = v.BlueprintTypeId,
                CompletedCharacterId = v.CompletedCharacterId,
                CompletedDate = v.CompletedDate,
                Cost = v.Cost,
                Duration = v.Duration,
                EndDate = v.EndDate,
                FacilityId = v.FacilityId,
                InstallerId = v.InstallerId,
                JobId = v.JobId,
                LicensedRuns = v.LicensedRuns,
                OutputLocationId = v.OutputLocationId,
                PauseDate = v.PauseDate,
                Probability = v.Probability,
                ProductTypeId = v.ProductTypeId,
                Runs = v.Runs,
                StartDate = v.StartDate,
                StationId = v.StationId,
                Status = v.Status,
                SuccessfulRuns = v.SuccessfulRuns
            };
        }

        public static IEnumerable<IndustryJob> ToIndustryJobs(this IEnumerable<IndustryJobDTO> dtos)
        {
            return dtos.Select(dto => dto.ToIndustryJob());
        }
    }
}
