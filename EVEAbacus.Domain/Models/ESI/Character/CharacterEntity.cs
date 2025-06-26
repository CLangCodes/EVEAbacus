using EVEAbacus.Domain.Models.ESI.Assets;
using EVEAbacus.Domain.Models.ESI.Industry;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models.ESI.Character
{
    public class CharacterEntity
    {
        public string? UserId;
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public int? AllianceId { get; set; }
        [NotMapped]
        public List<Asset>? Assets { get; set; }
        public required string Birthday { get; set; }
        public int? BloodlineId { get; set; }
        [NotMapped]
        public List<BlueprintEntity>? CharacterBlueprints { get; set; }
        public int? CharacterId { get; set; }
        [NotMapped]
        public CharacterAttribute? CharacterAttributes { get; set; }
        public int? CorporationId { get; set; }
        public string? Description { get; set; }
        public int? FactionId { get; set; }
        public string? Gender { get; set; }
        [NotMapped]
        public List<IndustryJob>? IndustryJobs { get; set; }
        [NotMapped]
        public List<CharacterMiningLedger>? MiningLedger { get; set; }
        public required string Name { get; set; }
        public int RaceId { get; set; }
        public float? SecurityStatus { get; set; }
        public long TotalSP { get; set; }
        public int UnallocatedSP { get; set; }
        [NotMapped]
        public List<Skill>? Skills { get; set; }
        [NotMapped]
        public List<SkillQueue>? SkillQueue { get; set; }
        [NotMapped]
        public CharacterSkills? SkillProfile { get; set; }
        [NotMapped]
        public List<CharacterStanding>? Standings { get; set; }
        public string? Title { get; set; }
    }
}
