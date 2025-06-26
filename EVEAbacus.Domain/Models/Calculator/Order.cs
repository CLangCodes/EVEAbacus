using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class Order
    {
        public int BlueprintTypeId { get; set; }
        public byte ActivityId { get; set; }
        public int ProductTypeId { get; set; }
        public required string ProductName { get; set; }
        public required Item Product { get; set; }
        public required string BlueprintName { get; set; }
        public int Copies { get; set; }
        public int Runs { get; set; }
        [NotMapped]
        public int Quantity { get { return this.Copies * this.Runs; } }
        public int ME { get; set; }
        public int TE { get; set; }
        public int? ParentBlueprintTypeId { get; set; }
    }
}