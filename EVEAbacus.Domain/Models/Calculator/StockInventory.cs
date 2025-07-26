using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class StockInventory
    {
        public int TypeId { get; set; }
        public int Quantity { get; set; }
    }
}