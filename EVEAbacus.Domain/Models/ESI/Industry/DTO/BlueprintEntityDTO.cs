namespace EVEAbacus.Domain.Models.ESI.Industry.DTO
{
    public class BlueprintEntityDTO
    {
        public long ItemId { get; set; }
        public string LocationFlag { get; set; } = string.Empty;
        public long LocationId { get; set; }
        public int MaterialEfficiency { get; set; }
        public int Quantity { get; set; } // -1 if BPO, -2 if BPC
        public int Runs { get; set; } // -1 if Original
        public int TimeEfficiency { get; set; }
        public int TypeId { get; set; }
    }
}
