using System.ComponentModel.DataAnnotations.Schema;

namespace EVEAbacus.Domain.Models.Map
{
    public class SolarSystem
    {
        public int SolarSystemId { get; set; }
        public string? SolarSystemName { get; set; }
        public int? RegionId { get; set; }
        public int? ConstellationId { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
        public float? X_Min { get; set; }
        public float? X_Max { get; set; }
        public float? Y_Min { get; set; }
        public float? Y_Max { get; set; }
        public float? Z_Min { get; set; }
        public float? Z_Max { get; set; }
        public float? Luminosity { get; set; }
        public bool? Border {  get; set; }
        public bool? Corridor { get; set; }
        public bool? Fringe { get; set; }
        public bool? Hub { get; set; }
        public bool? International { get; set; }
        public bool? Regional { get; set; }
        public float? Security {  get; set; }
        public int? FactionId { get; set; }
        public float? Radius { get; set; }
        public int? SunTypeId { get; set; }
        public string? SecurityClass { get; set; } = string.Empty;
        public int? SolarSystemNameId { get; set; }
        public string? VisualEffect { get; set; } = string.Empty;
        public int? DescriptionId { get; set; }
        [NotMapped]
        public int? JumpDistance { get; set; }
    }
}
