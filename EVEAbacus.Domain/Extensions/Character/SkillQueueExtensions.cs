using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class SkillQueueExtensions
    {
        public static SkillQueue ToSkillQueue(this SkillQueueDTO dto)
        {
            return new SkillQueue()
            {
                FinishDate = dto.FinishDate,
                FinishedLevel = dto.FinishedLevel,
                LevelEndSP = dto.LevelEndSP,
                LevelStartSP = dto.LevelStartSP,
                QueuePosition = dto.QueuePosition,
                SkillId = dto.SkillId,
                StartDate = dto.StartDate,
                TrainingStartSP = dto.TrainingStartSP
            };
        }

        public static IEnumerable<SkillQueue> ToSkillQueues(this IEnumerable<SkillQueueDTO> dtos)
        {
            return dtos.Select(dto => dto.ToSkillQueue());
        }
    }
} 