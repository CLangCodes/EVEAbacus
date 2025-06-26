namespace EVEAbacus.Domain.Models.Map
{
    public class ConstellationJump
    {
        public int? FromRegionId { get; set; }
        public int FromConstellationId { get; set; }
        public int ToConstellationId { get; set; }
        public int? ToRegionId { get; set; }
    }
}
