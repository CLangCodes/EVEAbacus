using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class CharacterStandingExtensions
    {
        public static CharacterStanding ToCharacterStanding(this CharacterStandingDTO dto)
        {
            return new CharacterStanding()
            {
                FromId = dto.FromId,
                FromType = dto.FromType,
                Standing = dto.Standing
            };
        }

        public static IEnumerable<CharacterStanding> ToCharacterStandings(this IEnumerable<CharacterStandingDTO> dtos)
        {
            return dtos.Select(dto => dto.ToCharacterStanding());
        }
    }
} 