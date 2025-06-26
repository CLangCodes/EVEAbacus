using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class CharacterMiningLedger
    {
        public required string Date { get; set; }
        public long Quantity { get; set; }
        public int SolarSystemId { get; set; }
        public int TypeId { get; set; }
    }
}
