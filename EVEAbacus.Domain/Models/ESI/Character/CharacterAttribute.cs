using EVEAbacus.Domain.Models.ESI.Character.DTO;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class CharacterAttribute
    {
        public required string AccruedRemapCooldownDate { get; set; }
        public int BonusRemaps { get; set; }
        public int Charisma { get; set; }
        public int Intelligence { get; set; }
        public required string LastRemapDate { get; set; }
        public int Memory { get; set; }
        public int Perception { get; set; }
        public int Willpower { get; set; }
    }
}
