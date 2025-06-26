namespace EVEAbacus.Domain.Models.Calculator
{
    public class SupplyPlan
    {
        public List<ProcurementPlan> ProcurementPlans { get; set; } = [];
        public decimal EstimatedTotalCost 
        {
            get
            {
                decimal totalCost = 0;
                foreach (var item in ProcurementPlans)
                {
                    totalCost += item.EstimatedCost;
                }
                return totalCost;
            }
        }
        public decimal TotalVolume
        {
            get
            {
                decimal totalVolume = 0;
                foreach (var item in ProcurementPlans)
                {
                    totalVolume += item.TotalVolume;
                }
                return totalVolume;
            }
        }
    }
}
