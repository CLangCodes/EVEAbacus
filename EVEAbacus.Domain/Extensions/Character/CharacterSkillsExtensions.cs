using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class CharacterSkillsExtensions
    {
        public static CharacterSkills ToCharacterSkills(this CharacterSkillsDTO dto)
        {
            return new CharacterSkills()
            {
                Skills = dto.Skills,
                TotalSP = dto.TotalSP,
                UnallocatedSP = dto.UnallocatedSP
            };
        }
    }
} 