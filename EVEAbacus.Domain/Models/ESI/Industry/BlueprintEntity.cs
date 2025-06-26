using EVEAbacus.Domain.Models.ESI.Industry.DTO;

namespace EVEAbacus.Domain.Models.ESI.Industry
{
    public class BlueprintEntity
    {
        public long ItemId { get; set; }
        public Item? BlueprintProperty { get; set; }
        public string LocationFlag { get; set; }
        public long LocationId { get; set; }
        public int MaterialEfficiency { get; set; }
        public int Quantity { get; set; } // -1 if BPO, -2 if BPC
        public int Runs { get; set; } // -1 if Original
        public int TimeEfficiency { get; set; }
        public int TypeId { get; set; }

        public static implicit operator BlueprintEntity(BlueprintEntityDTO v)
        {
            return new BlueprintEntity() {
                ItemId = v.ItemId,
                LocationFlag = v.LocationFlag,
                LocationId = v.LocationId,
                MaterialEfficiency = v.MaterialEfficiency,
                Quantity = v.Quantity,
                Runs = v.Runs,
                TimeEfficiency = v.TimeEfficiency,
                TypeId = v.TypeId
            };
        }
    }
}
