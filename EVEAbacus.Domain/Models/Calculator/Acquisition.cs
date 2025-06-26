namespace EVEAbacus.Domain.Models.Calculator
{
    public class Acquisition
    {
        public required string UserId { get; set; }
        //public List<int> OrderIds { get; set; }
        public int? OrderId { get; set; }
        public int TypeId { get; set; }
        public required string Name { get; set; }
        public int Quantity { get; set; }
        public Item? ItemProperty { get; set; }
    }
}
