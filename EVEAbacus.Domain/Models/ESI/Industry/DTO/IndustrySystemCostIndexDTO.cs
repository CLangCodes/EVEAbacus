namespace EVEAbacus.Domain.Models.ESI.Industry.DTO
{
    public class IndustrySystemCostIndexDTO
    {
        public List<IndustryCostIndex> CostIndices = [];
        public int SolarSystemID { get; set; }
    }
}
