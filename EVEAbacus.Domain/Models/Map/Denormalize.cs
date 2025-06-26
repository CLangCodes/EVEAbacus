namespace EVEAbacus.Domain.Models.Map
{
    public class Denormalize
    {
        public Int64 ItemId { get; set; }
        public required Name Name { get; set; }
        public int? TypeId { get; set; }
        public required Item Item { get; set; }
        public int? SolarSystemId { get; set; }
        public required SolarSystem? SolarSystem { get; set; }
        public int? ConstellationId { get; set; }
        public required Constellation Constellation { get; set; }
        public int? RegionId { get; set; }
        public required Region Region { get; set; }
        public int? OrbitId { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
        public float? Radius { get; set; }
        public int? NameId { get; set; }
        public float? Security { get; set; }
        public int? CelestialIndex { get; set; }
        public int? OrbitIndex { get; set; }
        public int? MinLinkPowerGrid => Radius.HasValue ? (int)Math.Ceiling(10 + 0.15 * (0.012008578 * ((float)Radius / 1000))) : null;
        public int? MinLinkCPU => Radius.HasValue ? (int)Math.Ceiling(15 + (0.2 * (0.012008578 * ((float)Radius / 1000)))) : null;
    }
}
