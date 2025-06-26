namespace EVEAbacus.Domain.Models.Map
{
    public class Region
    {
        public int RegionId { get; set; }
        public string? RegionName { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
        public float? X_Min { get; set; }
        public float X_Max { get; set; }
        public float? Y_Min { get; set; }
        public float? Y_Max { get; set; }
        public float? Z_Min { get; set; }
        public float? Z_Max { get; set; }
        public int? FactionId { get; set; }
        public int? NameId { get; set; }
        public int? DescriptionId { get; set; }

    }
}
