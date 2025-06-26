using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models.Blueprint
{
    [Table("industryBlueprints")]
    public class Blueprint
    {
        public int BlueprintTypeId { get; set; }

        public int? MaxProductionLimit { get; set; }

        public virtual Item? ItemProperty { get; set; } = null!;

        public virtual ICollection<Item> Skills { get; set; } = [];
        public virtual ICollection<BPSkill> BPSkills { get; set; } = [];

        public virtual ICollection<Item> Products { get; set; } = [];
        public virtual ICollection<BPProduct> BPProducts { get; set; } = [];

        public virtual ICollection<Item> Materials { get; set; } = [];
        public virtual ICollection<BPMaterial> BPMaterials { get; set; } = [];

        public virtual ICollection<BPTime> BPTimes { get; set; } = [];
    }
}
