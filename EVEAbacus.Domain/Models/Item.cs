using EVEAbacus.Domain.Models.Blueprint;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models
{
    public class Item
    {
        public int TypeId { get; set; }
        public bool? Published { get; set; }
        public string? TypeName { get; set; }
        public string? Description { get; set; }
        public int? GroupId { get; set; }
        public virtual Group? Group { get; set; } = null!;
        public int? MarketGroupId { get; set; }
        public int? GraphicId { get; set; }
        public float? Radius { get; set; }
        public int? IconId { get; set; }
        public int? SoundId { get; set; }
        public int? FactionId { get; set; }
        public byte? RaceId { get; set; }
        public string? SofFactionName { get; set; }
        public int? SofMaterialSetId { get; set; }
        public int? MetaGroupId { get; set; }
        public int? VariationparentTypeId { get; set; }
        public float? Mass { get; set; }
        public float? Volume { get; set; }
        public float? PackagedVolume { get; set; }
        public float? Capacity { get; set; }
        public int? PortionSize { get; set; }
        public float? BasePrice { get; set; }
        [JsonIgnore]
        [NotMapped]
        public virtual ICollection<Blueprint.Blueprint>? Blueprints { get; set; } = [];

        [JsonIgnore]
        [NotMapped]
        public virtual ICollection<BPSkill>? BPSkills { get; set; } = [];

        [JsonIgnore]
        [NotMapped]
        public virtual ICollection<BPProduct>? BPProducts { get; set; } = [];

        [JsonIgnore]
        [NotMapped]
        public virtual ICollection<BPMaterial>? BPMaterials { get; set; } = [];
        //public Tycoon.MarketHistory? MarketHistory { get; set; }
    }
}
