using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Extensions.Character
{
    public static class CharacterMiningLedgerExtensions
    {
        public static CharacterMiningLedger ToCharacterMiningLedger(this CharacterMiningLedgerDTO dto)
        {
            return new CharacterMiningLedger()
            {
                Date = dto.Date,
                Quantity = dto.Quantity,
                SolarSystemId = dto.SolarSystemId,
                TypeId = dto.TypeId
            };
        }
        public static IEnumerable<CharacterMiningLedger> ToCharacterMiningLedgers(this IEnumerable<CharacterMiningLedgerDTO> dtos)
        {
            return dtos.Select(dto => dto.ToCharacterMiningLedger());
        }
    }
}
