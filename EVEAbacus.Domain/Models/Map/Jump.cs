namespace EVEAbacus.Domain.Models.Map
{
    public class Jump
    {
        public int StargateId { get; set; }
        public int? DestionationId { get; set; }
        public int? TypeId { get; set; }
        public float? X { get; set; }
        public float? Y { get; set; }
        public float? Z { get; set; }
    }
}
