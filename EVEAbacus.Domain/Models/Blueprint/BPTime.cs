using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Blueprint
{
    [Table("industryActivities")]
    public class BPTime
    {
        public int BlueprintTypeId { get; set; }

        public byte ActivityId { get; set; }
        [JsonIgnore]

        public virtual Blueprint? Blueprint { get; set; }

        public int? Time { get; set; }
    }
}
