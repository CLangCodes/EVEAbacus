namespace EVEAbacus.Domain.Models.API.DTO
{
    public class PlanetDTO
    {
        public string Name { get; set; } = string.Empty;
        public string SolarSystem { get; set; } = string.Empty;
        public string Constellation { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string PlanetType { get; set; } = string.Empty;
        public float? Security { get; set; }
        public float? Radius { get; set; }
        public int? MinLinkPowerGrid { get; set; }
        public int? MinLinkCPU { get; set; }
    }
} 