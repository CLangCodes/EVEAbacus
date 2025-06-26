namespace EVEAbacus.Domain.Models.ESI.Assets.DTO
{
    public class AssetDTO
    {
        public bool IsBlueprintCopy { get; set; }
        public bool IsSingleton { get; set; }
        public long ItemId { get; set; }
        public string LocationFlag { get; set; } = string.Empty;
        public long LocationId { get; set; }
        public string LocationType { get; set; } = string.Empty;
        public int Quantiy { get; set; }
        public int TypeId { get; set; }
    }
}
