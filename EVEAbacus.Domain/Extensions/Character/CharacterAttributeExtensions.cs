using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class CharacterAttributeExtensions
    {
        public static CharacterAttribute ToCharacterAttribute(this CharacterAttributeDTO dto)
        {
            return new CharacterAttribute()
            {
                AccruedRemapCooldownDate = dto.AccruedRemapCooldownDate,
                BonusRemaps = dto.BonusRemaps,
                Charisma = dto.Charisma,
                Intelligence = dto.Intelligence,
                LastRemapDate = dto.LastRemapDate,
                Memory = dto.Memory,
                Perception = dto.Perception,
                Willpower = dto.Willpower,
            };
        }
    }
}
