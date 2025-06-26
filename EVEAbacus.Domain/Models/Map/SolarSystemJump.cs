namespace EVEAbacus.Domain.Models.Map
{
    public class SolarSystemJump
    {
        public int? FromRegionId { get; set; }
        public int? FromConstellationId { get; set; }
        public int FromSolarSystemId { get; set; }
        public int ToSolarSystemId { get; set; }
        public int? ToConstellationId { get; set; }
        public int? ToRegionId { get; set; }
    }
}
