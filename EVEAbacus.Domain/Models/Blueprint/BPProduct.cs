using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Blueprint
{
    [Table("industryActivityProducts")]
    public class BPProduct
    {
        public int? BlueprintTypeId { get; set; }

        public byte? ActivityId { get; set; }

        public int? ProductTypeId { get; set; }
        [JsonIgnore]

        public virtual Item? Product { get; set; }

        public int? Quantity { get; set; }

        public float? Probability { get; set; }
    }
}
