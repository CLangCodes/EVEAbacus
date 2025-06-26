using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class CharacterExtensions
    {
        public static CharacterEntity ToCharacter(this CharacterDTO dto, int characterId, string characterName)
        {
            return new CharacterEntity()
            {
                AllianceId = dto.AllianceId,
                Birthday = dto.Birthday,
                BloodlineId = dto.BloodlineId,
                CorporationId = dto.CorporationId,
                Description = dto.Description,
                FactionId = dto.FactionId,
                Gender = dto.Gender,
                CharacterId = characterId,
                Name = characterName,
                RaceId = dto.RaceId,
                SecurityStatus = dto.SecurityStatus,
                Title = dto.Title
            };
        }
    }
} 