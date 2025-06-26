using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models.Blueprint
{
    [Table("industryActivityMaterials")]
    public class BPMaterial
    {
        public int? BlueprintTypeId { get; set; }

        public byte? ActivityId { get; set; }

        public int? MaterialTypeId { get; set; }
        [JsonIgnore]

        public virtual Item? Material { get; set; }

        public int? Quantity { get; set; }
    }
}
