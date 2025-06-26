namespace EVEAbacus.Domain.Models.Map
{
    public class CelestialStatistic
    {
        public int CelestialId { get; set; }
        public float? Temperature { get; set; }
        public string? SpectralClass { get; set; } = string.Empty;
        public float? Luminosity { get; set; }
        public float? Age { get; set; }
        public float? Life {  get; set; }
        public float? OrbitRadius { get; set; }
        public float? Eccentricity { get; set; }
        public float? MassDust { get; set; }
        public float? MassGas { get; set; }
        public bool? Fragmented {  get; set; }
        public float? Density { get; set; }
        public float? SurfaceGravity { get; set; }
        public float? EscapeVelocity { get; set; }
        public float? OrbitPeriod { get; set; }
        public float? RotationRate { get; set; }
        public bool? Locked { get; set; }
        public float? Pressure { get; set; }
        public float? Radius { get; set; }
        public int? HeightMap1 { get; set; }
        public int? HeightMap2 { get; set; }
        public bool? Population {  get; set; }
        public int? ShaderPreset { get; set; }
    }
}
