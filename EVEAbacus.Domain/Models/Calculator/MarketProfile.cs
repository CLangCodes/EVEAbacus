namespace EVEAbacus.Domain.Models.Calculator
{
    public class MarketProfile
    {
        public decimal MaterialCost { get; set; } = 0;
        public decimal RevenueSellOrder { get; set; } = 0;
        public decimal RevenueBuyOrder { get; set; } = 0;
        public decimal ProfitSellOrder { get { return this.RevenueSellOrder - this.MaterialCost; } }
        public decimal ProfitBuyOrder { get { return this.RevenueBuyOrder - this.MaterialCost; } }
    }
}
